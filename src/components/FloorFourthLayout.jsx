import React from 'react';

export default React.memo(function FloorFourthLayout() {
  return <g className="fourth-floor-scene" pointerEvents="none">
    <rect x="1640" y="-20" width="940" height="820" fill="#f8fafc" />
    <rect x="1695" y="55" width="820" height="689" rx="6" fill="#ffffff" stroke="#1e293b" strokeWidth="7" />
    <rect x="1695" y="0" width="820" height="50" rx="4" fill="#0f172a" />
    <text x="2105" y="28" textAnchor="middle" fontSize="13" fontWeight="800" fill="#ffffff" letterSpacing="2">MAIN BUILDING</text>
    <text x="2105" y="44" textAnchor="middle" fontSize="9" fontWeight="600" fill="#94a3b8" letterSpacing="1.5">4TH FLOOR</text>
    <path d="M 1913 56 H 1961 V 237 H 2399 V 278 H 2350 V 700 H 1898 V 580 H 1702 V 550 H 1898 V 237 H 1913 Z" fill="#f1f5f9" />
    <path d="M 1937 85 L 1928 265 H 2349 V 700 H 1928 V 290 M 1771 592 H 1928" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="5 5" />
    <text x="2110" y="270" textAnchor="middle" fontSize="10" fontWeight="700" fill="#64748b" letterSpacing="2">HALLWAY</text>
    <text x="1928" y="430" textAnchor="middle" fontSize="10" fontWeight="700" fill="#64748b" letterSpacing="2" transform="rotate(-90 1928 430)">HALLWAY</text>
    <text x="2135" y="720" textAnchor="middle" fontSize="10" fontWeight="700" fill="#64748b" letterSpacing="2">HALLWAY</text>
    <line x1="1960" y1="739" x2="2310" y2="739" stroke="#38bdf8" strokeWidth="4" />
    <line x1="1960" y1="732" x2="2310" y2="732" stroke="#bae6fd" strokeWidth="2" />
    <text x="2135" y="761" textAnchor="middle" fontSize="9" fontWeight="700" fill="#0284c7" letterSpacing="2">WINDOWS</text>
  </g>;
});
