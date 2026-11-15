import React from 'react';

export default function RoomApiInfo({ records = [], status }) {
  if (status === 'idle') return null;
  if (status === 'loading') return <p className="room-api-note" role="status">Loading room information…</p>;
  if (status === 'error' || records.length === 0) return <p className="room-api-note">Room assignment information is unavailable.</p>;
  return <div className="room-api-info">
    {records.map(record => <section className="room-api-record" key={record.id ?? record.name} aria-label={record.name}>
      <p className="room-api-name">{record.name}</p>
      <dl>
        <div><dt>Assignment</dt><dd className={record.isAssigned ? 'room-api-assigned' : ''}>{record.isAssigned ? 'Assigned' : 'Not assigned'}</dd></div>
        <div><dt>Instructor</dt><dd>{record.isAssigned ? record.assignedInstructor?.name || 'Not provided' : 'None assigned'}</dd></div>
      </dl>
    </section>)}
  </div>;
}
