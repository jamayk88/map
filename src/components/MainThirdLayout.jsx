import React from 'react';

export default React.memo(function MainThirdLayout() {
  return (
    <g className="main-3f-group">
      <path d="M 1695 55 H 2515 V 697 H 2420 Q 2200 773 1970 697 L 1919 706 V 744 H 1705 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="7" strokeLinejoin="round" />
      <rect x="1695" y="0" width="820" height="50" rx="4" fill="#0f172a" />
      <text x="2105" y="28" textAnchor="middle" fontSize="13" fontWeight="800" fill="#ffffff" letterSpacing="2">MAIN BUILDING</text>
      <text x="2105" y="44" textAnchor="middle" fontSize="9" fontWeight="600" fill="#94a3b8" letterSpacing="1.5">3RD FLOOR</text>
      <g pointerEvents="none">
        <path d="M 1913 56 H 1961 V 237 H 2399 V 278 H 2318 V 700 Q 2185 755 1960 679 V 550 H 1898 V 237 H 1913 Z" fill="#f8fafc" />
        <path d="M 1937 85 L 1928 265 H 2349 V 703 Q 2195 755 2006 694 L 1928 635 V 290" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="5 5" />
        <text x="2100" y="269" textAnchor="middle" fontSize="10" fontWeight="700" fill="#64748b" letterSpacing="2">HALLWAY</text>
        <text x="1932" y="390" textAnchor="middle" fontSize="10" fontWeight="700" fill="#64748b" letterSpacing="2" transform="rotate(90 1932 390)">HALLWAY</text>
        <text x="2175" y="723" textAnchor="middle" fontSize="10" fontWeight="700" fill="#64748b" letterSpacing="2">HALLWAY</text>
        <rect x="2405" y="388" width="52" height="16" rx="2" fill="#fff1f2" stroke="#fca5a5" />
        <text x="2431" y="399" textAnchor="middle" fontSize="7" fontWeight="600" fill="#dc2626">FIRE HOSE</text>
        <path d="M 2377 482 H 2409 V 534 H 2377 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
      </g>
    </g>
  );
});
