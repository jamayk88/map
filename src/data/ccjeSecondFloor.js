import { ccjeBounds, ccjeGroundRooms } from './ccjeGroundFloor.js';

const { x: ox, y: oy } = ccjeBounds;
const room = (id, name, code, category, x, y, width, height, doors) => ({
  id, name, code, category, buildingId: 'ccje', floorId: 'floor-2',
  x: ox + x, y: oy + y, width, height, center: [ox + x + width / 2, oy + y + height / 2],
  icon: category === 'Classroom' ? '🏫' : '🏢',
  accentColor: category === 'Classroom' ? '#3b82f6' : '#f97316',
  description: `${name} • CCJE Building, 2nd Floor`,
  doors: doors.map(([dx, dy, wall]) => ({ x: ox + dx, y: oy + dy, wall, size: 26,
    arc: wall === 'right' ? 'east-up' : wall === 'left' ? 'west-up' : wall === 'top' ? 'north-left' : 'south-left' })),
});

export const ccjeSecondRooms = [
  room('ccje-204', 'Room 204', 'CCJE-204', 'Classroom', 10, 55, 310, 160, [[320, 80, 'right'], [320, 190, 'right']]),
  room('ccje-203', 'Room 203', 'CCJE-203', 'Classroom', 10, 215, 310, 170, [[320, 240, 'right'], [320, 360, 'right']]),
  room('ccje-202', 'Room 202', 'CCJE-202', 'Classroom', 10, 385, 310, 150, [[45, 535, 'bottom'], [285, 535, 'bottom']]),
  room('ccje-201', 'Room 201', 'CCJE-201', 'Classroom', 10, 625, 310, 220, [[45, 625, 'top'], [285, 625, 'top']]),
  room('ccje-205', 'Room 205', 'CCJE-205', 'Classroom', 495, 55, 345, 220, [[495, 80, 'left'], [495, 250, 'left']]),
  room('ccje2-electrical', 'Electrical Room 2', 'ELECTRICAL 2', 'Facility', 495, 275, 345, 110, [[495, 300, 'left']]),
  room('ccje-206', 'Room 206', 'CCJE-206', 'Classroom', 495, 385, 345, 160, [[495, 410, 'left'], [495, 520, 'left']]),
  room('ccje-207', 'Room 207', 'CCJE-207', 'Classroom', 495, 545, 345, 150, [[495, 570, 'left'], [495, 670, 'left']]),
  room('ccje2-faculty', 'Faculty Room', 'FACULTY', 'Administrative Office', 495, 695, 345, 150, [[495, 720, 'left'], [495, 810, 'left']]),
  ...ccjeGroundRooms.filter(r => r.isStair).map(stair => ({
    ...stair, id: stair.id.replace('ccje-stairs', 'ccje2-stairs'), floorId: 'floor-2',
    name: stair.name.replace('Ground Floor', '2nd Floor'), code: stair.code.replace('UP', 'DN'),
    direction: 'down', stairDestination: 'GROUND', isTwinFlight: stair.id.endsWith('south'),
    stairSecondaryDestination: '3RD FLOOR',
    description: 'CCJE staircase: down to the Ground Floor or up to the 3rd Floor',
  })),
];

export const ccjeSecondWaypoints = [];
export const ccjeSecondEdges = [];
const positions = new Map([...ccjeGroundRooms, ...ccjeSecondRooms].map(r => [r.id, r.center]));
const point = (id, x, y) => {
  const position = [ox + x, oy + y];
  ccjeSecondWaypoints.push({ id, floorId: 'floor-2', position });
  positions.set(id, position);
  return id;
};
const link = (from, to, forwardDir = 'Follow the CCJE second-floor hallway', backDir = forwardDir, cost) => {
  const a = positions.get(from), b = positions.get(to);
  ccjeSecondEdges.push({ from, to, cost: cost ?? Math.max(1, Math.hypot(a[0] - b[0], a[1] - b[1])), forwardDir, backDir });
};

const stops = [80, 190, 225, 240, 250, 300, 360, 410, 520, 570, 580, 625, 670, 720, 810];
for (const side of ['west', 'east']) {
  stops.forEach((y, i) => {
    point(`ccje2-${side}-${y}`, side === 'west' ? 360 : 485, y);
    if (i) link(`ccje2-${side}-${stops[i - 1]}`, `ccje2-${side}-${y}`);
  });
}
// Cross the open hallway below the north stairs and above the south stairs.
for (const y of [225, 580, 625]) link(`ccje2-west-${y}`, `ccje2-east-${y}`);

ccjeSecondRooms.filter(r => !r.isStair).forEach(r => r.doors.forEach((door, i) => {
  const dx = door.x - ox, dy = door.y - oy;
  const doorId = point(`${r.id}-door-${i}`, dx, dy);
  const side = door.wall === 'left' ? 'east' : 'west';
  const hallY = ['top', 'bottom'].includes(door.wall) ? 580 : dy;
  const approachId = point(`${r.id}-approach-${i}`, ['top', 'bottom'].includes(door.wall) ? dx : side === 'west' ? 360 : 485, hallY);
  link(r.id, doorId, `Exit ${r.name} through the doorway`, `Enter ${r.name}`);
  link(doorId, approachId);
  link(approachId, `ccje2-${side}-${hallY}`);
}));

for (const [side, landingY] of [['north', 225], ['south', 625]]) {
  const landing = point(`ccje2-stair-landing-${side}`, 440, landingY);
  link(`ccje2-stairs-${side}`, landing);
  link(landing, `ccje2-west-${landingY}`);
  link(landing, `ccje2-east-${landingY}`);
  link(`ccje-stairs-${side}`, `ccje2-stairs-${side}`,
    'Take the stairs UP to the 2nd Floor', 'Take the stairs DOWN to the Ground Floor', 120);
}
