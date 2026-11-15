import { useEffect, useState } from 'react';
import { fetchRoomInfo } from '../utils/roomInfo.js';

export function useRoomInfo(enabled) {
  const [reload, setReload] = useState(0);
  const [state, setState] = useState({ status: 'idle', byMapRoom: {}, unmapped: [], message: '' });
  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    let active = true;
    const timeout = setTimeout(() => controller.abort(), 15000);
    setState({ status: 'loading', byMapRoom: {}, unmapped: [], message: '' });
    fetchRoomInfo({ signal: controller.signal }).then(result => {
      if (active) setState({ ...result, status: 'ready', message: '' });
    }).catch(error => {
      if (active) setState({ status: 'error', byMapRoom: {}, unmapped: [], message: controller.signal.aborted
        ? 'Loading room information timed out.' : error.message });
    }).finally(() => clearTimeout(timeout));
    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [enabled, reload]);
  return { ...state, retry: () => setReload(value => value + 1) };
}
