import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ccjeSecondRooms, ccjeSecondWaypoints, ccjeSecondEdges } from './src/data/ccjeSecondFloor.js';
import { rooms } from './src/data/rooms.js';
import { waypoints } from './src/data/graph.js';
import { floors } from './src/data/floors.js';
import { findPath, findNearestExit } from './src/utils/pathfinding.js';
import { apiRoomMappings } from './src/data/apiRoomMappings.js';

test('CCJE second-floor destinations and seven API classrooms fit the expanded floor view', () => {
  const [x, y, width, height] = floors.find(f => f.id === 'floor-2').viewBox.split(' ').map(Number);
  assert.equal(ccjeSecondRooms.filter(r => r.category === 'Classroom').length, 7);
  for (const r of ccjeSecondRooms) {
    assert.ok(r.x >= x && r.x + r.width <= x + width);
    assert.ok(r.y >= y && r.y + r.height <= y + height);
  }
  for (let n = 201; n <= 207; n++) assert.equal(apiRoomMappings[`CCJE-${n}`], `ccje-${n}`);
});

test('both CCJE staircases connect the correct floors with up and down directions', () => {
  for (const side of ['north', 'south']) {
    assert.equal(findPath(`ccje-stairs-${side}`, `ccje2-stairs-${side}`).steps[0].instruction, 'Take the stairs UP to the 2nd Floor');
    assert.equal(findPath(`ccje2-stairs-${side}`, `ccje-stairs-${side}`).steps[0].instruction, 'Take the stairs DOWN to the Ground Floor');
  }
});

test('every second-floor location reaches campus and local exits through the stairs', () => {
  for (const r of ccjeSecondRooms) {
    for (const [start, end] of [[r.id, 'room-1'], ['room-1', r.id]]) {
      const result = findPath(start, end);
      assert.ok(result?.path.includes('ccje-crossing-north'), `${start} to ${end}`);
      assert.deepEqual(new Set(result.floorsInPath), new Set(['floor-1', 'floor-2']));
      assert.equal(result.steps.filter(s => s.isFloorTransition).length, 1);
    }
    const evacuation = findNearestExit(r.id, ['ccje-entrance', 'ccje-gate-west', 'ccje-gate-east']);
    assert.ok(evacuation?.path.length, r.id);
    assert.ok(!evacuation.path.includes('ccje-crossing-north'));
  }
});

test('room doors match routing waypoints, including both doors on the west side hallway', () => {
  for (const r of ccjeSecondRooms.filter(r => !r.isStair)) {
    for (const [i, door] of r.doors.entries()) {
      assert.deepEqual(ccjeSecondWaypoints.find(w => w.id === `${r.id}-door-${i}`).position, [door.x, door.y]);
    }
  }
  assert.ok(findPath('ccje-201', 'ccje-202').path.some(id => id.includes('-approach-')));
});

test('hallway edges avoid private rooms and both stair shafts', () => {
  const positions = new Map([...rooms.map(r => [r.id, r.center]), ...waypoints.map(w => [w.id, w.position])]);
  for (const edge of ccjeSecondEdges.filter(e => !rooms.some(r => r.id === e.from || r.id === e.to))) {
    const a = positions.get(edge.from), b = positions.get(edge.to);
    assert.ok(a && b);
    for (let i = 0; i <= 30; i++) {
      const x = a[0] + (b[0] - a[0]) * i / 30, y = a[1] + (b[1] - a[1]) * i / 30;
      for (const r of ccjeSecondRooms) {
        assert.ok(!(x > r.x + 1 && x < r.x + r.width - 1 && y > r.y + 1 && y < r.y + r.height - 1), `${edge.from} to ${edge.to} crosses ${r.id}`);
      }
    }
  }
});
