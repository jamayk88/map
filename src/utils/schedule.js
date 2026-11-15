const dayNumbers = {
  monday: 1, mon: 1, m: 1,
  tuesday: 2, tue: 2, tues: 2, tu: 2,
  wednesday: 3, wed: 3, w: 3,
  thursday: 4, thu: 4, thurs: 4, th: 4,
  friday: 5, fri: 5, f: 5,
  saturday: 6, sat: 6,
  sunday: 7, sun: 7,
};

export function todayInManila(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Manila', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now);
  const value = type => parts.find(part => part.type === type).value;
  return `${value('year')}-${value('month')}-${value('day')}`;
}

export function getWeekDates(dateKey, offset = 0) {
  const date = new Date(`${dateKey}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 6) % 7) + offset * 7);
  return Array.from({ length: 7 }, (_, index) => new Date(date.getTime() + index * 86400000));
}

function parseTime(value) {
  if (typeof value !== 'string') return null;
  const match = value.trim().match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?$/i);
  if (!match) return null;
  let hour = Number(match[1]);
  const minute = Number(match[2]);
  if (minute > 59 || (match[3] ? hour < 1 || hour > 12 : hour > 23)) return null;
  if (match[3]) hour = hour % 12 + (match[3].toUpperCase() === 'PM' ? 12 : 0);
  return hour * 60 + minute;
}

export function formatClassTime(value) {
  const minutes = parseTime(value);
  if (minutes === null) return value;
  const hour = Math.floor(minutes / 60);
  return `${hour % 12 || 12}:${String(minutes % 60).padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;
}

export function getCalendarRange(classes) {
  const start = Math.min(420, ...classes.map(lesson => Math.floor(parseTime(lesson.startTime) / 60) * 60));
  const end = Math.max(1140, ...classes.map(lesson => Math.ceil(parseTime(lesson.endTime) / 60) * 60));
  return { start, end, height: (end - start) * 1.5 };
}

// Give overlapping meetings separate lanes so every class remains visible.
export function layoutDayClasses(classes, rangeStart) {
  const sorted = [...classes].sort((a, b) => parseTime(a.startTime) - parseTime(b.startTime));
  const result = [];
  let cluster = [];
  let lanes = [];
  let clusterEnd = -1;
  const flush = () => {
    for (const item of cluster) result.push({ ...item, left: item.lane * 100 / lanes.length, width: 100 / lanes.length });
    cluster = [];
    lanes = [];
  };
  for (const lesson of sorted) {
    const start = parseTime(lesson.startTime);
    const end = parseTime(lesson.endTime);
    if (start >= clusterEnd) {
      flush();
      clusterEnd = -1;
    }
    let lane = lanes.findIndex(laneEnd => laneEnd <= start);
    if (lane === -1) lane = lanes.length;
    lanes[lane] = end;
    cluster.push({ lesson, lane, top: (start - rangeStart) * 1.5, height: Math.max(1, (end - start) * 1.5 - 4) });
    clusterEnd = Math.max(clusterEnd, end);
  }
  flush();
  return result;
}

const matchValue = value => typeof value === 'string' || typeof value === 'number'
  ? String(value).trim().toLowerCase() : '';
const studentIdOf = value => matchValue(value?.studentid ?? value?.student_id ?? value?.studentId);

function belongsToStudent(entry, student) {
  const ownerId = studentIdOf(entry) || studentIdOf(entry?.student);
  if (ownerId) {
    const studentId = studentIdOf(student);
    if (studentId) return ownerId === studentId;
  } else {
    const grade = matchValue(entry?.grade);
    const section = matchValue(entry?.section);
    const studentGrade = matchValue(student?.grade);
    const studentSection = matchValue(student?.section);
    if (grade && section && studentGrade && studentSection) {
      return grade === studentGrade && section === studentSection;
    }
  }
  throw new Error('Your classes could not be matched to your student profile. Please contact the school.');
}

export function normalizeSchedule(payload, student) {
  const entries = Array.isArray(payload) ? payload
    : payload?.schedule ?? payload?.schedules ?? payload?.data?.schedule ?? payload?.data;
  if (!Array.isArray(entries)) throw new Error('The schedule response could not be displayed. Please contact the school.');
  const visibleEntries = student === undefined ? entries : entries.filter(entry => belongsToStudent(entry, student));
  return visibleEntries.flatMap((entry, index) => {
    const title = entry?.subject;
    if (typeof title !== 'string' || !title.trim() || !Array.isArray(entry?.days)) {
      throw new Error('Some class details could not be displayed. Please contact the school.');
    }
    const text = value => typeof value === 'string' || typeof value === 'number' ? String(value) : '';
    return entry.days.map((meeting, meetingIndex) => {
      const day = dayNumbers[String(meeting?.day ?? '').trim().toLowerCase()];
      const startTime = meeting?.start;
      const endTime = meeting?.end;
      if (!day || parseTime(startTime) === null || parseTime(endTime) === null
        || parseTime(endTime) <= parseTime(startTime)) {
        throw new Error('Some class times could not be displayed. Please contact the school.');
      }
      return {
        id: `${text(entry.id) || 'class'}-${index}-${meetingIndex}`,
        title: title.trim(),
        code: text(entry.subject_code),
        days: [day],
        startTime,
        endTime,
        room: text(entry.room),
        instructor: text(entry.instructor),
        section: text(entry.section),
      };
    });
  }).sort((a, b) => parseTime(a.startTime) - parseTime(b.startTime));
}

export async function fetchSchedule({
  student,
  signal,
  endpoint = import.meta.env?.DEV && import.meta.env?.VITE_SCHEDULE_URL
    ? '/api/student-schedule' : import.meta.env?.VITE_SCHEDULE_URL,
  fetchImpl = fetch,
} = {}) {
  if (!endpoint) throw new Error('Student schedules are not configured. Please contact the school.');
  let response;
  try {
    response = await fetchImpl(endpoint, { method: 'GET', headers: { Accept: 'application/json' }, credentials: 'include', signal });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new Error('Unable to reach your schedule. Please check your connection and try again.');
  }
  if (response.status === 401 || response.status === 403) {
    throw new Error('Your student session could not be verified. Please reload the page and log in again.');
  }
  let payload;
  try { payload = await response.json(); }
  catch { throw new Error('The schedule service returned an unexpected response. Please try again.'); }
  if (!response.ok || payload?.success === false) {
    throw new Error(typeof payload?.message === 'string' ? payload.message : 'Unable to load your schedule. Please try again.');
  }
  return normalizeSchedule(payload, student ?? null);
}
