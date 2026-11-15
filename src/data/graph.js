// Multi-Floor Navigation Graph: Campus Network
// Ground-floor campus paths, all three buildings on floor 2, and Mercado floor 3.
// Connector Hallway connects at the BOTTOM of Stairs to Gym (y = 820)

import { thirdFloorWaypoints, thirdFloorEdges } from './thirdFloor.js';
import { ccjeGroundWaypoints, ccjeGroundEdges } from './ccjeGroundFloor.js';
import { ccjeSecondWaypoints, ccjeSecondEdges } from './ccjeSecondFloor.js';
import { ccjeThirdWaypoints, ccjeThirdEdges } from './ccjeThirdFloor.js';

import { mainSecondFloorWaypoints, mainSecondFloorEdges } from './mainSecondFloor.js';

import { mainThirdFloorWaypoints, mainThirdFloorEdges } from './mainThirdFloor.js';
import { mainFourthFloorWaypoints, mainFourthFloorEdges } from './mainFourthFloor.js';
import { hernandezMiddleWall } from './hernandezWalls.js';

export const waypoints = [
  ...mainFourthFloorWaypoints,
  ...ccjeThirdWaypoints,
  ...ccjeSecondWaypoints,
  ...ccjeGroundWaypoints,
  ...mainThirdFloorWaypoints,
  ...mainSecondFloorWaypoints,
  ...thirdFloorWaypoints,
  // =========================================================================
  // GROUND FLOOR (floor-1) - HERNANDEZ BUILDING (LEFT / WEST)
  // =========================================================================
  { id: 'wp-nw-corridor', floorId: 'floor-1', position: [290, 140] },
  { id: 'wp-nw-corner', floorId: 'floor-1', position: [290, 245] },
  { id: 'wp-w-net', floorId: 'floor-1', position: [290, 380] },
  { id: 'wp-w-cqa', floorId: 'floor-1', position: [290, 495] },
  { id: 'wp-w-ffcr', floorId: 'floor-1', position: [290, 620] },
  { id: 'wp-w-gym', floorId: 'floor-1', position: [290, 725] },

  // North corridor
  { id: 'wp-n-r2', floorId: 'floor-1', position: [395, 245] },
  { id: 'wp-n-mid', floorId: 'floor-1', position: [490, 245] },
  { id: 'wp-n-r3', floorId: 'floor-1', position: [585, 245] },
  { id: 'wp-ne-corner', floorId: 'floor-1', position: [680, 245] },
  { id: 'wp-n-cl', floorId: 'floor-1', position: [780, 245] },

  // East corridor
  { id: 'wp-e-srv', floorId: 'floor-1', position: [670, 340] },
  { id: 'wp-e-prog', floorId: 'floor-1', position: [670, 380] },
  { id: 'wp-e-mm', floorId: 'floor-1', position: [670, 500] },
  { id: 'wp-e-mid-junc', floorId: 'floor-1', position: [670, 515] },
  { id: 'wp-e-mfcr', floorId: 'floor-1', position: [670, 640] },
  { id: 'wp-e-gym', floorId: 'floor-1', position: [640, 740] },

  // Central corridor & crossroads
  { id: 'wp-c-net-south', floorId: 'floor-1', position: [385, 505] },
  { id: 'wp-c-prog-south', floorId: 'floor-1', position: [557, 505] },
  { id: 'wp-c-junc-mid', floorId: 'floor-1', position: [470, 505] },
  { id: 'wp-c-lower', floorId: 'floor-1', position: [480, 610] },
  ...hernandezMiddleWall.gates.flatMap(gate => [-20, 0, 20].map((offset, index) => ({
    id: `hb-gate-${gate.id}-${['north', 'threshold', 'south'][index]}`,
    floorId: 'floor-1', position: [gate.x, hernandezMiddleWall.y + offset],
  }))),
  { id: 'hz-wp-east-stairs-south', floorId: 'floor-1', position: [640, 818] },
  { id: 'wp-c-pre-exit', floorId: 'floor-1', position: [480, 755] },
  { id: 'wp-c-exit-hall', floorId: 'floor-1', position: [480, 818] },
  { id: 'hz-wp-se-corridor', floorId: 'floor-1', position: [730, 818] },

  // BOTTOM CORRIDOR (Pathway 1 Origin)
  { id: 'hz-wp-pathway1-entry', floorId: 'floor-1', position: [890, 818] },

  // =========================================================================
  // STRAIGHT PATHWAY 1: CONNECTOR FROM HERNANDEZ -> MERCADO BUILDING (BOTTOM)
  // =========================================================================
  { id: 'wp-conn-bottom-mid', floorId: 'floor-1', position: [920, 818] },
  { id: 'wp-conn-bottom-mercado', floorId: 'floor-1', position: [950, 818] },

  // =========================================================================
  // GROUND FLOOR (floor-1) - MERCADO BUILDING (RIGHT / EAST)
  // =========================================================================
  { id: 'mb-wp-n-exit', floorId: 'floor-1', position: [1250, 67] },
  { id: 'mb-wp-n-cross', floorId: 'floor-1', position: [1250, 130] },
  { id: 'mb-wp-stairs-up', floorId: 'floor-1', position: [1250, 205] },
  { id: 'mb-wp-102', floorId: 'floor-1', position: [1250, 270] },
  { id: 'mb-wp-lib-north', floorId: 'floor-1', position: [1250, 350] },
  { id: 'mb-wp-101', floorId: 'floor-1', position: [1250, 500] },
  { id: 'mb-wp-lib-mid', floorId: 'floor-1', position: [1250, 550] },
  { id: 'mb-wp-comp-sec', floorId: 'floor-1', position: [1250, 640] },
  { id: 'mb-wp-lib-south', floorId: 'floor-1', position: [1250, 730] },
  { id: 'mb-wp-stairs-s', floorId: 'floor-1', position: [1250, 818] },
  { id: 'mb-wp-s-exit', floorId: 'floor-1', position: [1250, 835] },

  // =========================================================================
  // SECOND FLOOR (floor-2) - HERNANDEZ BUILDING (GYMNASIUM)
  // =========================================================================
  { id: 'gym-wp-court-center', floorId: 'floor-2', position: [460, 470] },
  { id: 'gym-wp-court-north', floorId: 'floor-2', position: [460, 290] },
  { id: 'gym-wp-court-south', floorId: 'floor-2', position: [460, 650] },
  { id: 'gym-wp-court-west', floorId: 'floor-2', position: [230, 470] },
  { id: 'gym-wp-court-east', floorId: 'floor-2', position: [690, 470] },
  { id: 'gym-wp-stage', floorId: 'floor-2', position: [460, 250] },
  { id: 'gym-wp-stairs-w', floorId: 'floor-2', position: [270, 730] },
  { id: 'gym-wp-stairs-w-entry', floorId: 'floor-2', position: [165, 730] },
  { id: 'gym-wp-stairs-e', floorId: 'floor-2', position: [660, 730] },
  { id: 'gym-wp-stairs-e-entry', floorId: 'floor-2', position: [765, 730] },
  { id: 'gym-wp-exit-nw', floorId: 'floor-2', position: [235, 45] },
  { id: 'gym-wp-exit-ne', floorId: 'floor-2', position: [695, 45] },
  { id: 'gym-wp-exit-s', floorId: 'floor-2', position: [465, 820] },

  // =========================================================================
  // SECOND FLOOR (floor-2) - MERCADO BUILDING (RIGHT / EAST)
  // =========================================================================
  { id: 'mb2-wp-n-exit', floorId: 'floor-2', position: [1250, 67] },
  { id: 'mb2-wp-avr', floorId: 'floor-2', position: [1250, 190] },
  { id: 'mb2-wp-speech', floorId: 'floor-2', position: [1250, 160] },
  { id: 'mb2-wp-stairs-main', floorId: 'floor-2', position: [1250, 215] },
  { id: 'mb2-wp-205', floorId: 'floor-2', position: [1250, 320] },
  { id: 'mb2-wp-202', floorId: 'floor-2', position: [1250, 270] },
  { id: 'mb2-wp-204', floorId: 'floor-2', position: [1250, 500] },
  { id: 'mb2-wp-201', floorId: 'floor-2', position: [1250, 520] },
  { id: 'mb2-wp-203', floorId: 'floor-2', position: [1250, 690] },
  { id: 'mb2-wp-guidance', floorId: 'floor-2', position: [1250, 700] },
  { id: 'mb2-wp-stairs-s', floorId: 'floor-2', position: [1250, 815] },

  // =========================================================================
  // GROUND FLOOR (floor-1) - MAIN BUILDING (RIGHT OF MERCADO)
  // =========================================================================
  { id: 'main-wp-nw-exit', floorId: 'floor-1', position: [1710, 50] },
  { id: 'main-wp-n-exit-bar', floorId: 'floor-1', position: [2135, 45] },
  // North upper corridor
  { id: 'main-wp-nw-junc', floorId: 'floor-1', position: [1898, 240] },
  { id: 'main-wp-n-pres', floorId: 'floor-1', position: [1822, 240] },
  { id: 'main-wp-n-hotel', floorId: 'floor-1', position: [1985, 240] },
  { id: 'main-wp-n-bar', floorId: 'floor-1', position: [2135, 240] },
  { id: 'main-wp-n-mid-junc', floorId: 'floor-1', position: [2238, 240] },
  { id: 'main-wp-n-kitchen', floorId: 'floor-1', position: [2322, 240] },
  { id: 'main-wp-n-canteen', floorId: 'floor-1', position: [2552, 240] },
  { id: 'main-wp-canteen-area', floorId: 'floor-1', position: [2552, 337] },

  // West column corridor (Corporate, Treasury, Stairs, SW Lobby)
  { id: 'main-wp-w-corp', floorId: 'floor-1', position: [1898, 300] },
  { id: 'main-wp-w-treasury', floorId: 'floor-1', position: [1898, 495] },
  { id: 'main-wp-w-comlab', floorId: 'floor-1', position: [1898, 565] },
  { id: 'main-wp-w-stairs', floorId: 'floor-1', position: [1898, 620] },
  { id: 'main-wp-w-lobby', floorId: 'floor-1', position: [1898, 760] },

  // South-West Entrance doorway & Sidewalk connection
  { id: 'wp-main-sw-exit', floorId: 'floor-1', position: [1792, 845] },

  // Hallway around Comlab 1 and Clinic (internal connecting curve)
  { id: 'main-wp-sw-curved-junc', floorId: 'floor-1', position: [1898, 680] },
  { id: 'main-wp-s-comlab', floorId: 'floor-1', position: [1995, 725] },
  { id: 'main-wp-s-clinic', floorId: 'floor-1', position: [2145, 725] },
  { id: 'main-wp-se-clinic-junc', floorId: 'floor-1', position: [2238, 680] },

  // Front Outside Walkway (open space in front of Main Building extending to Activity Area & Canteen Area)
  { id: 'main-wp-s-front-hall', floorId: 'floor-1', position: [2060, 760] },
  { id: 'main-wp-c-south-junc', floorId: 'floor-1', position: [2238, 760] },
  { id: 'main-wp-s-east-hall', floorId: 'floor-1', position: [2400, 760] },
  { id: 'main-wp-s-activity-junc', floorId: 'floor-1', position: [2552, 760] },

  // Central corridor & Registrar hallway
  { id: 'main-wp-c-faculty-e', floorId: 'floor-1', position: [2238, 360] },
  { id: 'main-wp-c-mid-junc', floorId: 'floor-1', position: [2238, 460] },
  { id: 'main-wp-c-registrar', floorId: 'floor-1', position: [2238, 565] },

  // Activity Area
  { id: 'main-wp-activity-n', floorId: 'floor-1', position: [2552, 480] },
  { id: 'main-wp-activity-mid', floorId: 'floor-1', position: [2552, 580] },
  { id: 'main-wp-activity-s', floorId: 'floor-1', position: [2552, 670] },

  // Outdoor Sidewalk Promenade connecting all buildings along the bottom (y = 870)
  { id: 'wp-sidewalk-hz', floorId: 'floor-1', position: [480, 870] },
  { id: 'wp-sidewalk-conn', floorId: 'floor-1', position: [890, 870] },
  { id: 'wp-sidewalk-mercado', floorId: 'floor-1', position: [1250, 870] },
  { id: 'wp-sidewalk-mid', floorId: 'floor-1', position: [1530, 870] },
  { id: 'wp-sidewalk-main', floorId: 'floor-1', position: [1792, 870] },
];

