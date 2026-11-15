import { ccjeBounds } from './ccjeGroundFloor.js';
import { ccjeSecondRooms } from './ccjeSecondFloor.js';

const { x: ox, y: oy } = ccjeBounds;
const room = (id, name, code, category, x, y, width, height, doors, labelLines) => ({
  id, name, code, category, buildingId: 'ccje', floorId: 'floor-3',
  x: ox + x, y: oy + y, width, height, center: [ox + x + width / 2, oy + y + height / 2],
  icon: category === 'Classroom' ? '🏫' : category === 'Laboratory' ? '🔬' : '🏢',
  accentColor: category === 'Classroom' ? '#3b82f6' : category === 'Laboratory' ? '#8b5cf6' : '#f97316',
  description: `${name} • CCJE Building, 3rd Floor`,
  labelLines,
  doors: doors.map(([dx, dy, wall]) => ({ x: ox + dx, y: oy + dy, wall, size: 24,
    arc: wall === 'right' ? 'east-up' : wall === 'left' ? 'west-up' : wall === 'top' ? 'north-left' : 'south-left' })),
});

export const ccjeThirdRooms = [
  room('ccje-305', 'Room 305', 'CCJE-305', 'Classroom', 10, 55, 310, 150, [[320, 175, 'right']]),
  room('ccje-304', 'Room 304', 'CCJE-304', 'Classroom', 10, 205, 310, 140, [[320, 315, 'right']]),
  room('ccje-303', 'Room 303', 'CCJE-303', 'Classroom', 10, 345, 310, 150, [[320, 465, 'right']]),
  room('ccje3-electrical', 'Electrical Room 3', 'ELECTRICAL 3', 'Facility', 10, 495, 310, 130, [[320, 595, 'right']]),
  room('ccje-302', 'Room 302', 'CCJE-302', 'Classroom', 10, 625, 310, 220, [[320, 655, 'right'], [320, 815, 'right']]),
  room('ccje3-documents-photo', 'Questioned Document and Photography Room', 'QD / PHOTO', 'Laboratory', 495, 55, 172.5, 210,
    [[530, 265, 'bottom']], ['Questioned Document', '& Photography Room']),
  room('ccje3-ballistics', 'Forensic Ballistics and Dactyloscopy Room', 'BALLISTICS', 'Laboratory', 667.5, 55, 172.5, 210,
    [[705, 265, 'bottom']], ['Forensic Ballistics', '& Dactyloscopy Room']),
  room('ccje3-polygraph', 'Polygraph Examination and Interrogation Room', 'POLYGRAPH', 'Laboratory', 495, 335, 115, 170,
    [[575, 335, 'top']], ['Polygraph', 'Examination &', 'Interrogation']),
  room('ccje3-darkroom', 'Dark Room', 'DARK ROOM', 'Laboratory', 610, 335, 115, 170, [[690, 335, 'top']]),
  room('ccje3-crime-scene', 'Permanent Crime Scene Room', 'CRIME SCENE', 'Laboratory', 725, 335, 115, 170,
    [[805, 335, 'top']], ['Permanent', 'Crime Scene Room']),
  room('ccje3-defensive-tactics', 'Defensive Tactics Room', 'DEF. TACTICS', 'Facility', 495, 505, 345, 170,
    [[495, 535, 'left'], [495, 645, 'left']]),
  room('ccje-301', 'Room 301', 'CCJE-301', 'Classroom', 495, 675, 345, 170,
    [[495, 705, 'left'], [495, 815, 'left']]),
  ...ccjeSecondRooms.filter(r => r.isStair).map(stair => ({
    ...stair, id: stair.id.replace('ccje2-', 'ccje3-'), floorId: 'floor-3',
    name: stair.name.replace('2nd Floor', '3rd Floor'), stairDestination: '2ND FLOOR',
    stairSecondaryDestination: null,
    isTwinFlight: stair.id.endsWith('north'),
    description: 'CCJE staircase connecting the 3rd Floor to the 2nd Floor',
  })),
];

export const ccjeThirdWaypoints = [];
export const ccjeThirdEdges = [];
const positions = new Map([...ccjeSecondRooms, ...ccjeThirdRooms].map(r => [r.id, r.center]));
const point = (id, x, y) => {
  const position = [ox + x, oy + y];
  ccjeThirdWaypoints.push({ id, floorId: 'floor-3', position });
  positions.set(id, position);
  return id;
};
const link = (from, to, forwardDir = 'Follow the CCJE third-floor hallway', backDir = forwardDir, cost) => {
  const a = positions.get(from), b = positions.get(to);
  ccjeThirdEdges.push({ from, to, cost: cost ?? Math.max(1, Math.hypot(a[0] - b[0], a[1] - b[1])), forwardDir, backDir });
};
const stops = [175, 225, 300, 315, 465, 535, 595, 625, 645, 655, 705, 815];
for (const side of ['west', 'east']) {
  stops.forEach((y, i) => {
    point(`ccje3-${side}-${y}`, side === 'west' ? 360 : 485, y);
    if (i) link(`ccje3-${side}-${stops[i - 1]}`, `ccje3-${side}-${y}`);
  });
}
for (const y of [225, 300, 625]) link(`ccje3-west-${y}`, `ccje3-east-${y}`);

// The five forensic rooms open onto the shared east-west hallway.
const branchStops = [485, 530, 575, 690, 705, 805];
branchStops.forEach((x, i) => {
  point(`ccje3-branch-${x}`, x, 300);
  if (i) link(`ccje3-branch-${branchStops[i - 1]}`, `ccje3-branch-${x}`);
});
link('ccje3-east-300', 'ccje3-branch-485');

ccjeThirdRooms.filter(r => !r.isStair).forEach(r => r.doors.forEach((door, i) => {
  const dx = door.x - ox, dy = door.y - oy;
  const doorId = point(`${r.id}-door-${i}`, dx, dy);
  const branch = door.wall === 'top' || door.wall === 'bottom';
  const target = branch ? `ccje3-branch-${dx}` : `ccje3-${door.wall === 'right' ? 'west' : 'east'}-${dy}`;
  link(r.id, doorId, `Exit ${r.name} through the doorway`, `Enter ${r.name}`);
  link(doorId, target);
}));

for (const [side, landingY] of [['north', 225], ['south', 625]]) {
  const landing = point(`ccje3-stair-landing-${side}`, 440, landingY);
  link(`ccje3-stairs-${side}`, landing);
  link(landing, `ccje3-west-${landingY}`);
  link(landing, `ccje3-east-${landingY}`);
  link(`ccje2-stairs-${side}`, `ccje3-stairs-${side}`,
    'Take the stairs UP to the 3rd Floor', 'Take the stairs DOWN to the 2nd Floor', 120);
}
