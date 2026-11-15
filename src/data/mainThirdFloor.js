// Proportional trace of the supplied third-floor plan. Numbering follows the
// fourth-floor positions as requested; the former spare room is Room 306.
const S = 1.45;
const point = ([x, y]) => [1673 + x * S, 26 + y * S];
const path = points => points.map(([command, x, y]) => `${command} ${point([x, y]).join(' ')}`).join(' ') + ' Z';
const door = (x, y, wall, arc) => ({ x: point([x, y])[0], y: point([x, y])[1], wall, arc, size: 28 });

function room(id, name, code, category, [x, y, width, height], doors, extra = {}) {
  return {
    id: `main3-${id}`, buildingId: 'main', floorId: 'floor-3', name, code, category,
    x: point([x, y])[0], y: point([x, y])[1], width: width * S, height: height * S,
    center: point([x + width / 2, y + height / 2]), doors,
    icon: '🏫', accentColor: '#3b82f6', description: `${name} • Main Building, 3rd Floor`, ...extra,
  };
}

export const mainThirdFloorRooms = [
  room('lecture-nw', 'Room 303', 'MAIN-303', 'Classroom', [20, 20, 144, 123], [door(164, 90, 'right', 'east-down')]),
  room('lecture-north', 'Room 302', 'MAIN-302', 'Classroom', [200, 20, 190, 123], [door(216, 143, 'bottom', 'south-left')]),
  room('lecture-ne', 'Room 301', 'MAIN-301', 'Classroom', [397, 20, 180, 125], [door(420, 145, 'bottom', 'south-left')]),
  room('west-upper', 'Room 304', 'MAIN-304', 'Classroom', [20, 147, 133, 105], [door(153, 203, 'right', 'east-down')]),
  room('west-lower', 'Room 305', 'MAIN-305', 'Classroom', [20, 256, 133, 105], [door(153, 280, 'right', 'east-down')]),
  room('lecture-center-west', 'Room 307', 'MAIN-307', 'Classroom', [198, 187, 122, 121], [door(215, 187, 'top', 'north-left'), door(198, 295, 'left', 'west-down')]),
  room('lecture-center-east', 'Room 308', 'MAIN-308', 'Classroom', [324, 187, 120, 121], [door(335, 187, 'top', 'north-left'), door(444, 295, 'right', 'east-down')]),
  room('lecture-sw', 'Room 310', 'MAIN-310', 'Classroom', [198, 313, 122, 132], [door(198, 420, 'left', 'west-down')], {
    shapePath: path([['M', 198, 313], ['L', 320, 313], ['L', 320, 445], ['L', 225, 434], ['L', 198, 425]]), center: point([259, 375]),
  }),
  room('lecture-se', 'Room 309', 'MAIN-309', 'Classroom', [324, 313, 120, 134], [door(444, 435, 'right', 'east-down')], {
    shapePath: `M ${point([324,313])} L ${point([444,313])} L ${point([444,441])} Q ${point([385,455])} ${point([324,445])} Z`, center: point([384, 375]),
  }),
  room('spare', 'Room 306', 'MAIN-306', 'Classroom', [488, 354, 84, 107], [door(488, 378, 'left', 'west-down')], {
    shapePath: path([['M',488,354],['L',572,354],['L',572,461],['L',518,461],['L',488,469]]), icon:'🏫', accentColor:'#3b82f6',
  }),
  room('restroom-he', 'Male Restroom', 'HE', 'Facility', [489, 266, 84, 44], [door(489,285,'left','west-down')], { icon:'🚹', accentColor:'#0ea5e9', compactLabel:true }),
  room('restroom-she', 'Female Restroom', 'SHE', 'Facility', [508,315,65,35], [door(508,327,'left','west-down')], { icon:'🚺', accentColor:'#ec4899', compactLabel:true }),
  room('pipe-chase-upper', 'Pipe Chase (Upper)', 'PIPE', 'Facility', [550,214,24,21], [door(550,225,'left','west-down')], { icon:'🔧', accentColor:'#64748b', compactLabel:true }),
  room('pipe-chase-lower', 'Pipe Chase (Lower)', 'PIPE', 'Facility', [550,239,24,25], [door(550,250,'left','west-down')], { icon:'🔧', accentColor:'#64748b', compactLabel:true }),
  room('lobby', 'Lobby', 'LOBBY 3F', 'Facility', [112,363,84,98], [], {center:point([153,405]),icon:'🚪',accentColor:'#10b981',defaultFill:'#f0fdf4'}),
  room('balcony', 'Balcony', 'BALCONY', 'Facility', [110,469,60,23], [door(140,469,'top','north-left')], {icon:'🌤️',accentColor:'#0ea5e9',compactLabel:true}),
  room('stairs-sw', 'Southwest Stairs (Floors 2–4)', 'SW STAIRS', 'Exit & Stairs', [28,415,80,75], [], {icon:'🪜',accentColor:'#0ea5e9',isStair:true,direction:'down',isTwinFlight:true,stairOrientation:'vertical',stairDestination:'2ND FLOOR',stairSecondaryDestination:'4TH FLOOR'}),
  room('stairs-ne', 'Northeast Stairs (Floors 2–4)', 'NE STAIRS', 'Exit & Stairs', [503,145,71,65], [], {icon:'🪜',accentColor:'#0ea5e9',isStair:true,direction:'down',isTwinFlight:true,stairOrientation:'vertical',stairDestination:'2ND FLOOR',stairSecondaryDestination:'4TH FLOOR',stairLabel:'NE STAIRS'}),
  room('exit-north', 'North Fire Exit', 'FIRE EXIT', 'Exit & Stairs', [169,21,24,14], [], {icon:'🏃',accentColor:'#10b981'}),
];

