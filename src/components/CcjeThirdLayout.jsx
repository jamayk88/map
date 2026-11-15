import React from 'react';
import { ccjeBounds } from '../data/ccjeGroundFloor.js';

export default React.memo(function CcjeThirdLayout() {
  return <g className="ccje-third-floor-scene" pointerEvents="none" transform={`translate(${ccjeBounds.x}, ${ccjeBounds.y})`}>
    <rect width="850" height="855" rx="12" fill="#ffffff" stroke="#1e293b" strokeWidth="8" />
    <rect x="325" y="50" width="160" height="795" fill="#f1f5f9" />
    <rect x="485" y="265" width="355" height="70" fill="#f1f5f9" />
    <rect width="850" height="50" rx="4" fill="#0f172a" />
    <text x="425" y="30" textAnchor="middle" fontSize="13" fontWeight="800" fill="#ffffff" letterSpacing="2">CCJE BUILDING</text>
    <text x="425" y="46" textAnchor="middle" fontSize="9" fontWeight="600" fill="#94a3b8" letterSpacing="1.5">3RD FLOOR</text>
    <path d="M 360 70 V 830 M 485 70 V 830 M 360 225 H 485 M 360 300 H 830" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
    <text x="390" y="440" textAnchor="middle" fontSize="11" fontWeight="700" fill="#64748b" letterSpacing="2" transform="rotate(-90 390 440)">HALLWAY</text>
    <text x="665" y="290" textAnchor="middle" fontSize="9" fontWeight="700" fill="#64748b" letterSpacing="1.5">HALLWAY</text>
  </g>;
});
