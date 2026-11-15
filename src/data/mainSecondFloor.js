// Photo trace in the same campus coordinate system as Main Building's ground floor.
const X = 1590;
const Y = -40;
const point = ([x, y]) => [x + X, y + Y];
const door = (x, y, wall, arc) => ({ x: x + X, y: y + Y, wall, arc, size: 30 });

function room(id, name, code, category, bounds, doors, extra = {}) {
  const [x, y, width, height] = bounds;
  return {
    id: `main2-${id}`, buildingId: 'main', floorId: 'floor-2', name, code, category,
    x: x + X, y: y + Y, width, height, center: point([x + width / 2, y + height / 2]),
    doors, icon: '💻', accentColor: '#6366f1',
    description: `${name} • Main Building, 2nd Floor`, ...extra,
  };
}

export const mainSecondFloorRooms = [
  room('library', 'Library', 'LIBRARY 2F', 'Library & Study', [110, 100, 200, 170], [door(310, 245, 'right', 'east-down')], { icon: '📚', accentColor: '#f59e0b' }),
  room('prayer', 'Prayer Room', 'PRAYER', 'Facility', [110, 274, 185, 120], [door(295, 360, 'right', 'east-down')], { icon: '🙏', accentColor: '#a855f7' }),
  room('tourism', 'Tourism Room', 'TOURISM', 'Laboratory', [110, 397, 185, 193], [door(295, 450, 'right', 'east-down')], { icon: '🌍', accentColor: '#0ea5e9' }),
  room('computer-lab-1', 'Computer Lab 1', 'COMPUTER LAB 1', 'Laboratory', [360, 100, 270, 170], [door(440, 270, 'bottom', 'south-left')]),
  room('computer-lab-2', 'Computer Lab 2', 'COMPUTER LAB 2', 'Laboratory', [637, 100, 266, 170], [door(675, 270, 'bottom', 'south-left')]),
  room('computer-tech', 'Computer Tech', 'COMPUTER TECH', 'Laboratory', [360, 330, 178, 180], [door(385, 330, 'top', 'north-left'), door(360, 480, 'left', 'west-down')]),
  room('natural-science', 'Natural Science Lab', 'NAT SCIENCE', 'Laboratory', [543, 330, 175, 180], [door(555, 330, 'top', 'north-left'), door(718, 485, 'right', 'east-down')], { icon: '🔬', accentColor: '#10b981' }),
  room('seaman', 'Seaman Lab', 'SEAMAN LAB', 'Laboratory', [360, 517, 178, 202], [door(360, 660, 'left', 'west-down')], {
    shapePath: 'M 1950 477 H 2128 V 679 L 1985 650 L 1950 638 Z',
    center: point([449, 608]), icon: '⚙️', accentColor: '#0ea5e9',
  }),
  room('electronic', 'Electronic Lab', 'ELECTRONIC', 'Laboratory', [543, 517, 178, 202], [door(721, 710, 'right', 'east-down')], {
    shapePath: 'M 2133 477 H 2311 V 671 Q 2222 689 2133 679 Z',
    center: point([632, 608]), icon: '⚡', accentColor: '#f59e0b',
  }),
  room('faculty', 'Faculty Room', 'FACULTY 2F', 'Administrative Office', [795, 590, 126, 156], [door(795, 610, 'left', 'west-down')], {
    shapePath: 'M 2385 550 H 2511 V 697 H 2420 L 2385 712 Z',
    icon: '👨‍🏫', accentColor: '#3b82f6',
  }),
  room('restroom-he', 'Male Restroom', 'HE', 'Facility', [784, 444, 128, 62], [door(784, 456, 'left', 'west-down')], { icon: '🚹', accentColor: '#0ea5e9', compactLabel: true }),
  room('restroom-she', 'Female Restroom', 'SHE', 'Facility', [818, 512, 94, 52], [door(818, 525, 'left', 'west-down')], { icon: '🚺', accentColor: '#ec4899', compactLabel: true }),
  room('service-upper', 'Service Chase (Upper)', 'CHASE', 'Facility', [868, 360, 44, 38], [door(868, 380, 'left', 'west-down')], { icon: '🔧', accentColor: '#64748b', compactLabel: true }),
  room('service-lower', 'Service Chase (Lower)', 'CHASE', 'Facility', [868, 401, 44, 35], [door(868, 418, 'left', 'west-down')], { icon: '🔧', accentColor: '#64748b', compactLabel: true }),
  room('lobby', 'Lobby', 'LOBBY 2F', 'Facility', [230, 595, 125, 145], [], { center: point([285, 640]), icon: '🚪', accentColor: '#10b981', defaultFill: '#f0fdf4' }),
  room('balcony', 'Balcony', 'BALCONY', 'Facility', [230, 754, 90, 42], [door(275, 754, 'top', 'north-left')], { icon: '🌤️', accentColor: '#0ea5e9', compactLabel: true }),
  room('stairs-sw', 'Southwest Stairs (To Ground Floor)', 'SW STAIRS', 'Exit & Stairs', [110, 680, 110, 120], [], { center: point([165, 740]), icon: '🪜', accentColor: '#0ea5e9', isStair: true, direction: 'down', isTwinFlight: true, stairOrientation: 'vertical', stairDestination: 'GROUND' }),
  room('stairs-ne', 'Northeast Stairs', 'NE STAIRS', 'Exit & Stairs', [796, 270, 110, 85], [], { icon: '🪜', accentColor: '#0ea5e9', isStair: true, direction: 'down', isTwinFlight: true, stairLabel: 'NE STAIRS', description: 'Northeast staircase shown on the reference; lower-floor connection is not mapped.' }),
  room('exit-north', 'North Fire Exit', 'FIRE EXIT', 'Exit & Stairs', [315, 83, 34, 25], [], { icon: '🏃', accentColor: '#10b981', center: point([332, 95.5]) }),
];

