import assert from 'node:assert/strict';
import { test } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { rooms } from './src/data/rooms.js';
import { apiRoomMappings, pendingApiRoomNames } from './src/data/apiRoomMappings.js';
import { matchApiRooms, fetchRoomInfo } from './src/utils/roomInfo.js';

const sample = [
  { id: 7, name: 'HB-Comp. Lab', isAssigned: true, assignedInstructor: { id: 2, name: 'Test Instructor' } },
  { id: 1, name: 'HB-ROOM 101', isAssigned: false, assignedInstructor: null },
  { id: 8, name: 'HB-Research Office', isAssigned: false, assignedInstructor: null },
];

test('all 83 API rooms have entries, with 75 confirmed mappings and 8 blank locations', () => {
  assert.equal(Object.keys(apiRoomMappings).length, 83);
  assert.equal(Object.values(apiRoomMappings).filter(Boolean).length, 75);
  assert.equal(pendingApiRoomNames.length, 8);
  const ids = new Set(rooms.map(room => room.id));
  for (const [name, id] of Object.entries(apiRoomMappings)) {
    if (id === '') {
      assert.ok(pendingApiRoomNames.includes(name));
      continue;
    }
    assert.ok(ids.has(id), `${name} maps to an existing room`);
    assert.ok(!pendingApiRoomNames.includes(name));
  }
  const pending = matchApiRooms(pendingApiRoomNames.map(name => ({ name })));
  assert.equal(pending.unmapped.length, 8);
  assert.deepEqual(pending.byMapRoom, {});
});

test('matches API rooms without changing geometry or mapping unknown rooms by guesswork', () => {
  const before = JSON.stringify(rooms);
  const result = matchApiRooms([...sample, { id: 99, name: 'MAIN-406', isAssigned: false, assignedInstructor: null }]);
  assert.equal(result.byMapRoom['computer-lab'][0].assignedInstructor.name, 'Test Instructor');
  assert.equal(result.byMapRoom['room-1'][0].isAssigned, false);
  assert.equal(result.byMapRoom['server-room'][0].name, 'HB-Research Office');
  assert.deepEqual(result.unmapped.map(room => room.name), ['MAIN-406']);
  assert.equal(JSON.stringify(rooms), before);
  assert.equal(matchApiRooms([{ ...sample[0], name: ' hb-comp.   lab ' }]).byMapRoom['computer-lab'].length, 1);
});

test('keeps distinct API records when confirmed mappings share a physical area', () => {
  const result = matchApiRooms(sample.slice(0, 2), { 'HB-Comp. Lab': 'computer-lab', 'HB-ROOM 101': 'computer-lab' });
  assert.equal(result.byMapRoom['computer-lab'].length, 2);
});

test('room request uses configured endpoint and session cookies; errors never imply unassigned', async () => {
  const result = await fetchRoomInfo({ endpoint: 'https://example.com/API/getrooms', fetchImpl: async (url, options) => {
    assert.equal(url, 'https://example.com/API/getrooms');
    assert.equal(options.method, 'GET');
    assert.equal(options.credentials, 'include');
    return Response.json({ success: true, rooms: sample });
  } });
  assert.equal(result.byMapRoom['computer-lab'].length, 1);
  for (const response of [Response.json({ success: false, message: 'Not authenticated.' }, { status: 401 }), Response.json({ rooms: [{ name: 'HB-Comp. Lab' }] }), new Response('Invalid')]) {
    await assert.rejects(fetchRoomInfo({ endpoint: 'https://example.com', fetchImpl: async () => response }));
  }
  await assert.rejects(fetchRoomInfo({ endpoint: '' }), /not configured/);
  await assert.rejects(fetchRoomInfo({ endpoint: 'https://example.com', fetchImpl: async () => { throw new TypeError('offline'); } }), /Unable to reach/);
});

test('hover details show assigned instructor, unassigned status, and an honest unavailable state', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
  try {
    const { default: RoomApiInfo } = await server.ssrLoadModule('/src/components/RoomApiInfo.jsx');
    const render = props => renderToStaticMarkup(React.createElement(RoomApiInfo, props));
    const assigned = render({ status: 'ready', records: [sample[0]] });
    assert.match(assigned, /HB-Comp. Lab/);
    assert.match(assigned, /Test Instructor/);
    assert.match(assigned, />Assigned</);
    assert.match(render({ status: 'ready', records: [sample[1]] }), /Not assigned/);
    const error = render({ status: 'error' });
    assert.match(error, /unavailable/);
    assert.doesNotMatch(error, /Not assigned/);
    assert.equal(render({ status: 'idle' }), '');
  } finally {
    await server.close();
  }
});
