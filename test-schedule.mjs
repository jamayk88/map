import assert from 'node:assert/strict';
import { test } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { fetchSchedule, normalizeSchedule, todayInManila, getWeekDates, formatClassTime, getCalendarRange, layoutDayClasses } from './src/utils/schedule.js';

const endpoint = 'http://localhost:8080/API/getschedule';
const sample = {
  success: true,
  schedules: [
    { id: 2, subject: 'Calculus', subject_code: 'MATH 1', days: [{ day: 'Monday', start: '13:00:00', end: '14:30:00' }], room: 'Room 1', instructor: 'Instructor' },
    { id: 1, subject: 'Programming', days: [{ day: 'Tuesday', start: '08:00', end: '09:30' }, { day: 'Thursday', start: '10:00', end: '11:00' }], room: 'Computer Lab' },
  ],
};

test('normalizes and sorts recurring classes with room and instructor details', () => {
  const result = normalizeSchedule(sample);
  assert.equal(result[0].title, 'Programming');
  assert.deepEqual(result[0].days, [2]);
  assert.deepEqual(result[1].days, [4]);
  assert.equal(result[1].startTime, '10:00');
  assert.equal(result[2].code, 'MATH 1');
  assert.equal(result[2].room, 'Room 1');
  assert.equal(result[2].instructor, 'Instructor');
  assert.equal(formatClassTime(result[2].startTime), '1:00 PM');
  assert.equal(new Set(result.map(lesson => lesson.id)).size, 3);
  assert.equal(formatClassTime('12:00 AM'), '12:00 AM');
  assert.equal(formatClassTime('12:30 PM'), '12:30 PM');
});

test('maps the API days array into every weekday meeting for the logged-in student', () => {
  const result = normalizeSchedule({ success: true, schedules: [{
    id: 1, subject: 'Programming 1', instructor: 'Instructor', room: 'HB-Comp. Lab', grade: 'IT4', section: 'A',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => ({ day, start: '08:00', end: '09:00' })),
  }] });
  assert.equal(result.length, 5);
  assert.deepEqual(result.map(lesson => lesson.days[0]), [1, 2, 3, 4, 5]);
  assert.ok(result.every(lesson => lesson.title === 'Programming 1' && lesson.room === 'HB-Comp. Lab'
    && lesson.startTime === '08:00' && lesson.endTime === '09:00'));
});

test('schedule renders as a labelled dialog with student identity, close action and loading feedback', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
  try {
    const { ScheduleDialog } = await server.ssrLoadModule('/src/components/StudentSchedule.jsx');
    const markup = renderToStaticMarkup(React.createElement(ScheduleDialog, { studentName: 'Test Student', onClose() {} }));
    assert.match(markup, /<dialog[^>]*aria-labelledby="schedule-title"/);
    assert.match(markup, /id="schedule-title"[^>]*>My schedule/);
    assert.match(markup, /Test Student/);
    assert.match(markup, /aria-label="Close schedule"/);
    assert.match(markup, /schedule-toolbar/);
    assert.match(markup, /role="status">Loading your schedule/);
    const { ScheduleTimeGrid } = await server.ssrLoadModule('/src/components/StudentSchedule.jsx');
    const calendar = renderToStaticMarkup(React.createElement(ScheduleTimeGrid, {
      dates: getWeekDates('2026-11-01'), classes: normalizeSchedule(sample), today: '2026-11-01',
    }));
    assert.match(calendar, /GMT\+8/);
    assert.match(calendar, /aria-current="date"/);
    assert.equal((calendar.match(/class="schedule-day-track"/g) || []).length, 7);
    assert.equal((calendar.match(/class="schedule-class"/g) || []).length, 3);
    assert.match(calendar, /8:00 AM – 9:30 AM/);
  } finally {
    await server.close();
  }
});

test('hour grid positions meetings by time and gives overlapping classes separate lanes', () => {
  const classes = [
    { id: 'a', startTime: '08:00', endTime: '09:00' },
    { id: 'b', startTime: '08:30', endTime: '09:30' },
    { id: 'c', startTime: '09:30', endTime: '10:00' },
  ];
  const range = getCalendarRange(classes);
  assert.deepEqual(range, { start: 420, end: 1140, height: 1080 });
  const layout = layoutDayClasses(classes, range.start);
  assert.equal(layout[0].top, 90);
  assert.equal(layout[0].height, 86);
  assert.equal(layout[0].width, 50);
  assert.equal(layout[1].left, 50);
  assert.equal(layout[2].width, 100);
  assert.equal(layout[2].top, 225);
  assert.deepEqual(getCalendarRange([{ startTime: '06:30', endTime: '20:15' }]), { start: 360, end: 1260, height: 1350 });
});

