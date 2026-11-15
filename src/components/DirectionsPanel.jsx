import React, { useState } from 'react';
import { floors } from '../data/floors';
import {
  Compass,
  Copy,
  Check,
  X,
  Footprints,
  Route,
  MapPin,
  Flag,
  ArrowUpDown,
  Clock,
  Siren,
  CheckCircle2,
  CornerUpRight,
  CornerUpLeft,
  ArrowDown,
  ArrowUp,
  DoorOpen,
  Navigation,
} from 'lucide-react';

function renderStepLucideIcon(step) {
  const text = (step.instruction || '').toLowerCase();
  if (step.turnType === 'stairs' || step.isFloorTransition || text.includes('stair') || text.includes('steps')) {
    return <Footprints size={15} />;
  }
  if (step.turnType === 'exit' || text.includes('exit')) {
    return <DoorOpen size={15} />;
  }
  if (step.turnType === 'arrive' || text.includes('arrive') || text.includes('enter')) {
    return <CheckCircle2 size={15} />;
  }
  if (step.turnType === 'right' || text.includes('right')) {
    return <CornerUpRight size={15} />;
  }
  if (step.turnType === 'left' || text.includes('left')) {
    return <CornerUpLeft size={15} />;
  }
  if (step.turnType === 'straight' || text.includes('straight')) {
    return <ArrowUp size={15} />;
  }
  return <Navigation size={15} />;
}

export default React.memo(function DirectionsPanel({
  directions,
  steps = [],
  startName,
  endName,
  startBuilding,
  endBuilding,
  hasFloorTransition,
  floorsInPath,
  distanceMeters,
  estimatedSeconds,
  onReset,
  onSwap,
  activeStepIndex,
  onSelectStep,
  onChangeFloor,
  onQuickEvacuate,
}) {
  const [copied, setCopied] = useState(false);

  const isCrossBuilding = startBuilding && endBuilding && startBuilding !== endBuilding;

  const handleCopy = () => {
    const text = [
      `Route from ${startName || 'Origin'} to ${endName || 'Destination'}:`,
      isCrossBuilding ? `Cross-Building Route (${startBuilding} ➔ ${endBuilding})` : '',
      hasFloorTransition ? `Multi-Floor Route (${floorsInPath.join(' ➔ ')})` : '',
      `Estimated distance: ~${distanceMeters}m (${estimatedSeconds}s walk)`,
      '',
      ...directions.map((d, i) => `${i + 1}. ${d}`),
    ]
      .filter(Boolean)
      .join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside className="directions-panel">
      {/* Header */}
      <div className="directions-header">
        <div className="header-title-row">
          <span className="directions-title-icon">
            <Compass size={18} color="#0284c7" />
          </span>
          <h2>Directions</h2>
        </div>

        <div className="header-actions">
          <button
            className="panel-tool-btn"
            onClick={handleCopy}
            title="Copy directions to clipboard"
          >
            {copied ? (
              <>
                <Check size={13} style={{ marginRight: 4 }} /> Copied
              </>
            ) : (
              <>
                <Copy size={13} style={{ marginRight: 4 }} /> Copy
              </>
            )}
          </button>
          <button
            className="panel-tool-btn reset"
            onClick={onReset}
            title="Reset route"
          >
            <X size={13} style={{ marginRight: 3 }} /> Clear
          </button>
        </div>
      </div>

      {/* Multi-Floor Journey Banner */}
      {hasFloorTransition && (
        <div className="multi-floor-banner">
          <span className="banner-icon">
            <Footprints size={20} color="#0284c7" />
          </span>
          <div>
            <h4 className="banner-title">Multi-Floor Journey</h4>
            <p className="banner-desc">
              Take the stairs between {floorsInPath.map(id => floors.find(f => f.id === id)?.shortName).join(' → ')}
            </p>
          </div>
        </div>
      )}

      {/* Cross-Building Alert Banner */}
      {isCrossBuilding && (
        <div className="inter-building-banner">
          <span className="banner-icon">
            <Route size={20} color="#0ea5e9" />
          </span>
          <div>
            <h4 className="banner-title">Inter-Building Route</h4>
            <p className="banner-desc">
              {startBuilding === 'ccje' ? 'CCJE Building' : startBuilding === 'hernandez' ? 'Hernandez Building' : startBuilding === 'main' ? 'Main Building' : 'Mercado Building'}
              {' ➔ '}
              {endBuilding === 'ccje' ? 'CCJE Building' : endBuilding === 'hernandez' ? 'Hernandez Building' : endBuilding === 'main' ? 'Main Building' : 'Mercado Building'}
            </p>
          </div>
        </div>
      )}

      {/* Compact Route Summary */}
      <div className="route-summary-row">
        <MapPin size={13} color="#10b981" className="summary-icon" />
        <span className="summary-name">{startName || '—'}</span>
        <ArrowUpDown size={12} color="#94a3b8" style={{ flexShrink: 0, cursor: 'pointer' }} onClick={onSwap} title="Swap" />
        <Flag size={13} color="#ef4444" className="summary-icon" />
        <span className="summary-name">{endName || '—'}</span>
      </div>

      {/* Metrics Banner */}
      <div className="route-metrics-bar">
        <div className="metric-item">
          <span className="metric-icon">
            <Route size={18} color="#0284c7" />
          </span>
          <div>
            <span className="metric-value">~{distanceMeters} meters</span>
            <span className="metric-label">Estimated Distance</span>
          </div>
        </div>
        <div className="metric-divider"></div>
        <div className="metric-item">
          <span className="metric-icon">
            <Clock size={18} color="#0284c7" />
          </span>
          <div>
            <span className="metric-value">
              {estimatedSeconds < 60
                ? `${estimatedSeconds} sec`
                : `${Math.ceil(estimatedSeconds / 60)} min`}
            </span>
            <span className="metric-label">Walking Time</span>
          </div>
        </div>
      </div>

      {/* Step by Step List */}
      <div className="steps-container">
        <div className="steps-header">
          <span className="steps-count-badge">
            {steps.length} {steps.length === 1 ? 'Step' : 'Steps'}
          </span>
          <span className="steps-hint">Click any step to focus on its floor</span>
        </div>

        <ol className="directions-list">
          {steps.map((step, idx) => {
            const isActive = activeStepIndex === idx;
            const isStair = step.isFloorTransition;

            return (
              <li
                key={idx}
                className={`direction-step ${isActive ? 'active-step' : ''} ${isStair ? 'stair-transition-step' : ''}`}
                onClick={() => {
                  if (onSelectStep) onSelectStep(idx);
                  if (onChangeFloor && step.floorId) onChangeFloor(step.floorId);
                }}
              >
                <div className="step-badge">
                  <span className="step-num">{step.index}</span>
                  <span className="step-action-icon">{renderStepLucideIcon(step)}</span>
                </div>
                <div className="step-content">
                  <p className="step-text">{step.instruction}</p>
                  {isStair && (
                    <span className="stair-floor-tag">
                      <Footprints size={12} style={{ display: 'inline', marginRight: 4 }} />
                      Vertical Floor Transfer
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Panel Footer Quick Actions */}
      <div className="directions-footer">
        <button
          className="evacuation-quick-btn"
          onClick={onQuickEvacuate}
        >
          <Siren size={16} style={{ display: 'inline', marginRight: 6, verticalAlign: 'text-bottom' }} />
          Find Nearest Emergency Exit
        </button>
      </div>
    </aside>
  );
});
