import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { usePathfinding } from '../hooks/usePathfinding';
import { useRoomInfo } from '../hooks/useRoomInfo';
import { rooms } from '../data/rooms';
import { readRouteUrl, writeRouteUrl, getRouteView } from '../utils/routeUrl.js';
import MapViewer from './MapViewer';
import SearchableSelect from './SearchableSelect';
import InstructorSearch from './InstructorSearch';
import DirectionsPanel from './DirectionsPanel';
import LoginPopup from './LoginPopup';
import { ScheduleDialog } from './StudentSchedule';
import {
  MapPin,
  Flag,
  Building2,
  ArrowUpDown,
  X,
  Layers,
  CalendarDays,
} from 'lucide-react';

const roomMap = new Map(rooms.map((r) => [r.id, r]));
const roomGroups = [
  ['main', 'floor-1', 'Main Building · Ground Floor'],
  ['main', 'floor-2', 'Main Building · 2nd Floor'],
  ['main', 'floor-3', 'Main Building · 3rd Floor'],
  ['main', 'floor-4', 'Main Building · 4th Floor'],
  ['ccje', 'floor-1', 'CCJE Building · Ground Floor'],
  ['ccje', 'floor-2', 'CCJE Building · 2nd Floor'],
  ['ccje', 'floor-3', 'CCJE Building · 3rd Floor'],
  ['hernandez', 'floor-1', 'Hernandez · Ground Floor'],
  ['hernandez', 'floor-2', 'Hernandez · 2nd Floor (Gym)'],
  ['mercado', 'floor-1', 'Mercado · Ground Floor'],
  ['mercado', 'floor-2', 'Mercado · 2nd Floor'],
  ['mercado', 'floor-3', 'Mercado · 3rd Floor'],
].map(([buildingId, floorId, label]) => ({
  label,
  options: rooms.filter(room => room.buildingId === buildingId && room.floorId === floorId)
    .map(room => ({ value: room.id, label: room.name, code: room.code })),
}));

