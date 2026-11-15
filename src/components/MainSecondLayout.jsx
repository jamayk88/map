import React from 'react';

export default React.memo(function MainSecondLayout() {
  return (
    <g className="main-2f-group">
      <path d="M 1695 55 H 2495 L 2515 698 H 2420 Q 2195 792 1948 710 L 1910 714 V 762 H 1695 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="7" strokeLinejoin="round" />
      <rect x="1695" y="0" width="820" height="50" rx="4" fill="#0f172a" />
      <text x="2105" y="28" textAnchor="middle" fontSize="13" fontWeight="800" fill="#ffffff" letterSpacing="2">MAIN BUILDING</text>
      <text x="2105" y="44" textAnchor="middle" fontSize="9" fontWeight="600" fill="#94a3b8" letterSpacing="1.5">2ND FLOOR</text>
      <g pointerEvents="none">
        <path d="M 1902 62 H 1947 V 235 H 2380 V 275 H 2308 V 708 Q 2145 750 1946 696 V 550 H 1890 V 235 H 1902 Z" fill="#f8fafc" />
        <path d="M 1922 100 V 260 H 2341 V 710 Q 2200 746 2010 705 L 1922 640 V 300" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="5 5" />
        <text x="2100" y="266" textAnchor="middle" fontSize="10" fontWeight="700" fill="#64748b" letterSpacing="2">HALLWAY</text>
        <text x="1922" y="360" textAnchor="middle" fontSize="10" fontWeight="700" fill="#64748b" letterSpacing="2" transform="rotate(90 1922 360)">HALLWAY</text>
        <text x="2175" y="723" textAnchor="middle" fontSize="10" fontWeight="700" fill="#64748b" letterSpacing="2">HALLWAY</text>
        <rect x="2376" y="376" width="52" height="16" rx="2" fill="#fff1f2" stroke="#fca5a5" />
        <text x="2402" y="387" textAnchor="middle" fontSize="7" fontWeight="600" fill="#dc2626">FIRE HOSE</text>
        <path d="M 2374 472 H 2408 V 524 H 2374 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
      </g>
    </g>
  );
});
