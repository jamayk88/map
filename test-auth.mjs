import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loginStudent } from './src/utils/auth.js';

const endpoint = 'http://localhost:8080/API/login';
const credentials = { studentId: ' 2026-0001 ', password: ' test password ' };

test('login posts the API field names, preserves the password and supports session cookies', async () => {
  const controller = new AbortController();
  const result = await loginStudent(credentials, {
    endpoint,
    signal: controller.signal,
    fetchImpl: async (url, options) => {
      assert.equal(url, endpoint);
      assert.equal(options.method, 'POST');
      assert.equal(options.headers['Content-Type'], 'application/json');
      assert.equal(options.headers.Accept, 'application/json');
      assert.equal(options.credentials, 'include');
      assert.equal(options.signal, controller.signal);
      assert.deepEqual(JSON.parse(options.body), { studentid: '2026-0001', password: ' test password ' });
      return Response.json({ success: true, student: { studentid: '2026-0001' } });
    },
  });
  assert.equal(result.success, true);
  assert.equal(result.student.studentid, '2026-0001');
});

test('login retains the submitted student ID when the profile omits it', async () => {
  const result = await loginStudent(credentials, {
    endpoint,
    fetchImpl: async () => Response.json({ success: true, student: { name: 'Student', grade: 'IT4', section: 'A' } }),
  });
  assert.deepEqual(result.student, { name: 'Student', studentid: '2026-0001', grade: 'IT4', section: 'A' });
});

test('login rejects HTTP failures and application failures even with HTTP 200', async () => {
  for (const status of [200, 401, 422, 500]) {
    await assert.rejects(loginStudent(credentials, {
      endpoint,
      fetchImpl: async () => Response.json({ success: false, message: 'Invalid credentials.' }, { status }),
    }), { message: 'Invalid credentials.' });
  }
  await assert.rejects(loginStudent(credentials, {
    endpoint,
    fetchImpl: async () => Response.json({}, { status: 403 }),
  }), /Login failed/);
});

test('login reports missing configuration, network failure, and malformed API responses', async () => {
  await assert.rejects(loginStudent(credentials, { endpoint: '' }), /not configured/);
  await assert.rejects(loginStudent(credentials, {
    endpoint,
    fetchImpl: async () => { throw new TypeError('Failed to fetch'); },
  }), /Unable to reach/);
  for (const response of [new Response('<html>Error</html>'), Response.json(null), Response.json('OK')]) {
    await assert.rejects(loginStudent(credentials, {
      endpoint,
      fetchImpl: async () => response,
    }), /unexpected response/);
  }
});

test('login preserves request cancellation', async () => {
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(loginStudent(credentials, {
    endpoint,
    signal: controller.signal,
    fetchImpl: async (_, { signal }) => { throw signal.reason; },
  }), { name: 'AbortError' });
});
