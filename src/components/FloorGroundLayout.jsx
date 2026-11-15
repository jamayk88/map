import React from 'react';
import CcjeGroundLayout from './CcjeGroundLayout';
import { hernandezMiddleWall, hernandezWallSections } from '../data/hernandezWalls.js';

// Authentic CAD Fire Extinguisher symbol matching floor plan
const CadFireExtinguisher = ({ x, y }) => (
  <g transform={`translate(${x}, ${y})`} pointerEvents="none" className="cad-extinguisher">
    <rect x="-3" y="-6" width="6" height="12" rx="2" fill="#ef4444" stroke="#991b1b" strokeWidth="0.8" />
    <rect x="-1" y="-8" width="2" height="2" fill="#ffffff" />
    <line x1="-3" y1="-8" x2="3" y2="-8" stroke="#1e293b" strokeWidth="1" />
    <circle cx="1.5" cy="-6" r="0.8" fill="#fef08a" />
    <path d="M 1.5 -7 Q 3.5 -4 2.5 3" fill="none" stroke="#1e293b" strokeWidth="0.8" />
  </g>
);

// Green Evacuation Directional Arrow matching evacuation plan
const GreenEvacArrow = ({ x, y, direction = 'left', length = 18, strokeWidth = 3 }) => {
  let rotation = 0;
  if (direction === 'up') rotation = 90;
  else if (direction === 'down') rotation = -90;
  else if (direction === 'right') rotation = 180;
  else if (direction === 'down-left') rotation = -45;

  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation})`} pointerEvents="none" className="evac-arrow">
      <line x1="0" y1="0" x2={-length} y2="0" stroke="#10b981" strokeWidth={strokeWidth} strokeLinecap="round" />
      <polygon
        points={`${-length},0 ${-length + 6},-${strokeWidth + 2} ${-length + 6},${strokeWidth + 2}`}
        fill="#10b981"
      />
    </g>
  );
};

// Green Emergency Exit Running Man Sign matching blueprint
const CadExitSign = ({ x, y, width = 30, height = 20, arrowDir = null }) => (
  <g transform={`translate(${x}, ${y})`} pointerEvents="none" className="cad-exit-sign">
    <rect x={-width / 2} y={-height / 2} width={width} height={height} rx="2" fill="#10b981" stroke="#059669" strokeWidth="1" />
    <g transform="translate(-4, -1) scale(0.65)">
      <circle cx="0" cy="-6" r="2.2" fill="#ffffff" />
      <path d="M -3 -2 L 1 -3 L 4 -1 L 2 3 L -1 7" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 1 -3 L -3 1 L -5 5" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M -2 -1 L -5 -3" fill="none" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />
    </g>
    {arrowDir === 'up' && (
      <polygon points="7,-4 11,-4 9,-8" fill="#ffffff" />
    )}
    {arrowDir === 'left-right' && (
      <g>
        <polygon points="-11,0 -7,-3 -7,3" fill="#ffffff" />
        <polygon points="11,0 7,-3 7,3" fill="#ffffff" />
      </g>
    )}
  </g>
);

const FloorGroundLayout = React.memo(function FloorGroundLayout() {
  return (
    <g className="ground-floor-scene">
      <rect x="0" y="-1100" width="2750" height="1100" fill="#f8fafc" />
      <rect x="0" y="0" width="2750" height="1030" fill="#f8fafc" />
      <CcjeGroundLayout />

      {/* HERNANDEZ BUILDING (LEFT / WEST) */}
      <g className="hernandez-building-group">
        <rect x="40" y="0" width="850" height="855" rx="12" fill="#ffffff" stroke="#1e293b" strokeWidth="8" />
        <rect x="40" y="0" width="850" height="50" rx="4" fill="#0f172a" />
        <text x="465" y="30" textAnchor="middle" fontSize="13" fontWeight="800" fill="#ffffff" letterSpacing="2">
          HERNANDEZ BUILDING
        </text>
        <text x="465" y="46" textAnchor="middle" fontSize="9" fontWeight="600" fill="#94a3b8" letterSpacing="1.5">
          GROUND FLOOR
        </text>

        {/* Hallway guidelines */}
        <g opacity="0.35" pointerEvents="none">
          <line x1="290" y1="245" x2="780" y2="245" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="290" y1="120" x2="290" y2="725" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="670" y1="245" x2="670" y2="818" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="290" y1="505" x2="670" y2="505" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="480" y1="505" x2="480" y2="818" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 5" />
          <line x1="480" y1="630" x2="480" y2="818" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5 5" opacity="0.7" />
          {/* Guideline connecting to Pathway 1 at bottom */}
          <line x1="480" y1="818" x2="890" y2="818" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="5 5" opacity="0.9" />
        </g>

        <g className="hernandez-middle-wall" pointerEvents="none">
          {hernandezWallSections.map(section => <rect key={section.id}
            x={section.x} y={section.y} width={section.width} height={section.height} fill="#334155" />)}
          {hernandezMiddleWall.gates.map(gate => {
            const postX = gate.x + (gate.id === 'west' ? -1 : 1) * gate.width / 2;
            return <g key={gate.id} className="hernandez-gate">
              <title>{`${gate.id === 'west' ? 'West' : 'East'} middle-wall gate`}</title>
              <rect x={postX - 3} y={hernandezMiddleWall.y - 6} width="6" height="12" fill="#0f172a" />
              <line x1={postX} y1={hernandezMiddleWall.y}
                x2={postX} y2={hernandezMiddleWall.y + 22} stroke="#64748b" strokeWidth="2" />
            </g>;
          })}
        </g>

        {/* Corridor text labels */}
        <g opacity="0.45" pointerEvents="none">
          <text x="480" y="240" textAnchor="middle" fontSize="10" fontWeight="700" fill="#64748b" letterSpacing="2">
            NORTH CORRIDOR
          </text>
          <text x="300" y="440" textAnchor="middle" fontSize="9" fontWeight="700" fill="#64748b" letterSpacing="1.5" transform="rotate(-90 300 440)">
            WEST CORRIDOR
          </text>
          <text x="660" y="440" textAnchor="middle" fontSize="9" fontWeight="700" fill="#64748b" letterSpacing="1.5" transform="rotate(90 660 440)">
            EAST CORRIDOR
          </text>
        </g>

        {/* Main Exit Doorway Threshold */}
        <g pointerEvents="none">
          <rect x="420" y="812" width="120" height="6" fill="url(#hazard-stripes)" rx="2" />
        </g>

        {/* Gym Stair labels & Pathway 1 Indicator */}
        <g pointerEvents="none">
          <text x="195" y="760" textAnchor="middle" fontSize="9" fontWeight="700" fill="#0284c7">
            ⬇ TO GYM
          </text>
          <text x="730" y="750" textAnchor="middle" fontSize="8.5" fontWeight="800" fill="#0369a1">
            STAIRS TO GYM (EAST)
          </text>
          <text x="730" y="765" textAnchor="middle" fontSize="8" fontWeight="700" fill="#0284c7">
            ⬇ TO GYM
          </text>
          <text x="780" y="822" textAnchor="middle" fontSize="8" fontWeight="700" fill="#0284c7">
            ➡ PATHWAY 1
          </text>
        </g>

        {/* Entrance Doorway Opening at Hernandez Right Wall (x=890, y=786..850) */}
        <line x1="890" y1="788" x2="890" y2="848" stroke="#ffffff" strokeWidth="10" />
        <line x1="890" y1="788" x2="890" y2="848" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
      </g>

      {/* ============================================================= */}
      {/* PATHWAY 1 - WIDER HORIZONTAL CONNECTOR AT BOTTOM (y = 786 to 850) */}
      {/* ============================================================= */}
      <g className="straight-pathway-1-graphic" pointerEvents="none">
        {/* Straight Horizontal Walkway Floor (Wider 64px height) */}
        <rect
          x="880"
          y="786"
          width="80"
          height="64"
          fill="url(#connector-pavers)"
          stroke="#94a3b8"
          strokeWidth="1.5"
        />

        {/* Top and Bottom Enclosing Walls */}
        <line x1="890" y1="786" x2="950" y2="786" stroke="#0f172a" strokeWidth="4" />
        <line x1="890" y1="850" x2="950" y2="850" stroke="#0f172a" strokeWidth="4" />

        {/* Breezeway Column Posts */}
        <circle cx="890" cy="786" r="3.5" fill="#0f172a" />
        <circle cx="890" cy="850" r="3.5" fill="#0f172a" />
        <circle cx="950" cy="786" r="3.5" fill="#0f172a" />
        <circle cx="950" cy="850" r="3.5" fill="#0f172a" />

        {/* Straight Center Route Guideline */}
        <line
          x1="870"
          y1="818"
          x2="970"
          y2="818"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeDasharray="5 4"
          opacity="0.85"
        />

        {/* Pathway 1 Floating Badge */}
        <rect x="872" y="806" width="96" height="24" rx="12" fill="#0f172a" opacity="0.95" stroke="#334155" strokeWidth="1" />
        <text x="920" y="822" textAnchor="middle" fontSize="8.5" fontWeight="800" fill="#38bdf8" letterSpacing="1.2">
          PATHWAY 1
        </text>
      </g>

      {/* MERCADO BUILDING GROUND FLOOR (RIGHT / EAST) */}
      <g className="mercado-building-group">
        <rect x="950" y="0" width="580" height="855" rx="12" fill="#ffffff" stroke="#1e293b" strokeWidth="8" />

        {/* Entrance Doorway Openings at Pathway 1 Entry (x=950, y=786..850) */}
        <line x1="950" y1="788" x2="950" y2="848" stroke="#ffffff" strokeWidth="10" />
        <line x1="950" y1="788" x2="950" y2="848" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />

        <rect x="950" y="0" width="580" height="50" rx="4" fill="#0f172a" />
        <text x="1240" y="28" textAnchor="middle" fontSize="13" fontWeight="800" fill="#ffffff" letterSpacing="2">
          MERCADO BUILDING
        </text>
        <text x="1240" y="44" textAnchor="middle" fontSize="9" fontWeight="600" fill="#94a3b8" letterSpacing="1.5">
          GROUND FLOOR
        </text>

        {/* Central Hallway Background & Guideline */}
        <rect x="1215" y="50" width="70" height="805" fill="#f8fafc" />
        <line x1="1250" y1="50" x2="1250" y2="855" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="5 5" pointerEvents="none" />
        {/* Internal connecting line from Pathway 1 entry to central hallway */}
        <line x1="950" y1="818" x2="1250" y2="818" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="5 5" pointerEvents="none" />



        {/* Top Side Architectural Structural Elements (Modeled from CAD plan) */}
        <g className="mercado-top-architectural-details" pointerEvents="none">
          {/* Transversal Upper Hallway Background (between north rooms and Library/MB 102) */}
          <rect x="970" y="185" width="540" height="40" fill="#f8fafc" />

          {/* Horizontal dividing structural wall at y = 185 */}
          <line x1="970" y1="185" x2="1215" y2="185" stroke="#1e293b" strokeWidth="4" />
          <line x1="1285" y1="185" x2="1510" y2="185" stroke="#1e293b" strokeWidth="4" />

          {/* Dividing wall between the two CR West cubicle sections */}
          <line x1="1045" y1="50" x2="1045" y2="185" stroke="#64748b" strokeWidth="2" strokeDasharray="3 3" />

          {/* Vertical partition wall between West Restroom and Consultation Room */}
          <line x1="1100" y1="50" x2="1100" y2="185" stroke="#1e293b" strokeWidth="3" />

          {/* Partition wall between Stairs and Twin Restroom */}
          <line x1="1375" y1="50" x2="1375" y2="185" stroke="#1e293b" strokeWidth="3.5" />

          {/* Classroom dividing walls */}
          <line x1="1285" y1="405" x2="1510" y2="405" stroke="#1e293b" strokeWidth="3.5" />
          <line x1="1285" y1="585" x2="1510" y2="585" stroke="#1e293b" strokeWidth="3.5" />
          <line x1="1285" y1="760" x2="1510" y2="760" stroke="#1e293b" strokeWidth="3.5" />

          {/* Corner utility nook in bottom-left below Library */}
          <rect x="970" y="810" width="40" height="35" fill="none" stroke="#64748b" strokeWidth="1.5" />

          {/* Emergency Exit Sign at West Pathway 1 Doorway */}
          <rect x="942" y="828" width="16" height="24" rx="3" fill="#10b981" />
          <polygon points="948,840 954,835 954,845" fill="#ffffff" />

          {/* Structural Reinforced Concrete Column Posts (Exact CAD locations) */}
          {[
            // North wall columns
            [970, 50], [1100, 50], [1215, 50], [1285, 50], [1375, 50], [1445, 50], [1510, 50],
            // Mid-wall columns (at base of stairs and CRs, y = 185)
            [970, 185], [1100, 185], [1215, 185], [1285, 185], [1375, 185], [1510, 185],
            // Top of Library & MB 102 columns (y = 225)
            [970, 225], [1215, 225], [1285, 225], [1510, 225],
            // West outer wall columns
            [970, 370], [970, 530], [970, 690], [970, 845],
            // Central corridor column posts (West side)
            [1215, 300], [1215, 410], [1215, 500], [1215, 595], [1215, 680], [1215, 765], [1215, 845],
            // Central corridor column posts (East side)
            [1285, 410], [1285, 595], [1285, 765], [1285, 845],
            // East outer wall columns
            [1510, 410], [1510, 595], [1510, 765], [1510, 845],
            // South lobby free-standing columns
            [1040, 845], [1120, 845], [1200, 845],
          ].map(([colX, colY], idx) => (
            <rect key={idx} x={colX - 4} y={colY - 4} width="8" height="8" fill="#334155" stroke="#0f172a" strokeWidth="1" rx="1" />
          ))}
        </g>

        <text x="1250" y="450" textAnchor="middle" fontSize="10" fontWeight="700" fill="#64748b" letterSpacing="2" transform="rotate(90 1250 450)" pointerEvents="none">
          MERCADO MAIN HALLWAY
        </text>
      </g>

      {/* ============================================================= */}
      {/* MAIN BUILDING GROUND FLOOR (RIGHT / EAST) (x = 1680 to 2680)  */}
      {/* Modeled directly from CAD Architectural Evacuation Floor Plan */}
      {/* ============================================================= */}
      <g className="main-building-group">
        {/* Outer Building Boundary */}
        <rect x="1680" y="0" width="1000" height="855" rx="12" fill="#ffffff" stroke="#1e293b" strokeWidth="8" />

        {/* Header Title Bar - Centered at x = 2180 */}
        <rect x="1680" y="0" width="1000" height="50" rx="4" fill="#0f172a" />
        <text x="2180" y="30" textAnchor="middle" fontSize="13" fontWeight="800" fill="#ffffff" letterSpacing="2">
          MAIN BUILDING
        </text>
        <text x="2180" y="46" textAnchor="middle" fontSize="9" fontWeight="600" fill="#94a3b8" letterSpacing="1.5">
          GROUND FLOOR • ARCHITECTURAL EVACUATION PLAN
        </text>

        {/* Hallway Backgrounds & Guidelines */}
        <g className="main-corridors-guidelines" pointerEvents="none">
          {/* West Exit Corridor leading straight up to North-West Fire Exit (x = 1685..1735, y = 50..680) */}
          <rect x="1685" y="50" width="50" height="630" fill="#f8fafc" />

          {/* Upper North Hallway Background (y = 215..265, x = 1735..2670) */}
          <rect x="1735" y="215" width="935" height="50" fill="#f8fafc" />
          <line x1="1735" y1="240" x2="2552" y2="240" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5 5" opacity="0.6" />

          {/* West Corridor Background & Guideline (Corporate / Treasury to SW Lobby) */}
          <rect x="1885" y="240" width="25" height="520" fill="#f8fafc" />
          <line x1="1898" y1="240" x2="1898" y2="760" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5 5" opacity="0.6" />
          <line x1="1898" y1="760" x2="1792" y2="760" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5 5" opacity="0.6" />
          <line x1="1792" y1="760" x2="1792" y2="870" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="5 5" opacity="0.8" />

          {/* Central Registrar Hallway Background & Guideline (x = 2210..2265, y = 240..760) */}
          <rect x="2210" y="240" width="55" height="520" fill="#f8fafc" />
          <line x1="2238" y1="240" x2="2238" y2="760" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5 5" opacity="0.6" />

          {/* Front Outside Walkway Guideline to Activity Area & Canteen Area */}
          <line x1="1898" y1="760" x2="2552" y2="760" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5 5" opacity="0.5" />
          <line x1="2552" y1="760" x2="2552" y2="460" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5 5" opacity="0.5" />

          {/* South Curved Pathway around COMLAB 1 and CLINIC */}
          <path
            d="M 1885 670 L 1885 730 Q 2060 775 2265 730 L 2265 670 Q 2060 720 1885 670 Z"
            fill="#f8fafc"
            stroke="#cbd5e1"
            strokeWidth="1"
          />
          <path
            d="M 1898 680 Q 2060 725 2238 680"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeDasharray="5 5"
            opacity="0.6"
          />

          {/* Hallway Labels */}
          <text x="2238" y="565" textAnchor="middle" fontSize="7.5" fontWeight="800" fill="#64748b" letterSpacing="1" transform="rotate(90 2238 565)">
            REGISTRAR HALLWAY
          </text>
          <text x="2060" y="718" textAnchor="middle" fontSize="7" fontWeight="700" fill="#64748b" letterSpacing="0.8">
            COMLAB 1 & CLINIC HALLWAY
          </text>
        </g>

        {/* Architectural Structural Walls & Room Boundaries */}
        <g className="main-structural-walls" pointerEvents="none">
          {/* North Rooms Lower Horizontal Wall (y = 215, across from x = 1735 to 2670) */}
          <line x1="1735" y1="215" x2="2670" y2="215" stroke="#1e293b" strokeWidth="4" />

          {/* North Rooms Vertical Dividers */}
          <line x1="1735" y1="50" x2="1735" y2="215" stroke="#1e293b" strokeWidth="3.5" />
          <line x1="1910" y1="50" x2="1910" y2="215" stroke="#1e293b" strokeWidth="3" />
          <line x1="2060" y1="50" x2="2060" y2="215" stroke="#1e293b" strokeWidth="3" />
          <line x1="2210" y1="50" x2="2210" y2="215" stroke="#1e293b" strokeWidth="3.5" />
          <line x1="2435" y1="50" x2="2435" y2="215" stroke="#1e293b" strokeWidth="3.5" />
          <line x1="2670" y1="50" x2="2670" y2="700" stroke="#1e293b" strokeWidth="4" />

          {/* LC Hotel T&B Bathroom Partition (x = 1910..1960, y = 50..95) */}
          <line x1="1910" y1="95" x2="1960" y2="95" stroke="#64748b" strokeWidth="2" />
          <line x1="1960" y1="50" x2="1960" y2="95" stroke="#64748b" strokeWidth="2" />
          <text x="1935" y="76" textAnchor="middle" fontSize="7" fontWeight="700" fill="#94a3b8">T&B</text>

          {/* LC Culinary Kitchen: Soft Green Tint Floor Background */}
          <rect x="2210" y="50" width="225" height="165" fill="#dcfce7" opacity="0.65" />

          {/* LC Culinary Kitchen Equipment Tables & Stations (2 rows of 4 stainless tables) */}
          <g opacity="0.55">
            {[2230, 2275, 2320, 2365].map((tX, idx) => (
              <g key={`table-top-${idx}`}>
                <rect x={tX} y="72" width="30" height="20" fill="#cbd5e1" stroke="#475569" strokeWidth="1" rx="1.5" />
                <line x1={tX + 15} y1="72" x2={tX + 15} y2="92" stroke="#94a3b8" strokeWidth="0.8" />
              </g>
            ))}
            {[2230, 2275, 2320, 2365].map((tX, idx) => (
              <g key={`table-bot-${idx}`}>
                <rect x={tX} y="152" width="30" height="20" fill="#cbd5e1" stroke="#475569" strokeWidth="1" rx="1.5" />
                <line x1={tX + 15} y1="152" x2={tX + 15} y2="172" stroke="#94a3b8" strokeWidth="0.8" />
              </g>
            ))}
            {/* Wash basin / sink stations along right wall */}
            <rect x="2420" y="75" width="10" height="40" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
            <rect x="2420" y="130" width="10" height="40" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
          </g>

          {/* CANTEEN: Food Serving Counters at top-right (x = 2435..2670, y = 50..215) */}
          <g opacity="0.45">
            <line x1="2465" y1="175" x2="2640" y2="175" stroke="#475569" strokeWidth="2.5" />
            <rect x="2490" y="178" width="130" height="14" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" rx="2" />
            <text x="2555" y="188" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="#475569">FOOD SERVICE COUNTER</text>
          </g>

          {/* East Wing Wall Dividing Canteen Area from Restrooms / Registrar (x = 2435, y = 215..700) */}
          <line x1="2435" y1="215" x2="2435" y2="700" stroke="#1e293b" strokeWidth="4" />

          {/* West Exit Passage Outer & Inner Wall (x = 1735, y = 215..680) */}
          <line x1="1735" y1="215" x2="1735" y2="680" stroke="#1e293b" strokeWidth="3.5" />

          {/* West Column Corridor Right Wall (Corporate, Treasury, SW Stairs to corridor, x = 1885) */}
          <line x1="1885" y1="265" x2="1885" y2="680" stroke="#1e293b" strokeWidth="4" />

          {/* Utility Room (x = 1735..1805, y = 215..265) */}
          <line x1="1805" y1="215" x2="1805" y2="265" stroke="#1e293b" strokeWidth="3" />
          <text x="1770" y="244" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="#64748b">UTILITY ROOM</text>

          {/* Corporate Office & Treasury dividers */}
          <line x1="1735" y1="265" x2="1885" y2="265" stroke="#1e293b" strokeWidth="3.5" />
          <line x1="1735" y1="430" x2="1885" y2="430" stroke="#1e293b" strokeWidth="3.5" />

          {/* Treasury Vault (x = 1735..1785, y = 430..470) */}
          <rect x="1735" y="430" width="50" height="40" fill="#f1f5f9" stroke="#64748b" strokeWidth="1.5" />
          <rect x="1740" y="435" width="40" height="30" fill="none" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="2 2" />
          <text x="1760" y="455" textAnchor="middle" fontSize="6" fontWeight="800" fill="#475569">VAULT</text>

          {/* SW Stairs Top and Bottom Dividers */}
          <line x1="1735" y1="560" x2="1885" y2="560" stroke="#1e293b" strokeWidth="3.5" />
          <line x1="1735" y1="680" x2="1885" y2="680" stroke="#1e293b" strokeWidth="3.5" />

          {/* SW Stairs Utility Closet under stairs */}
          <rect x="1735" y="640" width="50" height="40" fill="#f1f5f9" stroke="#64748b" strokeWidth="1" />
          <text x="1760" y="663" textAnchor="middle" fontSize="6.5" fontWeight="600" fill="#64748b">utility</text>

          {/* Center Column Walls (Faculty Room, COMLAB 1, Clinic) */}
          <line x1="1910" y1="265" x2="2210" y2="265" stroke="#1e293b" strokeWidth="3.5" />
          <line x1="1910" y1="460" x2="2210" y2="460" stroke="#1e293b" strokeWidth="3.5" />
          <line x1="1910" y1="265" x2="1910" y2="670" stroke="#1e293b" strokeWidth="3.5" />
          <line x1="2080" y1="460" x2="2080" y2="695" stroke="#1e293b" strokeWidth="3" />
          <line x1="2210" y1="265" x2="2210" y2="670" stroke="#1e293b" strokeWidth="3.5" />

          {/* COMLAB 1 & CLINIC Curved Wall Facade (Authentic CAD curve - room interior boundary) */}
          <path
            d="M 1910 670 Q 2060 715 2210 670"
            fill="none"
            stroke="#1e293b"
            strokeWidth="4.5"
          />

          {/* Natural Stone & Bush Landscape Planter Bed along Curved Facade */}
          <g className="curved-landscape-planter">
            {/* Planter retaining bed outline */}
            <path
              d="M 1895 675 Q 2060 735 2225 675 L 2235 690 Q 2060 755 1885 690 Z"
              fill="#dcfce7"
              stroke="#86efac"
              strokeWidth="1.5"
            />
            {/* Natural Boulders / Stones Border (Modeled directly from CAD drawing) */}
            {[
              [1895, 680, 5], [1915, 686, 6], [1935, 693, 5.5], [1956, 701, 6],
              [1978, 708, 6.5], [2001, 715, 6], [2025, 720, 6.5], [2049, 723, 6],
              [2073, 724, 6.5], [2096, 722, 6], [2119, 718, 6.5], [2141, 713, 6],
              [2163, 706, 6.5], [2184, 698, 5.5], [2204, 690, 6], [2222, 682, 5],
            ].map(([sX, sY, sR], idx) => (
              <circle key={`stone-${idx}`} cx={sX} cy={sY} r={sR} fill="#e2e8f0" stroke="#64748b" strokeWidth="1" />
            ))}
            {/* Green Landscape Foliage / Shrubs Clusters */}
            {[
              [1920, 696], [1955, 710], [1990, 722], [2030, 729],
              [2070, 731], [2110, 727], [2150, 719], [2185, 706],
            ].map(([bX, bY], idx) => (
              <g key={`bush-${idx}`} transform={`translate(${bX}, ${bY})`}>
                <circle cx="0" cy="0" r="7" fill="#86efac" opacity="0.8" />
                <circle cx="-3" cy="-2" r="5" fill="#4ade80" opacity="0.85" />
                <circle cx="3" cy="-1" r="5" fill="#22c55e" opacity="0.9" />
              </g>
            ))}
          </g>

          {/* Mid-Right Utility & Restrooms Column (x = 2265..2435) */}
          <line x1="2265" y1="265" x2="2435" y2="265" stroke="#1e293b" strokeWidth="3.5" />
          <line x1="2265" y1="460" x2="2435" y2="460" stroke="#1e293b" strokeWidth="3.5" />
          <line x1="2265" y1="670" x2="2435" y2="670" stroke="#1e293b" strokeWidth="3.5" />
          <line x1="2265" y1="265" x2="2265" y2="670" stroke="#1e293b" strokeWidth="3.5" />

          {/* Electrical Room & Water Pump Dividers (y = 265..330) */}
          <line x1="2265" y1="330" x2="2435" y2="330" stroke="#1e293b" strokeWidth="2.5" />
          <line x1="2350" y1="265" x2="2350" y2="330" stroke="#1e293b" strokeWidth="2.5" />
          <text x="2305" y="295" textAnchor="middle" fontSize="6" fontWeight="700" fill="#64748b">ELECTRICAL</text>
          <text x="2305" y="305" textAnchor="middle" fontSize="6" fontWeight="700" fill="#64748b">ROOM</text>
          <text x="2390" y="300" textAnchor="middle" fontSize="6" fontWeight="600" fill="#64748b">water pump</text>
          <circle cx="2390" cy="315" r="5" fill="none" stroke="#64748b" strokeWidth="1" />
          <line x1="2390" y1="310" x2="2390" y2="320" stroke="#64748b" strokeWidth="1" />
          <line x1="2385" y1="315" x2="2395" y2="315" stroke="#64748b" strokeWidth="1" />

          {/* Restrooms: T&B, HE, SHE (y = 330..460) */}
          <line x1="2265" y1="370" x2="2435" y2="370" stroke="#64748b" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="2350" y1="370" x2="2350" y2="460" stroke="#64748b" strokeWidth="2" strokeDasharray="3 3" />
          <text x="2305" y="355" textAnchor="middle" fontSize="7" fontWeight="700" fill="#64748b">T&B</text>
          <text x="2305" y="420" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#64748b">HE</text>
          <text x="2390" y="420" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#64748b">SHE</text>
          {/* Restroom fixtures: WC stalls and sinks */}
          <g opacity="0.4">
            <rect x="2275" y="435" width="12" height="15" fill="none" stroke="#64748b" strokeWidth="1" />
            <circle cx="2281" cy="442" r="3" fill="#cbd5e1" />
            <rect x="2295" y="435" width="12" height="15" fill="none" stroke="#64748b" strokeWidth="1" />
            <circle cx="2301" cy="442" r="3" fill="#cbd5e1" />
            <rect x="2365" y="435" width="12" height="15" fill="none" stroke="#64748b" strokeWidth="1" />
            <circle cx="2371" cy="442" r="3" fill="#cbd5e1" />
            <rect x="2385" y="435" width="12" height="15" fill="none" stroke="#64748b" strokeWidth="1" />
            <circle cx="2391" cy="442" r="3" fill="#cbd5e1" />
          </g>

          {/* South Open Front Walkway & Landscaped Promenade (y = 670..855) */}
          <rect x="1870" y="670" width="800" height="175" fill="#f0fdf4" opacity="0.6" />
        </g>

        {/* ============================================================= */}
        {/* AUTHENTIC CAD FIRE EXTINGUISHERS (16 Locations from Drawing)  */}
        {/* ============================================================= */}
        <g className="cad-extinguishers-group">
          <CadFireExtinguisher x={1755} y={135} /> {/* Office of the President */}
          <CadFireExtinguisher x={2190} y={195} /> {/* LC Bar */}
          <CadFireExtinguisher x={2225} y={110} /> {/* LC Culinary Kitchen */}
          <CadFireExtinguisher x={2450} y={135} /> {/* Canteen */}
          <CadFireExtinguisher x={1715} y={175} /> {/* West Exit Passage */}
          <CadFireExtinguisher x={1760} y={285} /> {/* Corporate Office */}
          <CadFireExtinguisher x={1865} y={510} /> {/* Treasury Office */}
          <CadFireExtinguisher x={1898} y={620} /> {/* Hallway outside SW Stairs */}
          <CadFireExtinguisher x={1720} y={760} /> {/* SW Lobby Entrance */}
          <CadFireExtinguisher x={2190} y={435} /> {/* College Faculty Room */}
          <CadFireExtinguisher x={2070} y={560} /> {/* Comlab 1 */}
          <CadFireExtinguisher x={2195} y={630} /> {/* Clinic */}
          <CadFireExtinguisher x={2245} y={300} /> {/* Hallway outside Electrical */}
          <CadFireExtinguisher x={2245} y={410} /> {/* Hallway outside SHE */}
          <CadFireExtinguisher x={2280} y={485} /> {/* Registrar Office (Top) */}
          <CadFireExtinguisher x={2280} y={580} /> {/* Registrar Office (Mid) */}
          <CadFireExtinguisher x={2245} y={690} /> {/* Hallway south of Registrar */}
        </g>

        {/* ============================================================= */}
        {/* EVACUATION ROUTE DIRECTIONAL GREEN ARROWS (From Blueprint)    */}
        {/* ============================================================= */}
        <g className="evacuation-route-arrows">
          {/* Culinary Kitchen: Down Arrow */}
          <GreenEvacArrow x={2225} y={140} direction="down" length={18} strokeWidth={3.5} />

          {/* North Corridor: Left Arrows */}
          <GreenEvacArrow x={2500} y={240} direction="left" length={20} strokeWidth={3.5} />
          <GreenEvacArrow x={2320} y={240} direction="left" length={20} strokeWidth={3.5} />
          <GreenEvacArrow x={2238} y={240} direction="left" length={20} strokeWidth={3.5} />
          <GreenEvacArrow x={2135} y={240} direction="left" length={20} strokeWidth={3.5} />
          <GreenEvacArrow x={1985} y={240} direction="left" length={20} strokeWidth={3.5} />
          <GreenEvacArrow x={1840} y={240} direction="left" length={20} strokeWidth={3.5} />

          {/* Turning Corner into West Exit Corridor: Down-Left Arrow */}
          <GreenEvacArrow x={1750} y={240} direction="down-left" length={18} strokeWidth={3.5} />
          <GreenEvacArrow x={1725} y={215} direction="left" length={16} strokeWidth={3.5} />

          {/* West Exit Corridor: Large Arrow Pointing Straight UP to Fire Exit Door */}
          <GreenEvacArrow x={1710} y={120} direction="up" length={40} strokeWidth={4.5} />
        </g>

  

        {/* Entrance Doorway Openings */}
        <line x1="1680" y1="770" x2="1680" y2="840" stroke="#ffffff" strokeWidth="10" />
        <line x1="1680" y1="770" x2="1680" y2="840" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />

        {/* Southwest Entrance Triangle Indicator & Sidewalk Promenade Labels */}
        <g pointerEvents="none">
          <polygon points="1792,845 1802,860 1782,860" fill="#1e293b" />
          <text x="1792" y="873" textAnchor="middle" fontSize="8.5" fontWeight="800" fill="#1e293b">
            ENTRANCE
          </text>
          <text x="2060" y="873" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#64748b" letterSpacing="1">
            sidewalk
          </text>
        </g>
      </g>

      {/* ============================================================= */}
      {/* TWO-WAY ACCESS ROAD & PROMENADE (BOTTOM OF ALL BUILDINGS)    */}
      {/* ============================================================= */}
      <g className="two-way-road-group" pointerEvents="none">
        {/* Sidewalk Promenade along buildings (y = 855 to 885) */}
        <rect x="0" y="855" width="2750" height="30" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
        <line x1="0" y1="885" x2="2750" y2="885" stroke="#1e293b" strokeWidth="3" />

        {/* Sidewalk Promenade Route Guideline connecting buildings */}
        <line x1="480" y1="870" x2="1792" y2="870" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="5 5" opacity="0.8" />
        <line x1="480" y1="818" x2="480" y2="870" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" opacity="0.75" />
        <line x1="1250" y1="835" x2="1250" y2="870" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" opacity="0.75" />
        <line x1="1792" y1="845" x2="1792" y2="870" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" opacity="0.75" />
        <text x="1600" y="873" textAnchor="middle" fontSize="9" fontWeight="700" fill="#64748b" letterSpacing="1">
          sidewalk promenade
        </text>

        {/* Main Two-Way Road White Surface (y = 885 to 1015) */}
        <rect x="0" y="885" width="2750" height="130" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />

        {/* Top and Bottom Outer Margin Lines */}
        <line x1="0" y1="892" x2="2750" y2="892" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="6 4" />
        <line x1="0" y1="1008" x2="2750" y2="1008" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="6 4" />
        <line x1="0" y1="1015" x2="2750" y2="1015" stroke="#1e293b" strokeWidth="3" />

        {/* Center Double Yellow Dividing Lines (Two-Way Traffic) */}
        <line x1="0" y1="948" x2="2750" y2="948" stroke="#eab308" strokeWidth="2.5" strokeDasharray="16 12" />
        <line x1="0" y1="952" x2="2750" y2="952" stroke="#eab308" strokeWidth="2.5" strokeDasharray="16 12" />

        {/* Outer South Sidewalk & Curb (y = 1015 to 1030) */}
        <rect x="0" y="1015" width="2750" height="15" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
      </g>

      {/* Compass Rose */}
      <g transform="translate(2690, 780)" opacity="0.75" pointerEvents="none">
        <circle cx="0" cy="0" r="22" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <polygon points="0,-16 6,0 0,-4 -6,0" fill="#ef4444" />
        <polygon points="0,16 6,0 0,4 -6,0" fill="#64748b" />
        <text x="0" y="-18" textAnchor="middle" fontSize="9" fontWeight="800" fill="#1e293b">
          N
        </text>
      </g>
    </g>
  );
});

export default FloorGroundLayout;
