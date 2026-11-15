import assert from 'node:assert/strict';
import { test } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { rooms } from './src/data/rooms.js';
import { findPath } from './src/utils/pathfinding.js';
import { getFloorPath } from './src/utils/pathOverlay.js';

test('every room route starts and ends on a drawn doorway instead of its center', () => {
  for (const room of rooms.filter(room => room.doors?.length && room.category !== 'Exit & Stairs')) {
    for (const [from, to] of [[room.id, 'main-sw-lobby'], ['main-sw-lobby', room.id]]) {
      const route = findPath(from, to);
      assert.ok(route, `${from} → ${to}`);
      const overlay = getFloorPath(route.path, room.floorId);
      const point = from === room.id ? overlay.start.data.position : overlay.end.data.position;
      assert.ok(room.doors.some(door => point[0] === door.x && point[1] === door.y), `${room.id} must use a drawn doorway`);
    }
  }
});

test('multi-door rooms use the entrance connected to the selected corridor', () => {
  const room = rooms.find(room => room.id === 'main4-407');
  for (const [destination, doorIndex] of [['main4-408', 0], ['main4-410', 1]]) {
    const door = room.doors[doorIndex];
    const route = findPath(room.id, destination);
    assert.deepEqual(getFloorPath(route.path, room.floorId).start.data.position, [door.x, door.y]);
    const reverse = findPath(destination, room.id);
    assert.deepEqual(getFloorPath(reverse.path, room.floorId).end.data.position, [door.x, door.y]);
  }
});

test('upper-floor routes between buildings draw separate sections ending at stairs', () => {
  for (const pair of [
    ['gym-court', 'main2-library'],
    ['main2-library', 'mb2-201'],
    ['main3-lecture-se', 'mb3-303'],
  ]) {
    for (const [from, to] of [pair, [...pair].reverse()]) {
      const route = findPath(from, to);
      assert.ok(route, `${from} → ${to}`);
      const floor = rooms.find(room => room.id === from).floorId;
      const { segments, transfers } = getFloorPath(route.path, floor);
      assert.equal(segments.length, 2);
      assert.deepEqual(transfers.map(node => node.id), [segments[0].at(-1).id, segments[1][0].id]);
      for (const node of transfers) {
        assert.ok(rooms.find(room => room.id === node.id)?.isStair, node.id);
      }
      for (const segment of segments) {
        for (let i = 1; i < segment.length; i++) {
          assert.equal(route.path.indexOf(segment[i].id), route.path.indexOf(segment[i - 1].id) + 1);
        }
      }
      assert.ok(route.floorsInPath.includes('floor-1'));
      assert.ok(route.steps.filter(step => step.isFloorTransition).every(step => step.turnType === 'stairs'));
    }
  }
});

test('same-floor corridors remain continuous and ground-to-third routes mark both stair landings', () => {
  const sameFloor = findPath('main3-lecture-sw', 'main3-lecture-se');
  const overlay = getFloorPath(sameFloor.path, 'floor-3');
  assert.equal(overlay.segments.length, 1);
  assert.deepEqual(overlay.segments[0].map(node => node.id), sameFloor.path);
  assert.equal(overlay.transfers.length, 0);

  const upstairs = findPath('main-sw-lobby', 'main3-lecture-se');
  for (const [floor, stairs] of [['floor-1', 'main-stairs'], ['floor-2', 'main2-stairs-sw'], ['floor-3', 'main3-stairs-sw']]) {
    assert.deepEqual(getFloorPath(upstairs.path, floor).transfers.map(node => node.id), [stairs]);
  }
});

test('rendered routes never bridge buildings on upper floors, including intermediate stair-only sections', async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const { default: PathOverlay } = await server.ssrLoadModule('/src/components/PathOverlay.jsx');
    const { default: RoomHotspot } = await server.ssrLoadModule('/src/components/RoomHotspot.jsx');
    const room = rooms.find(room => room.id === 'main4-407');
    const door = room.doors[1];
    for (const state of ['Start', 'End']) {
      const marker = renderToStaticMarkup(React.createElement('svg', null,
        React.createElement(RoomHotspot, { room, [`is${state}`]: true, routePosition: [door.x, door.y] })
      ));
      assert.ok(marker.includes(`class="room-${state.toLowerCase()}-pin" transform="translate(${door.x}, ${door.y - 16})"`));
    }
    const route = findPath('main3-lecture-se', 'mb3-303');
    for (const floor of ['floor-2', 'floor-3']) {
      const markup = renderToStaticMarkup(React.createElement('svg', null,
        React.createElement(PathOverlay, { path: route.path, currentFloor: floor })
      ));
      assert.equal((markup.match(/STAIRS TRANSFER/g) || []).length, 2);
      const actualPoints = [...markup.matchAll(/<polyline points="([^"]+)"/g)].map(match => match[1]);
      const { lines } = getFloorPath(route.path, floor);
      const expectedPoints = lines.filter(line => line.length > 1).flatMap(line => {
        const points = line.map(position => position.join(',')).join(' ');
        return [points, points, points];
      });
      assert.deepEqual(actualPoints, expectedPoints);
      assert.equal(actualPoints.length, floor === 'floor-2' ? 0 : 6);
    }
  } finally {
    await server.close();
  }
});
