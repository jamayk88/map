import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ccjeBounds, ccjeGroundRooms, ccjeGroundWaypoints, ccjeGroundEdges } from './src/data/ccjeGroundFloor.js';
import { findPath, findNearestExit } from './src/utils/pathfinding.js';
import { floors } from './src/data/floors.js';
import { apiRoomMappings, pendingApiRoomNames } from './src/data/apiRoomMappings.js';

test('CCJE matches the Hernandez footprint and fits above the highway in the ground-floor view', () => {
  assert.equal(ccjeBounds.width, 850);
  assert.equal(ccjeBounds.height, 855);
  assert.ok(ccjeBounds.y + ccjeBounds.height < -195);
  const [x, y, width, height] = floors[0].viewBox.split(' ').map(Number);
  for (const room of ccjeGroundRooms) {
    assert.ok(room.x >= x && room.x + room.width <= x + width, room.id);
    assert.ok(room.y >= y && room.y + room.height <= y + height, room.id);
  }
  assert.equal(apiRoomMappings['CCJE-101'], 'ccje-101');
  assert.ok(!pendingApiRoomNames.includes('CCJE-101'));
});

test('every CCJE destination connects to the existing campus in both directions via the crossing', () => {
  for (const room of ccjeGroundRooms) {
    for (const [start, end] of [[room.id, 'room-1'], ['room-1', room.id]]) {
      const route = findPath(start, end);
      assert.ok(route?.path.includes('ccje-crossing-north'), `${start} to ${end}`);
      assert.ok(route.path.includes('ccje-crossing-south'));
      assert.ok(route.directions.some(text => text.includes('Cross the two-way highway')));
    }
  }
});

test('CCJE exits are reachable locally without crossing the highway', () => {
  for (const room of ccjeGroundRooms) {
    const result = findNearestExit(room.id, ['ccje-entrance', 'ccje-gate-west', 'ccje-gate-east']);
    assert.ok(result, room.id);
    assert.ok(!result.path.includes('ccje-crossing-north'));
  }
});

test('room links use the drawn doorways and all CCJE graph endpoints exist', () => {
  const ids = new Set([...ccjeGroundRooms, ...ccjeGroundWaypoints].map(node => node.id));
  ids.add('wp-sidewalk-main');
  for (const edge of ccjeGroundEdges) {
    assert.ok(ids.has(edge.from) && ids.has(edge.to));
    assert.ok(Number.isFinite(edge.cost));
  }
  for (const room of ccjeGroundRooms.filter(room => room.doors)) {
    const door = ccjeGroundWaypoints.find(node => node.id === `${room.id}-door`);
    assert.deepEqual(door.position, [room.doors[0].x, room.doors[0].y]);
  }
});
