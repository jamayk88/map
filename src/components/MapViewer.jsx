import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { floors } from '../data/floors';
import { rooms, floorMarkers } from '../data/rooms';
import RoomHotspot from './RoomHotspot';
import PathOverlay from './PathOverlay';
import FloorGroundLayout from './FloorGroundLayout';
import FloorSecondLayout from './FloorSecondLayout';
import FloorThirdLayout from './FloorThirdLayout';
import FloorFourthLayout from './FloorFourthLayout';
import {
  Building2,
  Sparkles,
  Siren,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Footprints,
  Flame,
  MapPin,
  Flag,
  Bell,
  Users,
} from 'lucide-react';
import { getRoomLucideIcon } from './icons';
import { apiRoomMappings } from '../data/apiRoomMappings.js';
import RoomApiInfo from './RoomApiInfo';
import { getNodePosition } from '../utils/routePosition.js';

const roomMap = new Map(rooms.map((r) => [r.id, r]));
const apiMappedRoomIds = new Set(Object.values(apiRoomMappings));

export default function MapViewer({
  currentFloor,
  onChangeFloor,
  onRoomClick,
  path,
  startRoom,
  endRoom,
  selectionMode,
  hasFloorTransition,
  floorsInPath,
  onQuickEvacuate,
  roomInfo,
  roomFocus,
}) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredRoom, setHoveredRoom] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const containerRef = useRef(null);
  const rafPanRef = useRef(null);

  const activeFloorObj = floors.find((f) => f.id === currentFloor) || floors[0];

  // Auto-switch floor when a user selects a room on a different floor
  useEffect(() => {
    const targetRoomId = selectionMode === 'start' ? startRoom : endRoom;
    if (!targetRoomId) return;

    const r = roomMap.get(targetRoomId);
    if (r && r.floorId !== currentFloor) {
      onChangeFloor(r.floorId);
    }
  }, [startRoom, endRoom, selectionMode, onChangeFloor]);

  // Reset zoom & pan when switching floor
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [currentFloor]);

  useEffect(() => {
    if (!roomFocus) return;
    setActiveCategory('All');
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setHoveredRoom(null);
  }, [roomFocus]);

  // Wheel & Touchpad Zoom / Scroll Pan Handler (non-passive to allow preventDefault)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      // Don't intercept if scrolling inside a popup/dropdown or category chips
      if (e.target.closest('.room-hover-card') || e.target.closest('.category-chips')) {
        return;
      }

      e.preventDefault();

      // Case 1: Touchpad Pinch or Ctrl + Mouse Wheel (Zoom)
      if (e.ctrlKey || e.metaKey) {
        const rect = container.getBoundingClientRect();
        // Mouse coordinate relative to the center of the viewport
        const mouseX = e.clientX - (rect.left + rect.width / 2);
        const mouseY = e.clientY - (rect.top + rect.height / 2);

        // Smooth zoom factor based on deltaY (handles touchpad pinch and ctrl+wheel)
        const zoomFactor = Math.exp(-e.deltaY * 0.005);

        setZoom((prevZoom) => {
          const nextZoom = Math.min(Math.max(prevZoom * zoomFactor, 0.35), 4.5);
          const actualFactor = nextZoom / prevZoom;

          // Adjust pan to zoom smoothly toward cursor position
          setPan((prevPan) => ({
            x: mouseX - (mouseX - prevPan.x) * actualFactor,
            y: mouseY - (mouseY - prevPan.y) * actualFactor,
          }));

          return nextZoom;
        });
      } else {
        // Case 2: Regular scrolling / 2-finger touchpad swipe (Pan)
        const deltaX = e.shiftKey ? e.deltaY : e.deltaX;
        const deltaY = e.shiftKey ? 0 : e.deltaY;

        setPan((prevPan) => ({
          x: prevPan.x - deltaX,
          y: prevPan.y - deltaY,
        }));
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Filter rooms by floor and category
  const floorRooms = useMemo(() => rooms.filter((r) => r.floorId === currentFloor), [currentFloor]);
  const filteredRooms = useMemo(
    () => (activeCategory === 'All' ? floorRooms : floorRooms.filter((r) => r.category === activeCategory)),
    [floorRooms, activeCategory]
  );

  const activeFloorMarkers = useMemo(
    () => floorMarkers.filter((m) => m.floorId === currentFloor),
    [currentFloor]
  );

  const pathSet = useMemo(() => new Set(path), [path]);

  const handleRoomHover = useCallback((r) => setHoveredRoom(r), []);
  const handleRoomLeave = useCallback(() => setHoveredRoom(null), []);

  // Zoom handlers
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 4.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.35));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Mouse Pan handlers
  const handleMouseDown = (e) => {
    if (e.target.closest('.room-hotspot') || e.target.closest('.map-toolbar')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const nextX = e.clientX - dragStart.x;
    const nextY = e.clientY - dragStart.y;

    if (rafPanRef.current) cancelAnimationFrame(rafPanRef.current);
    rafPanRef.current = requestAnimationFrame(() => {
      setPan({ x: nextX, y: nextY });
    });
  };

  const handleMouseUp = () => {
    if (rafPanRef.current) {
      cancelAnimationFrame(rafPanRef.current);
      rafPanRef.current = null;
    }
    setIsDragging(false);
  };

  // Touch handlers for mobile & touchscreen devices (Pinch-to-zoom & Touch Pan)
  const touchStateRef = useRef({
    initialDistance: null,
    initialZoom: 1,
    initialPan: { x: 0, y: 0 },
    lastTouch: null,
  });

  const handleTouchStart = (e) => {
    if (e.target.closest('.room-hotspot') || e.target.closest('.map-toolbar')) return;

    if (e.touches.length === 1) {
      touchStateRef.current.lastTouch = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    } else if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const distance = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);

      touchStateRef.current = {
        initialDistance: distance,
        initialZoom: zoom,
        initialPan: { ...pan },
        lastTouch: null,
      };
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1 && touchStateRef.current.lastTouch) {
      const dx = e.touches[0].clientX - touchStateRef.current.lastTouch.x;
      const dy = e.touches[0].clientY - touchStateRef.current.lastTouch.y;
      touchStateRef.current.lastTouch = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
      setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    } else if (e.touches.length === 2 && touchStateRef.current.initialDistance) {
      if (e.cancelable) e.preventDefault();
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const currentDistance = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const scale = currentDistance / touchStateRef.current.initialDistance;

      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const midX = (t1.clientX + t2.clientX) / 2 - (rect.left + rect.width / 2);
        const midY = (t1.clientY + t2.clientY) / 2 - (rect.top + rect.height / 2);

        const newZoom = Math.min(Math.max(touchStateRef.current.initialZoom * scale, 0.35), 4.5);
        const actualFactor = newZoom / touchStateRef.current.initialZoom;

        setZoom(newZoom);
        setPan({
          x: midX - (midX - touchStateRef.current.initialPan.x) * actualFactor,
          y: midY - (midY - touchStateRef.current.initialPan.y) * actualFactor,
        });
      }
    }
  };

  const handleTouchEnd = () => {
    touchStateRef.current.initialDistance = null;
    touchStateRef.current.lastTouch = null;
  };

  const categories = [
    'All',
    'Classroom',
    'Laboratory',
    'Library & Study',
    'Administrative Office',
    'Facility',
    'Exit & Stairs',
  ];

  return (
    <div
      className="map-viewer-wrapper"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      style={{ cursor: isDragging ? 'grabbing' : 'default' }}
    >
      {/* Top Map Toolbar */}
      <div className="map-toolbar">
        {/* Floor Switcher Tabs */}
        <div className="building-tabs">
          {floors.map((f) => (
            <button
              key={f.id}
              className={`building-tab-btn ${currentFloor === f.id ? 'active' : ''}`}
              onClick={() => onChangeFloor(f.id)}
            >
              <Building2 size={13} style={{ marginRight: 5, verticalAlign: 'text-bottom' }} />
              {f.shortName}
            </button>
          ))}
        </div>

        {/* Category Filter Chips */}
        <div className="category-chips">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`chip-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat === 'All' ? (
                <>
                  <Sparkles size={12} style={{ marginRight: 4, verticalAlign: 'text-bottom' }} /> All Spaces
                </>
              ) : (
                cat
              )}
            </button>
          ))}
        </div>

        {/* Actions & Zoom */}
        <div className="map-actions">
          <button
            className="evac-btn"
            onClick={onQuickEvacuate}
            title="Calculate fastest route to nearest emergency exit"
          >
            <Siren size={15} style={{ marginRight: 5, verticalAlign: 'text-bottom' }} />
            Emergency Exit
          </button>

          <div className="zoom-controls">
            <button onClick={handleZoomIn} title="Zoom In">
              <ZoomIn size={15} />
            </button>
            <span className="zoom-level">{Math.round(zoom * 100)}%</span>
            <button onClick={handleZoomOut} title="Zoom Out">
              <ZoomOut size={15} />
            </button>
            <button onClick={handleResetView} title="Reset View">
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Floor Route Notification Bar */}
      {hasFloorTransition && (
        <div className="floor-transition-notice">
          <span className="notice-icon">
            <Footprints size={18} color="#0284c7" />
          </span>
          <span className="notice-text">
            <strong>Multi-Floor Route:</strong> This path transitions between floors via the stairs.
          </span>
          <div className="notice-buttons">
            {floors.filter(f => floorsInPath.includes(f.id)).map(f => (
              <button key={f.id}
                className={`notice-floor-btn ${currentFloor === f.id ? 'active' : ''}`}
                onClick={() => onChangeFloor(f.id)}>
                View {f.shortName}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SVG Canvas Container */}
      <div className="map-canvas-container">
        <svg
          viewBox={activeFloorObj.viewBox}
          className={`school-svg-map ${currentFloor === 'floor-3' ? 'third-floor-map' : ''}`}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          }}
        >
          <defs>
            <pattern id="campus-grid" width="25" height="25" patternUnits="userSpaceOnUse">
              <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
            </pattern>
            <pattern id="connector-pavers" width="16" height="16" patternUnits="userSpaceOnUse">
              <rect width="16" height="16" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="0.5" />
            </pattern>
            <pattern id="hazard-stripes" width="20" height="20" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
              <rect width="10" height="20" fill="#fef08a" />
              <rect x="10" width="10" height="20" fill="#1e293b" />
            </pattern>
            <pattern id="tile-hatch" width="8" height="8" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="8" stroke="#cbd5e1" strokeWidth="0.8" />
              <line x1="0" y1="0" x2="8" y2="0" stroke="#cbd5e1" strokeWidth="0.8" />
            </pattern>
          </defs>

          {/* ================================================================= */}
          {/* FLOOR 1: GROUND FLOOR (Hernandez + Mercado + Main Building)     */}
          {/* ================================================================= */}
          {currentFloor === 'floor-1' && <FloorGroundLayout />}

          {/* ================================================================= */}
          {/* FLOOR 2: SECOND FLOOR (Hernandez Gym + Mercado 2F)                */}
          {/* ================================================================= */}
          {currentFloor === 'floor-2' && <FloorSecondLayout />}
          {currentFloor === 'floor-3' && <FloorThirdLayout />}
          {currentFloor === 'floor-4' && <FloorFourthLayout />}

          {/* Room Hotspots for Active Floor */}
          {filteredRooms.map((room) => (
            <RoomHotspot
              key={room.id}
              room={room}
              isStart={room.id === startRoom}
              isEnd={room.id === endRoom}
              routePosition={room.id === startRoom ? getNodePosition(room.id, path[1])
                : room.id === endRoom ? getNodePosition(room.id, path.at(-2)) : undefined}
              isInPath={pathSet.has(room.id)}
              onClick={onRoomClick}
              onHover={handleRoomHover}
              onLeave={handleRoomLeave}
            />
          ))}

          {/* Safety Fixtures for Active Floor */}
          {activeFloorMarkers.map((marker) => (
            <g
              key={marker.id}
              transform={`translate(${marker.x}, ${marker.y})`}
              className="safety-marker"
              pointerEvents="none"
            >
              <circle cx="0" cy="0" r="10" fill="#fee2e2" stroke="#ef4444" strokeWidth="1.5" />
              {marker.icon === '🚨' ? (
                <Bell size={12} color="#dc2626" x={-6} y={-6} />
              ) : marker.icon === '👥' ? (
                <Users size={12} color="#16a34a" x={-6} y={-6} />
              ) : (
                <Flame size={12} color="#dc2626" x={-6} y={-6} />
              )}
            </g>
          ))}

          {/* Navigation Path Overlay for Active Floor */}
          {path.length > 1 && (
            <PathOverlay path={path} currentFloor={currentFloor} />
          )}
        </svg>
      </div>

      {/* Floating Room Hover Card */}
      {hoveredRoom && (
        <div className="room-hover-card">
          <div className="hover-header">
            <span className="hover-icon">
              {React.createElement(getRoomLucideIcon(hoveredRoom.icon, hoveredRoom.category), {
                size: 22,
                color: hoveredRoom.accentColor,
              })}
            </span>
            <div>
              <h4 className="hover-title">{hoveredRoom.name}</h4>
              <span className="hover-badge" style={{ backgroundColor: hoveredRoom.accentColor + '20', color: hoveredRoom.accentColor }}>
                {floors.find(f => f.id === hoveredRoom.floorId)?.shortName} • {hoveredRoom.category}
              </span>
            </div>
          </div>
          <p className="hover-desc">{hoveredRoom.description}</p>
          {roomInfo && apiMappedRoomIds.has(hoveredRoom.id) && <RoomApiInfo status={roomInfo.status} records={roomInfo.byMapRoom[hoveredRoom.id]} />}
          <div className="hover-actions">
            <button
              className="quick-btn start"
              onClick={() => onRoomClick(hoveredRoom.id, 'start')}
            >
              <MapPin size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'text-bottom' }} />
              Set as Starting Point
            </button>
            <button
              className="quick-btn end"
              onClick={() => onRoomClick(hoveredRoom.id, 'end')}
            >
              <Flag size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'text-bottom' }} />
              Set as Destination
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
