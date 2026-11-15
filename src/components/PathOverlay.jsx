import React from 'react';
import { getFloorPath } from '../utils/pathOverlay.js';
import { Footprints } from 'lucide-react';

function getSegmentArrow(p1, p2) {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const length = Math.sqrt(dx * dx + dy * dy);
  if (length < 35) return null;

  const midX = (p1[0] + p2[0]) / 2;
  const midY = (p1[1] + p2[1]) / 2;
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

  return { x: midX, y: midY, angle };
}

export default React.memo(function PathOverlay({ path, currentFloor = 'floor-1' }) {
  const { segments, lines, transfers, start, end } = getFloorPath(path, currentFloor);
  if (path.length < 2 || segments.length === 0) return null;

  // Compute arrows for segments on this floor
  const arrows = [];
  lines.forEach((coordinates, segmentIndex) => {
    for (let i = 0; i < coordinates.length - 1; i++) {
      const arrow = getSegmentArrow(coordinates[i], coordinates[i + 1]);
      if (arrow) arrows.push({ ...arrow, key: `${segmentIndex}-${i}` });
    }
  });

  // Detect if start/end are on this floor
  const isStartOnThisFloor = start?.data?.floorId === currentFloor;
  const isEndOnThisFloor = end?.data?.floorId === currentFloor;
  const startPos = start?.data?.position;
  const endPos = end?.data?.position;

  return (
    <g className="path-overlay-layer" pointerEvents="none">
      <defs>
        <filter id="path-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {lines.map((coordinates, segmentIndex) => {
        if (coordinates.length < 2) return null;
        const pointsStr = coordinates.map(([x, y]) => `${x},${y}`).join(' ');
        return (
          <g key={segmentIndex}>
            {/* Outer glow, solid backbone, and animated dashes share the same section. */}
            <polyline
              points={pointsStr}
              fill="none"
              stroke="rgba(16, 185, 129, 0.3)"
              strokeWidth="16"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points={pointsStr}
              fill="none"
              stroke="#10b981"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points={pointsStr}
              fill="none"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="10 10"
              className="flowing-route-line"
            />
          </g>
        );
      })}

      {/* 4. Directional Arrow Badges along path */}
      {arrows.map((arr) => (
        <g
          key={arr.key}
          transform={`translate(${arr.x}, ${arr.y}) rotate(${arr.angle})`}
        >
          <circle cx="0" cy="0" r="10" fill="#059669" stroke="#ffffff" strokeWidth="2" />
          <polygon points="-3,-5 5,0 -3,5" fill="#ffffff" />
        </g>
      ))}

      {/* 5. Waypoint Turn Dots */}
      {lines.flatMap((coordinates, segmentIndex) =>
        coordinates.map((pos, idx) => {
          if (idx === 0 || idx === coordinates.length - 1) return null;
          return (
            <circle
              key={`${segmentIndex}-${idx}`}
              cx={pos[0]}
              cy={pos[1]}
              r="4.5"
              fill="#ffffff"
              stroke="#059669"
              strokeWidth="2.5"
            />
          );
        })
      )}

      {/* 6. Start Point Indicator (if on this floor) */}
      {isStartOnThisFloor && (
        <g>
          <circle cx={startPos[0]} cy={startPos[1]} r="12" fill="rgba(16, 185, 129, 0.4)" className="pulse-beacon" />
          <circle cx={startPos[0]} cy={startPos[1]} r="7" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
        </g>
      )}

      {/* 7. End Point Indicator (if on this floor) */}
      {isEndOnThisFloor && (
        <g>
          <circle cx={endPos[0]} cy={endPos[1]} r="12" fill="rgba(239, 68, 68, 0.4)" className="pulse-beacon" />
          <circle cx={endPos[0]} cy={endPos[1]} r="7" fill="#ef4444" stroke="#ffffff" strokeWidth="2.5" />
        </g>
      )}

      {/* 8. Stair Transition Pin (if path continues to another floor) */}
      {transfers.map((stairNode) => (
        <g key={stairNode.id} transform={`translate(${stairNode.data.position[0]}, ${stairNode.data.position[1] - 30})`}>
          <rect x="-65" y="-12" width="130" height="24" rx="12" fill="#0284c7" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))" />
          <Footprints size={13} color="#ffffff" x={-52} y={-6.5} />
          <text x="6" y="4" textAnchor="middle" fontSize="9" fontWeight="800" fill="#ffffff" letterSpacing="0.5">
            STAIRS TRANSFER
          </text>
        </g>
      ))}
    </g>
  );
});