export default function App() {
  const [accessRole, setAccessRole] = useState(null);
  const roomInfo = useRoomInfo(Boolean(accessRole));
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [student, setStudent] = useState(null);
  const [roomFocus, setRoomFocus] = useState(null);
  const [initialRoute] = useState(() => readRouteUrl(window.location.href));
  const [currentFloor, setCurrentFloor] = useState(() => getRouteView(initialRoute).currentFloor);
  const [selectionMode, setSelectionMode] = useState(() => getRouteView(initialRoute).selectionMode);

  const {
    startRoom,
    setStartRoom,
    endRoom,
    setEndRoom,
    setRooms,
    path,
    directions,
    steps,
    floorsInPath,
    hasFloorTransition,
    totalCost,
    distanceMeters,
    estimatedSeconds,
    activeStepIndex,
    setActiveStepIndex,
    swapRooms,
    routeToNearestExit,
    reset,
  } = usePathfinding(initialRoute);

  useEffect(() => {
    const restoreRoute = () => {
      const route = readRouteUrl(window.location.href);
      const view = getRouteView(route);
      setRooms(route);
      setCurrentFloor(view.currentFloor);
      setSelectionMode(view.selectionMode);
    };
    window.addEventListener('popstate', restoreRoute);
    return () => window.removeEventListener('popstate', restoreRoute);
  }, [setRooms]);

  useEffect(() => {
    const nextUrl = writeRouteUrl(window.location.href, { startRoom });
    if (nextUrl !== window.location.href) {
      window.history.replaceState(window.history.state, '', nextUrl);
    }
  }, [startRoom]);

  const startRoomData = useMemo(() => roomMap.get(startRoom) || null, [startRoom]);
  const endRoomData = useMemo(() => roomMap.get(endRoom) || null, [endRoom]);

  const destinationGroups = useMemo(() => roomGroups.map(group => ({
    ...group,
    options: group.options.filter(option => option.value !== startRoom),
  })), [startRoom]);

  // Ref to hold latest state for callbacks, keeping function identities permanently stable
  const stateRef = useRef({ selectionMode, startRoom, endRoom, currentFloor });
  stateRef.current = { selectionMode, startRoom, endRoom, currentFloor };

  // Click on room on the SVG map (permanently stable callback reference)
  const handleRoomClick = useCallback((roomId, forceMode = null) => {
    const { selectionMode: curMode, startRoom: curStart, endRoom: curEnd } = stateRef.current;
    const mode = forceMode || curMode;

    if (mode === 'start') {
      setStartRoom(roomId);
      if (!curEnd) {
        setSelectionMode('end');
      }
    } else {
      if (roomId === curStart) return;
      setEndRoom(roomId);
    }
  }, [setStartRoom, setEndRoom]);

  const handleReset = useCallback(() => {
    reset();
    setSelectionMode('start');
  }, [reset]);

  const handleInstructorRoom = useCallback((roomId) => {
    const room = roomMap.get(roomId);
    if (!room) return;
    const origin = stateRef.current.startRoom;
    if (origin !== roomId) setEndRoom(roomId);
    setSelectionMode(origin === roomId ? 'start' : 'end');
    setCurrentFloor(room.floorId);
    setRoomFocus({ roomId });
  }, [setEndRoom]);

  const handleQuickEvacuate = useCallback(() => {
    const { startRoom: curStart, currentFloor: curFloor } = stateRef.current;
    const origin = curStart || (curFloor === 'floor-4' ? 'main4-401' : curFloor === 'floor-3' ? 'mb3-303' : curFloor === 'floor-2' ? 'gym-court' : 'cqa');
    if (!curStart) setStartRoom(origin);
    routeToNearestExit(origin);
  }, [setStartRoom, routeToNearestExit]);


  return (
    <div className="app-container" data-access-role={accessRole || undefined}>
      {!accessRole && <LoginPopup onSelect={(role, loginData) => {
        setAccessRole(role);
        if (role === 'student') {
          setStudent(loginData?.student ?? null);
          setScheduleOpen(true);
          setStudentName(typeof loginData?.student?.name === 'string' ? loginData.student.name : '');
        }
      }} />}
      {accessRole === 'student' && scheduleOpen && <ScheduleDialog student={student} studentName={studentName} onClose={() => setScheduleOpen(false)} />}
      {/* Combined Search + Floor Control Bar */}
      <section className="search-control-bar">
        <div className="selection-workflow">
          {roomInfo.status === 'error' && <button className="schedule-control" type="button" onClick={roomInfo.retry} title={roomInfo.message}>Retry room info</button>}
          {/* Origin Selector */}
          <div className={`selector-field ${selectionMode === 'start' ? 'active-field' : ''}`}>
            <span className="field-icon start-dot">
              <MapPin size={16} color="#10b981" />
            </span>
            <div className="field-input-group">
              <label className="field-label" htmlFor="start-room-select">FROM</label>
              <SearchableSelect
                id="start-room-select"
                label="Starting point"
                groups={roomGroups}
                placeholder="Select starting point…"
                value={startRoom || ''}
                onChange={(value) => {
                  const val = value || null;
                  setStartRoom(val);
                  if (val) {
                    const room = roomMap.get(val);
                    if (room && room.floorId !== currentFloor) setCurrentFloor(room.floorId);
                    if (!endRoom) setSelectionMode('end');
                  }
                }}
              />
            </div>
            <button
              className={`mode-indicator-btn ${selectionMode === 'start' ? 'active' : ''}`}
              onClick={() => setSelectionMode('start')}
              title="Click on the map to set starting point"
            >
              Pick
            </button>
          </div>

          {/* Swap Button */}
          <button
            className="swap-nav-btn"
            onClick={swapRooms}
            disabled={!startRoom && !endRoom}
            title="Swap Origin & Destination"
          >
            <ArrowUpDown size={16} />
          </button>

          {/* Destination Selector */}
          <div className={`selector-field ${selectionMode === 'end' ? 'active-field' : ''}`}>
            <span className="field-icon end-dot">
              <Flag size={16} color="#ef4444" />
            </span>
            <div className="field-input-group">
              <label className="field-label" htmlFor="end-room-select">TO</label>
              <SearchableSelect
                id="end-room-select"
                label="Destination"
                groups={destinationGroups}
                placeholder="Select destination…"
                value={endRoom || ''}
                onChange={(value) => {
                  const val = value || null;
                  setEndRoom(val);
                  if (val) {
                    const room = roomMap.get(val);
                    if (room && room.floorId !== currentFloor) setCurrentFloor(room.floorId);
                  }
                }}
              />
            </div>
            <button
              className={`mode-indicator-btn ${selectionMode === 'end' ? 'active' : ''}`}
              onClick={() => setSelectionMode('end')}
              title="Click on the map to set destination"
            >
              Pick
            </button>
          </div>

          {/* Clear Button */}
          {(startRoom || endRoom) && (
            <button className="nav-clear-btn" onClick={handleReset} title="Clear selection">
              <X size={14} />
            </button>
          )}

          {/* Floor Switcher */}
          <div className="bar-floor-switcher">
            <button
              className={`view-pill-btn ${currentFloor === 'floor-1' ? 'active' : ''}`}
              onClick={() => setCurrentFloor('floor-1')}
            >
              <Building2 size={13} style={{ marginRight: 4 }} /> G
            </button>
            <button
              className={`view-pill-btn ${currentFloor === 'floor-2' ? 'active' : ''}`}
              onClick={() => setCurrentFloor('floor-2')}
            >
              <Layers size={13} style={{ marginRight: 4 }} /> 2F
            </button>
            <button
              className={`view-pill-btn ${currentFloor === 'floor-3' ? 'active' : ''}`}
              onClick={() => setCurrentFloor('floor-3')}
            >
              <Layers size={13} style={{ marginRight: 4 }} /> 3F
            </button>
            <button
              className={`view-pill-btn ${currentFloor === 'floor-4' ? 'active' : ''}`}
              onClick={() => setCurrentFloor('floor-4')}
            >
              <Layers size={13} style={{ marginRight: 4 }} /> 4F
            </button>
          </div>
          {accessRole === 'student' && <button className="schedule-control schedule-open-button" type="button" aria-haspopup="dialog" onClick={() => setScheduleOpen(true)}>
            <CalendarDays size={17} aria-hidden="true" /> View schedule
          </button>}
          <InstructorSearch roomInfo={roomInfo} onSelectRoom={handleInstructorRoom} />
        </div>
      </section>

      {/* Main Workspace */}
      <main className="app-workspace">
        <MapViewer
          roomFocus={roomFocus}
          roomInfo={roomInfo}
          currentFloor={currentFloor}
          onChangeFloor={setCurrentFloor}
          onRoomClick={handleRoomClick}
          path={path}
          startRoom={startRoom}
          endRoom={endRoom}
          selectionMode={selectionMode}
          hasFloorTransition={hasFloorTransition}
          floorsInPath={floorsInPath}
          onQuickEvacuate={handleQuickEvacuate}
        />

        {directions.length > 0 && (
          <DirectionsPanel
            directions={directions}
            steps={steps}
            startName={startRoomData?.name}
            endName={endRoomData?.name}
            startBuilding={startRoomData?.buildingId}
            endBuilding={endRoomData?.buildingId}
            hasFloorTransition={hasFloorTransition}
            floorsInPath={floorsInPath}
            distanceMeters={distanceMeters}
            estimatedSeconds={estimatedSeconds}
            onReset={handleReset}
            onSwap={swapRooms}
            activeStepIndex={activeStepIndex}
            onSelectStep={setActiveStepIndex}
            onChangeFloor={setCurrentFloor}
            onQuickEvacuate={handleQuickEvacuate}
          />
        )}
      </main>
    </div>
  );
}
