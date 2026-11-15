import { rooms } from '../data/rooms.js';
import { floors } from '../data/floors.js';
import { waypoints, edges as staticEdges } from '../data/graph.js';
import { getNodePosition } from './routePosition.js';
import { getWalkingPoints } from './walkingGeometry.js';

// Pre-build lookup maps for O(1) access (instead of O(n) .find() on every call)
const roomMap = new Map(rooms.map(r => [r.id, r]));
const wpMap = new Map(waypoints.map(w => [w.id, w]));

function getNodeFloor(nodeId) {
  return roomMap.get(nodeId)?.floorId ?? wpMap.get(nodeId)?.floorId ?? 'floor-1';
}

/**
 * Build adjacency list from edges array
 */
function buildAdjacencyList(edges) {
  const adj = new Map();

  for (const edge of edges) {
    let cost = edge.cost;
    if (edges === staticEdges && getNodeFloor(edge.from) === getNodeFloor(edge.to)) {
      const from = getNodePosition(edge.from, edge.to);
      const to = getNodePosition(edge.to, edge.from);
      const points = from && to && getWalkingPoints(from, to, getNodeFloor(edge.from));
      if (!points) continue;
      cost = points.slice(1).reduce((sum, point, i) => sum
        + Math.hypot(point[0] - points[i][0], point[1] - points[i][1]), 0);
    }
    if (!adj.has(edge.from)) adj.set(edge.from, []);
    if (!adj.has(edge.to)) adj.set(edge.to, []);

    adj.get(edge.from).push({
      node: edge.to,
      cost,
      direction: edge.forwardDir,
    });
    adj.get(edge.to).push({
      node: edge.from,
      cost,
      direction: edge.backDir,
    });
  }

  return adj;
}

// Pre-build adjacency list (graph is static)
const cachedAdjacencyList = buildAdjacencyList(staticEdges);
/**
 * Determine an appropriate icon for an instruction step
 */
function getStepIcon(instruction, isFirst, isLast) {
  const text = instruction.toLowerCase();
  if (text.includes('stair') || text.includes('steps')) return '🪜';
  if (isFirst || text.includes('exit')) return '🚪';
  if (isLast || text.includes('enter') || text.includes('arrive') || text.includes('pass through')) return '🎯';
  if (text.includes('right') || text.includes('east')) return '➡️';
  if (text.includes('left') || text.includes('west')) return '⬅️';
  if (text.includes('south') || text.includes('down') || text.includes('straight')) return '⬇️';
  if (text.includes('north') || text.includes('up')) return '⬆️';
  return '🚶';
}

function getNodeCoordinates(nodeId, towardId) {
  const position = getNodePosition(nodeId, towardId);
  return position ? { x: position[0], y: position[1] } : null;
}

function getNodeLabel(nodeId) {
  return roomMap.get(nodeId)?.name ?? null;
}

/**
 * Determine relative turn angle in degrees between vector (A -> B) and vector (B -> C)
 * Negative = Left turn, Positive = Right turn
 */
function getTurnAngle(pA, pB, pC) {
  if (!pA || !pB || !pC) return 0;
  const angle1 = Math.atan2(pB.y - pA.y, pB.x - pA.x);
  const angle2 = Math.atan2(pC.y - pB.y, pC.x - pB.x);
  let diff = (angle2 - angle1) * (180 / Math.PI);
  while (diff > 180) diff -= 360;
  while (diff < -180) diff += 360;
  return diff;
}

/**
 * Find shortest path between two nodes using Dijkstra's algorithm
 */
