import { findPath } from './src/utils/pathfinding.js';
import { waypoints, edges } from './src/data/graph.js';
import { rooms } from './src/data/rooms.js';

console.log('--- TEST 1: Lobby -> Activity Area ---');
const res1 = findPath('main-sw-lobby', 'main-activity-area', waypoints, edges, rooms);
console.log('Path:', res1.path);
console.log('Cost:', res1.totalCost);

console.log('\n--- TEST 2: Lobby -> Canteen Area ---');
const res2 = findPath('main-sw-lobby', 'main-canteen-area', waypoints, edges, rooms);
console.log('Path:', res2.path);
console.log('Cost:', res2.totalCost);

console.log('\n--- TEST 3: Hernandez -> Main Activity Area ---');
const res3 = findPath('room-1', 'main-activity-area', waypoints, edges, rooms);
console.log('Path:', res3.path);
console.log('Cost:', res3.totalCost);
