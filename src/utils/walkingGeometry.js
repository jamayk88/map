import { rooms } from '../data/rooms.js';
import { hernandezWallSections } from '../data/hernandezWalls.js';

// Keep the six-pixel route stroke away from walls. Doorways are the only
// permitted contact with a closed room's boundary.
const CLEARANCE = 5;
const closedRooms = rooms.filter(room => room.doors?.length && !room.isStair
  && room.category !== 'Exit & Stairs' && room.category !== 'Athletics & Gymnasium');
const floors = new Map();
const cache = new Map();
const samePoint = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]) < 0.001;
const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const normals = { left: [-1, 0], right: [1, 0], top: [0, -1], bottom: [0, 1] };

// Intersect the open interior of an axis-aligned rectangle (Liang–Barsky).
// Following an offset corridor edge is allowed; crossing it is not.
export function crossesRoom(a, b, room, padding = 0) {
  let low = 0;
  let high = 1;
  for (const [axis, min, max] of [
    [0, room.x - padding + 0.001, room.x + room.width + padding - 0.001],
    [1, room.y - padding + 0.001, room.y + room.height + padding - 0.001],
  ]) {
    const delta = b[axis] - a[axis];
    if (Math.abs(delta) < 0.000001) {
      if (a[axis] < min || a[axis] > max) return false;
    } else {
      const t1 = (min - a[axis]) / delta;
      const t2 = (max - a[axis]) / delta;
      low = Math.max(low, Math.min(t1, t2));
      high = Math.min(high, Math.max(t1, t2));
      if (low > high) return false;
    }
  }
  return high >= low;
}

function floorGeometry(floorId) {
  if (!floors.has(floorId)) {
    const obstacles = [...closedRooms, ...hernandezWallSections].filter(room => room.floorId === floorId);
    const doors = rooms.filter(room => room.floorId === floorId)
      .flatMap(room => (room.doors || []).map(door => [door.x, door.y]));
    floors.set(floorId, { obstacles, doors, graph: null });
  }
  return floors.get(floorId);
}

function doorApproach(point, { obstacles, doors }) {
  if (!doors.some(door => samePoint(point, door))) return point;
  for (const room of obstacles) {
    // An exterior exit may define the doorway on the other side of this wall.
    const wall = Math.abs(point[0] - room.x) < 0.001 && point[1] >= room.y && point[1] <= room.y + room.height ? 'left'
      : Math.abs(point[0] - room.x - room.width) < 0.001 && point[1] >= room.y && point[1] <= room.y + room.height ? 'right'
      : Math.abs(point[1] - room.y) < 0.001 && point[0] >= room.x && point[0] <= room.x + room.width ? 'top'
      : Math.abs(point[1] - room.y - room.height) < 0.001 && point[0] >= room.x && point[0] <= room.x + room.width ? 'bottom' : null;
    if (wall) {
      const normal = normals[wall];
      return [point[0] + normal[0] * (CLEARANCE + 1), point[1] + normal[1] * (CLEARANCE + 1)];
    }
  }
  return point;
}

function visible(a, b, obstacles) {
  return !obstacles.some(room => crossesRoom(a, b, room, CLEARANCE));
}

function visibilityGraph(geometry) {
  if (geometry.graph) return geometry.graph;
  const { obstacles } = geometry;
  const corners = obstacles.flatMap(room => [
    [room.x - CLEARANCE, room.y - CLEARANCE],
    [room.x + room.width + CLEARANCE, room.y - CLEARANCE],
    [room.x + room.width + CLEARANCE, room.y + room.height + CLEARANCE],
    [room.x - CLEARANCE, room.y + room.height + CLEARANCE],
  ]).filter(point => visible(point, point, obstacles));
  const links = corners.map(() => []);
  corners.forEach((point, i) => {
    for (let j = i + 1; j < corners.length; j++) {
      if (!visible(point, corners[j], obstacles)) continue;
      const cost = distance(point, corners[j]);
      links[i].push([j, cost]);
      links[j].push([i, cost]);
    }
  });
  geometry.graph = { corners, links };
  return geometry.graph;
}

function avoidWalls(start, end, geometry) {
  if (visible(start, end, geometry.obstacles)) return [start, end];
  for (const corner of [[start[0], end[1]], [end[0], start[1]]]) {
    if (visible(start, corner, geometry.obstacles) && visible(corner, end, geometry.obstacles)) return [start, corner, end];
  }
  const { corners, links } = visibilityGraph(geometry);
  const points = [...corners, start, end];
  const startIndex = corners.length;
  const endIndex = startIndex + 1;
  const adjacency = links.map(neighbors => [...neighbors]);
  adjacency.push([], []);
  for (let i = 0; i < corners.length; i++) {
    for (const endpoint of [startIndex, endIndex]) {
      if (!visible(points[i], points[endpoint], geometry.obstacles)) continue;
      const cost = distance(points[i], points[endpoint]);
      adjacency[i].push([endpoint, cost]);
      adjacency[endpoint].push([i, cost]);
    }
  }
  const costs = points.map(() => Infinity);
  const previous = [];
  const visited = new Set();
  costs[startIndex] = 0;
  while (visited.size < points.length) {
    let current = -1;
    for (let i = 0; i < points.length; i++) {
      if (!visited.has(i) && (current < 0 || costs[i] < costs[current])) current = i;
    }
    if (current < 0 || !Number.isFinite(costs[current])) break;
    if (current === endIndex) {
      const result = [];
      for (let i = endIndex; i !== undefined; i = previous[i]) result.unshift(points[i]);
      return result;
    }
    visited.add(current);
    for (const [next, cost] of adjacency[current]) {
      if (costs[current] + cost < costs[next]) {
        costs[next] = costs[current] + cost;
        previous[next] = current;
      }
    }
  }
  // Never replace an unavailable connection with a straight line through walls.
  return null;
}

export function getWalkingPoints(from, to, floorId) {
  if (samePoint(from, to)) return [from];
  const key = `${floorId}:${from.join(',')}:${to.join(',')}`;
  if (cache.has(key)) return cache.get(key);
  const geometry = floorGeometry(floorId);
  const start = doorApproach(from, geometry);
  const end = doorApproach(to, geometry);
  const middle = avoidWalls(start, end, geometry);
  const result = middle && [from, ...middle, to].filter((point, i, all) => !i || !samePoint(point, all[i - 1]));
  cache.set(key, result);
  cache.set(`${floorId}:${to.join(',')}:${from.join(',')}`, result && [...result].reverse());
  return result;
}
