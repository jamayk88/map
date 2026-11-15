// Same map footprint as Hernandez. Local coordinates follow the supplied sketch.
export const ccjeBounds = { x: 1780, y: -1085, width: 850, height: 855 };
const { x: originX, y: originY } = ccjeBounds;

const locations = [
  ['ccje-cr-female', 'Female Restroom', 'CR FEMALE', 'Facility', 90, 55, 115, 95, 150, 'bottom'],
  ['ccje-cr-male', 'Male Restroom', 'CR MALE', 'Facility', 205, 55, 115, 95, 150, 'bottom'],
  ['ccje-101', 'Room 101', 'CCJE-101', 'Classroom', 10, 185, 310, 185, 225, 'right'],
  ['ccje-canteen', 'Canteen', 'CANTEEN', 'Facility', 10, 370, 310, 190, 465, 'right'],
  ['ccje-electrical', 'Electrical Room 1', 'ELECTRICAL 1', 'Facility', 10, 560, 310, 85, 600, 'right'],
  ['ccje-garage', 'Garage Room', 'GARAGE', 'Facility', 10, 645, 310, 70, 680, 'right'],
  ['ccje-parking', 'Parking Area', 'PARKING', 'Facility', 10, 715, 310, 130, 775, 'right'],
  ['ccje-open-area', 'Ground Floor Open Area', 'OPEN AREA', 'Facility', 495, 55, 345, 730, 785, 'bottom'],
  ['ccje-entrance', 'CCJE Entrance', 'ENTRANCE', 'Exit & Stairs', 330, 715, 65, 130, 840, null],
  ['ccje-gate-west', 'CCJE West Gate', 'GATE W', 'Exit & Stairs', 495, 795, 110, 50, 840, null],
  ['ccje-gate-east', 'CCJE East Gate', 'GATE E', 'Exit & Stairs', 730, 795, 110, 50, 840, null],
];

export const ccjeGroundRooms = locations.map(([id, name, code, category, x, y, width, height, doorY, wall]) => ({
  id, name, code, category, buildingId: 'ccje', floorId: 'floor-1',
  x: originX + x, y: originY + y, width, height,
  center: [originX + x + width / 2, originY + y + height / 2],
  icon: category === 'Classroom' ? '🏫' : category === 'Exit & Stairs' ? '🚪' : '🏢',
  accentColor: category === 'Classroom' ? '#3b82f6' : '#f97316',
  description: `${name} • CCJE Building, Ground Floor`,
  compactLabel: width < 120 && category === 'Exit & Stairs',
  ...(wall ? { doors: [{
    x: originX + (wall === 'right' ? x + width : x + width / 2),
    y: originY + doorY, wall, size: 28,
    arc: wall === 'right' ? 'east-up' : 'south-left',
  }] } : {}),
}));

const point = (id, x, y) => ({ id, floorId: 'floor-1', position: [originX + x, originY + y] });
export const ccjeGroundWaypoints = [
  ...[170, 225, 465, 600, 680, 775, 820].map(y => point(`ccje-hall-${y}`, 360, y)),
  point('ccje-open-entry', 550, 820),
  point('ccje-open-east', 785, 820),
  point('ccje-sidewalk-entry', 360, 880),
  point('ccje-sidewalk-west-gate', 550, 880),
  point('ccje-sidewalk-east-gate', 785, 880),
  { id: 'ccje-crossing-north', floorId: 'floor-1', position: [1710, -205] },
  { id: 'ccje-crossing-south', floorId: 'floor-1', position: [1710, -40] },
  { id: 'ccje-campus-walk-north', floorId: 'floor-1', position: [1640, -40] },
  { id: 'ccje-campus-walk-south', floorId: 'floor-1', position: [1640, 870] },
];

const positions = new Map([
  ...ccjeGroundRooms.map(room => [room.id, room.center]),
  ...ccjeGroundWaypoints.map(wp => [wp.id, wp.position]),
  ['wp-sidewalk-main', [1792, 870]],
]);
const connect = (from, to, forwardDir, backDir) => ({
  from, to, forwardDir, backDir,
  cost: Math.max(1, Math.hypot(positions.get(from)[0] - positions.get(to)[0], positions.get(from)[1] - positions.get(to)[1])),
});

export const ccjeGroundEdges = [];
const hallStops = [170, 225, 465, 600, 680, 775, 820];
hallStops.slice(1).forEach((y, i) => ccjeGroundEdges.push(connect(
  `ccje-hall-${hallStops[i]}`, `ccje-hall-${y}`,
  'Walk south along the CCJE hallway toward the entrance', 'Walk north along the CCJE hallway',
)));