export function findPath(startId, endId, edges = staticEdges) {
  if (!startId || !endId) return null;

  if (startId === endId) {
    const floor = getNodeFloor(startId);
    return {
      path: [startId],
      directions: ['You are already at your destination!'],
      steps: [
        {
          index: 1,
          instruction: 'You are already at your destination!',
          turnType: 'arrive',
          icon: '📍',
          nodeId: startId,
          floorId: floor,
        },
      ],
      floorsInPath: [floor],
      totalCost: 0,
      distanceMeters: 0,
      estimatedSeconds: 0,
    };
  }

  const adj = edges === staticEdges ? cachedAdjacencyList : buildAdjacencyList(edges);
  const distances = new Map();
  const previous = new Map();
  const directionTo = new Map();
  const visited = new Set();

  const queue = [];

  for (const nodeId of adj.keys()) {
    distances.set(nodeId, Infinity);
  }
  distances.set(startId, 0);
  queue.push({ id: startId, cost: 0 });

  while (queue.length > 0) {
    let minIdx = 0;
    for (let i = 1; i < queue.length; i++) {
      if (queue[i].cost < queue[minIdx].cost) minIdx = i;
    }
    const current = queue.splice(minIdx, 1)[0];

    if (visited.has(current.id)) continue;
    visited.add(current.id);

    if (current.id === endId) break;

    const neighbors = adj.get(current.id) || [];
    for (const neighbor of neighbors) {
      if (visited.has(neighbor.node)) continue;

      // Restrict routes from cutting through private rooms:
      // A room can only be entered if it is the target destination or an open exit/stair.
      const targetRoom = roomMap.get(neighbor.node);
      if (
        targetRoom &&
        !targetRoom.isStair &&
        targetRoom.category !== 'Exit & Stairs' &&
        neighbor.node !== endId
      ) {
        continue;
      }

      const newCost = distances.get(current.id) + neighbor.cost;
      if (newCost < (distances.get(neighbor.node) ?? Infinity)) {
        distances.set(neighbor.node, newCost);
        previous.set(neighbor.node, current.id);
        directionTo.set(neighbor.node, neighbor.direction);
        queue.push({ id: neighbor.node, cost: newCost });
      }
    }
  }

  if (!previous.has(endId) && startId !== endId) {
    return null;
  }

  const path = [];
  let current = endId;
  while (current !== undefined) {
    path.unshift(current);
    current = previous.get(current);
  }

  const directions = [];
  const steps = [];
  const floorsSet = new Set();

  const startName = getNodeLabel(startId) || 'current location';
  const endName = getNodeLabel(endId) || 'destination';

  for (let i = 1; i < path.length; i++) {
    const rawDir = directionTo.get(path[i]) || '';
    const fromId = path[i - 1];
    const toId = path[i];
    const fromFloor = getNodeFloor(fromId);
    const toFloor = getNodeFloor(toId);
    floorsSet.add(fromFloor);
    floorsSet.add(toFloor);

    const isFirstStep = i === 1;
    const isLastStep = i === path.length - 1;
    const isFloorTransition = fromFloor !== toFloor;

    // Node coordinates for geometry calculations
    const pPrev = i >= 2 ? getNodeCoordinates(path[i - 2]) : null;
    const pFrom = getNodeCoordinates(fromId, toId);
    const pTo = getNodeCoordinates(toId, fromId);
    const pNext = i + 1 < path.length ? getNodeCoordinates(path[i + 1]) : null;

    let instruction = '';
    let turnType = 'straight'; // 'straight' | 'left' | 'right' | 'stairs' | 'exit' | 'arrive'

    if (isFloorTransition || rawDir.includes('🪜') || toId.includes('stairs') && fromId.includes('stairs')) {
      turnType = 'stairs';
      if (isFloorTransition) {
        const direction = floors.findIndex(f => f.id === toFloor) > floors.findIndex(f => f.id === fromFloor) ? 'UP' : 'DOWN';
        const destination = floors.find(f => f.id === toFloor)?.shortName ?? toFloor;
        instruction = `Take the stairs ${direction} to the ${destination}`;
      } else {
        instruction = rawDir;
      }
    } else if (rawDir.startsWith('Cross the two-way highway')) {
      instruction = rawDir;
      turnType = 'straight';
    } else if (rawDir.includes('middle-wall gate') || rawDir.startsWith('Follow the wall')) {
      instruction = rawDir;
      turnType = 'straight';
    } else if (isFirstStep) {
      turnType = 'exit';
      // Calculate initial exit turn if we have next node
      let turnPrompt = '';
      if (pFrom && pTo && pNext) {
        const angle = getTurnAngle(pFrom, pTo, pNext);
        if (angle > 35) turnPrompt = ' and turn right';
        else if (angle < -35) turnPrompt = ' and turn left';
        else turnPrompt = ' and go straight';
      }
      instruction = `Exit ${startName} into the hallway${turnPrompt}`;
    } else if (isLastStep) {
      turnType = 'arrive';
      let arrivalSide = 'ahead';
      if (pPrev && pFrom && pTo) {
        const angle = getTurnAngle(pPrev, pFrom, pTo);
        if (angle > 30) arrivalSide = 'your right';
        else if (angle < -30) arrivalSide = 'your left';
        else arrivalSide = 'straight ahead';
      }
      const destLabel = getNodeLabel(toId) || endName;
      instruction = `Arrive at ${destLabel} on ${arrivalSide}`;
    } else {
      // Intermediate navigation step: Determine turn relative to current forward movement
      const angle = getTurnAngle(pPrev, pFrom, pTo);
      const isSidewalk = toId.includes('sidewalk') || fromId.includes('sidewalk');
      const isHallwayConnector = toId.includes('conn') || fromId.includes('conn') || isSidewalk;

      if (isSidewalk) {
        if (Math.abs(angle) > 40) {
          turnType = angle > 0 ? 'right' : 'left';
          instruction = angle > 0 ? 'Turn right onto the sidewalk promenade' : 'Turn left onto the sidewalk promenade';
        } else {
          turnType = 'straight';
          instruction = 'Continue along the sidewalk promenade';
        }
      } else if (toId === 'main-sw-lobby' || fromId === 'main-sw-lobby') {
        if (toId === 'main-sw-lobby') {
          instruction = 'Enter the South-West Entrance Lobby';
          turnType = 'straight';
        } else if (toId.includes('exit') || toId.includes('sidewalk')) {
          instruction = 'Pass through South-West Lobby doors outside to the sidewalk';
          turnType = 'exit';
        } else {
          instruction = 'Exit South-West Lobby into the hallway corridor';
          turnType = 'straight';
        }
      } else if (toId === 'mb-wp-s-exit' && fromId.includes('sidewalk')) {
        instruction = 'Enter Mercado Building through the South Entrance';
        turnType = 'straight';
      } else if (fromId === 'mb-wp-s-exit' && toId.includes('sidewalk')) {
        instruction = 'Exit Mercado Building through the South Entrance onto the sidewalk';
        turnType = 'exit';
      } else if (angle > 35) {
        turnType = 'right';
        instruction = isHallwayConnector
          ? 'Turn right into the connector hallway'
          : 'Turn right into the corridor';
      } else if (angle < -35) {
        turnType = 'left';
        instruction = isHallwayConnector
          ? 'Turn left into the connector hallway'
          : 'Turn left into the corridor';
      } else {
        turnType = 'straight';
        instruction = isHallwayConnector
          ? 'Continue straight across the connector hallway'
          : 'Go straight along the corridor';
      }

      // Add landmark context if available
      const currentTargetLabel = getNodeLabel(toId);
      if (currentTargetLabel && !toId.startsWith('wp-') && toId !== 'main-sw-lobby') {
        instruction += ` toward ${currentTargetLabel}`;
      }
    }

    directions.push(instruction);
    steps.push({
      index: directions.length,
      instruction,
      turnType,
      fromNode: fromId,
      toNode: toId,
      fromFloor,
      toFloor,
      floorId: toFloor,
      isFloorTransition,
      icon: getStepIcon(instruction, isFirstStep, isLastStep),
    });
  }

  const totalCost = distances.get(endId) || 0;
  // Apply the reduced campus distance scale to both route estimates.
  const distanceMeters = Math.round(totalCost * 0.075);
  const estimatedSeconds = Math.max(5, Math.round(distanceMeters / 1.3));

  return {
    path,
    directions,
    steps,
    floorsInPath: Array.from(floorsSet),
    hasFloorTransition: floorsSet.size > 1,
    totalCost,
    distanceMeters,
    estimatedSeconds,
  };
}

