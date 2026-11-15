import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mainFourthFloorRooms, mainFourthFloorWaypoints, mainFourthFloorEdges } from './src/data/mainFourthFloor.js';
import { floors } from './src/data/floors.js';
import { rooms } from './src/data/rooms.js';
import { waypoints } from './src/data/graph.js';
import { findPath, findNearestExit } from './src/utils/pathfinding.js';
import { readRouteUrl, getRouteView } from './src/utils/routeUrl.js';
import { apiRoomMappings, pendingApiRoomNames } from './src/data/apiRoomMappings.js';

test('fourth-floor rooms fit the floor view and map the nine drawn classrooms', () => {
  const floor = floors.find(f => f.id === 'floor-4');
  const [x, y, width, height] = floor.viewBox.split(' ').map(Number);
  assert.equal(mainFourthFloorRooms.filter(r => r.category === 'Classroom').length, 9);
  for (const r of mainFourthFloorRooms) {
    assert.ok(r.x >= x && r.x + r.width <= x + width, r.id);
    assert.ok(r.y >= y && r.y + r.height <= y + height, r.id);
    if (r.category === 'Classroom') assert.equal(apiRoomMappings[r.code], r.id);
  }
  assert.ok(pendingApiRoomNames.includes('MAIN-406'));
  assert.ok(!mainFourthFloorRooms.some(r => r.id === 'main4-406'));
  assert.equal(getRouteView(readRouteUrl('http://localhost/?start=main4-401')).currentFloor, 'floor-4');
});

test('both Main Building staircases connect floors 3 and 4 with correct directions', () => {
  for (const side of ['sw', 'ne']) {
    assert.equal(findPath(`main3-stairs-${side}`, `main4-stairs-${side}`).steps[0].instruction, 'Take the stairs UP to the 4th Floor');
    assert.equal(findPath(`main4-stairs-${side}`, `main3-stairs-${side}`).steps[0].instruction, 'Take the stairs DOWN to the 3rd Floor');
  }
});

test('every fourth-floor destination connects to the existing campus and its local fire exit', () => {
  for (const r of mainFourthFloorRooms) {
    for (const [start, end] of [[r.id, 'room-1'], ['room-1', r.id]]) {
      const result = findPath(start, end);
      assert.ok(result?.path.length, `${start} to ${end}`);
      assert.equal(result.steps.filter(s => s.isFloorTransition).length, 3);
    }
    const exit = findNearestExit(r.id, ['main4-exit-north']);
    assert.ok(exit?.path.length, r.id);
    assert.ok(!exit.hasFloorTransition);
  }
  const across = findPath('main4-401', 'ccje-301');
  assert.ok(across.path.includes('ccje-crossing-north'));
  assert.equal(across.steps.filter(s => s.isFloorTransition).length, 5);
});

test('multiple classroom entrances use the drawn door positions', () => {
  for (const r of mainFourthFloorRooms) {
    r.doors.forEach((d, i) => assert.deepEqual(
      mainFourthFloorWaypoints.find(w => w.id === `${r.id}-door-${i}`).position, [d.x, d.y],
    ));
  }
  assert.ok(findPath('main4-407', 'main4-408').path.includes('main4-wp-north-408'));
});

test('hallway links avoid private rooms and staircase shafts', () => {
  const roomIds = new Set(rooms.map(r => r.id));
  const positions = new Map([...rooms.map(r => [r.id, r.center]), ...waypoints.map(w => [w.id, w.position])]);
  for (const e of mainFourthFloorEdges.filter(e => !roomIds.has(e.from) && !roomIds.has(e.to))) {
    const a = positions.get(e.from), b = positions.get(e.to);
    assert.ok(a && b);
    for (let i = 0; i <= 40; i++) {
      const x = a[0] + (b[0] - a[0]) * i / 40, y = a[1] + (b[1] - a[1]) * i / 40;
      for (const r of mainFourthFloorRooms.filter(r => r.id !== 'main4-exit-north')) {
        assert.ok(!(x > r.x + 1 && x < r.x + r.width - 1 && y > r.y + 1 && y < r.y + r.height - 1), `${e.from} to ${e.to} crosses ${r.id}`);
      }
    }
  }
});
