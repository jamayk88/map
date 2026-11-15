# LC Mapping

Run `npm install` and `npm run dev` to start the map locally. Run `npm run build` for a production build.

## Opening login popup

Each page load presents “Login as Guest” and “Login as Student”. Guest access opens the map and retains any starting point supplied by a QR link, until the page is reloaded. The Student option opens a student ID and password form with a back button. Login sends a JSON POST request with `studentid` and `password`. A successful JSON response opens the map; HTTP failures and `success: false` responses keep the form open and show the API message. Requests time out after 15 seconds. Passwords and response tokens are not saved in browser storage. Cookies supplied by the API are supported.

Copy `.env.example` to `.env` and set `VITE_LOGIN_URL` (configured locally as `http://localhost:8080/API/login`). Restart Vite after changing environment variables. The development server proxies `/api/student-login` to that URL, avoiding local CORS preflight failures. Production builds use the configured URL directly: for a separately hosted API, allow the frontend origin and credentials in its CORS configuration, or configure a same-origin reverse proxy. Vite exposes `VITE_` variables to the browser, so use this setting for the endpoint URL only, never a secret. Use a reachable HTTPS API URL for deployment; `localhost` refers to each visitor's device.

## Student schedule calendar

Successful student login opens **My schedule** as a compact dialog over the campus map, showing an hourly week grid with class subjects, times, rooms, instructors, and sections. Blue class blocks are positioned by their start time and duration; overlapping meetings appear side by side. The calendar toolbar includes Today, week navigation, and Refresh. Dates and times use Philippine time (GMT+8). The grid scrolls vertically and horizontally on smaller screens, keeping day headings and time labels visible. Close the dialog using its close button or Escape to use the map, then reopen it with **View schedule** in the existing map controls. There is no separate app header. The map retains its starting point and route. Guest access opens the map directly without a schedule popup.

Set `VITE_SCHEDULE_URL=http://localhost:8080/API/getschedule` in `.env` (also included in `.env.example`), then restart Vite. Schedule loading uses an authenticated GET with session cookies. The development server proxies `/api/student-schedule` to this endpoint and rewrites API cookie paths for both login and schedule requests. The frontend filters classes using the logged-in student profile: an entry's `studentid`, `student_id`, or `studentId` (also supported inside `student`) must match the student's ID; entries without student ownership must match both the student's `grade` and `section`. Matching trims whitespace and ignores case. Login retains the submitted student ID if the profile omits `studentid`. Entries that cannot be matched produce an error instead of displaying an unfiltered timetable. Student information stays in React state; no student ID is taken from URL parameters. The backend must still authenticate requests and restrict access to student data, since frontend filtering only controls what the calendar displays.

The calendar reads the API's `schedules` array. Each entry contains `subject`, `instructor`, `room`, and a `days` array such as `[{ "day": "Monday", "start": "08:00", "end": "09:00" }]`. Each meeting is displayed separately, so one subject may meet at different times on different weekdays. Times support 24-hour `HH:mm[:ss]` or `h:mm AM/PM`. Classes repeat weekly according to the returned timetable. Invalid responses show an error rather than an empty timetable. Requests time out after 15 seconds and can be retried.

## API room information

Set `VITE_ROOMS_URL=http://localhost:8080/API/getrooms` in `.env`, then restart Vite. After either Student or Guest login, the app loads room metadata through the `/api/rooms` development proxy. Hover a linked map room to see its API room name, assignment status, and assigned instructor. A failed request shows unavailable information and a **Retry room info** button; it never marks rooms unassigned based on a failed request.

Confirmed links live in `src/data/apiRoomMappings.js`. Matching uses explicit API room names, ignoring case and extra spaces. Geometry, graph nodes, and URL room IDs stay unchanged. Several API records can share a physical area only when explicitly mapped. See [ROOM_MAPPINGS.md](ROOM_MAPPINGS.md) for the map room inventory. The API recheck on 2026-11-09 returned 83 API rooms. With HB Research Office and the numbered Main third-floor rooms, there are 75 links and 8 unmatched rooms included as blank values (`''`) in `apiRoomMappings`. `pendingApiRoomNames` is derived automatically from those blank entries. Unmapped API records are kept separate and are not attached to guessed positions.

## Starting-point links

Use the `start` query parameter to preselect a starting point:

- `https://your-map.example/?start=main3-lobby` opens the Main Building third-floor lobby as the starting point and lets the visitor choose a destination.

Values are exact, case-sensitive room IDs from `src/data/rooms.js` and its imported floor data, rather than room names or codes. Rooms, stairs, and exits are supported; internal graph waypoints are not. For example, the lobby defined in `src/data/mainThirdFloor.js` has the ID `main3-lobby`.

The address bar updates when the starting point changes, including after a swap. Destinations are selected in the app and are never read from or saved to the URL. Opening or reloading a link leaves the destination empty and opens the starting point's floor, ready for destination selection. Unknown starting IDs open the default ground-floor view. Clearing selections removes `start`. Legacy `end` parameters are ignored and removed; other query parameters and URL fragments are preserved.

For future QR codes, encode the actual deployed application URL with `?start=<room-id>` (or add `&start=<room-id>` if the URL already has query parameters). A visitor scanning the code will start at that location and can select their destination. The starting point remains editable. QR image generation and scanning are not included yet.

## Verification

Run `node --test test-*.mjs` for URL and routing checks, and `npm run build` to validate the production bundle.
