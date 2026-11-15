import { rooms } from '../data/rooms.js';
import { apiRoomMappings } from '../data/apiRoomMappings.js';

const mapRoomIds = new Set(rooms.map(room => room.id));
const normalizeName = name => name.trim().replace(/\s+/g, ' ').toUpperCase();

export function matchApiRooms(apiRooms, mappings = apiRoomMappings) {
  const names = new Map(Object.entries(mappings).map(([name, mapRoomId]) => [normalizeName(name), mapRoomId]));
  const byMapRoom = {};
  const unmapped = [];
  for (const apiRoom of apiRooms) {
    const mapRoomId = names.get(normalizeName(apiRoom.name));
    if (!mapRoomIds.has(mapRoomId)) {
      unmapped.push(apiRoom);
      continue;
    }
    (byMapRoom[mapRoomId] ??= []).push(apiRoom);
  }
  return { byMapRoom, unmapped };
}

export async function fetchRoomInfo({
  signal,
  endpoint = import.meta.env?.DEV && import.meta.env?.VITE_ROOMS_URL
    ? '/api/rooms' : import.meta.env?.VITE_ROOMS_URL,
  fetchImpl = fetch,
} = {}) {
  if (!endpoint) throw new Error('Room information is not configured.');
  let response;
  try {
    response = await fetchImpl(endpoint, { method: 'GET', headers: { Accept: 'application/json' }, credentials: 'include', signal });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new Error('Unable to reach room information. Please try again.');
  }
  let payload;
  try { payload = await response.json(); }
  catch { throw new Error('The room service returned an unexpected response.'); }
  if (!response.ok || payload?.success === false) {
    throw new Error(typeof payload?.message === 'string' ? payload.message : 'Room information could not be loaded.');
  }
  if (!Array.isArray(payload?.rooms) || payload.rooms.some(room => !room || typeof room.name !== 'string'
    || !room.name.trim() || typeof room.isAssigned !== 'boolean'
    || (room.assignedInstructor != null && typeof room.assignedInstructor.name !== 'string'))) {
    throw new Error('The room service returned incomplete room information.');
  }
  return matchApiRooms(payload.rooms);
}