ccjeGroundRooms.forEach(room => {
  const door = room.doors?.[0];
  const target = room.id === 'ccje-open-area' || room.id === 'ccje-gate-west' ? 'ccje-open-entry'
    : room.id === 'ccje-gate-east' ? 'ccje-open-east'
    : room.id === 'ccje-entrance' ? 'ccje-hall-820'
    : `ccje-hall-${door.wall === 'bottom' ? 170 : door.y - originY}`;
  if (door) {
    // Route through each actual doorway before joining the corridor.
    const doorId = `${room.id}-door`;
    const approachId = `${room.id}-approach`;
    const approach = door.wall === 'bottom' ? [door.x, originY + (room.id === 'ccje-open-area' ? 820 : 170)] : [originX + 360, door.y];
    ccjeGroundWaypoints.push({ id: doorId, floorId: 'floor-1', position: [door.x, door.y] });
    ccjeGroundWaypoints.push({ id: approachId, floorId: 'floor-1', position: approach });
    positions.set(doorId, [door.x, door.y]);
    positions.set(approachId, approach);
    ccjeGroundEdges.push(
      connect(room.id, doorId, `Exit ${room.name} through the doorway`, `Enter ${room.name}`),
      connect(doorId, approachId, 'Continue into the CCJE walkway', `Walk toward ${room.name}`),
      connect(approachId, target, 'Follow the CCJE walkway', `Walk toward ${room.name}`),
    );
  } else ccjeGroundEdges.push(connect(room.id, target, `Exit ${room.name} into the walkway`, `Enter ${room.name}`));
});

[
  ['ccje-entrance', 'ccje-sidewalk-entry'],
  ['ccje-open-entry', 'ccje-open-east'],
  ['ccje-gate-west', 'ccje-sidewalk-west-gate'],
  ['ccje-gate-east', 'ccje-sidewalk-east-gate'],
  ['ccje-sidewalk-east-gate', 'ccje-sidewalk-west-gate'],
  ['ccje-sidewalk-west-gate', 'ccje-sidewalk-entry'],
  ['ccje-sidewalk-entry', 'ccje-crossing-north'],
  ['ccje-crossing-south', 'ccje-campus-walk-north'],
  ['ccje-campus-walk-north', 'ccje-campus-walk-south'],
  ['ccje-campus-walk-south', 'wp-sidewalk-main'],
].forEach(([from, to]) => ccjeGroundEdges.push(connect(from, to,
  'Follow the walkway toward Main Building', 'Follow the walkway toward CCJE Building',
)));
ccjeGroundEdges.push(connect('ccje-crossing-north', 'ccje-crossing-south',
  'Cross the two-way highway at the marked pedestrian crossing toward Main Building',
  'Cross the two-way highway at the marked pedestrian crossing toward CCJE Building',
));

// Stair shafts shared with the second-floor drawing, with landings outside the treads.
for (const [side, y, height, landingY, hallY] of [['north', 65, 140, 225, 225], ['south', 650, 175, 737.5, 775]]) {
  const id = `ccje-stairs-${side}`;
  const stair = {
    id, buildingId: 'ccje', floorId: 'floor-1', name: `CCJE ${side === 'north' ? 'North' : 'South'} Stairs — Ground Floor`,
    code: `STAIRS ${side === 'north' ? 'N' : 'S'} UP`, category: 'Exit & Stairs',
    x: originX + 405, y: originY + y, width: 70, height,
    center: [originX + 440, originY + y + height / 2],
    icon: '🪜', accentColor: '#0284c7', isStair: true, stairOrientation: 'vertical',
    direction: 'up', stairDestination: '2ND FLOOR', description: 'CCJE stairs to the 2nd Floor',
  };
  ccjeGroundRooms.push(stair);
  positions.set(id, stair.center);
  const landingId = `${id}-landing`;
  const hallId = `${id}-hall`;
  const landing = side === 'north' ? [440, landingY] : [395, landingY];
  for (const [wpId, x, localY] of [[landingId, ...landing], [hallId, 360, landingY]]) {
    const wp = point(wpId, x, localY);
    ccjeGroundWaypoints.push(wp);
    positions.set(wpId, wp.position);
  }
  ccjeGroundEdges.push(connect(id, landingId, 'Step off the CCJE stairs onto the landing', 'Enter the CCJE staircase'),
    connect(landingId, hallId, 'Walk into the CCJE hallway', 'Walk toward the CCJE stairs'),
    connect(hallId, `ccje-hall-${hallY}`, 'Follow the CCJE hallway', 'Walk toward the CCJE stairs'));
}
