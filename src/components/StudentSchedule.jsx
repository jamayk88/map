import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, RefreshCw, X } from 'lucide-react';
import { fetchSchedule, getWeekDates, formatClassTime, todayInManila, getCalendarRange, layoutDayClasses } from '../utils/schedule.js';

const dayFormat = new Intl.DateTimeFormat('en-PH', { weekday: 'short', timeZone: 'UTC' });
const dateFormat = new Intl.DateTimeFormat('en-PH', { dateStyle: 'full', timeZone: 'UTC' });
const monthFormat = new Intl.DateTimeFormat('en-PH', { month: 'short', timeZone: 'UTC' });
function monthLabel(dates) {
  const first = dates[0];
  const last = dates[6];
  if (first.getUTCFullYear() !== last.getUTCFullYear()) return `${monthFormat.format(first)} ${first.getUTCFullYear()} – ${monthFormat.format(last)} ${last.getUTCFullYear()}`;
  return `${monthFormat.format(first)}${first.getUTCMonth() !== last.getUTCMonth() ? ` – ${monthFormat.format(last)}` : ''} ${last.getUTCFullYear()}`;
}

export function ScheduleDialog({ student, studentName, onClose }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog.open) dialog.showModal();
    return () => dialog.close();
  }, []);

  return (
    <dialog ref={dialogRef} className="schedule-dialog" aria-labelledby="schedule-title" onCancel={event => {
      event.preventDefault();
      onClose();
    }}>
      <StudentSchedule student={student} studentName={studentName} onClose={onClose} />
    </dialog>
  );
}

export function ScheduleTimeGrid({ dates, classes, today }) {
  const range = getCalendarRange(classes);
  const hours = Array.from({ length: (range.end - range.start) / 60 }, (_, index) => range.start + index * 60);
  return (
    <div className="schedule-grid-scroll" tabIndex={0} aria-label="Weekly class calendar, scroll to see more times">
      <div className="schedule-time-grid">
        <div className="schedule-timezone">GMT+8</div>
        {dates.map(date => {
          const dateKey = date.toISOString().slice(0, 10);
          return <div className={`schedule-day-heading ${dateKey === today ? 'schedule-day-today' : ''}`} key={dateKey}>
            <span>{dayFormat.format(date)}</span>
            <time dateTime={dateKey} aria-label={dateFormat.format(date)} aria-current={dateKey === today ? 'date' : undefined}>{date.getUTCDate()}</time>
          </div>;
        })}
        <div className="schedule-time-gutter" style={{ height: range.height }}>
          {hours.map(minutes => {
            const time = `${String(Math.floor(minutes / 60)).padStart(2, '0')}:00`;
            return <time key={minutes} className="schedule-hour-label" style={{ top: (minutes - range.start) * 1.5 }}>{formatClassTime(time)}</time>;
          })}
        </div>
        {dates.map((date, index) => <div className="schedule-day-track" key={date.toISOString()} style={{ height: range.height }} aria-label={dateFormat.format(date)}>
          {layoutDayClasses(classes.filter(lesson => lesson.days.includes(index + 1)), range.start).map(({ lesson, top, height, left, width }) => {
            const time = `${formatClassTime(lesson.startTime)} – ${formatClassTime(lesson.endTime)}`;
            const details = [lesson.room, lesson.instructor, lesson.section].filter(Boolean).join(' · ');
            return <article key={lesson.id} className="schedule-class" tabIndex={0}
              style={{ top, height, left: `calc(${left}% + 6px)`, width: `calc(${width}% - 12px)` }}
              aria-label={`${lesson.title}, ${time}${details ? `, ${details}` : ''}`}
              title={`${lesson.title}\n${time}\n${details}`}>
              <h3>{lesson.title}</h3>
              <p>{time}</p>
              {details && <p>{details}</p>}
            </article>;
          })}
        </div>)}
      </div>
    </div>
  );
}

export default function StudentSchedule({ student, studentName = '', onClose }) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [reload, setReload] = useState(0);
  const [state, setState] = useState({ status: 'loading', classes: [], message: '' });
  const today = todayInManila();
  const dates = useMemo(() => getWeekDates(today, weekOffset), [today, weekOffset]);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const timeout = setTimeout(() => controller.abort(), 15000);
    setState({ status: 'loading', classes: [], message: '' });
    fetchSchedule({ student, signal: controller.signal }).then(classes => {
      if (active) setState({ status: 'ready', classes, message: '' });
    }).catch(error => {
      if (active) setState({ status: 'error', classes: [], message: controller.signal.aborted
        ? 'Loading your schedule timed out. Please try again.' : error.message });
    }).finally(() => clearTimeout(timeout));
    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [reload, student]);

  return (
    <section className="student-schedule" aria-labelledby="schedule-title">
      <h1 id="schedule-title" className="schedule-sr-only">My schedule{studentName ? ` for ${studentName}` : ''}</h1>
      <header className="schedule-toolbar">
        <div className="schedule-toolbar-navigation">
          <button className="schedule-control" type="button" onClick={() => setWeekOffset(0)}>Today</button>
          <div className="schedule-arrow-group">
            <button className="schedule-control" type="button" aria-label="Previous week" onClick={() => setWeekOffset(value => value - 1)}><ChevronLeft size={18} /></button>
            <button className="schedule-control" type="button" aria-label="Next week" onClick={() => setWeekOffset(value => value + 1)}><ChevronRight size={18} /></button>
          </div>
          <h2 className="schedule-month-label" aria-live="polite">{monthLabel(dates)}</h2>
        </div>
        <div className="schedule-toolbar-actions">
          <p className="schedule-calendar-caption"><span aria-hidden="true" />{studentName || 'Your class schedule'}</p>
          <span className="schedule-view-label"><CalendarDays size={16} aria-hidden="true" /> Week</span>
          <button className="schedule-control schedule-icon-button" type="button" aria-label="Refresh schedule" onClick={() => setReload(value => value + 1)} disabled={state.status === 'loading'}><RefreshCw size={17} aria-hidden="true" /></button>
          {onClose && <button className="schedule-control schedule-icon-button" type="button" onClick={onClose} aria-label="Close schedule" autoFocus><X size={20} aria-hidden="true" /></button>}
        </div>
      </header>
      {state.status === 'loading' && <div className="schedule-feedback" role="status">Loading your schedule…</div>}
      {state.status === 'error' && <div className="schedule-feedback schedule-error" role="alert">
        <h2>Couldn’t load your schedule</h2><p>{state.message}</p>
        <button className="schedule-control" type="button" onClick={() => setReload(value => value + 1)}>Try again</button>
      </div>}
      {state.status === 'ready' && <>
        {state.classes.length === 0 && <p className="schedule-empty-notice" role="status">No classes are listed in your schedule yet.</p>}
        <ScheduleTimeGrid dates={dates} classes={state.classes} today={today} />
      </>}
    </section>
  );
}