// Hallway nodes follow the west/north/east corridors and the curved south facade.
const hallPoints = {
  'north-exit': [332, 125], 'library': [332, 245], 'nw': [332, 300],
  'prayer': [332, 360], 'tourism': [332, 450], 'tech-west': [332, 480],
  'west-lobby': [332, 600], 'seaman': [332, 660],
  'north-tech': [385, 300], 'lab-1': [440, 300], 'north-science': [555, 300],
  'lab-2': [675, 300], 'ne': [751, 300], 'ne-stairs': [775, 312.5],
  'east-services': [840, 418], 'service-upper': [840, 380], 'services-turn': [775, 380],
  'east-science': [751, 485], 'east-he': [751, 456], 'east-she': [751, 525],
  'she-entry': [801, 525], 'east-faculty': [751, 610], 'electronic': [751, 710],
  'south-east': [751, 748], 'south-mid': [610, 765], 'south-west': [420, 745],
  'lobby': [280, 630], 'sw-landing': [165, 630], 'balcony': [275, 735],
};
const wpId = key => `main2-wp-${key}`;
export const mainSecondFloorWaypoints = [
  ...Object.entries(hallPoints).map(([key, pos]) => ({ id: wpId(key), floorId: 'floor-2', position: point(pos) })),
  ...mainSecondFloorRooms.flatMap(r => r.doors.map((d, i) => ({ id: `${r.id}-door-${i}`, floorId: 'floor-2', position: [d.x, d.y] }))),
];

const nodes = new Map([...mainSecondFloorRooms.map(r => [r.id, r.center]), ...mainSecondFloorWaypoints.map(w => [w.id, w.position])]);
function edge(from, to, forwardDir, backDir, cost) {
  const a = nodes.get(from), b = nodes.get(to);
  return { from, to, cost: cost ?? Math.hypot(a[0] - b[0], a[1] - b[1]), forwardDir, backDir };
}
const hallLinks = [
  ['north-exit', 'library'], ['library', 'nw'], ['nw', 'prayer'], ['prayer', 'tourism'],
  ['tourism', 'tech-west'], ['tech-west', 'west-lobby'], ['west-lobby', 'seaman'],
  ['nw', 'north-tech'], ['north-tech', 'lab-1'], ['lab-1', 'north-science'], ['north-science', 'lab-2'], ['lab-2', 'ne'],
  ['ne', 'ne-stairs'], ['ne', 'east-he'], ['east-he', 'east-science'], ['east-science', 'east-she'],
  ['east-she', 'east-faculty'], ['east-faculty', 'electronic'], ['electronic', 'south-east'],
  ['south-east', 'south-mid'], ['south-mid', 'south-west'], ['south-west', 'seaman'],
  ['west-lobby', 'lobby'], ['lobby', 'sw-landing'], ['lobby', 'balcony'],
  ['east-she', 'she-entry'], ['ne-stairs', 'services-turn'], ['services-turn', 'service-upper'], ['service-upper', 'east-services'], ['east-services', 'east-he'],
];
const roomHalls = {
  library: ['library'], prayer: ['prayer'], tourism: ['tourism'],
  'computer-lab-1': ['lab-1'], 'computer-lab-2': ['lab-2'],
  'computer-tech': ['north-tech', 'tech-west'], 'natural-science': ['north-science', 'east-science'],
  seaman: ['seaman'], electronic: ['electronic'], faculty: ['east-faculty'],
  'restroom-he': ['east-he'], 'restroom-she': ['she-entry'],
  'service-upper': ['service-upper'], 'service-lower': ['east-services'], balcony: ['balcony'],
};
export const mainSecondFloorEdges = [
  ...hallLinks.map(([a, b]) => edge(wpId(a), wpId(b), 'Follow the Main Building 2nd Floor hallway', 'Follow the Main Building 2nd Floor hallway')),
  ...mainSecondFloorRooms.flatMap(r => r.doors.flatMap((d, i) => [
    edge(r.id, `${r.id}-door-${i}`, `Exit ${r.name} through its doorway`, `Enter ${r.name}`),
    edge(`${r.id}-door-${i}`, wpId(roomHalls[r.id.slice(6)][i]), 'Step into the hallway', `Walk to ${r.name} doorway`),
  ])),
  edge('main2-lobby', wpId('lobby'), 'Step into the lobby hallway', 'Enter the lobby'),
  edge('main2-stairs-sw', wpId('sw-landing'), 'Step off the southwest stairs into the lobby', 'Enter the southwest stairs'),
  edge('main2-stairs-ne', wpId('ne-stairs'), 'Step off the northeast stairs into the hallway', 'Enter the northeast stairs'),
  edge('main2-exit-north', wpId('north-exit'), 'Enter the fire exit passage', 'Proceed to the North Fire Exit'),
  { from: 'main-stairs', to: 'main2-stairs-sw', cost: 120, forwardDir: '🪜 Take the Main Building stairs UP to the 2nd Floor', backDir: '🪜 Take the Main Building stairs DOWN to the Ground Floor' },
];
