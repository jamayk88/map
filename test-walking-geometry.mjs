import assert from 'node:assert/strict';
import { test } from 'node:test';
import { rooms } from './src/data/rooms.js';
import { edges, waypoints } from './src/data/graph.js';
import { getNodePosition } from './src/utils/routePosition.js';
import { crossesRoom, getWalkingPoints } from './src/utils/walkingGeometry.js';
import { findPath } from './src/utils/pathfinding.js';
import { getFloorPath } from './src/utils/pathOverlay.js';
import { hernandezMiddleWall, hernandezWallSections } from './src/data/hernandezWalls.js';

const nodes = new Map([...rooms, ...waypoints].map(node => [node.id, node]));
const obstacles = [...rooms.filter(room => room.doors?.length && !room.isStair
  && room.category !== 'Exit & Stairs' && room.category !== 'Athletics & Gymnasium'), ...hernandezWallSections];

test('wall intersection detects crossings, corner clipping, and wall clearance', () => {
  const room = { x: 10, y: 10, width: 100, height: 100 };
  assert.equal(crossesRoom([0, 50], [150, 50], room), true);
  assert.equal(crossesRoom([0, 15], [15, 0], room), false);
  assert.equal(crossesRoom([0, 25], [25, 0], room), true);
  assert.equal(crossesRoom([0, 8], [120, 8], room), false);
  assert.equal(crossesRoom([0, 8], [120, 8], room, 5), true);
});

test('every campus connection has a continuous line outside closed rooms in both directions', () => {
  for (const edge of edges) {
    const floor = nodes.get(edge.from).floorId;
    if (floor !== nodes.get(edge.to).floorId) continue;
    const from = getNodePosition(edge.from, edge.to);
    const to = getNodePosition(edge.to, edge.from);
    const points = getWalkingPoints(from, to, floor);
    const label = `${edge.from} → ${edge.to}`;
    assert.ok(points, label);
    assert.deepEqual(points[0], from, label);
    assert.deepEqual(points.at(-1), to, label);
    assert.deepEqual(getWalkingPoints(to, from, floor), [...points].reverse(), label);
    for (let i = 1; i < points.length; i++) {
      // Sample the drawn segments independently of the intersection algorithm.
      // The room border itself is permitted only at the segment's door endpoint.
      for (let sample = 1; sample < 100; sample++) {
        const x = points[i - 1][0] + (points[i][0] - points[i - 1][0]) * sample / 100;
        const y = points[i - 1][1] + (points[i][1] - points[i - 1][1]) * sample / 100;
        for (const room of obstacles.filter(room => room.floorId === floor)) {
          assert.ok(!(x > room.x + 0.001 && x < room.x + room.width - 0.001
            && y > room.y + 0.001 && y < room.y + room.height - 0.001), `${label} crosses ${room.id}`);
        }
      }
    }
  }
});

test('restroom routes leave through their door and turn around the corner', () => {
  const from = getNodePosition('female-cr', 'wp-w-ffcr');
  const to = getNodePosition('wp-w-ffcr');
  const points = getWalkingPoints(from, to, 'floor-1');
  assert.ok(points.length > 2);
  assert.equal(points[1][0], from[0]);
  assert.ok(points[1][1] > from[1], 'leave the south door before turning toward the corridor');
});

test('routes retain continuous floor sections after adding corridor bends', () => {
  for (const room of rooms.filter(room => room.category !== 'Exit & Stairs')) {
    const route = findPath('main-sw-lobby', room.id);
    assert.ok(route, room.id);
    for (const floor of route.floorsInPath) {
      const overlay = getFloorPath(route.path, floor);
      assert.equal(overlay.lines.length, overlay.segments.length, `${room.id} on ${floor}`);
    }
  }
});

test('HB routes use the widened gates or open center and avoid the east stair shaft', () => {
  for (const [from, to] of [
    ['main-exit', 'multimedia-room'], ['stairs-gym-west', 'room-1'],
    ['stairs-gym-east', 'cqa'], ['multimedia-room', 'main-exit'],
  ]) {
    const route = findPath(from, to);
    for (const line of getFloorPath(route.path, 'floor-1').lines) {
      for (let i = 1; i < line.length; i++) {
        const a = line[i - 1], b = line[i];
        if ((a[1] < hernandezMiddleWall.y && b[1] >= hernandezMiddleWall.y)
          || (b[1] < hernandezMiddleWall.y && a[1] >= hernandezMiddleWall.y)) {
          const t = (hernandezMiddleWall.y - a[1]) / (b[1] - a[1]);
          const x = a[0] + (b[0] - a[0]) * t;
          const [west, east] = hernandezMiddleWall.gates;
          assert.ok(x > west.x - west.width / 2 + 3 && x < east.x + east.width / 2 - 3);
        }
      }
    }
  }
  assert.equal(hernandezWallSections.length, 2, 'the center wall is removed');
  assert.ok(hernandezMiddleWall.gates.every(gate => gate.width === 96));
  const centralRoute = findPath('wp-c-junc-mid', 'main-exit');
  assert.ok(centralRoute.path.includes('wp-c-lower'));
  assert.ok(centralRoute.path.includes('wp-c-pre-exit'));
  const route = findPath('multimedia-room', 'mb-101');
  const stairs = rooms.find(room => room.id === 'stairs-gym-east');
  for (const line of getFloorPath(route.path, 'floor-1').lines) {
    for (let i = 1; i < line.length; i++) assert.equal(crossesRoom(line[i - 1], line[i], stairs), false);
  }
});
