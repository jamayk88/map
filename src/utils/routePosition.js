import { rooms } from '../data/rooms.js';
import { waypoints } from '../data/graph.js';

const roomMap = new Map(rooms.map(room => [room.id, room]));
const waypointMap = new Map(waypoints.map(point => [point.id, point]));

export function getRoomDoorPosition(room, toward) {
  if (!room) return null;
  if (room.doors?.length) {
    // Door waypoints coincide with their drawn entrance. Older room links go
    // directly to a corridor; use the closest entrance to that approach.
    const door = toward ? room.doors.reduce((best, candidate) =>
      Math.hypot(candidate.x - toward[0], candidate.y - toward[1])
        < Math.hypot(best.x - toward[0], best.y - toward[1]) ? candidate : best
    ) : room.doors[0];
    return [door.x, door.y];
  }
  // Open areas and stairs without a drawn door retain their existing location.
  return room.doorPosition || room.center;
}

export function getNodePosition(id, towardId) {
  const room = roomMap.get(id);
  const toward = waypointMap.get(towardId)?.position || roomMap.get(towardId)?.center;
  return room ? getRoomDoorPosition(room, toward) : waypointMap.get(id)?.position || null;
}
