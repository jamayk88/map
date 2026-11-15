// Proportional trace of the Mercado third-floor reference, offset into campus coordinates.
function room(id, name, code, category, x, y, width, height, doorY, extra = {}) {
  const doorX = x < 1250 ? x + width : x;
  return {
    id: `mb3-${id}`, buildingId: 'mercado', floorId: 'floor-3', name, code,
    category, x, y, width, height, center: [x + width / 2, y + height / 2],
    icon: category === 'Classroom' ? '🏫' : '🔬',
    accentColor: category === 'Classroom' ? '#3b82f6' : '#8b5cf6',
    description: `${name} • Mercado Building, 3rd Floor`,
    doors: [{ x: doorX, y: doorY, wall: x < 1250 ? 'right' : 'left', size: 32, arc: x < 1250 ? 'east-down' : 'west-down' }],
    ...extra,
  };
}

export const thirdFloorRooms = [
  room('psychology', 'Psychology Room', 'PSYCHOLOGY', 'Laboratory', 985, 65, 260, 140, 105),
  room('bsba', 'BSBA Simulation Room', 'BSBA SIMULATION', 'Laboratory', 985, 205, 260, 132, 308),
  room('306', 'MB 306', 'MB 306', 'Classroom', 985, 337, 260, 189, 510),
  room('305', 'MB 305', 'MB 305', 'Classroom', 985, 526, 260, 181, 692),
  room('304', 'MB 304', 'MB 304', 'Classroom', 985, 707, 260, 182, 872),
  room('edtech', 'EdTech Room', 'EDTECH', 'Laboratory', 1375, 65, 160, 273, 308),
  room('303', 'MB 303', 'MB 303', 'Classroom', 1330, 338, 205, 188, 510, { isGuideLocation: true }),
  room('302', 'MB 302', 'MB 302', 'Classroom', 1330, 526, 205, 181, 692, { defaultFill: '#baff68', accentColor: '#16a34a' }),
  room('301', 'MB 301', 'MB 301', 'Classroom', 1330, 707, 205, 182, 872),
  {
    id: 'mb3-stairs-main', buildingId: 'mercado', floorId: 'floor-3',
    name: 'Main Stairs (To 2nd Floor)', code: 'MB3 STAIRS', category: 'Exit & Stairs',
    x: 1310, y: 115, width: 65, height: 145, center: [1342.5, 187.5],
    icon: '🪜', accentColor: '#0ea5e9', isStair: true, direction: 'down',
    stairDestination: '2ND FLOOR', doors: [], description: 'Main stairs connecting to Mercado 2nd Floor',
  },
  {
    id: 'mb3-stairs-south', buildingId: 'mercado', floorId: 'floor-3',
    name: 'South Stairs (To 2nd Floor)', code: 'MB3 STAIRS S', category: 'Exit & Stairs',
    x: 1280, y: 889, width: 255, height: 70, center: [1407.5, 924],
    icon: '🪜', accentColor: '#0ea5e9', isStair: true, direction: 'down',
    doors: [], description: 'South stairs connecting to Mercado 2nd Floor',
  },
];

const corridorX = 1285;
const corridorYs = [105, 275, 308, 510, 692, 872, 924];
export const thirdFloorWaypoints = [
  ...corridorYs.map(y => ({ id: `mb3-wp-hall-${y}`, floorId: 'floor-3', position: [corridorX, y] })),
  ...thirdFloorRooms.filter(r => !r.isStair).map(r => ({
    id: `${r.id}-door`, floorId: 'floor-3', position: [r.doors[0].x, r.doors[0].y],
  })),
  { id: 'mb3-wp-main-landing', floorId: 'floor-3', position: [1342.5, 275] },
];

function edge(from, to, cost, forwardDir, backDir) {
  return { from, to, cost, forwardDir, backDir };
}

export const thirdFloorEdges = [
  ...corridorYs.slice(1).map((y, i) => edge(
    `mb3-wp-hall-${corridorYs[i]}`, `mb3-wp-hall-${y}`, y - corridorYs[i],
    'Walk south along the 3rd Floor corridor', 'Walk north along the 3rd Floor corridor',
  )),
  ...thirdFloorRooms.filter(r => !r.isStair).flatMap(r => {
    const door = r.doors[0];
    return [
      // First travel inside the room to the actual doorway; then enter the corridor.
      edge(r.id, `${r.id}-door`, Math.hypot(r.center[0] - door.x, r.center[1] - door.y), `Exit ${r.name} through its doorway`, `Enter ${r.name}`),
      edge(`${r.id}-door`, `mb3-wp-hall-${door.y}`, Math.abs(door.x - corridorX), 'Step into the central corridor', `Walk to ${r.name} doorway`),
    ];
  }),
  edge('mb3-stairs-main', 'mb3-wp-main-landing', 87.5, 'Step off the main stairs onto the landing', 'Enter the main stairs'),
  edge('mb3-wp-main-landing', 'mb3-wp-hall-275', 57.5, 'Walk west into the central corridor', 'Walk east to the main stairs landing'),
  edge('mb3-stairs-south', 'mb3-wp-hall-924', 122.5, 'Step off the south stairs into the corridor', 'Enter the south stairs'),
  edge('mb2-stairs-main', 'mb3-stairs-main', 120, '🪜 Take the Main Stairs UP to the 3rd Floor', '🪜 Take the Main Stairs DOWN to the 2nd Floor'),
  edge('mb2-stairs-south', 'mb3-stairs-south', 120, '🪜 Take the South Stairs UP to the 3rd Floor', '🪜 Take the South Stairs DOWN to the 2nd Floor'),
];

export const thirdFloorMarkers = [
  { id: 'mb3-ext-north', floorId: 'floor-3', x: 1265, y: 105, icon: '🧯' },
  { id: 'mb3-alarm', floorId: 'floor-3', x: 1345, y: 324, icon: '🚨' },
  { id: 'mb3-ext-room-south', floorId: 'floor-3', x: 1350, y: 866, icon: '🧯' },
  { id: 'mb3-ext-stairs-south', floorId: 'floor-3', x: 1295, y: 938, icon: '🧯' },
];