/**
 * Find nearest emergency exit from current room
 */
export function findNearestExit(startId, exitIds, edges = staticEdges) {
  if (!startId || !exitIds || exitIds.length === 0) return null;

  const adj = edges === staticEdges ? cachedAdjacencyList : buildAdjacencyList(edges);
  const exitSet = new Set(exitIds);

  const distances = new Map();
  const visited = new Set();
  const queue = [{ id: startId, cost: 0 }];

  distances.set(startId, 0);

  let nearestExitId = null;

  while (queue.length > 0) {
    let minIdx = 0;
    for (let i = 1; i < queue.length; i++) {
      if (queue[i].cost < queue[minIdx].cost) minIdx = i;
    }
    const current = queue.splice(minIdx, 1)[0];

    if (visited.has(current.id)) continue;
    visited.add(current.id);

    if (exitSet.has(current.id)) {
      nearestExitId = current.id;
      break;
    }

    const neighbors = adj.get(current.id) || [];
    for (const neighbor of neighbors) {
      if (visited.has(neighbor.node)) continue;

      // Restrict evacuation route from cutting through closed private rooms
      const targetRoom = roomMap.get(neighbor.node);
      if (
        targetRoom &&
        !targetRoom.isStair &&
        targetRoom.category !== 'Exit & Stairs' &&
        !exitSet.has(neighbor.node)
      ) {
        continue;
      }

      const newCost = distances.get(current.id) + neighbor.cost;
      if (newCost < (distances.get(neighbor.node) ?? Infinity)) {
        distances.set(neighbor.node, newCost);
        queue.push({ id: neighbor.node, cost: newCost });
      }
    }
  }

  if (!nearestExitId) return null;

  const route = findPath(startId, nearestExitId, edges);
  if (!route) return null;
  return { ...route, destinationId: nearestExitId };
}

