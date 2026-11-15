import React from 'react';
import { MapPin, Flag, Footprints } from 'lucide-react';
import { getRoomLucideIcon } from './icons';
import { getRoomDoorPosition } from '../utils/routePosition.js';

export default React.memo(function RoomHotspot({
  room,
  isStart,
  isEnd,
  isInPath,
  onClick,
  onHover,
  onLeave,
  routePosition,
}) {
  const { x, y, width, height, center, name, code, icon, accentColor, category, doors, badge, isStair, direction } = room;
  const endpoint = routePosition || getRoomDoorPosition(room);
  const pinPosition = (isStart || isEnd) && room.doors?.length
    ? [endpoint[0], endpoint[1] - 16]
    : [center[0], room.isGuideLocation ? y + 40 : center[1] - 36];

  const titleFontSize = width > 200 ? 15 : 13;
  const labelWidth = Math.max(20, width - 16);
  const maxLineLength = Math.max(5, Math.floor(labelWidth / (titleFontSize * 0.6)));
  const titleLines = (room.labelLines || [name]).flatMap(label => {
    const lines = [];
    for (const word of label.split(/\s+/)) {
      const last = lines.length - 1;
      if (last >= 0 && `${lines[last]} ${word}`.length <= maxLineLength) lines[last] += ` ${word}`;
      else lines.push(word);
    }
    return lines;
  });

  // Visual styling depending on state
  let fill = '#f8fafc';
  let stroke = '#64748b';
  let strokeWidth = 2.5;
  let filter = 'none';

  if (isStart) {
    fill = '#ecfdf5';
    stroke = '#10b981';
    strokeWidth = 3.5;
    filter = 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.45))';
  } else if (isEnd) {
    fill = '#fef2f2';
    stroke = '#ef4444';
    strokeWidth = 3.5;
    filter = 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.45))';
  } else if (isInPath) {
    fill = '#f0fdf4';
    stroke = '#86efac';
    strokeWidth = 2.5;
  } else if (room.defaultFill) {
    fill = room.defaultFill;
    stroke = room.accentColor;
  } else if (room.id === 'cqa') {
    fill = '#f0fdf4';
    stroke = '#34d399';
    strokeWidth = 2.5;
  } else if (room.id === 'main-culinary-kitchen') {
    fill = '#dcfce7';
    stroke = '#16a34a';
    strokeWidth = 2.5;
  } else if (category === 'Laboratory') {
    fill = '#fbfbfe';
    stroke = '#6366f1';
    strokeWidth = 2.5;
  } else if (category === 'Classroom') {
    fill = '#f8fafc';
    stroke = '#3b82f6';
    strokeWidth = 2.5;
  } else if (category === 'Facility') {
    fill = '#fff7ed';
    stroke = '#f97316';
    strokeWidth = 2.5;
  } else if (category === 'Exit & Stairs') {
    fill = '#f0fdf4';
    stroke = '#10b981';
    strokeWidth = 2.5;
  } else if (category === 'Athletics & Gymnasium') {
    fill = 'rgba(255, 255, 255, 0.01)';
    stroke = isInPath ? '#86efac' : 'transparent';
    strokeWidth = isInPath ? 3 : 0;
  }

  // =========================================================================
  // DEDICATED ARCHITECTURAL CAD STAIRCASE RENDERER
  // (Models authentic CAD floor plan stair flights with treads, stringers,
  // break lines, and incline direction arrows instead of a closed room box!)
  // =========================================================================
  const renderArchitecturalStairs = () => {
    if (room.stairOrientation === 'vertical') {
      return (
        <g className="architectural-staircase" pointerEvents="none">
          <rect x={x} y={y} width={width} height={height} rx="3"
            fill={isStart ? '#ecfdf5' : isEnd ? '#fef2f2' : '#f8fafc'}
            stroke={isStart ? '#10b981' : isEnd ? '#ef4444' : '#334155'} strokeWidth="2.5" />
          {Array.from({ length: 12 }, (_, i) => (
            <line key={i} x1={x + 4} x2={x + width - 4} y1={y + 6 + i * (height - 20) / 12} y2={y + 6 + i * (height - 20) / 12} stroke="#475569" strokeWidth="1.5" />
          ))}
          {room.isTwinFlight && <line x1={center[0]} x2={center[0]} y1={y} y2={y + height - 22} stroke="#334155" strokeWidth="3" />}
          <line x1={center[0]} y1={y + 8} x2={center[0]} y2={y + height - 28} stroke="#0284c7" strokeWidth="2" strokeDasharray="4 3" />
          {direction === 'up' ? <polygon points={`${center[0] - 5},${y + 20} ${center[0] + 5},${y + 20} ${center[0]},${y + 10}`} fill="#0284c7" />
            : <polygon points={`${center[0] - 5},${y + height - 33} ${center[0] + 5},${y + height - 33} ${center[0]},${y + height - 23}`} fill="#0284c7" />}
          <rect x={center[0] - 44} y={y + height - 20} width="88" height="16" rx="8" fill="#0f172a" />
          <text x={center[0]} y={y + height - 9} textAnchor="middle" fontSize="8" fontWeight="800" fill="#38bdf8">{direction === 'up' ? 'UP' : 'DN'} • TO {room.stairDestination}</text>
          {room.stairSecondaryDestination && <g>
            <rect x={center[0] - 44} y={y + 4} width="88" height="16" rx="8" fill="#0f172a" />
            <text x={center[0]} y={y + 15} textAnchor="middle" fontSize="8" fontWeight="800" fill="#38bdf8">UP • TO {room.stairSecondaryDestination}</text>
          </g>}
        </g>
      );
    }
    // -----------------------------------------------------------------------
    // 0. MAIN BUILDING SOUTH-WEST STAIRS (main-stairs): Ascends NORTH with Breakline
    // -----------------------------------------------------------------------
    if (room.id === 'main-stairs') {
      const solidStepY = [665, 653, 641, 629, 617, 605];
      const dashedStepY = [593, 581, 569];

      return (
        <g className="architectural-staircase" pointerEvents="none">
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            fill={isStart ? '#ecfdf5' : isEnd ? '#fef2f2' : isInPath ? '#f0fdf4' : '#f8fafc'}
            stroke={isStart ? '#10b981' : isEnd ? '#ef4444' : isInPath ? '#10b981' : '#cbd5e1'}
            strokeWidth={isStart || isEnd ? 3 : 1.5}
          />
          <line x1={x} y1={y} x2={x} y2={y + height} stroke="#334155" strokeWidth="3" />
          <line x1={x + width} y1={y} x2={x + width} y2={y + height} stroke="#334155" strokeWidth="3" />
          {solidStepY.map((sY, idx) => (
            <line key={`solid-${idx}`} x1={x + 3} y1={sY} x2={x + width - 3} y2={sY} stroke="#334155" strokeWidth="1.8" />
          ))}
          <path
            d={`M ${x + 2} 600 L ${x + width * 0.35} 600 L ${x + width * 0.44} 592 L ${x + width * 0.56} 608 L ${x + width * 0.65} 600 L ${x + width - 2} 600`}
            fill="none"
            stroke="#0284c7"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {dashedStepY.map((sY, idx) => (
            <line key={`dashed-${idx}`} x1={x + 3} y1={sY} x2={x + width - 3} y2={sY} stroke="#94a3b8" strokeWidth="1.4" strokeDasharray="4 3" />
          ))}
          <line x1={center[0]} y1={y + height - 12} x2={center[0]} y2={y + 35} stroke="#0284c7" strokeWidth="2" strokeDasharray="5 3" />
          <polygon points={`${center[0] - 5},${y + 37} ${center[0] + 5},${y + 37} ${center[0]},${y + 25}`} fill="#0284c7" />
          <text x={center[0]} y={y + height - 4} textAnchor="middle" fontSize="9" fontWeight="900" fill="#0284c7" letterSpacing="1">
            UP
          </text>
          <g transform={`translate(${center[0]}, ${y + 80})`}>
            <rect x="-36" y="-8" width="72" height="16" rx="8" fill="#0f172a" opacity="0.9" />
            <text x="0" y="3" textAnchor="middle" fontSize="7.5" fontWeight="800" fill="#38bdf8" letterSpacing="0.5">
              🪜 TO 2ND FLR
            </text>
          </g>
        </g>
      );
    }



    // -----------------------------------------------------------------------
    // 1. GROUND FLOOR MAIN STAIRS (mb-stairs-up): Ascends NORTH with Breakline
    // -----------------------------------------------------------------------
    if (room.id === 'mb-stairs-up') {
      const solidStepY = [175, 166, 157, 148, 139, 130, 121];
      const dashedStepY = [105, 96, 87, 78, 69, 60, 51];

      return (
        <g className="architectural-staircase" pointerEvents="none">
          {/* Subtle stairwell floor fill */}
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            fill={isStart ? '#ecfdf5' : isEnd ? '#fef2f2' : isInPath ? '#f0fdf4' : '#f8fafc'}
            stroke={isStart ? '#10b981' : isEnd ? '#ef4444' : isInPath ? '#10b981' : '#cbd5e1'}
            strokeWidth={isStart || isEnd ? 3 : 1.5}
            strokeDasharray={isStart || isEnd ? 'none' : '3 3'}
          />

          {/* Side Stringers / Handrails */}
          <line x1={x} y1={y} x2={x} y2={y + height} stroke="#334155" strokeWidth="3" />
          <line x1={x + width} y1={y} x2={x + width} y2={y + height} stroke="#334155" strokeWidth="3" />
          <circle cx={x} cy={y + 8} r="2.5" fill="#0f172a" />
          <circle cx={x} cy={y + height - 2} r="2.5" fill="#0f172a" />
          <circle cx={x + width} cy={y + 8} r="2.5" fill="#0f172a" />
          <circle cx={x + width} cy={y + height - 2} r="2.5" fill="#0f172a" />

          {/* Solid lower steps (eye-level section plane) */}
          {solidStepY.map((sY, idx) => (
            <line
              key={`solid-${idx}`}
              x1={x + 3}
              y1={sY}
              x2={x + width - 3}
              y2={sY}
              stroke="#334155"
              strokeWidth="1.8"
            />
          ))}

          {/* Architectural Diagonal Break Cut Line (_/\_ cut across stairs) */}
          <path
            d={`M ${x + 2} 114 L ${x + width * 0.35} 114 L ${x + width * 0.44} 106 L ${x + width * 0.56} 122 L ${x + width * 0.65} 114 L ${x + width - 2} 114`}
            fill="none"
            stroke="#0284c7"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />

          {/* Dashed overhead steps ascending toward 2nd floor landing */}
          {dashedStepY.map((sY, idx) => (
            <line
              key={`dashed-${idx}`}
              x1={x + 3}
              y1={sY}
              x2={x + width - 3}
              y2={sY}
              stroke="#94a3b8"
              strokeWidth="1.4"
              strokeDasharray="4 3"
            />
          ))}

          {/* Direction of Flight Arrow (Heading North) */}
          <line
            x1={center[0]}
            y1={y + height - 16}
            x2={center[0]}
            y2={y + 36}
            stroke="#0284c7"
            strokeWidth="2"
            strokeDasharray="5 3"
          />
          <polygon
            points={`${center[0] - 5},${y + 38} ${center[0] + 5},${y + 38} ${center[0]},${y + 26}`}
            fill="#0284c7"
          />

          {/* "UP" Architectural CAD Incline Marker at South corridor approach */}
          <text
            x={center[0]}
            y={y + height - 3}
            textAnchor="middle"
            fontSize="10"
            fontWeight="900"
            fill="#0284c7"
            letterSpacing="1.2"
          >
            UP
          </text>

          {/* Interactive Floating Badge */}
          <g transform={`translate(${center[0]}, ${y + 72})`}>
            <rect x="-38" y="-9" width="76" height="18" rx="9" fill="#0f172a" opacity="0.9" />
            <text x="0" y="3" textAnchor="middle" fontSize="8" fontWeight="800" fill="#38bdf8" letterSpacing="0.5">
              🪜 TO 2ND FLR
            </text>
          </g>
        </g>
      );
    }

    // -----------------------------------------------------------------------
    // 2. SECOND FLOOR MAIN STAIRS (mb2-stairs-main): Descends SOUTH to Ground
    // -----------------------------------------------------------------------
    if (room.id === 'mb2-stairs-main' || room.id === 'mb3-stairs-main') {
      const stepY = room.floorId === 'floor-3'
        ? Array.from({ length: 13 }, (_, i) => y + 5 + i * (height - 20) / 12)
        : [55, 67, 79, 91, 103, 115, 127, 139, 151, 163, 175, 187, 199];

      return (
        <g className="architectural-staircase" pointerEvents="none">
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            fill={isStart ? '#ecfdf5' : isEnd ? '#fef2f2' : isInPath ? '#f0fdf4' : '#f8fafc'}
            stroke={isStart ? '#10b981' : isEnd ? '#ef4444' : isInPath ? '#10b981' : '#cbd5e1'}
            strokeWidth={isStart || isEnd ? 3 : 1.5}
            strokeDasharray={isStart || isEnd ? 'none' : '3 3'}
          />

          <line x1={x} y1={y} x2={x} y2={y + height} stroke="#334155" strokeWidth="3" />
          <line x1={x + width} y1={y} x2={x + width} y2={y + height} stroke="#334155" strokeWidth="3" />

          {stepY.map((sY, idx) => (
            <line
              key={idx}
              x1={x + 3}
              y1={sY}
              x2={x + width - 3}
              y2={sY}
              stroke="#334155"
              strokeWidth="1.8"
            />
          ))}

          {/* Direction of Flight Arrow (Heading South) */}
          <line
            x1={center[0]}
            y1={y + 35}
            x2={center[0]}
            y2={y + height - 20}
            stroke="#0284c7"
            strokeWidth="2"
            strokeDasharray="5 3"
          />
          <polygon
            points={`${center[0] - 5},${y + height - 22} ${center[0] + 5},${y + height - 22} ${center[0]},${y + height - 10}`}
            fill="#0284c7"
          />

          <text
            x={center[0]}
            y={y + height - 2}
            textAnchor="middle"
            fontSize="10"
            fontWeight="900"
            fill="#0284c7"
            letterSpacing="1.2"
          >
            DN
          </text>

          <g transform={`translate(${center[0]}, ${y + 88})`}>
            <rect x="-38" y="-9" width="76" height="18" rx="9" fill="#0f172a" opacity="0.9" />
            <text x="0" y="3" textAnchor="middle" fontSize="8" fontWeight="800" fill="#38bdf8" letterSpacing="0.5">
              🪜 TO {room.stairDestination || 'GROUND'}
            </text>
          </g>
        </g>
      );
    }

    // -----------------------------------------------------------------------
    // 3. SOUTH STAIRS & GYM STAIRS: Vertical Tread Flights (Horizontal Travel)
    // -----------------------------------------------------------------------
    const stepCount = Math.max(10, Math.floor(width / 14));
    const stepGap = (width - 16) / stepCount;
    const steps = [];
    for (let i = 1; i <= stepCount; i++) {
      const stepX = x + 8 + (i - 0.5) * stepGap;
      steps.push(
        <line
          key={i}
          x1={stepX}
          y1={y + 3}
          x2={stepX}
          y2={y + height - 3}
          stroke="#475569"
          strokeWidth="1.6"
        />
      );
    }

    const isWestGym = room.id.includes('west');

    return (
      <g className="architectural-staircase" pointerEvents="none">
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx="3"
          fill={isStart ? '#ecfdf5' : isEnd ? '#fef2f2' : isInPath ? '#f0fdf4' : '#f8fafc'}
          stroke={isStart ? '#10b981' : isEnd ? '#ef4444' : isInPath ? '#10b981' : '#cbd5e1'}
          strokeWidth={isStart || isEnd ? 3 : 1.5}
        />
        {/* Top and Bottom Stringer Rails */}
        <line x1={x} y1={y + 3} x2={x + width} y2={y + 3} stroke="#1e293b" strokeWidth="2.5" />
        <line x1={x} y1={y + height - 3} x2={x + width} y2={y + height - 3} stroke="#1e293b" strokeWidth="2.5" />
        
        {/* Vertical Step Tread Lines */}
        {steps}
        {room.isTwinFlight && <line x1={x} x2={x + width} y1={center[1]} y2={center[1]} stroke="#334155" strokeWidth="3" />}

        {/* Direction arrow pointing along the horizontal flight */}
        {isWestGym ? (
          <>
            <line
              x1={x + 16}
              y1={center[1]}
              x2={x + width - 18}
              y2={center[1]}
              stroke="#0284c7"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
            <polygon
              points={`${x + width - 18},${center[1] - 5} ${x + width - 18},${center[1] + 5} ${x + width - 6},${center[1]}`}
              fill="#0284c7"
            />
          </>
        ) : (
          <>
            <line
              x1={x + width - 16}
              y1={center[1]}
              x2={x + 18}
              y2={center[1]}
              stroke="#0284c7"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
            <polygon
              points={`${x + 18},${center[1] - 5} ${x + 18},${center[1] + 5} ${x + 6},${center[1]}`}
              fill="#0284c7"
            />
          </>
        )}

        <g transform={`translate(${center[0]}, ${y + (height > 60 ? height - 12 : center[1])})`}>
          <rect x="-42" y="-8" width="84" height="16" rx="8" fill="#0f172a" opacity="0.88" />
          <text x="0" y="3" textAnchor="middle" fontSize="7.5" fontWeight="800" fill="#38bdf8">
            {room.stairLabel || (room.id.includes('gym') ? '🪜 TO GYM' : '🪜 SOUTH STAIRS')}
          </text>
        </g>
      </g>
    );
  };

  // Dedicated Emergency Exit Hotspot Renderer (prevents overlapping labels)
  const renderExitHotspot = () => {
    const isMainGate = room.id.includes('gate') || (name || '').toUpperCase().includes('GATE');
    const label = isMainGate ? 'MAIN GATE' : 'EXIT';

    let bgFill = '#10b981';
    let borderStroke = '#059669';
    let textFill = '#ffffff';
    let shadowFilter = 'drop-shadow(0 2px 4px rgba(16, 185, 129, 0.25))';

    if (isStart) {
      bgFill = '#ecfdf5';
      borderStroke = '#10b981';
      textFill = '#065f46';
      shadowFilter = 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.5))';
    } else if (isEnd) {
      bgFill = '#fef2f2';
      borderStroke = '#ef4444';
      textFill = '#991b1b';
      shadowFilter = 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.5))';
    } else if (isInPath) {
      bgFill = '#059669';
      borderStroke = '#047857';
      textFill = '#ffffff';
      shadowFilter = 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.5))';
    }

    return (
      <g className="exit-hotspot" pointerEvents="none">
        {renderDoorSwings()}
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={height / 2}
          fill={bgFill}
          stroke={borderStroke}
          strokeWidth={isStart || isEnd ? 3 : 1.5}
          style={{
            filter: shadowFilter,
            transition: 'all 0.2s ease',
          }}
        />
        <text
          x={center[0]}
          y={center[1] + 3.5}
          textAnchor="middle"
          fontSize={width > 100 ? 10 : 8.5}
          fontWeight="800"
          fill={textFill}
          letterSpacing="0.8"
        >
          🏃 {label}
        </text>
      </g>
    );
  };

  // Draw door swings for rooms
  const renderDoorSwings = () => {
    if (!doors || doors.length === 0 || isStair) return null;

    return doors.map((door, idx) => {
      const { x: dx, y: dy, size = 34, arc } = door;

      if (arc === 'east-down') {
        return (
          <g key={idx} className="door-group" pointerEvents="none">
            <line x1={dx} y1={dy - size / 2} x2={dx} y2={dy + size / 2} stroke="#f8fafc" strokeWidth="4" />
            <line x1={dx} y1={dy - size / 2} x2={dx + size * 0.7} y2={dy} stroke="#475569" strokeWidth="2.5" />
            <path
              d={`M ${dx} ${dy + size / 2} A ${size} ${size} 0 0 0 ${dx + size * 0.7} ${dy}`}
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1.2"
              strokeDasharray="2 2"
            />
          </g>
        );
      } else if (arc === 'east-up') {
        return (
          <g key={idx} className="door-group" pointerEvents="none">
            <line x1={dx} y1={dy - size / 2} x2={dx} y2={dy + size / 2} stroke="#f8fafc" strokeWidth="4" />
            <line x1={dx} y1={dy + size / 2} x2={dx + size * 0.7} y2={dy} stroke="#475569" strokeWidth="2.5" />
            <path
              d={`M ${dx} ${dy - size / 2} A ${size} ${size} 0 0 1 ${dx + size * 0.7} ${dy}`}
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1.2"
              strokeDasharray="2 2"
            />
          </g>
        );
      } else if (arc === 'west-down') {
        return (
          <g key={idx} className="door-group" pointerEvents="none">
            <line x1={dx} y1={dy - size / 2} x2={dx} y2={dy + size / 2} stroke="#f8fafc" strokeWidth="4" />
            <line x1={dx} y1={dy - size / 2} x2={dx - size * 0.7} y2={dy} stroke="#475569" strokeWidth="2.5" />
            <path
              d={`M ${dx} ${dy + size / 2} A ${size} ${size} 0 0 1 ${dx - size * 0.7} ${dy}`}
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1.2"
              strokeDasharray="2 2"
            />
          </g>
        );
      } else if (arc === 'west-up') {
        return (
          <g key={idx} className="door-group" pointerEvents="none">
            <line x1={dx} y1={dy - size / 2} x2={dx} y2={dy + size / 2} stroke="#f8fafc" strokeWidth="4" />
            <line x1={dx} y1={dy + size / 2} x2={dx - size * 0.7} y2={dy} stroke="#475569" strokeWidth="2.5" />
            <path
              d={`M ${dx} ${dy - size / 2} A ${size} ${size} 0 0 0 ${dx - size * 0.7} ${dy}`}
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1.2"
              strokeDasharray="2 2"
            />
          </g>
        );
      } else if (arc === 'south-left') {
        return (
          <g key={idx} className="door-group" pointerEvents="none">
            <line x1={dx - size / 2} y1={dy} x2={dx + size / 2} y2={dy} stroke="#f8fafc" strokeWidth="4" />
            <line x1={dx + size / 2} y1={dy} x2={dx} y2={dy + size * 0.7} stroke="#475569" strokeWidth="2.5" />
            <path
              d={`M ${dx - size / 2} ${dy} A ${size} ${size} 0 0 0 ${dx} ${dy + size * 0.7}`}
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1.2"
              strokeDasharray="2 2"
            />
          </g>
        );
      } else if (arc === 'south-right') {
        return (
          <g key={idx} className="door-group" pointerEvents="none">
            <line x1={dx - size / 2} y1={dy} x2={dx + size / 2} y2={dy} stroke="#f8fafc" strokeWidth="4" />
            <line x1={dx - size / 2} y1={dy} x2={dx} y2={dy + size * 0.7} stroke="#475569" strokeWidth="2.5" />
            <path
              d={`M ${dx + size / 2} ${dy} A ${size} ${size} 0 0 1 ${dx} ${dy + size * 0.7}`}
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1.2"
              strokeDasharray="2 2"
            />
          </g>
        );
      } else if (arc === 'north-left') {
        return (
          <g key={idx} className="door-group" pointerEvents="none">
            <line x1={dx - size / 2} y1={dy} x2={dx + size / 2} y2={dy} stroke="#f8fafc" strokeWidth="4" />
            <line x1={dx + size / 2} y1={dy} x2={dx} y2={dy - size * 0.7} stroke="#475569" strokeWidth="2.5" />
            <path
              d={`M ${dx - size / 2} ${dy} A ${size} ${size} 0 0 1 ${dx} ${dy - size * 0.7}`}
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1.2"
              strokeDasharray="2 2"
            />
          </g>
        );
      } else if (arc === 'north-right') {
        return (
          <g key={idx} className="door-group" pointerEvents="none">
            <line x1={dx - size / 2} y1={dy} x2={dx + size / 2} y2={dy} stroke="#f8fafc" strokeWidth="4" />
            <line x1={dx - size / 2} y1={dy} x2={dx} y2={dy - size * 0.7} stroke="#475569" strokeWidth="2.5" />
            <path
              d={`M ${dx + size / 2} ${dy} A ${size} ${size} 0 0 0 ${dx} ${dy - size * 0.7}`}
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1.2"
              strokeDasharray="2 2"
            />
          </g>
        );
      } else if (arc === 'double') {
        return (
          <g key={idx} className="door-group" pointerEvents="none">
            <line x1={dx - size / 2} y1={dy} x2={dx + size / 2} y2={dy} stroke="#ffffff" strokeWidth="6" />
            <line x1={dx - size / 2} y1={dy} x2={dx - size / 4} y2={dy + 20} stroke="#10b981" strokeWidth="3" />
            <line x1={dx + size / 2} y1={dy} x2={dx + size / 4} y2={dy + 20} stroke="#10b981" strokeWidth="3" />
          </g>
        );
      }
      return null;
    });
  };

  const isExitDoor = (category === 'Exit & Stairs' && !isStair && height <= 50) || (room.id.includes('exit') && height <= 50) || (room.id.includes('gate') && height <= 50);

  return (
    <g
      className={`room-hotspot ${isStart ? 'is-start' : ''} ${isEnd ? 'is-end' : ''} ${isStair ? 'is-stair-hotspot' : ''}`}
      onClick={() => onClick(room.id)}
      onMouseEnter={(e) => onHover && onHover(room, e)}
      onMouseLeave={() => onLeave && onLeave()}
      style={{ cursor: 'pointer' }}
    >
      {/* ------------------------------------------------------------------- */}
      {/* If it's a staircase, render the CAD architectural staircase graphic */}
      {/* ------------------------------------------------------------------- */}
      {isStair ? (
        renderArchitecturalStairs()
      ) : isExitDoor ? (
        renderExitHotspot()
      ) : (
        /* ----------------------------------------------------------------- */
        /* Standard Room Renderer (Classrooms, Labs, Offices, Restrooms)      */
        /* ----------------------------------------------------------------- */
        <>
          {/* Room Background Shape */}
          {room.shapePath ? (
            <path d={room.shapePath} fill={fill} stroke={stroke} strokeWidth={strokeWidth}
              style={{ filter, transition: 'all 0.25s ease' }} className="room-shape" />
          ) : room.id === 'main-comlab-1' ? (
            <path
              d="M 1910 460 L 2080 460 L 2080 695 Q 1995 715 1910 670 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
              style={{
                filter,
                transition: 'all 0.25s ease',
              }}
              className="room-shape"
            />
          ) : room.id === 'main-clinic' ? (
            <path
              d="M 2080 460 L 2210 460 L 2210 670 Q 2145 700 2080 695 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
              style={{
                filter,
                transition: 'all 0.25s ease',
              }}
              className="room-shape"
            />
          ) : (
            <rect
              x={x}
              y={y}
              width={width}
              height={height}
              rx="6"
              ry="6"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
              style={{
                filter,
                transition: 'all 0.25s ease',
              }}
              className="room-shape"
            />
          )}

          {/* Decorative top accent strip */}
          <rect
            x={x + 1}
            y={y + 1}
            width={width - 2}
            height={4}
            rx="2"
            fill={accentColor}
            opacity={isStart || isEnd ? 0.95 : 0.4}
            pointerEvents="none"
          />

          {/* East Twin Restroom Architectural Dividers */}
          {room.id === 'mb-faculty-cr-e' && (
            <g pointerEvents="none">
              <rect x={x + 2} y={y + 2} width={width - 4} height={height - 4} fill="url(#tile-hatch)" opacity="0.35" />
              <line x1={center[0]} y1={y} x2={center[0]} y2={y + height} stroke="#475569" strokeWidth="2.5" />
              <line x1={x + width * 0.25} y1={y + 20} x2={x + width * 0.25} y2={y + height - 20} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
              <line x1={x + width * 0.75} y1={y + 20} x2={x + width * 0.75} y2={y + height - 20} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
            </g>
          )}

          {/* West Restroom Architectural Pattern */}
          {room.id === 'mb-faculty-cr-w' && (
            <g pointerEvents="none">
              <rect x={x + 2} y={y + 2} width={width - 4} height={height - 4} fill="url(#tile-hatch)" opacity="0.35" />
              <line x1={x} y1={y + 60} x2={x + width} y2={y + 60} stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="3 3" />
              <line x1={x + 40} y1={y} x2={x + 40} y2={y + 60} stroke="#94a3b8" strokeWidth="1.2" />
              <line x1={x + 80} y1={y} x2={x + 80} y2={y + 60} stroke="#94a3b8" strokeWidth="1.2" />
            </g>
          )}

          {/* Door swings */}
          {renderDoorSwings()}

          {/* Room text and labels (skipped for Gym graphics unless selected to keep court clear) */}
          {room.compactLabel && (
            <text x={center[0]} y={center[1] + 3} textAnchor="middle" fontSize={width < 60 ? 9 : 11}
              textLength={code.length * (width < 60 ? 9 : 11) * 0.65 > labelWidth ? labelWidth : undefined}
              lengthAdjust="spacingAndGlyphs"
              fontWeight="700" fill="#1e293b" pointerEvents="none">{code}</text>
          )}
          {!room.compactLabel && !(category === 'Athletics & Gymnasium' && !isStart && !isEnd) && (
            <>
              {/* Room code pill */}
              <g transform={`translate(${center[0]}, ${center[1] - (height > 130 ? 28 : 16)})`} pointerEvents="none">
                <rect
                  x={-Math.min(code.length * 4.8 + 10, labelWidth / 2)}
                  y="-12"
                  width={Math.min((code.length * 4.8 + 10) * 2, labelWidth)}
                  height="22"
                  rx="11"
                  fill={accentColor}
                  opacity={isStart || isEnd ? 0.95 : 0.15}
                />
                <text
                  x="0"
                  y="3"
                  textAnchor="middle"
                  fontSize="11"
                  textLength={code.length * 7.2 > labelWidth - 12 ? Math.max(12, labelWidth - 12) : undefined}
                  lengthAdjust="spacingAndGlyphs"
                  fontWeight="700"
                  fill={isStart || isEnd ? '#ffffff' : accentColor}
                  letterSpacing="0.5"
                >
                  {code}
                </text>
              </g>

              {/* Lucide Room Icon */}
              {React.createElement(getRoomLucideIcon(icon, category), {
                x: center[0] - (height > 140 ? 11 : 9),
                y: center[1] - (height > 140 ? 14 : 7),
                size: height > 140 ? 22 : 18,
                color: accentColor,
                pointerEvents: 'none',
              })}

              {/* Main room title */}
              <text
                x={center[0]}
                y={center[1] + (height > 140 ? 24 : 18)}
                textAnchor="middle"
                fontSize={titleFontSize}
                fontWeight="700"
                fill="#1e293b"
                pointerEvents="none"
              >
                {titleLines.map((line, index) => (
                  <tspan key={index} x={center[0]} dy={index === 0 ? (titleLines.length > 1 ? '-0.4em' : 0) : '1.2em'}
                    textLength={line.length * titleFontSize * 0.6 > labelWidth ? labelWidth : undefined}
                    lengthAdjust="spacingAndGlyphs">{line}</tspan>
                ))}
              </text>
            </>
          )}

          {/* Badge */}
          {badge && !isStart && !isEnd && (
            <g transform={`translate(${center[0]}, ${y + height - 20})`} pointerEvents="none">
              <rect
                x={-(badge.length * 3.2 + 8)}
                y="-8"
                width={(badge.length * 3.2 + 8) * 2}
                height="16"
                rx="8"
                fill="#dcfce7"
                stroke="#16a34a"
                strokeWidth="1"
              />
              <text
                x="0"
                y="3"
                textAnchor="middle"
                fontSize="8"
                fontWeight="600"
                fill="#15803d"
              >
                ★ {badge}
              </text>
            </g>
          )}
        </>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Start location pin with pulse beacon (Applies to both Rooms & Stairs)*/}
      {/* ------------------------------------------------------------------- */}
      {(isStart || (room.isGuideLocation && !isEnd)) && (
        <g className="room-start-pin" transform={`translate(${pinPosition[0]}, ${pinPosition[1]})`} pointerEvents="none">
          <circle cx="0" cy="0" r="18" fill="rgba(16, 185, 129, 0.25)" className="pulse-beacon" />
          <circle cx="0" cy="0" r="13" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
          <MapPin size={14} color="#ffffff" x={-7} y={-7} />
          <polygon points="-5,8 5,8 0,16" fill="#10b981" />
          <rect x="-44" y="-30" width="88" height="18" rx="9" fill="#1e293b" />
          <text x="0" y="-18" textAnchor="middle" fontSize="9" fontWeight="700" fill="#ffffff">
            YOU ARE HERE
          </text>
        </g>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Destination flag pin (Applies to both Rooms & Stairs)                */}
      {/* ------------------------------------------------------------------- */}
      {isEnd && (
        <g className="room-end-pin" transform={`translate(${pinPosition[0]}, ${pinPosition[1]})`} pointerEvents="none">
          <circle cx="0" cy="0" r="18" fill="rgba(239, 68, 68, 0.25)" className="pulse-beacon" />
          <circle cx="0" cy="0" r="13" fill="#ef4444" stroke="#ffffff" strokeWidth="2.5" />
          <Flag size={14} color="#ffffff" x={-7} y={-7} />
          <polygon points="-5,8 5,8 0,16" fill="#ef4444" />
          <rect x="-46" y="-30" width="92" height="18" rx="9" fill="#1e293b" />
          <text x="0" y="-18" textAnchor="middle" fontSize="9" fontWeight="700" fill="#ffffff">
            DESTINATION
          </text>
        </g>
      )}
    </g>
  );
});