const hallPoints = {
  'exit': [182,40], 'nw-room': [182,90], 'nw': [176,165],
  'west-upper':[176,203], 'west-lower':[176,280], 'center-west':[176,295],
  'west-lobby':[176,375], 'southwest':[176,420],
  'north-west':[215,165], 'north-center':[216,165], 'north-middle':[335,165], 'north-east':[420,165], 'ne':[466,165],
  'stairs-ne':[488,177.5], 'service-turn':[488,240], 'service-upper':[530,225], 'service-mid':[530,240], 'service-lower':[530,250], 'service-west':[480,250],
  'he':[466,285], 'center-east':[466,295], 'she':[466,327], 'she-entry':[498,327], 'spare':[466,378], 'southeast':[466,435],
  'south-east':[466,467], 'south-mid':[360,478], 'south-west':[230,461],
  'lobby':[153,390], 'sw-landing':[68,390], 'balcony':[140,460],
};
const wpId = key => `main3-wp-${key}`;
export const mainThirdFloorWaypoints = [
  ...Object.entries(hallPoints).map(([key,pos]) => ({id:wpId(key),floorId:'floor-3',position:point(pos)})),
  ...mainThirdFloorRooms.flatMap(r => r.doors.map((d,i) => ({id:`${r.id}-door-${i}`,floorId:'floor-3',position:[d.x,d.y]}))),
];
const nodes = new Map([...mainThirdFloorRooms.map(r => [r.id,r.center]),...mainThirdFloorWaypoints.map(w => [w.id,w.position])]);
function edge(from,to,forwardDir,backDir) {
  const a=nodes.get(from),b=nodes.get(to);
  return {from,to,cost:Math.hypot(a[0]-b[0],a[1]-b[1]),forwardDir,backDir};
}
const hallLinks = [
  ['exit','nw-room'],['nw-room','nw'],['nw','west-upper'],['west-upper','west-lower'],['west-lower','center-west'],['center-west','west-lobby'],['west-lobby','southwest'],
  ['nw','north-west'],['north-west','north-center'],['north-center','north-middle'],['north-middle','north-east'],['north-east','ne'],
  ['ne','stairs-ne'],['stairs-ne','service-turn'],['service-turn','service-mid'],['service-mid','service-upper'],['service-mid','service-lower'],['service-lower','service-west'],['service-west','he'],
  ['ne','he'],['he','center-east'],['center-east','she'],['she','she-entry'],['she','spare'],['spare','southeast'],['southeast','south-east'],
  ['south-east','south-mid'],['south-mid','south-west'],['south-west','southwest'],['west-lobby','lobby'],['lobby','sw-landing'],['lobby','balcony'],
];
const roomHalls = {
  'lecture-nw':['nw-room'],'lecture-north':['north-center'],'lecture-ne':['north-east'],
  'west-upper':['west-upper'],'west-lower':['west-lower'],
  'lecture-center-west':['north-west','center-west'],'lecture-center-east':['north-middle','center-east'],
  'lecture-sw':['southwest'],'lecture-se':['southeast'],spare:['spare'],
  'restroom-he':['he'],'restroom-she':['she-entry'],
  'pipe-chase-upper':['service-upper'],'pipe-chase-lower':['service-lower'],balcony:['balcony'],
};
export const mainThirdFloorEdges = [
  ...hallLinks.map(([a,b]) => edge(wpId(a),wpId(b),'Follow the Main Building 3rd Floor hallway','Follow the Main Building 3rd Floor hallway')),
  ...mainThirdFloorRooms.flatMap(r => r.doors.flatMap((d,i) => [
    edge(r.id,`${r.id}-door-${i}`,`Exit ${r.name} through its doorway`,`Enter ${r.name}`),
    edge(`${r.id}-door-${i}`,wpId(roomHalls[r.id.slice(6)][i]),'Step into the hallway',`Walk to ${r.name} doorway`),
  ])),
  edge('main3-lobby',wpId('lobby'),'Step into the lobby hallway','Enter the lobby'),
  edge('main3-stairs-sw',wpId('sw-landing'),'Step off the southwest stairs into the lobby','Enter the southwest stairs'),
  edge('main3-stairs-ne',wpId('stairs-ne'),'Step off the northeast stairs into the hallway','Enter the northeast stairs'),
  edge('main3-exit-north',wpId('exit'),'Enter the north fire exit passage','Proceed to the North Fire Exit'),
  ...['sw','ne'].map(side => ({from:`main2-stairs-${side}`,to:`main3-stairs-${side}`,cost:120,forwardDir:'🪜 Take the Main Building stairs UP to the 3rd Floor',backDir:'🪜 Take the Main Building stairs DOWN to the 2nd Floor'})),
];
