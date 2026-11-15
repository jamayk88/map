// Main Building fourth floor, oriented north-up from the supplied sketch.
// The west room below 404 is 405 (confirmed by the user); 406 is not drawn.
const S = 1.45;
const point = ([x, y]) => [1673 + x * S, 26 + y * S];
const door = (x, y, wall, arc) => ({ x: point([x, y])[0], y: point([x, y])[1], wall, arc, size: 28 });
function room(id, name, code, category, [x, y, width, height], doors, extra = {}) {
  return {
    id: `main4-${id}`, buildingId: 'main', floorId: 'floor-4', name, code, category,
    x: point([x, y])[0], y: point([x, y])[1], width: width * S, height: height * S,
    center: point([x + width / 2, y + height / 2]), doors,
    icon: '🏫', accentColor: '#3b82f6', description: `${name} • Main Building, 4th Floor`, ...extra,
  };
}

export const mainFourthFloorRooms = [
  room('403', 'Room 403', 'MAIN-403', 'Classroom', [20, 20, 144, 123], [door(164, 120, 'right', 'east-down')]),
  room('404', 'Room 404', 'MAIN-404', 'Classroom', [20, 147, 133, 105], [door(153, 230, 'right', 'east-down')]),
  room('405', 'Room 405', 'MAIN-405', 'Classroom', [20, 256, 133, 105], [door(153, 335, 'right', 'east-down')]),
  room('402', 'Room 402', 'MAIN-402', 'Classroom', [200, 20, 190, 123], [door(216, 143, 'bottom', 'south-left')]),
  room('401', 'Room 401', 'MAIN-401', 'Classroom', [397, 20, 180, 125], [door(420, 145, 'bottom', 'south-left')]),
  room('407', 'Room 407', 'MAIN-407', 'Classroom', [198, 187, 122, 121], [door(215, 187, 'top', 'north-left'), door(198, 205, 'left', 'west-up')]),
  room('408', 'Room 408', 'MAIN-408', 'Classroom', [324, 187, 120, 121], [door(340, 187, 'top', 'north-left'), door(444, 295, 'right', 'east-down')]),
  room('410', 'Room 410', 'MAIN-410', 'Classroom', [198, 313, 122, 132], [door(198, 340, 'left', 'west-up'), door(198, 420, 'left', 'west-down')]),
  room('409', 'Room 409', 'MAIN-409', 'Classroom', [324, 313, 120, 132], [door(444, 335, 'right', 'east-up'), door(425, 445, 'bottom', 'south-right')]),
  room('restroom-male', 'Male Restroom', 'CR MALE', 'Facility', [489, 225, 84, 65], [door(489, 245, 'left', 'west-up')], { icon: '🚹', accentColor: '#0ea5e9' }),
  room('restroom-female', 'Female Restroom', 'CR FEMALE', 'Facility', [489, 295, 84, 65], [door(489, 315, 'left', 'west-up')], { icon: '🚺', accentColor: '#ec4899' }),
  room('jshssc', 'LC-JSHSSC Office', 'LC-JSHSSC', 'Administrative Office', [489, 378, 84, 112], [door(489, 400, 'left', 'west-up')], { icon: '🏢', accentColor: '#10b981' }),
  room('stairs-sw', 'Southwest Stairs (To 3rd Floor)', 'SW STAIRS', 'Exit & Stairs', [28, 415, 80, 75], [], { icon: '🪜', accentColor: '#0ea5e9', isStair: true, direction: 'down', isTwinFlight: true, stairOrientation: 'vertical', stairDestination: '3RD FLOOR' }),
  room('stairs-ne', 'Northeast Stairs (To 3rd Floor)', 'NE STAIRS', 'Exit & Stairs', [503, 145, 71, 65], [], { icon: '🪜', accentColor: '#0ea5e9', isStair: true, direction: 'down', isTwinFlight: true, stairOrientation: 'vertical', stairDestination: '3RD FLOOR' }),
  room('exit-north', 'Main 4th Floor North Fire Exit', 'FIRE EXIT', 'Exit & Stairs', [169, 21, 24, 14], [], { icon: '🏃', accentColor: '#10b981' }),
];

