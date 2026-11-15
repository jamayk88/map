import assert from 'node:assert/strict';
import { test } from 'node:test';
import { rooms } from './src/data/rooms.js';
import { readRouteUrl, writeRouteUrl, getRouteView } from './src/utils/routeUrl.js';

const base = 'https://example.com/maps/';
const empty = { startRoom: null, endRoom: null };

test('reads only starting points and ignores destination parameters', () => {
  assert.deepEqual(readRouteUrl(`${base}?start=main3-lobby&end=cqa`), {
    startRoom: 'main3-lobby', endRoom: null,
  });
  assert.deepEqual(readRouteUrl(`${base}?start=main3-lobby`), {
    startRoom: 'main3-lobby', endRoom: null,
  });
  assert.deepEqual(readRouteUrl(`${base}?end=cqa`), empty);
  assert.deepEqual(readRouteUrl(base), empty);
});

test('rejects invalid, empty, internal and incorrectly cased starting IDs', () => {
  assert.deepEqual(readRouteUrl(`${base}?start=unknown&end=cqa`), empty);
  assert.deepEqual(readRouteUrl(`${base}?start=cqa&end=unknown`), { startRoom: 'cqa', endRoom: null });
  assert.deepEqual(readRouteUrl(`${base}?start=&end=`), empty);
  assert.deepEqual(readRouteUrl(`${base}?start=cqa&end=cqa`), { startRoom: 'cqa', endRoom: null });
  assert.deepEqual(readRouteUrl(`${base}?start=hz-wp-pathway1-entry&end=CQA`), empty);
  assert.deepEqual(readRouteUrl(`${base}?start=CQA`), empty);
});

test('decodes encoded IDs and accepts every registered room, including exits and stairs', () => {
  assert.deepEqual(readRouteUrl(`${base}?start=main3%2Dlobby&end=%63qa`), {
    startRoom: 'main3-lobby', endRoom: null,
  });
  for (const room of rooms) {
    assert.equal(readRouteUrl(`${base}?start=${encodeURIComponent(room.id)}`).startRoom, room.id);
  }
});

test('writes and clears only the starting point, removing legacy destinations and preserving URL context', () => {
  const original = `${base}?campaign=qr&start=unknown&end=room-1#map`;
  const route = { startRoom: 'main3-lobby', endRoom: 'cqa' };
  const written = writeRouteUrl(original, route);
  const url = new URL(written);
  assert.equal(url.origin, 'https://example.com');
  assert.equal(url.pathname, '/maps/');
  assert.equal(url.hash, '#map');
  assert.equal(url.searchParams.get('campaign'), 'qr');
  assert.deepEqual(readRouteUrl(written), { startRoom: 'main3-lobby', endRoom: null });
  assert.equal(url.searchParams.has('end'), false);
  assert.equal(writeRouteUrl(written, route), written);
  assert.equal(writeRouteUrl(written, {}), `${base}?campaign=qr#map`);
  assert.deepEqual(readRouteUrl(writeRouteUrl(base, { startRoom: 'unknown', endRoom: 'cqa' })), {
    startRoom: null, endRoom: null,
  });
});

test('normalizes repeated route parameters into a single selection', () => {
  const url = new URL(writeRouteUrl(`${base}?start=cqa&start=room-1&end=cqa`, {
    startRoom: 'main3-lobby', endRoom: 'cqa',
  }));
  assert.deepEqual(url.searchParams.getAll('start'), ['main3-lobby']);
  assert.deepEqual(url.searchParams.getAll('end'), []);
});

test('opens only the origin floor and prompts for a destination', () => {
  assert.deepEqual(getRouteView(readRouteUrl(`${base}?start=main3-lobby`)), {
    currentFloor: 'floor-3', selectionMode: 'end',
  });
  assert.deepEqual(getRouteView(readRouteUrl(`${base}?start=main3-lobby&end=cqa`)), {
    currentFloor: 'floor-3', selectionMode: 'end',
  });
  assert.deepEqual(getRouteView(readRouteUrl(`${base}?end=main3-lobby`)), {
    currentFloor: 'floor-1', selectionMode: 'start',
  });
  assert.deepEqual(getRouteView(empty), { currentFloor: 'floor-1', selectionMode: 'start' });
});

test('choosing a destination does not change the starting-point link', () => {
  const origin = { startRoom: 'main3-lobby', endRoom: null };
  const link = writeRouteUrl(base, origin);
  assert.equal(writeRouteUrl(link, { ...origin, endRoom: 'cqa' }), link);
  assert.equal(writeRouteUrl(link, { ...origin, endRoom: 'room-1' }), link);
});