test('handles empty schedules without hiding malformed subjects and meeting times', () => {
  assert.deepEqual(normalizeSchedule({ success: true, schedule: [] }), []);
  const subject = { subject: 'Programming', days: [{ day: 'Monday', start: '08:00', end: '09:00' }] };
  for (const payload of [{ success: true }, { data: {} }, [null], [{ ...subject, days: 'Monday' }]]) {
    assert.throws(() => normalizeSchedule(payload), /could not be displayed/);
  }
  for (const meeting of [null, { day: 'Invalid', start: '08:00', end: '09:00' }, { day: 'Monday', start: '25:00', end: '09:00' }, { day: 'Monday', start: '09:00', end: '08:00' }]) {
    assert.throws(() => normalizeSchedule([{ ...subject, days: [meeting] }]), /times could not be displayed/);
  }
});

test('calendar uses Philippine dates and Monday-to-Sunday weeks across year boundaries', () => {
  assert.equal(todayInManila(new Date('2026-10-31T17:00:00Z')), '2026-11-01');
  assert.deepEqual(getWeekDates('2026-11-01').map(date => date.toISOString().slice(0, 10)), [
    '2026-10-26', '2026-10-27', '2026-10-28', '2026-10-29', '2026-10-30', '2026-10-31', '2026-11-01',
  ]);
  assert.equal(getWeekDates('2026-12-31', 1)[0].toISOString().slice(0, 10), '2027-01-04');
  assert.equal(getWeekDates('2026-11-01', -1)[0].toISOString().slice(0, 10), '2026-10-19');
});

test('schedule request uses the authenticated session and configured endpoint', async () => {
  const controller = new AbortController();
  const result = await fetchSchedule({ endpoint, student: { studentid: '2026-0001' }, signal: controller.signal, fetchImpl: async (url, options) => {
    assert.equal(url, endpoint);
    assert.equal(options.method, 'GET');
    assert.equal(options.credentials, 'include');
    assert.equal(options.signal, controller.signal);
    assert.equal(options.headers.Accept, 'application/json');
    return Response.json({ ...sample, schedules: [
      ...sample.schedules.map(entry => ({ ...entry, studentid: '2026-0001' })),
      { ...sample.schedules[0], studentid: '2026-0002', subject: 'Other student class' },
    ] });
  } });
  assert.equal(result.length, 3);
  assert.ok(result.every(lesson => lesson.title !== 'Other student class'));
});

test('filters shared classes by both grade and section with normalized values', () => {
  const lesson = sample.schedules[0];
  const result = normalizeSchedule([
    { ...lesson, grade: 'IT4', section: 'A' },
    { ...lesson, grade: 'IT3', section: 'A' },
    { ...lesson, grade: 'IT4', section: 'B' },
  ], { grade: ' it4 ', section: ' a ' });
  assert.equal(result.length, 1);
  assert.equal(result[0].section, 'A');
});

test('explicit student ownership takes precedence over matching grade and section', () => {
  const lesson = { ...sample.schedules[0], grade: 'IT4', section: 'A' };
  const student = { studentid: '2026-0001', grade: 'IT4', section: 'A' };
  assert.equal(normalizeSchedule([
    { ...lesson, student_id: '2026-0002' },
    { ...lesson, student: { studentid: ' 2026-0001 ' } },
  ], student).length, 1);
  assert.deepEqual(normalizeSchedule([{ ...lesson, studentId: '2026-0002' }], student), []);
});

test('does not display schedules that cannot be matched to a student', async () => {
  for (const student of [null, {}, { studentid: '2026-0001' }, { section: 'A' }]) {
    assert.throws(() => normalizeSchedule(sample, student), /could not be matched/);
  }
  await assert.rejects(fetchSchedule({ endpoint, fetchImpl: async () => Response.json(sample) }), /could not be matched/);
  assert.deepEqual(normalizeSchedule({ schedules: [] }, null), []);
});

test('schedule failures distinguish expired sessions, API errors and network errors', async () => {
  for (const status of [401, 403]) {
    await assert.rejects(fetchSchedule({ endpoint, fetchImpl: async () => Response.json({}, { status }) }), /log in again/);
  }
  await assert.rejects(fetchSchedule({ endpoint, fetchImpl: async () => Response.json({ success: false, message: 'Schedule unavailable.' }) }), /Schedule unavailable/);
  await assert.rejects(fetchSchedule({ endpoint, fetchImpl: async () => new Response('<html>Error</html>') }), /unexpected response/);
  await assert.rejects(fetchSchedule({ endpoint, fetchImpl: async () => { throw new TypeError('Failed to fetch'); } }), /check your connection/);
  await assert.rejects(fetchSchedule({ endpoint: '' }), /not configured/);
});