const hallPoints = {
  exit: [182, 40], 'room-403': [182, 120], nw: [176, 165],
  'room-404': [176, 230], 'room-405': [176, 335], 'room-407-west': [176, 205],
  'room-410-upper': [176, 340], 'room-410-lower': [176, 420],
  'north-402': [216, 165], 'north-407': [215, 165], 'north-408': [340, 165], 'north-401': [420, 165], ne: [466, 165],
  'stairs-ne': [488, 177.5], 'male': [466, 245], female: [466, 315],
  'room-408-east': [466, 295], 'room-409-east': [466, 335], jshssc: [466, 400], se: [466, 465],
  'south-409': [425, 465], 'south-mid': [320, 465], sw: [176, 465],
  'sw-landing': [68, 390], 'west-landing': [176, 390],
};
const wpId = key => `main4-wp-${key}`;
export const mainFourthFloorWaypoints = [
  ...Object.entries(hallPoints).map(([key, pos]) => ({ id: wpId(key), floorId: 'floor-4', position: point(pos) })),
  ...mainFourthFloorRooms.flatMap(r => r.doors.map((d, i) => ({ id: `${r.id}-door-${i}`, floorId: 'floor-4', position: [d.x, d.y] }))),
];
const positions = new Map([...mainFourthFloorRooms.map(r => [r.id, r.center]), ...mainFourthFloorWaypoints.map(w => [w.id, w.position])]);
function link(from, to, forwardDir = 'Follow the Main Building 4th Floor hallway', backDir = forwardDir) {
  const a = positions.get(from), b = positions.get(to);
  return { from, to, cost: Math.max(1, Math.hypot(a[0] - b[0], a[1] - b[1])), forwardDir, backDir };
}
const hallLinks = [
  ['exit', 'room-403'], ['room-403', 'nw'], ['nw', 'room-407-west'], ['room-407-west', 'room-404'],
  ['room-404', 'room-405'], ['room-405', 'room-410-upper'], ['room-410-upper', 'west-landing'], ['west-landing', 'room-410-lower'], ['room-410-lower', 'sw'],
  ['nw', 'north-407'], ['north-407', 'north-402'], ['north-402', 'north-408'], ['north-408', 'north-401'], ['north-401', 'ne'],
  ['ne', 'stairs-ne'], ['ne', 'male'], ['male', 'room-408-east'], ['room-408-east', 'female'], ['female', 'room-409-east'], ['room-409-east', 'jshssc'], ['jshssc', 'se'],
  ['se', 'south-409'], ['south-409', 'south-mid'], ['south-mid', 'sw'], ['west-landing', 'sw-landing'],
];
const roomHalls = {
  '403': ['room-403'], '404': ['room-404'], '405': ['room-405'], '402': ['north-402'], '401': ['north-401'],
  '407': ['north-407', 'room-407-west'], '408': ['north-408', 'room-408-east'],
  '410': ['room-410-upper', 'room-410-lower'], '409': ['room-409-east', 'south-409'],
  'restroom-male': ['male'], 'restroom-female': ['female'], jshssc: ['jshssc'],
};
export const mainFourthFloorEdges = [
  ...hallLinks.map(([a, b]) => link(wpId(a), wpId(b))),
  ...mainFourthFloorRooms.flatMap(r => r.doors.flatMap((d, i) => [
    link(r.id, `${r.id}-door-${i}`, `Exit ${r.name} through its doorway`, `Enter ${r.name}`),
    link(`${r.id}-door-${i}`, wpId(roomHalls[r.id.slice(6)][i])),
  ])),
  link('main4-stairs-sw', wpId('sw-landing'), 'Step off the southwest stairs onto the landing', 'Enter the southwest staircase'),
  link('main4-stairs-ne', wpId('stairs-ne'), 'Step off the northeast stairs into the hallway', 'Enter the northeast staircase'),
  link('main4-exit-north', wpId('exit'), 'Enter the north fire exit passage', 'Proceed to the North Fire Exit'),
  ...['sw', 'ne'].map(side => ({ from: `main3-stairs-${side}`, to: `main4-stairs-${side}`, cost: 120,
    forwardDir: 'Take the Main Building stairs UP to the 4th Floor', backDir: 'Take the Main Building stairs DOWN to the 3rd Floor' })),
];
