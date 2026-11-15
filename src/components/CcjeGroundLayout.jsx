import React from 'react';
import { ccjeBounds } from '../data/ccjeGroundFloor.js';

export default React.memo(function CcjeGroundLayout() {
  return <g className="ccje-ground-scene" pointerEvents="none">
    <g transform={`translate(${ccjeBounds.x}, ${ccjeBounds.y})`}>
      <rect width={ccjeBounds.width} height={ccjeBounds.height} rx="12" fill="#ffffff" stroke="#1e293b" strokeWidth="8" />
      <rect width="850" height="50" rx="4" fill="#0f172a" />
      <text x="425" y="30" textAnchor="middle" fontSize="13" fontWeight="800" fill="#ffffff" letterSpacing="2">CCJE BUILDING</text>
      <text x="425" y="46" textAnchor="middle" fontSize="9" fontWeight="600" fill="#94a3b8" letterSpacing="1.5">GROUND FLOOR</text>
      <rect x="325" y="55" width="160" height="790" fill="#f1f5f9" />
      <line x1="485" y1="50" x2="485" y2="855" stroke="#1e293b" strokeWidth="4" />
      <line x1="360" y1="175" x2="360" y2="710" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />
      <text x="385" y="430" textAnchor="middle" fontSize="10" fontWeight="700" fill="#64748b" letterSpacing="2" transform="rotate(-90 385 430)">HALLWAY</text>
      {[330, 495, 730].map((x, i) => <g key={x}>
        <line x1={x} y1="855" x2={x + (i === 0 ? 65 : 110)} y2="855" stroke="#ffffff" strokeWidth="10" />
        <line x1={x} y1="855" x2={x + (i === 0 ? 65 : 110)} y2="855" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
      </g>)}
    </g>

    {/* Highway separates CCJE from the existing campus buildings. */}
    <rect x="0" y="-225" width="2750" height="30" fill="url(#connector-pavers)" stroke="#cbd5e1" />
    <rect x="0" y="-195" width="2750" height="130" fill="#ffffff" stroke="#1e293b" strokeWidth="3" />
    <rect x="0" y="-65" width="2750" height="30" fill="url(#connector-pavers)" stroke="#cbd5e1" />
    {[-188, -72].map(y => <line key={y} x1="0" x2="2750" y1={y} y2={y} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="6 4" />)}
    {[-132, -128].map(y => <line key={y} x1="0" x2="2750" y1={y} y2={y} stroke="#eab308" strokeWidth="2.5" strokeDasharray="16 12" />)}
    <text x="1180" y="-214" textAnchor="middle" fontSize="10" fontWeight="700" letterSpacing="2" fill="#64748b">TWO-WAY HIGHWAY</text>
    {[700, 2250].map(x => <g key={x} stroke="#64748b" strokeWidth="3" fill="none">
      <path d={`M ${x + 65} -163 h -65 l 12 -7 m -12 7 l 12 7`} />
      <path d={`M ${x} -98 h 65 l -12 -7 m 12 7 l -12 7`} />
    </g>)}
    <rect x="1685" y="-195" width="50" height="130" fill="#f1f5f9" />
    {Array.from({ length: 9 }, (_, i) => <rect key={i} x="1687" y={-191 + i * 14} width="46" height="7" fill="#64748b" />)}
    <path d="M 2140 -205 H 1710 M 1710 -40 H 1640 V 870 H 1792" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5 5" />
  </g>;
});
