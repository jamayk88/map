import React from 'react';

export default function FloorSelector({ floors, value, onChange }) {
  return (
    <div className="floor-selector-container">
      <span className="floor-icon">🏢</span>
      <select
        id="floor-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="floor-select-dropdown"
      >
        {floors.map((floor) => (
          <option key={floor.id} value={floor.id}>
            {floor.name}
          </option>
        ))}
      </select>
    </div>
  );
}
