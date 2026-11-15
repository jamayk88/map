import { rooms } from '../data/rooms.js';
import { waypoints } from '../data/graph.js';
import { getNodePosition } from './routePosition.js';
import { getWalkingPoints } from './walkingGeometry.js';

const roomMap = new Map(rooms.map(room => [room.id, room]));
const wpMap = new Map(waypoints.map(wp => [wp.id, wp]));

function getNodeData(id, towardId) {
  const room = roomMap.get(id);
  if (room) return { position: getNodePosition(id, towardId), floorId: room.floorId };
  const wp = wpMap.get(id);
  return wp ? { position: wp.position, floorId: wp.floorId } : null;
}

// Keep each visit to a floor separate: filtering out other floors would join
// unrelated stair landings with a line that is not part of the walking route.
export function getFloorPath(path, currentFloor) {
  const nodes = path.map((id, index) => ({ id, data: getNodeData(id, index === 0 ? path[1] : path[index - 1]) }));
  const segments = [];
  const transfers = [];
  let segment = null;

  nodes.forEach((node, index) => {
    if (node.data?.floorId !== currentFloor) {
      segment = null;
      return;
    }
    if (!segment) {
      segment = [];
      segments.push(segment);
    }
    segment.push(node);

    const previous = nodes[index - 1];
    const next = nodes[index + 1];
    if (
      (previous?.data && previous.data.floorId !== currentFloor) ||
      (next?.data && next.data.floorId !== currentFloor)
    ) {
      transfers.push(node);
    }
  });

  const lines = [];
  for (const section of segments) {
    let line = [section[0].data.position];
    for (let i = 1; i < section.length; i++) {
      const connection = getWalkingPoints(section[i - 1].data.position, section[i].data.position, currentFloor);
      if (connection) line.push(...connection.slice(1));
      else {
        lines.push(line);
        line = [section[i].data.position];
      }
    }
    lines.push(line);
  }
  return { segments, lines, transfers, start: nodes[0], end: nodes.at(-1) };
}