export const edges = [
  ...mainFourthFloorEdges,
  ...ccjeThirdEdges,
  ...ccjeSecondEdges,
  ...ccjeGroundEdges,
  ...mainThirdFloorEdges,
  ...mainSecondFloorEdges,
  ...thirdFloorEdges,
  // =========================================================================
  // HERNANDEZ BUILDING INTERNAL EDGES (floor-1)
  // =========================================================================
  { from: 'room-1', to: 'wp-nw-corridor', cost: 130, forwardDir: 'Exit Room 1 into the west hallway', backDir: 'Enter Room 1' },
  { from: 'wp-nw-corridor', to: 'wp-nw-corner', cost: 125, forwardDir: 'Walk south down the hallway to the corner', backDir: 'Walk north along the hallway toward Room 1' },

  { from: 'wp-nw-corner', to: 'wp-n-r2', cost: 110, forwardDir: 'Walk east along the north hallway toward Room 2', backDir: 'Walk west toward the Room 1 and CQA wing' },
  { from: 'wp-n-r2', to: 'room-2', cost: 110, forwardDir: 'Enter Room 2', backDir: 'Exit Room 2 into the north hallway' },
  { from: 'wp-n-r2', to: 'wp-n-mid', cost: 95, forwardDir: 'Continue east along the north corridor', backDir: 'Walk west toward Room 2' },
  { from: 'wp-n-mid', to: 'wp-n-r3', cost: 105, forwardDir: 'Continue east toward Room 3', backDir: 'Walk west along the north corridor' },
  { from: 'wp-n-r3', to: 'room-3', cost: 110, forwardDir: 'Enter Room 3', backDir: 'Exit Room 3 into the north hallway' },
  { from: 'wp-n-r3', to: 'wp-ne-corner', cost: 95, forwardDir: 'Walk east toward the Computer Lab and Research Office corner', backDir: 'Walk west past Room 3' },
  { from: 'wp-ne-corner', to: 'wp-n-cl', cost: 105, forwardDir: 'Walk east toward the Computer Lab entrance', backDir: 'Walk west toward the main corridor' },
  { from: 'wp-n-cl', to: 'computer-lab', cost: 110, forwardDir: 'Enter the Computer Lab', backDir: 'Exit the Computer Lab into the hallway' },

  { from: 'wp-nw-corner', to: 'wp-w-net', cost: 135, forwardDir: 'Walk south down the west corridor past Room 4', backDir: 'Walk north toward Room 1' },
  { from: 'room-4', to: 'wp-w-net', cost: 110, forwardDir: 'Exit Room 4 into the west hallway', backDir: 'Enter Room 4' },
  { from: 'wp-w-net', to: 'networking-lab', cost: 105, forwardDir: 'Enter Networking Lab (West entrance)', backDir: 'Exit Networking Lab into the west hallway' },
  { from: 'wp-w-net', to: 'wp-w-cqa', cost: 115, forwardDir: 'Continue south down the west hallway toward CQA main door', backDir: 'Walk north past Room 4' },
  { from: 'wp-w-cqa', to: 'cqa', cost: 130, forwardDir: 'Enter Center for Quality Assurance', backDir: 'Exit Center for Quality Assurance into the hallway' },
  { from: 'wp-w-cqa', to: 'wp-w-ffcr', cost: 120, forwardDir: 'Walk south down the hallway toward the Female Comfort Room', backDir: 'Walk north toward the CQA Office' },
  { from: 'wp-w-ffcr', to: 'female-cr', cost: 95, forwardDir: 'Enter Female Faculty Comfort Room', backDir: 'Exit Female Faculty Comfort Room' },
  { from: 'wp-w-ffcr', to: 'hb-gate-west-north', cost: 105, forwardDir: 'Follow the wall toward the west gate', backDir: 'Follow the wall toward the Female Restroom corridor' },
  { from: 'hb-gate-west-south', to: 'wp-w-gym', cost: 125, forwardDir: 'Continue toward the West Gymnasium Stairs', backDir: 'Walk toward the west middle-wall gate' },
  { from: 'wp-w-gym', to: 'stairs-gym-west', cost: 95, forwardDir: 'Proceed to the Stairs to Gym (West)', backDir: 'Walk out from the stairs into the main Ground Floor corridor' },

  { from: 'wp-w-cqa', to: 'wp-c-net-south', cost: 95, forwardDir: 'Turn east toward the central lab entrances', backDir: 'Walk west toward the CQA office' },
  { from: 'wp-c-net-south', to: 'networking-lab', cost: 125, forwardDir: 'Enter Networking Lab (South entrance)', backDir: 'Exit Networking Lab into the central corridor' },
  { from: 'wp-c-net-south', to: 'wp-c-junc-mid', cost: 105, forwardDir: 'Walk east into the central main corridor junction', backDir: 'Walk west toward the Networking Lab and CQA' },
  { from: 'wp-c-junc-mid', to: 'wp-c-prog-south', cost: 75, forwardDir: 'Walk east toward the Programming Lab south entrance', backDir: 'Walk west into the central main junction' },
  { from: 'wp-c-prog-south', to: 'programming-lab', cost: 125, forwardDir: 'Enter Programming Lab (South entrance)', backDir: 'Exit Programming Lab into the central corridor' },
  { from: 'wp-c-prog-south', to: 'wp-e-mid-junc', cost: 120, forwardDir: 'Walk east toward the Multimedia Room and East hallway', backDir: 'Walk west toward the central main junction' },

  { from: 'wp-ne-corner', to: 'wp-e-srv', cost: 85, forwardDir: 'Walk south down the east hallway toward Research Office', backDir: 'Walk north toward the Computer Lab corner' },
  { from: 'wp-e-srv', to: 'server-room', cost: 130, forwardDir: 'Enter Research Office', backDir: 'Exit Research Office into the east hallway' },
  { from: 'wp-e-srv', to: 'wp-e-prog', cost: 50, forwardDir: 'Continue south along the east hallway toward Programming Lab', backDir: 'Walk north toward Research Office' },
  { from: 'wp-e-prog', to: 'programming-lab', cost: 115, forwardDir: 'Enter Programming Lab (East entrance)', backDir: 'Exit Programming Lab into the east hallway' },
  { from: 'wp-e-prog', to: 'wp-e-mm', cost: 110, forwardDir: 'Walk south toward the Multimedia Room', backDir: 'Walk north toward Programming Lab' },
  { from: 'wp-e-mm', to: 'multimedia-room', cost: 130, forwardDir: 'Enter Multimedia Room', backDir: 'Exit Multimedia Room into the east hallway' },
  { from: 'wp-e-mm', to: 'wp-e-mid-junc', cost: 25, forwardDir: 'Step south into the east cross-corridor junction', backDir: 'Walk north past Multimedia Room' },
  { from: 'wp-e-mid-junc', to: 'hb-gate-east-north', cost: 150, forwardDir: 'Walk toward the east middle-wall gate', backDir: 'Walk north toward Multimedia Room' },
  { from: 'hb-gate-east-south', to: 'wp-e-mfcr', cost: 115, forwardDir: 'Follow the south side of the wall toward the Male Restroom', backDir: 'Follow the wall toward the east gate' },
  { from: 'wp-e-mfcr', to: 'male-cr', cost: 90, forwardDir: 'Enter Male Faculty Comfort Room', backDir: 'Exit Male Faculty Comfort Room' },

  { from: 'wp-w-ffcr', to: 'wp-c-lower', cost: 200, forwardDir: 'Walk east along the lower corridor toward the central exit hall', backDir: 'Walk west toward the Female Restroom' },
  ...hernandezMiddleWall.gates.flatMap(gate => [
    { from: 'wp-c-lower', to: `hb-gate-${gate.id}-north`, cost: 100, forwardDir: `Follow the wall to the ${gate.id} gate`, backDir: 'Follow the wall toward the central corridor' },
    { from: `hb-gate-${gate.id}-north`, to: `hb-gate-${gate.id}-threshold`, cost: 20, forwardDir: `Pass through the ${gate.id} middle-wall gate`, backDir: `Pass through the ${gate.id} middle-wall gate` },
    { from: `hb-gate-${gate.id}-threshold`, to: `hb-gate-${gate.id}-south`, cost: 20, forwardDir: 'Continue into the lower hallway', backDir: 'Continue into the central corridor' },
    { from: `hb-gate-${gate.id}-south`, to: 'wp-c-pre-exit', cost: 135, forwardDir: 'Walk along the lower hallway toward the main exit', backDir: `Walk toward the ${gate.id} middle-wall gate` },
  ]),
  { from: 'hb-gate-east-south', to: 'wp-e-gym', cost: 125, forwardDir: 'Follow the lower hallway to the East Gym Stairs', backDir: 'Walk toward the east middle-wall gate' },
  { from: 'wp-e-gym', to: 'stairs-gym-east', cost: 90, forwardDir: 'Enter the Stairs to Gym - East', backDir: 'Step out into the Hernandez lower corridor' },
  { from: 'wp-e-gym', to: 'hz-wp-east-stairs-south', cost: 78, forwardDir: 'Walk south beside the East Stairs into the bottom hallway', backDir: 'Walk north beside the East Stairs' },
  { from: 'hz-wp-east-stairs-south', to: 'hz-wp-se-corridor', cost: 90, forwardDir: 'Turn east along the bottom hallway', backDir: 'Turn west along the bottom hallway' },

  { from: 'wp-c-junc-mid', to: 'wp-c-lower', cost: 125, forwardDir: 'Walk south down the wide central hallway', backDir: 'Walk north toward the central labs' },
  { from: 'wp-c-lower', to: 'wp-c-pre-exit', cost: 145, forwardDir: 'Continue through the open central passage toward the Main Emergency Exit', backDir: 'Walk through the open central passage into the central corridor' },
  { from: 'wp-c-pre-exit', to: 'wp-c-exit-hall', cost: 65, forwardDir: 'Walk south to the main exit lobby', backDir: 'Walk north toward the central corridor' },
  { from: 'wp-c-exit-hall', to: 'main-exit', cost: 40, forwardDir: 'Pass through the Main Emergency Exit doors outside to the Assembly Area', backDir: 'Enter the building through the Main Ground Floor Entrance' },
  { from: 'wp-c-exit-hall', to: 'hz-wp-se-corridor', cost: 240, forwardDir: 'Walk east along the south hallway toward Pathway 1', backDir: 'Walk west toward the Main Exit' },
  { from: 'hz-wp-se-corridor', to: 'hz-wp-pathway1-entry', cost: 155, forwardDir: 'Walk east toward Pathway 1 entrance', backDir: 'Walk west along the south hallway' },

  // =========================================================================
  // PATHWAY 1: STRAIGHT CONNECTOR FROM HERNANDEZ -> MERCADO BUILDING (BOTTOM)
  // =========================================================================
  { from: 'hz-wp-pathway1-entry', to: 'wp-conn-bottom-mid', cost: 35, forwardDir: 'Step into Pathway 1 toward Mercado Building', backDir: 'Step into Hernandez Building south corridor' },
  { from: 'wp-conn-bottom-mid', to: 'wp-conn-bottom-mercado', cost: 35, forwardDir: 'Walk east along Pathway 1 toward Mercado Building', backDir: 'Walk west along Pathway 1 toward Hernandez Building' },
  { from: 'wp-conn-bottom-mercado', to: 'mb-wp-stairs-s', cost: 280, forwardDir: 'Enter Mercado Building through South corridor from Pathway 1', backDir: 'Walk west toward Pathway 1 to Hernandez Building' },
  { from: 'mb-wp-stairs-s', to: 'mb-wp-s-exit', cost: 35, forwardDir: 'Walk south to the South Entrance', backDir: 'Walk north toward the central corridor' },
  { from: 'mb-wp-stairs-s', to: 'mb-wp-lib-south', cost: 75, forwardDir: 'Continue north along the central corridor', backDir: 'Walk south toward the South Steps' },
  { from: 'mb-wp-lib-south', to: 'mb-wp-comp-sec', cost: 90, forwardDir: 'Walk north toward the Library Computer Section', backDir: 'Walk south toward the South Steps' },
  { from: 'mb-wp-comp-sec', to: 'mb-wp-lib-mid', cost: 90, forwardDir: 'Continue north along the corridor', backDir: 'Walk south toward the Computer Section' },
  { from: 'mb-wp-lib-mid', to: 'mb-wp-101', cost: 50, forwardDir: 'Walk north past MB 101', backDir: 'Walk south toward the Library' },
  { from: 'mb-wp-101', to: 'mb-wp-lib-north', cost: 160, forwardDir: 'Walk north toward MB 102 and the Main Stairs', backDir: 'Walk south toward MB 101' },
  { from: 'mb-wp-lib-north', to: 'mb-wp-102', cost: 75, forwardDir: 'Walk north down the hallway past MB 102', backDir: 'Walk south toward the Library' },
  { from: 'mb-wp-102', to: 'mb-wp-stairs-up', cost: 85, forwardDir: 'Walk north toward the Main Stairs to 2nd Floor', backDir: 'Walk south toward MB 102' },
  { from: 'mb-wp-stairs-up', to: 'mb-wp-n-cross', cost: 95, forwardDir: 'Walk north toward the Consultation Room and Restrooms', backDir: 'Walk south toward the Main Stairs' },
  { from: 'mb-wp-n-cross', to: 'mb-wp-n-exit', cost: 35, forwardDir: 'Proceed to the North Emergency Exit', backDir: 'Walk south into the central corridor' },

  { from: 'mb-faculty-cr-w', to: 'mb-wp-stairs-up', cost: 85, forwardDir: 'Exit West Restroom through south door into hallway', backDir: 'Enter West Restroom through south door' },
  { from: 'mb-consultation', to: 'mb-wp-stairs-up', cost: 55, forwardDir: 'Exit Consultation Room through south door into hallway', backDir: 'Enter Consultation Room through south door' },
  { from: 'mb-faculty-cr-e', to: 'mb-wp-stairs-up', cost: 95, forwardDir: 'Exit East Restroom through south door into hallway', backDir: 'Enter East Restroom through south door' },
  { from: 'mb-102', to: 'mb-wp-102', cost: 95, forwardDir: 'Exit MB 102 (Front door) into central corridor', backDir: 'Enter MB 102 (Front door)' },
  { from: 'mb-102', to: 'mb-wp-lib-north', cost: 95, forwardDir: 'Exit MB 102 (Back door) into central corridor', backDir: 'Enter MB 102 (Back door)' },
  { from: 'mb-library', to: 'mb-wp-lib-south', cost: 110, forwardDir: 'Exit Library through south door into the corridor', backDir: 'Enter Library through south door' },
  { from: 'mb-101', to: 'mb-wp-lib-mid', cost: 95, forwardDir: 'Exit MB 101 (Front door) into hallway', backDir: 'Enter MB 101 (Front door)' },
  { from: 'mb-101', to: 'mb-wp-101', cost: 95, forwardDir: 'Exit MB 101 (Back door) into hallway', backDir: 'Enter MB 101 (Back door)' },
  { from: 'mb-comp-section', to: 'mb-wp-comp-sec', cost: 95, forwardDir: 'Exit Library Computer Section (Front door) into corridor', backDir: 'Enter Library Computer Section (Front door)' },
  { from: 'mb-comp-section', to: 'mb-wp-lib-south', cost: 95, forwardDir: 'Exit Library Computer Section (Back door) into corridor', backDir: 'Enter Library Computer Section (Back door)' },
  { from: 'mb-stairs-south', to: 'mb-wp-stairs-s', cost: 95, forwardDir: 'Step out from South Stairs into hallway', backDir: 'Step to the South Stairs landing' },
  { from: 'mb-exit-north', to: 'mb-wp-n-exit', cost: 20, forwardDir: 'Push through North Emergency Exit doors', backDir: 'Enter building from North path' },
  { from: 'mb-exit-south', to: 'mb-wp-s-exit', cost: 20, forwardDir: 'Exit through South Main Entrance', backDir: 'Enter building through South Entrance' },
  { from: 'mb-stairs-up', to: 'mb-wp-stairs-up', cost: 95, forwardDir: 'Step out from Main Stairs into hallway', backDir: 'Step to Main Stairs landing' },

  // =========================================================================
  // VERTICAL STAIR CONNECTIONS (FLOOR 1 <-> FLOOR 2)
  // =========================================================================
  // Hernandez: West Stairs to Gym
  {
    from: 'stairs-gym-west',
    to: 'gym-stairs-west',
    cost: 110,
    forwardDir: '🪜 Take the West Stairs UP to the Gymnasium (2nd Floor)',
    backDir: '🪜 Take the West Stairs DOWN to Hernandez Ground Floor',
  },
  // Hernandez: East Stairs to Gym
  {
    from: 'stairs-gym-east',
    to: 'gym-stairs-east',
    cost: 110,
    forwardDir: '🪜 Take the East Stairs UP to the Gymnasium (2nd Floor)',
    backDir: '🪜 Take the East Stairs DOWN to Hernandez Ground Floor',
  },
  // Mercado: Main Stairs
  {
    from: 'mb-stairs-up',
    to: 'mb2-stairs-main',
    cost: 120,
    forwardDir: '🪜 Take the Main Stairs UP to the 2nd Floor',
    backDir: '🪜 Take the Main Stairs DOWN to the Ground Floor',
  },
  // Mercado: South Stairs
  {
    from: 'mb-stairs-south',
    to: 'mb2-stairs-south',
    cost: 120,
    forwardDir: '🪜 Take the South Stairs UP to the 2nd Floor',
    backDir: '🪜 Take the South Stairs DOWN to the Ground Floor',
  },

  // =========================================================================
  // SECOND FLOOR (floor-2) - HERNANDEZ GYMNASIUM INTERNAL EDGES
  // =========================================================================
  { from: 'gym-stairs-west', to: 'gym-wp-stairs-w', cost: 30, forwardDir: 'Walk through West Stairs to the concourse', backDir: 'Enter West Stairs to go DOWN' },
  { from: 'gym-wp-stairs-w', to: 'gym-wp-stairs-w-entry', cost: 40, forwardDir: 'Walk west toward the corner entrance', backDir: 'Walk east along the stairs corridor' },
  { from: 'gym-wp-stairs-w-entry', to: 'gym-wp-court-west', cost: 180, forwardDir: 'Walk north along the west sideline toward the court', backDir: 'Walk south to the West Stairs entrance' },

  { from: 'gym-stairs-east', to: 'gym-wp-stairs-e', cost: 30, forwardDir: 'Walk through East Stairs to the concourse', backDir: 'Enter East Stairs to go DOWN' },
  { from: 'gym-wp-stairs-e', to: 'gym-wp-stairs-e-entry', cost: 40, forwardDir: 'Walk east toward the corner entrance', backDir: 'Walk west along the stairs corridor' },
  { from: 'gym-wp-stairs-e-entry', to: 'gym-wp-court-east', cost: 180, forwardDir: 'Walk north along the east sideline toward the court', backDir: 'Walk south to the East Stairs entrance' },

  { from: 'gym-wp-stairs-w', to: 'gym-wp-court-south', cost: 120, forwardDir: 'Walk east toward the south baseline', backDir: 'Walk west toward the West Stairs' },
  { from: 'gym-wp-stairs-e', to: 'gym-wp-court-south', cost: 120, forwardDir: 'Walk west toward the south baseline', backDir: 'Walk east toward the East Stairs' },
  { from: 'gym-wp-court-south', to: 'gym-wp-exit-s', cost: 160, forwardDir: 'Walk south to the Gymnasium South Emergency Exit', backDir: 'Walk north toward the Basketball Court' },
  { from: 'gym-wp-exit-s', to: 'gym-exit-south', cost: 20, forwardDir: 'Pass through the South Emergency Exit', backDir: 'Enter Gymnasium through South Door' },

  { from: 'gym-wp-court-south', to: 'gym-wp-court-center', cost: 180, forwardDir: 'Walk onto the center of the Basketball Court', backDir: 'Walk south toward the court baseline' },
  { from: 'gym-wp-court-center', to: 'gym-court', cost: 10, forwardDir: 'Step onto the Basketball Court', backDir: 'Step off the Basketball Court' },

  { from: 'gym-wp-court-center', to: 'gym-wp-court-north', cost: 180, forwardDir: 'Walk north toward the Stage and north court baseline', backDir: 'Walk south to the court center' },
  { from: 'gym-wp-court-center', to: 'gym-wp-court-west', cost: 220, forwardDir: 'Walk west across the court toward the west sideline', backDir: 'Walk east to the center of the court' },
  { from: 'gym-wp-court-center', to: 'gym-wp-court-east', cost: 220, forwardDir: 'Walk east across the court toward the east sideline', backDir: 'Walk west to the center of the court' },

  { from: 'gym-wp-court-north', to: 'gym-wp-stage', cost: 50, forwardDir: 'Walk north toward the Stage steps', backDir: 'Walk south toward the Basketball Court' },
  { from: 'gym-wp-stage', to: 'gym-stage', cost: 40, forwardDir: 'Step onto the Gymnasium Stage / Platform', backDir: 'Step off the Stage onto the court floor' },

  { from: 'gym-wp-court-north', to: 'gym-wp-exit-nw', cost: 260, forwardDir: 'Walk north-west toward the North-West Fire Exit', backDir: 'Walk south-east toward the Basketball Court' },
  { from: 'gym-wp-exit-nw', to: 'gym-exit-nw', cost: 20, forwardDir: 'Push through North-West Emergency Exit', backDir: 'Enter Gymnasium from North-West Door' },

  { from: 'gym-wp-court-north', to: 'gym-wp-exit-ne', cost: 260, forwardDir: 'Walk north-east toward the North-East Fire Exit', backDir: 'Walk south-west toward the Basketball Court' },
  { from: 'gym-wp-exit-ne', to: 'gym-exit-ne', cost: 20, forwardDir: 'Push through North-East Emergency Exit', backDir: 'Enter Gymnasium from North-East Door' },

  // =========================================================================
  // SECOND FLOOR (floor-2) - MERCADO BUILDING INTERNAL EDGES
  // =========================================================================
  { from: 'mb2-stairs-main', to: 'mb2-wp-stairs-main', cost: 65, forwardDir: 'Step off the Main Stairs into the 2nd Floor corridor', backDir: 'Step to the Main Stairs landing to go DOWN' },
  { from: 'mb2-wp-n-exit', to: 'mb2-wp-avr', cost: 45, forwardDir: 'Walk south into the corridor past AVR', backDir: 'Walk north to the 2nd Floor North Exit' },
  { from: 'mb2-wp-avr', to: 'mb2-wp-speech', cost: 70, forwardDir: 'Walk south toward Speech Lab', backDir: 'Walk north toward AVR' },
  { from: 'mb2-wp-speech', to: 'mb2-wp-stairs-main', cost: 62, forwardDir: 'Walk south toward the Main Stairs', backDir: 'Walk north toward Speech Lab' },
  { from: 'mb2-wp-stairs-main', to: 'mb2-wp-205', cost: 98, forwardDir: 'Walk south past MB 205', backDir: 'Walk north toward the Main Stairs' },
  { from: 'mb2-wp-205', to: 'mb2-wp-202', cost: 20, forwardDir: 'Step to MB 202 entrance', backDir: 'Step toward MB 205 entrance' },
  { from: 'mb2-wp-202', to: 'mb2-wp-204', cost: 160, forwardDir: 'Walk south down the central corridor toward MB 204', backDir: 'Walk north toward MB 202' },
  { from: 'mb2-wp-204', to: 'mb2-wp-201', cost: 20, forwardDir: 'Step to MB 201 entrance', backDir: 'Step toward MB 204 entrance' },
  { from: 'mb2-wp-201', to: 'mb2-wp-203', cost: 170, forwardDir: 'Walk south toward MB 203 and Guidance Office', backDir: 'Walk north toward MB 201' },
  { from: 'mb2-wp-203', to: 'mb2-wp-guidance', cost: 15, forwardDir: 'Step to Guidance Office entrance', backDir: 'Step to MB 203 entrance' },
  { from: 'mb2-wp-guidance', to: 'mb2-wp-stairs-s', cost: 115, forwardDir: 'Walk south toward the South Stairs', backDir: 'Walk north toward Guidance Office' },

  // Room connections on Floor 2 (Mercado)
  { from: 'mb2-speech-lab', to: 'mb2-wp-speech', cost: 120, forwardDir: 'Exit Speech Lab into the central corridor', backDir: 'Enter Speech Lab' },
  { from: 'mb2-205', to: 'mb2-wp-205', cost: 120, forwardDir: 'Exit MB 205 into the central corridor', backDir: 'Enter MB 205' },
  { from: 'mb2-204', to: 'mb2-wp-204', cost: 120, forwardDir: 'Exit MB 204 into the central corridor', backDir: 'Enter MB 204' },
  { from: 'mb2-203', to: 'mb2-wp-203', cost: 120, forwardDir: 'Exit MB 203 into the central corridor', backDir: 'Enter MB 203' },
  { from: 'mb2-avr', to: 'mb2-wp-avr', cost: 100, forwardDir: 'Exit AVR into the central corridor', backDir: 'Enter AVR' },
  { from: 'mb2-202', to: 'mb2-wp-202', cost: 100, forwardDir: 'Exit MB 202 into the central corridor', backDir: 'Enter MB 202' },
  { from: 'mb2-201', to: 'mb2-wp-201', cost: 100, forwardDir: 'Exit MB 201 into the central corridor', backDir: 'Enter MB 201' },
  { from: 'mb2-guidance', to: 'mb2-wp-guidance', cost: 100, forwardDir: 'Exit Guidance Office into the central corridor', backDir: 'Enter Guidance Office' },
  { from: 'mb2-stairs-south', to: 'mb2-wp-stairs-s', cost: 80, forwardDir: 'Step off South Stairs into the 2nd Floor corridor', backDir: 'Step to South Stairs landing to go DOWN' },
  { from: 'mb2-exit-north', to: 'mb2-wp-n-exit', cost: 20, forwardDir: 'Push through 2nd Floor North Emergency Exit', backDir: 'Enter 2nd Floor from North Exit' },

  // =========================================================================
  // GROUND FLOOR (floor-1) - MAIN BUILDING INTERNAL EDGES
  // =========================================================================
  // North corridor connections
  { from: 'main-exit-north', to: 'main-wp-nw-exit', cost: 20, forwardDir: 'Push through North Emergency Exit doors outside', backDir: 'Enter building from North Emergency Exit' },
  { from: 'main-utility-room', to: 'main-wp-n-pres', cost: 65, forwardDir: 'Exit Utility Room (East door) into north hallway', backDir: 'Enter Utility Room (East door)' },
  { from: 'main-wp-n-pres', to: 'main-wp-nw-junc', cost: 40, forwardDir: 'Walk west toward the west corridor corner', backDir: 'Walk east past Office of the President' },
  { from: 'main-pres-office', to: 'main-wp-n-pres', cost: 40, forwardDir: 'Exit Office of the President into hallway', backDir: 'Enter Office of the President' },

  { from: 'main-wp-nw-junc', to: 'main-wp-w-corp', cost: 60, forwardDir: 'Walk south down the west corridor toward Corporate Office', backDir: 'Walk north along west corridor toward the corner' },
  { from: 'main-wp-nw-junc', to: 'main-wp-n-hotel', cost: 95, forwardDir: 'Walk east along north corridor toward LC Hotel', backDir: 'Walk west toward the west corridor corner' },

  { from: 'main-wp-n-pres', to: 'main-wp-n-hotel', cost: 130, forwardDir: 'Walk east toward LC Hotel', backDir: 'Walk west toward the President Office' },
  { from: 'main-lc-hotel', to: 'main-wp-n-hotel', cost: 40, forwardDir: 'Exit LC Hotel Suite into hallway', backDir: 'Enter LC Hotel Hospitality Suite' },

  { from: 'main-wp-n-hotel', to: 'main-wp-n-bar', cost: 140, forwardDir: 'Walk east toward LC Bar', backDir: 'Walk west toward LC Hotel' },
  { from: 'main-lc-bar', to: 'main-wp-n-bar', cost: 40, forwardDir: 'Exit LC Bar into hallway', backDir: 'Enter LC Bar Laboratory' },
  { from: 'main-lc-bar', to: 'main-wp-n-exit-bar', cost: 35, forwardDir: 'Walk north toward LC Bar Emergency Fire Exit', backDir: 'Enter LC Bar from Emergency Fire Exit' },
  { from: 'main-wp-n-exit-bar', to: 'main-exit-north-center', cost: 20, forwardDir: 'Push through North Emergency Exit door', backDir: 'Enter LC Bar through North Emergency Exit' },

  { from: 'main-wp-n-bar', to: 'main-wp-n-mid-junc', cost: 65, forwardDir: 'Continue east into central hall intersection', backDir: 'Walk west toward LC Bar' },
  { from: 'main-wp-n-mid-junc', to: 'main-wp-n-kitchen', cost: 130, forwardDir: 'Walk east along corridor toward LC Culinary Kitchen', backDir: 'Walk west toward central intersection' },
  { from: 'main-culinary-kitchen', to: 'main-wp-n-kitchen', cost: 40, forwardDir: 'Exit LC Culinary Kitchen into hallway', backDir: 'Enter LC Culinary Kitchen' },

  { from: 'main-wp-n-kitchen', to: 'main-wp-n-canteen', cost: 135, forwardDir: 'Walk east toward the School Canteen', backDir: 'Walk west toward LC Culinary Kitchen' },
  { from: 'main-canteen', to: 'main-wp-n-canteen', cost: 35, forwardDir: 'Exit School Canteen into hallway', backDir: 'Enter School Canteen' },
  { from: 'main-wp-n-canteen', to: 'main-wp-canteen-area', cost: 75, forwardDir: 'Walk south into Canteen Area (Dining Hall)', backDir: 'Walk north toward School Canteen' },
  { from: 'main-canteen-area', to: 'main-wp-canteen-area', cost: 20, forwardDir: 'Step into Canteen Area', backDir: 'Step to Canteen Area aisle' },

  // West column connections
  { from: 'main-corp-office', to: 'main-wp-w-corp', cost: 35, forwardDir: 'Exit Corporate Office into west hallway', backDir: 'Enter Corporate Office' },

  { from: 'main-wp-w-corp', to: 'main-wp-w-treasury', cost: 140, forwardDir: 'Walk south toward Treasury Office', backDir: 'Walk north toward Corporate Office' },
  { from: 'main-treasury', to: 'main-wp-w-treasury', cost: 35, forwardDir: 'Exit Treasury Office into west hallway', backDir: 'Enter Treasury Office' },

  { from: 'main-wp-w-treasury', to: 'main-wp-w-comlab', cost: 70, forwardDir: 'Walk south past Comlab 1 west hallway', backDir: 'Walk north toward Treasury Office' },
  { from: 'main-comlab-1', to: 'main-wp-w-comlab', cost: 35, forwardDir: 'Exit Computer Laboratory 1 (West door) into west hallway', backDir: 'Enter Computer Laboratory 1 (West door)' },

  { from: 'main-wp-w-comlab', to: 'main-wp-w-stairs', cost: 55, forwardDir: 'Walk south toward Main Building Stairs (SW)', backDir: 'Walk north past Comlab 1' },
  { from: 'main-stairs', to: 'main-wp-w-stairs', cost: 50, forwardDir: 'Step out from SW Stairs into west corridor', backDir: 'Step to the SW Stairs landing to go UP' },

  { from: 'main-wp-w-stairs', to: 'main-wp-sw-curved-junc', cost: 60, forwardDir: 'Walk south toward the curved hallway around Comlab 1', backDir: 'Walk north toward SW Stairs' },
  { from: 'main-wp-sw-curved-junc', to: 'main-wp-w-lobby', cost: 80, forwardDir: 'Walk south toward the South-West Entrance Lobby', backDir: 'Walk north toward curved hallway' },

  // Curved hallway in front of Comlab 1 and Clinic (internal connecting curve)
  { from: 'main-wp-sw-curved-junc', to: 'main-wp-s-comlab', cost: 105, forwardDir: 'Follow curved hallway along the front of Comlab 1', backDir: 'Walk west along curved hallway toward West corridor' },
  { from: 'main-wp-s-comlab', to: 'main-wp-s-clinic', cost: 125, forwardDir: 'Continue along curved hallway past School Health Clinic', backDir: 'Walk west along curved hallway past Comlab 1' },
  { from: 'main-wp-s-clinic', to: 'main-wp-se-clinic-junc', cost: 85, forwardDir: 'Follow curved hallway to the Central Registrar corridor', backDir: 'Follow curved hallway west past Clinic toward West Wing' },
  { from: 'main-wp-se-clinic-junc', to: 'main-wp-c-registrar', cost: 115, forwardDir: 'Walk north into Registrar hallway', backDir: 'Walk south down Registrar hallway to curved corridor' },

  // South-West Lobby (the ONLY official campus entrance & exit for Main Building)
  { from: 'main-wp-w-lobby', to: 'main-sw-lobby', cost: 95, forwardDir: 'Turn west into the South-West Entrance Lobby', backDir: 'Exit South-West Lobby into the west corridor' },
  { from: 'main-sw-lobby', to: 'wp-main-sw-exit', cost: 85, forwardDir: 'Walk through the South-West Entrance doors toward the sidewalk', backDir: 'Enter the South-West Lobby from the entrance doors' },
  { from: 'wp-main-sw-exit', to: 'wp-sidewalk-main', cost: 25, forwardDir: 'Step out onto the outdoor sidewalk promenade', backDir: 'Approach Main Building South-West Entrance doors' },

  // Front Outside Walkway connections (open space in front of Main Building extending to Activity Area & Canteen Area)
  { from: 'main-wp-w-lobby', to: 'main-wp-s-front-hall', cost: 160, forwardDir: 'Walk east along front outside walkway', backDir: 'Walk west along front walkway toward South-West Lobby' },
  { from: 'main-wp-s-front-hall', to: 'main-wp-c-south-junc', cost: 175, forwardDir: 'Continue east along front outside walkway past Clinic', backDir: 'Walk west along front walkway toward South-West Lobby' },
  { from: 'main-wp-c-south-junc', to: 'main-wp-se-clinic-junc', cost: 80, forwardDir: 'Walk north into Registrar hallway', backDir: 'Walk south to front outside walkway' },
  { from: 'main-wp-c-south-junc', to: 'main-wp-s-east-hall', cost: 160, forwardDir: 'Continue east along front outside walkway toward Activity Area', backDir: 'Walk west toward Central Registrar corridor' },
  { from: 'main-wp-s-east-hall', to: 'main-wp-s-activity-junc', cost: 150, forwardDir: 'Walk east to front entrance of Activity Area', backDir: 'Walk west along front outside walkway' },
  { from: 'main-wp-s-activity-junc', to: 'main-wp-activity-s', cost: 80, forwardDir: 'Step into Activity Area from front outside walkway', backDir: 'Step out to front outside walkway' },

  // Central corridor & Registrar hallway
  { from: 'main-wp-n-hotel', to: 'main-faculty-room', cost: 45, forwardDir: 'Enter College Faculty Room (North entrance)', backDir: 'Exit Faculty Room into north hallway' },
  { from: 'main-wp-n-mid-junc', to: 'main-wp-c-faculty-e', cost: 120, forwardDir: 'Walk south down central corridor along Faculty Room', backDir: 'Walk north toward upper hallway' },
  { from: 'main-faculty-room', to: 'main-wp-c-faculty-e', cost: 35, forwardDir: 'Exit Faculty Room (East door) into central corridor', backDir: 'Enter Faculty Room (East door)' },

  { from: 'main-wp-c-faculty-e', to: 'main-wp-c-mid-junc', cost: 100, forwardDir: 'Walk south to central intersection', backDir: 'Walk north past Faculty Room' },
  { from: 'main-service-cr', to: 'main-wp-c-faculty-e', cost: 40, forwardDir: 'Exit Restroom / Utility into central corridor', backDir: 'Enter Restrooms / Service Utility' },

  { from: 'main-wp-c-mid-junc', to: 'main-wp-c-registrar', cost: 105, forwardDir: 'Walk south down hallway toward Registrar Office', backDir: 'Walk north past Clinic and Registrar toward central intersection' },
  { from: 'main-clinic', to: 'main-wp-c-mid-junc', cost: 45, forwardDir: 'Exit Health Clinic (North door) toward central intersection', backDir: 'Enter School Health Clinic (North door)' },
  { from: 'main-clinic', to: 'main-wp-c-registrar', cost: 35, forwardDir: 'Exit Health Clinic into central hallway facing Registrar', backDir: 'Enter School Health Clinic' },
  { from: 'main-registrar', to: 'main-wp-c-registrar', cost: 35, forwardDir: 'Exit Registrar Office into central hallway', backDir: 'Enter Office of the Registrar' },
  { from: 'main-registrar', to: 'main-wp-activity-mid', cost: 40, forwardDir: 'Exit Registrar (East door) into Activity Area', backDir: 'Enter Registrar Office through East door' },

  // Activity Area & Canteen Area connection
  { from: 'main-wp-activity-s', to: 'main-wp-activity-mid', cost: 90, forwardDir: 'Walk north through Activity Area toward Canteen Area', backDir: 'Walk south through Activity Area toward front outside entrance' },
  { from: 'main-wp-activity-mid', to: 'main-wp-activity-n', cost: 100, forwardDir: 'Continue north through Activity Area toward Canteen Area', backDir: 'Walk south toward center of Activity Area' },
  { from: 'main-wp-activity-n', to: 'main-wp-canteen-area', cost: 110, forwardDir: 'Walk north directly into Canteen Area (Dining Hall)', backDir: 'Walk south into Activity Area' },

  // Activity Area internal navigation & room access
  { from: 'main-activity-area', to: 'main-wp-activity-mid', cost: 10, forwardDir: 'Step onto Activity Area floor', backDir: 'Step to Activity Area perimeter' },
  { from: 'main-activity-area', to: 'main-wp-activity-s', cost: 20, forwardDir: 'Step toward Activity Area south entrance', backDir: 'Step onto Activity Area floor' },
  { from: 'main-activity-area', to: 'main-wp-activity-n', cost: 20, forwardDir: 'Step toward Activity Area north entrance', backDir: 'Step onto Activity Area floor' },

  // =========================================================================
  // INTER-BUILDING SIDEWALK PROMENADE (y = 870)
  // When going to/from Main Building to other buildings, the route follows the outdoor sidewalk.
  // The only entry and exit point for Main Building is the South-West Lobby & Entrance.
  // =========================================================================
  {
    from: 'wp-sidewalk-main',
    to: 'wp-sidewalk-mid',
    cost: 265,
    forwardDir: 'Walk west along the sidewalk promenade toward Mercado Building',
    backDir: 'Walk east along the sidewalk promenade toward Main Building South-West Entrance',
  },
  {
    from: 'wp-sidewalk-mid',
    to: 'wp-sidewalk-mercado',
    cost: 280,
    forwardDir: 'Continue west along the sidewalk promenade to Mercado Building South Entrance',
    backDir: 'Walk east along the sidewalk promenade toward Main Building',
  },
  {
    from: 'wp-sidewalk-mercado',
    to: 'mb-wp-s-exit',
    cost: 35,
    forwardDir: 'Enter Mercado Building through the South Entrance doors',
    backDir: 'Exit Mercado Building through the South Entrance onto the sidewalk promenade',
  },
  {
    from: 'wp-sidewalk-mercado',
    to: 'wp-sidewalk-conn',
    cost: 360,
    forwardDir: 'Walk west along the sidewalk promenade toward Hernandez Building',
    backDir: 'Walk east along the sidewalk promenade toward Mercado Building',
  },
  {
    from: 'wp-sidewalk-conn',
    to: 'wp-sidewalk-hz',
    cost: 410,
    forwardDir: 'Continue west along the sidewalk promenade to Hernandez Main Entrance',
    backDir: 'Walk east along the sidewalk promenade toward Mercado Building',
  },
  {
    from: 'wp-sidewalk-hz',
    to: 'main-exit',
    cost: 70,
    forwardDir: 'Enter Hernandez Building through the Main Ground Floor Entrance',
    backDir: 'Exit Hernandez Building through Main Exit onto the sidewalk promenade',
  },
];

