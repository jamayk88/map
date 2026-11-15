// Two wide gates flank an open central passage in the middle divider.
export const hernandezMiddleWall = {
  floorId: 'floor-1', x: 270, endX: 680, y: 630, thickness: 6,
  gates: [
    { id: 'west', x: 385, width: 96 },
    { id: 'east', x: 557, width: 96 },
  ],
};

let previousX = hernandezMiddleWall.x;
export const hernandezWallSections = [...hernandezMiddleWall.gates,
  { x: hernandezMiddleWall.endX, width: 0 }].map((gate, index) => {
  const endX = gate.x - gate.width / 2;
  const section = {
    id: `hb-middle-wall-${index}`, floorId: hernandezMiddleWall.floorId,
    x: previousX, y: hernandezMiddleWall.y - hernandezMiddleWall.thickness / 2,
    width: endX - previousX, height: hernandezMiddleWall.thickness,
  };
  previousX = gate.x + gate.width / 2;
  return section;
}).filter((section, index) => index !== 1);
