import React, { useMemo } from 'react';
import { Search } from 'lucide-react';
import SearchableSelect from './SearchableSelect';
import { getInstructorOptions } from '../utils/instructorSearch.js';

export default function InstructorSearch({ roomInfo, onSelectRoom }) {
  const options = useMemo(() => getInstructorOptions(roomInfo), [roomInfo.byMapRoom, roomInfo.unmapped]);
  const loading = roomInfo.status === 'loading' || roomInfo.status === 'idle';
  const failed = roomInfo.status === 'error';
  return <div className="selector-field instructor-search">
    <Search size={17} className="field-icon" aria-hidden="true" />
    <div className="field-input-group">
      <label className="field-label" htmlFor="instructor-search">INSTRUCTOR</label>
      <SearchableSelect id="instructor-search" label="Instructor search"
        groups={[{ label: 'Instructor room assignments', options }]} value=""
        placeholder="Search instructor…" searchPlaceholder="Enter instructor name…"
        emptyMessage={loading ? 'Loading instructor assignments…' : failed ? 'Instructor search unavailable' : 'No instructor assignments found'}
        emptyHint={loading ? 'Please wait while room information loads.' : failed ? 'Use Retry room info to try again.' : 'Try another instructor name.'}
        onChange={value => {
          const option = options.find(item => item.value === value);
          if (option?.mapRoomId) onSelectRoom(option.mapRoomId);
        }} />
    </div>
  </div>;
}
