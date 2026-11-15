import React from 'react';
import MainSecondLayout from './MainSecondLayout';
import CcjeSecondLayout from './CcjeSecondLayout';

const FloorSecondLayout = React.memo(function FloorSecondLayout() {
  return (
    <g className="second-floor-scene">
      <rect x="0" y="-1100" width="2750" height="1100" fill="#f8fafc" />
      <CcjeSecondLayout />
      <rect x="0" y="0" width="2750" height="1030" fill="#f8fafc" />

      {/* HERNANDEZ BUILDING (GYMNASIUM) (LEFT / WEST) */}
      <g className="hernandez-gym-group">
        <rect x="40" y="0" width="850" height="855" rx="12" fill="#ffffff" stroke="#1e293b" strokeWidth="8" />
        <rect x="40" y="0" width="850" height="50" rx="4" fill="#0f172a" />
        <text x="465" y="30" textAnchor="middle" fontSize="13" fontWeight="800" fill="#ffffff" letterSpacing="2">
          HERNANDEZ BUILDING
        </text>
        <text x="465" y="46" textAnchor="middle" fontSize="9" fontWeight="600" fill="#94a3b8" letterSpacing="1.5">
          2ND FLOOR — GYMNASIUM
        </text>

        {/* Stage Platform (North) */}
        <g className="gym-stage-graphic" pointerEvents="none">
          <rect x="240" y="80" width="440" height="170" rx="4" fill="#f1f5f9" stroke="#64748b" strokeWidth="2.5" />
          <line x1="240" y1="120" x2="680" y2="120" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="240" y1="160" x2="680" y2="160" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="240" y1="200" x2="680" y2="200" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
          <text x="460" y="165" textAnchor="middle" fontSize="11" fontWeight="800" fill="#475569" letterSpacing="2">
            🎭 STAGE / EVENT PLATFORM
          </text>
        </g>

        {/* Basketball Court Graphics */}
        <g className="gym-court-graphic" pointerEvents="none">
          {/* Hardwood Court Floor */}
          <rect x="160" y="275" width="600" height="390" rx="6" fill="#fffbeb" stroke="#86efac" strokeWidth="3" />

          {/* Half-Court Division Line */}
          <line x1="460" y1="275" x2="460" y2="665" stroke="#86efac" strokeWidth="2.5" />

          {/* Center Circle */}
          <circle cx="460" cy="470" r="50" fill="#fef08a" fillOpacity="0.3" stroke="#86efac" strokeWidth="2.5" />
          <circle cx="460" cy="470" r="18" fill="none" stroke="#86efac" strokeWidth="2" />

          {/* West Key / Paint Area */}
          <rect x="160" y="405" width="120" height="130" fill="#f0fdf4" fillOpacity="0.6" stroke="#86efac" strokeWidth="2" />
          <circle cx="280" cy="470" r="45" fill="none" stroke="#86efac" strokeWidth="2" strokeDasharray="6 4" />
          {/* West 3-Point Arc */}
          <path d="M 160 320 A 180 180 0 0 1 160 620" fill="none" stroke="#86efac" strokeWidth="2" strokeDasharray="6 4" />
          {/* West Backboard & Hoop */}
          <line x1="180" y1="445" x2="180" y2="495" stroke="#ea580c" strokeWidth="3.5" />
          <circle cx="195" cy="470" r="8" fill="none" stroke="#ea580c" strokeWidth="2" />

          {/* East Key / Paint Area */}
          <rect x="640" y="405" width="120" height="130" fill="#f0fdf4" fillOpacity="0.6" stroke="#86efac" strokeWidth="2" />
          <circle cx="640" cy="470" r="45" fill="none" stroke="#86efac" strokeWidth="2" strokeDasharray="6 4" />
          {/* East 3-Point Arc */}
          <path d="M 760 320 A 180 180 0 0 0 760 620" fill="none" stroke="#86efac" strokeWidth="2" strokeDasharray="6 4" />
          {/* East Backboard & Hoop */}
          <line x1="740" y1="445" x2="740" y2="495" stroke="#ea580c" strokeWidth="3.5" />
          <circle cx="725" cy="470" r="8" fill="none" stroke="#ea580c" strokeWidth="2" />

          {/* Court Center Badge */}
          <text x="460" y="465" textAnchor="middle" fontSize="12" fontWeight="800" fill="#166534" letterSpacing="1">
            🏀 BASKETBALL COURT
          </text>
          <text x="460" y="482" textAnchor="middle" fontSize="9" fontWeight="600" fill="#15803d">
            CAMPUS ATHLETICS CENTER
          </text>
        </g>

        {/* South Stairs (West & East - Horizontal Orientation matching floor plan) */}
        <g className="gym-stairs-graphic" pointerEvents="none">
          {/* West Stairs Enclosure (Treads run vertically, travel flows East ->) */}
          <rect x="190" y="690" width="160" height="80" rx="3" fill="#f0f9ff" stroke="#0284c7" strokeWidth="2.5" />
          {[202, 214, 226, 238, 250, 262, 274, 286, 298, 310, 322, 334, 344].map((xStep) => (
            <line key={xStep} x1={xStep} y1="690" x2={xStep} y2="770" stroke="#93c5fd" strokeWidth="1.8" />
          ))}
          {/* Stringer Top & Bottom Rails */}
          <line x1="190" y1="690" x2="350" y2="690" stroke="#0f172a" strokeWidth="3" />
          <line x1="190" y1="770" x2="350" y2="770" stroke="#0f172a" strokeWidth="3" />
          {/* West Doorway Entry Arc */}
          <path d="M 190 705 A 25 25 0 0 0 165 730" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="165" y1="730" x2="190" y2="730" stroke="#0284c7" strokeWidth="2" />
          <text x="270" y="682" textAnchor="middle" fontSize="8.5" fontWeight="800" fill="#0369a1">
            🪜 WEST STAIRS (TO GF)
          </text>

          {/* East Stairs Enclosure (Treads run vertically, travel flows West <-) */}
          <rect x="580" y="690" width="160" height="80" rx="3" fill="#f0f9ff" stroke="#0284c7" strokeWidth="2.5" />
          {[592, 604, 616, 628, 640, 652, 664, 676, 688, 700, 712, 724, 734].map((xStep) => (
            <line key={xStep} x1={xStep} y1="690" x2={xStep} y2="770" stroke="#93c5fd" strokeWidth="1.8" />
          ))}
          {/* Stringer Top & Bottom Rails */}
          <line x1="580" y1="690" x2="740" y2="690" stroke="#0f172a" strokeWidth="3" />
          <line x1="580" y1="770" x2="740" y2="770" stroke="#0f172a" strokeWidth="3" />
          {/* East Doorway Entry Arc */}
          <path d="M 740 705 A 25 25 0 0 1 765 730" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="740" y1="730" x2="765" y2="730" stroke="#0284c7" strokeWidth="2" />
          <text x="660" y="682" textAnchor="middle" fontSize="8.5" fontWeight="800" fill="#0369a1">
            🪜 EAST STAIRS (TO GF)
          </text>
        </g>

        {/* Evacuation Arrows (Matching Plan) */}
        <g className="gym-evac-arrows" pointerEvents="none" opacity="0.8">
          {/* Northward arrows toward NW and NE Exits */}
          <polygon points="215,220 225,220 225,180 230,180 220,165 210,180 215,180" fill="#10b981" />
          <polygon points="705,220 715,220 715,180 720,180 710,165 700,180 705,180" fill="#10b981" />
          {/* Southward arrows down side aisles */}
          <polygon points="145,690 155,690 155,720 160,720 150,735 140,720 145,720" fill="#10b981" />
          <polygon points="775,690 785,690 785,720 790,720 780,735 770,720 775,720" fill="#10b981" />
          {/* Horizontal flow arrows through stairs */}
          {/* West Stairs: Flows East -> */}
          <polygon points="215,726 215,734 245,734 245,738 258,730 245,722 245,726" fill="#10b981" />
          <polygon points="280,726 280,734 310,734 310,738 323,730 310,722 310,726" fill="#10b981" />
          {/* East Stairs: Flows West <- */}
          <polygon points="715,726 715,734 685,734 685,738 672,730 685,722 685,726" fill="#10b981" />
          <polygon points="650,726 650,734 620,734 620,738 607,730 620,722 620,726" fill="#10b981" />
        </g>


      </g>

      {/* MERCADO BUILDING 2ND FLOOR (RIGHT / EAST) */}
      <g className="mercado-2f-group">
        <rect x="950" y="0" width="580" height="855" rx="12" fill="#ffffff" stroke="#1e293b" strokeWidth="8" />
        <rect x="950" y="0" width="580" height="50" rx="4" fill="#0f172a" />
        <text x="1240" y="28" textAnchor="middle" fontSize="13" fontWeight="800" fill="#ffffff" letterSpacing="2">
          MERCADO BUILDING
        </text>
        <text x="1240" y="44" textAnchor="middle" fontSize="9" fontWeight="600" fill="#94a3b8" letterSpacing="1.5">
          2ND FLOOR
        </text>

        {/* Central Hallway Background & Guideline */}
        <rect x="1215" y="50" width="70" height="805" fill="#f8fafc" />
        <line x1="1250" y1="50" x2="1250" y2="855" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="5 5" pointerEvents="none" />



        {/* 2nd Floor Central Hallway Label */}
        <text x="1250" y="470" textAnchor="middle" fontSize="10" fontWeight="700" fill="#64748b" letterSpacing="2" transform="rotate(90 1250 470)" pointerEvents="none">
          2ND FLOOR MAIN CORRIDOR
        </text>
      </g>

      <MainSecondLayout />

      {/* Compass Rose */}
      <g transform="translate(1530, 780)" opacity="0.75" pointerEvents="none">
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

export default FloorSecondLayout;
