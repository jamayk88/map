import assert from 'node:assert/strict';
import { test } from 'node:test';
import { rooms } from './src/data/rooms.js';
import { waypoints, edges } from './src/data/graph.js';
import { floors } from './src/data/floors.js';
import { findPath, findNearestExit } from './src/utils/pathfinding.js';
import { thirdFloorRooms } from './src/data/thirdFloor.js';

test('floor and graph IDs are unique and every edge resolves', () => {
  const ids = [...rooms, ...waypoints].map(n => n.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(floors.map(f => f.id), ['floor-1', 'floor-2', 'floor-3', 'floor-4']);
  for (const e of edges) {
    assert.ok(ids.includes(e.from), e.from);
    assert.ok(ids.includes(e.to), e.to);
    assert.ok(Number.isFinite(e.cost) && e.cost > 0);
  }
});

test('all third-floor rooms are reachable in both directions', () => {
  for (const r of thirdFloorRooms) {
    assert.ok(findPath('mb3-303', r.id)?.path.length, r.id);
    assert.ok(findPath(r.id, 'mb3-303')?.path.length, r.id);
  }
});

test('adjacent rooms route through their doorways and central hallway', () => {
  const result = findPath('mb3-303', 'mb3-302');
  assert.deepEqual(result.path, [
    'mb3-303', 'mb3-303-door', 'mb3-wp-hall-510',
    'mb3-wp-hall-692', 'mb3-302-door', 'mb3-302',
  ]);
  assert.deepEqual(result.floorsInPath, ['floor-3']);
  for (const r of thirdFloorRooms.filter(r => !r.isStair)) {
    const doorway = waypoints.find(w => w.id === `${r.id}-door`);
    assert.deepEqual(doorway.position, [r.doors[0].x, r.doors[0].y]);
    const exitEdge = edges.filter(e => e.from === r.id || e.to === r.id);
    assert.equal(exitEdge.length, 1);
    assert.equal(exitEdge[0].to, doorway.id);
  }
});

test('both stairs connect adjacent floors with correct UP/DOWN labels', () => {
  for (const staircase of ['main', 'south']) {
    const up = findPath(`mb2-stairs-${staircase}`, `mb3-stairs-${staircase}`);
    const down = findPath(`mb3-stairs-${staircase}`, `mb2-stairs-${staircase}`);
    assert.equal(up.steps[0].instruction, 'Take the stairs UP to the 3rd Floor');
    assert.equal(down.steps[0].instruction, 'Take the stairs DOWN to the 2nd Floor');
  }
});

test('third-floor routes reach existing floors, including descending via floor 2', () => {
  for (const destination of ['mb2-202', 'mb-102', 'room-1', 'gym-court', 'main-activity-area']) {
    assert.ok(findPath('mb3-303', destination)?.path.length, destination);
    assert.ok(findPath(destination, 'mb3-303')?.path.length, destination);
  }
  const down = findPath('mb3-303', 'mb-102');
  assert.deepEqual(down.steps.filter(s => s.isFloorTransition).map(s => s.instruction), [
    'Take the stairs DOWN to the 2nd Floor', 'Take the stairs DOWN to the Ground Floor',
  ]);
});

test('quick evacuation can route from MB 303 to an existing exit', () => {
  const result = findNearestExit('mb3-303', ['mb-exit-north', 'mb-exit-south', 'mb2-exit-north']);
  assert.ok(result?.path.length);
  assert.equal(result.path[0], 'mb3-303');
  assert.ok(result.steps.some(s => s.isFloorTransition && s.toFloor === 'floor-2'));
});

test('existing ground and second-floor routes remain connected', () => {
  for (const [from, to] of [
    ['main-sw-lobby', 'main-activity-area'], ['main-sw-lobby', 'main-canteen-area'],
    ['room-1', 'main-activity-area'], ['mb-102', 'mb2-202'], ['cqa', 'gym-court'],
  ]) {
    assert.ok(findPath(from, to)?.path.length, `${from} → ${to}`);
  }
});
