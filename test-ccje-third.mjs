import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ccjeThirdRooms, ccjeThirdWaypoints, ccjeThirdEdges } from './src/data/ccjeThirdFloor.js';
import { rooms } from './src/data/rooms.js';
import { waypoints } from './src/data/graph.js';
import { floors } from './src/data/floors.js';
import { findPath, findNearestExit } from './src/utils/pathfinding.js';
import { apiRoomMappings, pendingApiRoomNames } from './src/data/apiRoomMappings.js';

test('CCJE classrooms and forensic facilities fit the third-floor view', () => {
  const [x, y, width, height] = floors.find(f => f.id === 'floor-3').viewBox.split(' ').map(Number);
  assert.equal(ccjeThirdRooms.filter(r => r.category === 'Classroom').length, 5);
  assert.equal(ccjeThirdRooms.filter(r => r.category === 'Laboratory').length, 5);
  for (const r of ccjeThirdRooms) {
    assert.ok(r.x >= x && r.x + r.width <= x + width, r.id);
    assert.ok(r.y >= y && r.y + r.height <= y + height, r.id);
  }
  assert.equal(apiRoomMappings['CCJE-301'], 'ccje-301');
  assert.equal(apiRoomMappings['CCJE-302'], 'ccje-302');
  assert.ok(pendingApiRoomNames.includes('CCJE-303-305'));
});

test('both stairs connect floors 2 and 3 with correct directions', () => {
  for (const side of ['north', 'south']) {
    assert.equal(findPath(`ccje2-stairs-${side}`, `ccje3-stairs-${side}`).steps[0].instruction, 'Take the stairs UP to the 3rd Floor');
    assert.equal(findPath(`ccje3-stairs-${side}`, `ccje2-stairs-${side}`).steps[0].instruction, 'Take the stairs DOWN to the 2nd Floor');
  }
});

test('all CCJE third-floor locations connect to campus through both lower floors', () => {
  for (const r of ccjeThirdRooms) {
    for (const [start, end] of [[r.id, 'room-1'], ['room-1', r.id]]) {
      const result = findPath(start, end);
      assert.ok(result?.path.includes('ccje-crossing-north'), `${start} to ${end}`);
      assert.equal(result.steps.filter(s => s.isFloorTransition).length, 2);
      assert.deepEqual(new Set(result.floorsInPath), new Set(['floor-1', 'floor-2', 'floor-3']));
    }
    const exit = findNearestExit(r.id, ['ccje-entrance', 'ccje-gate-west', 'ccje-gate-east']);
    assert.ok(exit?.path.length, r.id);
    assert.ok(!exit.path.includes('ccje-crossing-north'));
  }
  const across = findPath('ccje-301', 'mb3-303');
  assert.equal(across.steps.filter(s => s.isFloorTransition).length, 4);
});

test('forensic rooms route through their actual doors and the east-west branch hallway', () => {
  for (const r of ccjeThirdRooms.filter(r => !r.isStair)) {
    r.doors.forEach((door, i) => assert.deepEqual(
      ccjeThirdWaypoints.find(w => w.id === `${r.id}-door-${i}`).position, [door.x, door.y],
    ));
  }
  const route = findPath('ccje3-ballistics', 'ccje3-polygraph');
  assert.ok(route.path.includes('ccje3-branch-705'));
  assert.ok(route.path.includes('ccje3-branch-575'));
  assert.deepEqual(route.floorsInPath, ['floor-3']);
});

test('hallway links avoid rooms and stair shafts', () => {
  const roomIds = new Set(rooms.map(r => r.id));
  const positions = new Map([...rooms.map(r => [r.id, r.center]), ...waypoints.map(w => [w.id, w.position])]);
  for (const e of ccjeThirdEdges.filter(e => !roomIds.has(e.from) && !roomIds.has(e.to))) {
    const a = positions.get(e.from), b = positions.get(e.to);
    assert.ok(a && b);
    for (let i = 0; i <= 40; i++) {
      const x = a[0] + (b[0] - a[0]) * i / 40, y = a[1] + (b[1] - a[1]) * i / 40;
      for (const r of ccjeThirdRooms) assert.ok(
        !(x > r.x + 1 && x < r.x + r.width - 1 && y > r.y + 1 && y < r.y + r.height - 1),
        `${e.from} to ${e.to} crosses ${r.id}`,
      );
    }
  }
});
