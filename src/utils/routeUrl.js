import { rooms } from '../data/rooms.js';

const roomMap = new Map(rooms.map(room => [room.id, room]));

export function normalizeRoute({ startRoom = null, endRoom = null } = {}) {
  startRoom = roomMap.has(startRoom) ? startRoom : null;
  endRoom = roomMap.has(endRoom) && endRoom !== startRoom ? endRoom : null;
  return { startRoom, endRoom };
}

export function readRouteUrl(url) {
  const params = new URL(url).searchParams;
  return normalizeRoute({ startRoom: params.get('start') });
}

export function writeRouteUrl(url, route) {
  const next = new URL(url);
  const { startRoom } = normalizeRoute(route);
  if (startRoom) next.searchParams.set('start', startRoom);
  else next.searchParams.delete('start');
  // Remove destination parameters from links created before starting-point-only support.
  next.searchParams.delete('end');
  return next.href;
}

export function getRouteView({ startRoom }) {
  return {
    currentFloor: roomMap.get(startRoom)?.floorId || 'floor-1',
    selectionMode: startRoom ? 'end' : 'start',
  };
}
