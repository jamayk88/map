import assert from 'node:assert/strict';
import { test } from 'node:test';
import { rooms } from './src/data/rooms.js';
import { waypoints, edges } from './src/data/graph.js';
import { mainSecondFloorRooms, mainSecondFloorWaypoints, mainSecondFloorEdges } from './src/data/mainSecondFloor.js';
import { findPath, findNearestExit } from './src/utils/pathfinding.js';

test('all Main Building second-floor destinations are reachable from campus in both directions', () => {
  for (const room of mainSecondFloorRooms) {
    assert.ok(findPath('main-sw-lobby', room.id)?.path.length, room.id);
    assert.ok(findPath(room.id, 'main-sw-lobby')?.path.length, room.id);
  }
  assert.equal(mainSecondFloorRooms.find(r => r.id === 'main2-seaman').name, 'Seaman Lab');
});

test('SW stairs use the ground-floor counterpart and correct floor instructions', () => {
  assert.equal(findPath('main-stairs', 'main2-stairs-sw').steps[0].instruction, 'Take the stairs UP to the 2nd Floor');
  assert.equal(findPath('main2-stairs-sw', 'main-stairs').steps[0].instruction, 'Take the stairs DOWN to the Ground Floor');
  const result = findPath('main-sw-lobby', 'main2-computer-lab-2');
  assert.ok(result.path.includes('main-stairs'));
  assert.ok(result.path.includes('main2-stairs-sw'));
  assert.deepEqual(result.floorsInPath, ['floor-1', 'floor-2']);
  // The NE stairs have a local floor-2 edge and now connect upward to floor 3;
  // no unverified ground-floor counterpart is introduced.
  assert.equal(edges.filter(e => e.from === 'main2-stairs-ne' || e.to === 'main2-stairs-ne').length, 2);
  assert.ok(!edges.some(e => (e.from === 'main2-stairs-ne' || e.to === 'main2-stairs-ne') && [e.from,e.to].some(id => rooms.find(r => r.id === id)?.floorId === 'floor-1')));
});

test('room entrances match drawn doors and preserve multiple lab entrances', () => {
  for (const room of mainSecondFloorRooms) {
    room.doors.forEach((door, i) => {
      const wp = waypoints.find(w => w.id === `${room.id}-door-${i}`);
      assert.deepEqual(wp.position, [door.x, door.y]);
      assert.ok(edges.some(e => e.from === room.id && e.to === wp.id));
    });
  }
  const result = findPath('main2-tourism', 'main2-natural-science');
  assert.ok(result.path.some(id => id.startsWith('main2-tourism-door-')));
  assert.ok(result.path.some(id => id.startsWith('main2-natural-science-door-')));
});

test('hallway edges avoid rectangular private rooms and follow the south curve', () => {
  const wpMap = new Map(mainSecondFloorWaypoints.map(w => [w.id, w.position]));
  const privateRooms = mainSecondFloorRooms.filter(r => !r.shapePath && !r.isStair && r.id !== 'main2-lobby' && r.category !== 'Exit & Stairs');
  for (const e of mainSecondFloorEdges.filter(e => e.from.startsWith('main2-wp-') && e.to.startsWith('main2-wp-'))) {
    const a = wpMap.get(e.from), b = wpMap.get(e.to);
    for (let i = 0; i <= 40; i++) {
      const x = a[0] + (b[0] - a[0]) * i / 40;
      const y = a[1] + (b[1] - a[1]) * i / 40;
      for (const r of privateRooms) {
        assert.ok(!(x > r.x + 1 && x < r.x + r.width - 1 && y > r.y + 1 && y < r.y + r.height - 1), `${e.from} → ${e.to} crosses ${r.id}`);
      }
    }
  }
  const route = findPath('main2-seaman', 'main2-electronic');
  assert.ok(route.path.includes('main2-wp-south-mid'));
});

test('north fire exit is reachable without crossing private rooms', () => {
  for (const r of mainSecondFloorRooms.filter(r => r.category === 'Laboratory')) {
    const route = findNearestExit(r.id, ['main2-exit-north']);
    assert.equal(route.destinationId, 'main2-exit-north');
    assert.ok(!route.hasFloorTransition);
    for (const id of route.path.slice(1, -1)) {
      const node = rooms.find(room => room.id === id);
      assert.ok(!node || node.isStair || node.category === 'Exit & Stairs', id);
    }
  }
});

test('routes connect to Mercado third floor through ground-floor campus paths', () => {
  for (const [from, to] of [['main2-library', 'mb3-303'], ['mb3-303', 'main2-library']]) {
    const route = findPath(from, to);
    assert.ok(route.path.includes('main2-stairs-sw'));
    assert.ok(route.floorsInPath.includes('floor-1'));
    assert.ok(route.floorsInPath.includes('floor-3'));
  }
});
