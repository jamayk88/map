import { useState, useMemo, useCallback } from 'react';
import { findPath, findNearestExit } from '../utils/pathfinding';
import { edges } from '../data/graph';
import { normalizeRoute } from '../utils/routeUrl.js';

const EXIT_IDS = [
  'ccje-entrance',
  'ccje-gate-west',
  'ccje-gate-east',
  'main-exit',
  'stairs-gym-west',
  'gym-exit-nw',
  'gym-exit-ne',
  'gym-exit-south',
  'mb-exit-north',
  'mb-exit-south',
  'mb2-exit-north',
  'main-sw-lobby',
  'main-exit-north',
  'main2-exit-north',
  'main3-exit-north',
  'main4-exit-north',
];

export function usePathfinding(initialRoute = {}) {
  const [{ startRoom, endRoom }, setRoute] = useState(() => normalizeRoute(initialRoute));
  const [activeStepIndex, setActiveStepIndex] = useState(null);

  const setRooms = useCallback((route) => {
    setRoute(normalizeRoute(route));
    setActiveStepIndex(null);
  }, []);

  const setStartRoom = useCallback((value) => {
    setRoute(route => normalizeRoute({ ...route, startRoom: value }));
    setActiveStepIndex(null);
  }, []);

  const setEndRoom = useCallback((value) => {
    setRoute(route => normalizeRoute({ ...route, endRoom: value }));
    setActiveStepIndex(null);
  }, []);

  const result = useMemo(() => {
    if (!startRoom || !endRoom) return null;
    return findPath(startRoom, endRoom, edges);
  }, [startRoom, endRoom]);

  const reset = useCallback(() => {
    setRooms({});
  }, [setRooms]);

  const swapRooms = useCallback(() => {
    setRoute(route => ({ startRoom: route.endRoom, endRoom: route.startRoom }));
    setActiveStepIndex(null);
  }, []);

  const routeToNearestExit = useCallback((customStartId = null) => {
    const fromId = customStartId || startRoom;
    if (!fromId) return;

    const shortest = findNearestExit(fromId, EXIT_IDS, edges);

    if (shortest) {
      setRooms({ startRoom: fromId, endRoom: shortest.destinationId });
    }
  }, [startRoom, setRooms]);

  return {
    startRoom,
    setStartRoom,
    endRoom,
    setEndRoom,
    setRooms,
    path: result?.path ?? [],
    directions: result?.directions ?? [],
    steps: result?.steps ?? [],
    floorsInPath: result?.floorsInPath ?? [],
    hasFloorTransition: result?.hasFloorTransition ?? false,
    totalCost: result?.totalCost ?? 0,
    distanceMeters: result?.distanceMeters ?? 0,
    estimatedSeconds: result?.estimatedSeconds ?? 0,
    hasPath: result !== null && (result?.path?.length ?? 0) > 0,
    activeStepIndex,
    setActiveStepIndex,
    swapRooms,
    routeToNearestExit,
    reset,
  };
}
