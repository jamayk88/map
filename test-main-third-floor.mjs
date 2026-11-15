import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mainThirdFloorRooms, mainThirdFloorWaypoints, mainThirdFloorEdges } from './src/data/mainThirdFloor.js';
import { apiRoomMappings } from './src/data/apiRoomMappings.js';
import { mainFourthFloorRooms } from './src/data/mainFourthFloor.js';
import { floors } from './src/data/floors.js';
import { findPath, findNearestExit } from './src/utils/pathfinding.js';

test('ten numbered classrooms are registered, including both west rooms', () => {
  assert.equal(mainThirdFloorRooms.filter(r => r.category === 'Classroom').length, 10);
  for (const id of ['west-upper','west-lower']) {
    assert.equal(mainThirdFloorRooms.find(r => r.id === `main3-${id}`).category, 'Classroom');
  }
  const [left, top, width, height] = floors.find(f => f.id === 'floor-3').viewBox.split(' ').map(Number);
  for (const room of mainThirdFloorRooms) {
    assert.ok(room.x >= left && room.x + room.width <= left + width);
    assert.ok(room.y >= top && room.y + room.height <= top + height);
  }
});

test('all Main Building third-floor destinations are reachable from campus in both directions', () => {
  for (const room of mainThirdFloorRooms) {
    assert.ok(findPath('main-sw-lobby', room.id)?.path.length, room.id);
    assert.ok(findPath(room.id, 'main-sw-lobby')?.path.length, room.id);
  }
});

test('both Main Building staircases connect floors 2 and 3 with correct directions', () => {
  for (const side of ['sw','ne']) {
    assert.equal(findPath(`main2-stairs-${side}`, `main3-stairs-${side}`).steps[0].instruction, 'Take the stairs UP to the 3rd Floor');
    assert.equal(findPath(`main3-stairs-${side}`, `main2-stairs-${side}`).steps[0].instruction, 'Take the stairs DOWN to the 2nd Floor');
  }
  const down = findPath('main3-lecture-sw', 'main-sw-lobby');
  assert.deepEqual(down.steps.filter(s => s.isFloorTransition).map(s => s.toFloor), ['floor-2','floor-1']);
});

test('room routing uses the reference door positions', () => {
  for (const room of mainThirdFloorRooms) {
    for (let i = 0; i < room.doors.length; i++) {
      const wp = mainThirdFloorWaypoints.find(w => w.id === `${room.id}-door-${i}`);
      assert.deepEqual(wp.position, [room.doors[i].x, room.doors[i].y]);
      assert.ok(mainThirdFloorEdges.some(e => e.from === room.id && e.to === wp.id));
    }
  }
  const result = findPath('main3-lecture-sw', 'main3-lecture-se');
  assert.ok(result.path.includes('main3-wp-south-mid'));
  assert.deepEqual(result.floorsInPath, ['floor-3']);
});

test('hallway links stay outside rectangular classrooms and service rooms', () => {
  const wpMap = new Map(mainThirdFloorWaypoints.map(w => [w.id,w.position]));
  const privateRooms = mainThirdFloorRooms.filter(r => !r.shapePath && !r.isStair && r.id !== 'main3-lobby' && r.category !== 'Exit & Stairs');
  for (const e of mainThirdFloorEdges.filter(e => e.from.startsWith('main3-wp-') && e.to.startsWith('main3-wp-'))) {
    const a = wpMap.get(e.from), b = wpMap.get(e.to);
    for (let i=0; i<=40; i++) {
      const x=a[0]+(b[0]-a[0])*i/40, y=a[1]+(b[1]-a[1])*i/40;
      for (const r of privateRooms) {
        assert.ok(!(x>r.x+1 && x<r.x+r.width-1 && y>r.y+1 && y<r.y+r.height-1), `${e.from} → ${e.to} crosses ${r.id}`);
      }
    }
  }
});

test('north fire exit is reachable on floor 3 and Mercado routes use actual building connections', () => {
  const exit = findNearestExit('main3-lecture-se', ['main3-exit-north']);
  assert.equal(exit.destinationId, 'main3-exit-north');
  assert.ok(!exit.hasFloorTransition);
  const across = findPath('main3-lecture-se','mb3-303');
  assert.ok(across.floorsInPath.includes('floor-1'));
  assert.ok(across.path.includes('main2-stairs-sw'));
});

test('third-floor API rooms follow fourth-floor positions, with 306 in the former spare room', () => {
  for (let num = 301; num <= 310; num++) {
    const room = mainThirdFloorRooms.find(r => r.id === apiRoomMappings['MAIN-' + num]);
    assert.equal(room.code, 'MAIN-' + num);
    assert.equal(room.name, 'Room ' + num);
    assert.equal(room.category, 'Classroom');
    if (num === 306) {
      assert.equal(room.id, 'main3-spare');
    } else {
      const above = mainFourthFloorRooms.find(r => r.code === 'MAIN-' + (num + 100));
      assert.deepEqual([room.x, room.y], [above.x, above.y]);
    }
  }
});
