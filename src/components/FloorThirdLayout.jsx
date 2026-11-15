import React from 'react';
import MainThirdLayout from './MainThirdLayout';
import CcjeThirdLayout from './CcjeThirdLayout';

export default React.memo(function FloorThirdLayout() {
  return (
    <g className="third-floor-scene">
      <rect x="915" y="-1100" width="1835" height="1100" fill="#f8fafc" />
      <CcjeThirdLayout />
      <rect x="915" y="0" width="1680" height="1030" fill="#f8fafc" />
      <rect x="955" y="15" width="600" height="955" rx="12" fill="#ffffff" stroke="#1e293b" strokeWidth="8" />
      <rect x="955" y="15" width="600" height="50" rx="4" fill="#0f172a" />
      <text x="1255" y="43" textAnchor="middle" fontSize="13" fontWeight="800" fill="#ffffff" letterSpacing="2">MERCADO BUILDING</text>
      <text x="1255" y="59" textAnchor="middle" fontSize="9" fontWeight="600" fill="#94a3b8" letterSpacing="1.5">3RD FLOOR</text>
      <rect x="1245" y="65" width="85" height="894" fill="#f8fafc" />
      <g pointerEvents="none">
        <rect x="1261" y="68" width="48" height="20" rx="3" fill="#10b981" />
        <text x="1285" y="82" textAnchor="middle" fontSize="10" fontWeight="800" fill="#ffffff">EXIT ↑</text>
        <text x="1285" y="785" textAnchor="middle" fontSize="9" fontWeight="700" fill="#64748b" letterSpacing="1.5" transform="rotate(90 1285 785)">3RD FLOOR CORRIDOR</text>
      </g>
      <MainThirdLayout />
    </g>
  );
});
