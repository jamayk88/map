export async function loginStudent(
  { studentId, password },
  {
    signal,
    endpoint = import.meta.env?.DEV && import.meta.env?.VITE_LOGIN_URL
      ? '/api/student-login'
      : import.meta.env?.VITE_LOGIN_URL,
    fetchImpl = fetch,
  } = {},
) {
  if (!endpoint) throw new Error('Student login is not configured. Please contact the administrator.');

  let response;
  try {
    response = await fetchImpl(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ studentid: studentId.trim(), password }),
      signal,
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new Error('Unable to reach student login. Please try again.');
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Student login returned an unexpected response. Please try again.');
  }

  if (!response.ok || data?.success === false) {
    throw new Error(
      typeof data?.message === 'string' && data.message.trim()
        ? data.message
        : 'Login failed. Check your student ID and password and try again.',
    );
  }
  if (!data || typeof data !== 'object') {
    throw new Error('Student login returned an unexpected response. Please try again.');
  }
  return {
    ...data,
    student: { ...data.student, studentid: data.student?.studentid ?? studentId.trim() },
  };
}
