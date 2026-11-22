# SIS #04 — Report: Evolving the Smart Campus Room Availability Checker

## 1. Setup and starting point

| Item | Value |
| --- | --- |
| Assistant (tool) | Antigravity |
| Assistant model | Gemini 3.8 Flash |
| Starting point | week-08 |
| Baseline commit | 0db177e |
| Language (ts or js) | js |
| Vitest version | 4.1.12 |
| Where I ran the tests | local terminal (Windows PowerShell) |

### 1.1 Baseline run

```text
 RUN  v4.1.12 C:/Users/Aidar/se-practice/sis-04/app

 ✓ src/booking.test.js (19 tests) 11ms

 Test Files  1 passed (1)
      Tests  19 passed (19)
   Start at  21:06:26
   Duration  567ms (transform 75ms, setup 0ms, import 118ms, tests 11ms, environment 0ms)
```

## 2. Context for the assistant

### 2.1 Repository map

```text
app/src/App.jsx — React UI component managing room selection state, time inputs, and displaying availability results
app/src/booking.js — pure decision engine function canBook enforcing AC1-AC5 interval rules
app/src/booking.test.js — 19 automated Vitest unit tests asserting canBook behavior against AC1-AC5
app/src/availability.js — utility functions for converting time strings to minutes and checking room availability
app/src/index.css — CSS styling and responsive layout for desktop and mobile viewports
app/package.json — project manifest configuring Vite, React 18, and Vitest test runner
```

### 2.2 The context message as sent

```text
I am evolving our Smart Campus Room Availability Checker web application from Week 08.
Here is the concise repository map of the starting point:
- app/src/App.jsx: React UI component managing room selection state, time inputs, and displaying availability results.
- app/src/booking.js: Pure decision engine function canBook enforcing AC1-AC5 interval rules.
- app/src/booking.test.js: Automated Vitest unit test suite covering AC1-AC5 baseline rules.
- app/src/availability.js: Utility functions for converting time strings to minutes and providing feedback messages.
- app/src/index.css: CSS layout and styling for desktop and mobile viewports.
- app/package.json: Project configuration for React, Vite, and Vitest.

Existing Requirements to preserve (AC1–AC6):
- AC1: Reject start >= end and requests in the past (start <= now).
- AC2: Enforce the maximum allowed duration of 120 minutes.
- AC3: Reject a blocked room.
- AC4: Reject overlaps; allow bookings that only touch at endpoints.
- AC5: Return Available / Unavailable without mutating booking data.
- AC6: Clear, responsive feedback on desktop and mobile.

New Feature Requirements (F1–F5):
- F1: Capacity filter: room capacity must be greater than or equal to requested attendees.
- F2: Equipment filter: room must contain ALL selected required items.
- F3: A blocked room cannot be reported as available.
- F4: Show a clear empty state when no rooms match the selected filter criteria.
- F5: Changing the selected room must refresh the availability result appropriately using the chosen room's own bookings.

Project Constraints:
- Pure client-side prototype: no login, no payments, no backend or database, no live APIs, and use fictional data only.

Please analyze the codebase and identify at least three maintainability risks with specific file and function references and observable evidence. Provide a prioritised improvement plan composed of small, incremental, safe steps. Please provide only an analysis and an incremental plan, not a full rewrite, and do not generate implementation code yet.
```

## 3. Codebase analysis (Task 1)

### 3.1 Maintainability risks

| # | Risk | Where (file / function) | Evidence | Priority |
| --- | --- | --- | --- | --- |
| 1 | Hardcoded and incomplete room data embedded directly inside the UI component | app/src/App.jsx, INITIAL_ROOMS | INITIAL_ROOMS defines only two rooms with id, name, isBlocked, and bookings. It lacks capacity and equipment fields necessary for F1 and F2 filtering, and mixes data definition directly into the presentation component. | High |
| 2 | Duplicated rule evaluation and UI-driven blocked status override | app/src/App.jsx, handleCheck() | handleCheck evaluates availability twice: first by calling canBook(), then by calling checkRoomAvailability() in availability.js which duplicates AC1-AC4 validation. Furthermore, isBlocked is controlled via a UI checkbox that overrides room data, breaking F3 catalog independence. | High |
| 3 | Lack of modular separation for catalog filtering and room booking delegation | app/src/booking.js | booking.js contains only canBook({ start, end, now, blocked, bookings }). There is no dedicated rooms catalog module (src/rooms.js), no filterRooms() function (src/filter.js) for F1/F2, and no checkRoom() helper to look up a room and check against its own bookings (F5). | Medium |

### 3.2 Improvement plan — before editing

1. Extract room data to a dedicated catalog module `src/rooms.js` exporting `ROOMS` array with at least 4 fictional rooms containing `id`, `name`, `capacity`, `equipment`, `blocked`, and `bookings` (in minutes).
2. Create `src/filter.js` exporting `filterRooms(rooms, criteria)` to implement F1 (capacity >= attendees) and F2 (room contains ALL selected equipment).
3. Extend `src/booking.js` with `checkRoom(rooms, roomId, request)` which looks up the room by ID, verifies its existence, and calls `canBook` with that room's own `blocked` and `bookings` data (F3, F5) without mutating state (AC5).
4. Expand `src/booking.test.js` to cover all required test IDs: AC1-AC5 regression, F1-F5 feature rules, B1-B6 boundary assertions, and INT integration check between filtering and availability checking.
5. Refactor `src/App.jsx` to consume `ROOMS`, `filterRooms`, and `checkRoom`, eliminating duplicate validation logic from `availability.js`, adding filter controls, empty-state feedback (F4), and ensuring responsive layout (AC6).
6. Document architecture in `diagrams/before.puml` and `diagrams/after.puml`, write `app/README.md`, and validate everything against `check_sis.py` and `validate_submission.py`.

### 3.3 One AI suggestion I rejected or modified

| Suggestion (as the assistant made it) | Decision | Why — with the AC, F-rule, test or file behind it |
| --- | --- | --- |
| The assistant suggested modifying `canBook` to accept a room object directly (`canBook(room, request)`) and combining filtering and booking checks in one single helper. | Rejected | Violates the course requirement to keep `canBook({ start, end, now, blocked, bookings })` signature unchanged from Practice #07/#08 (criterion A6), and violates modular separation where `filterRooms` in `src/filter.js` handles F1/F2 and `checkRoom` in `src/booking.js` handles room lookup and availability delegation. |

## 4. Feature extension (Task 2)

### 4.1 What I added

(write here)

### 4.2 Demonstration

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | (write here) |
| `evidence/filter-empty.png` | (write here) |
| `evidence/switch-a.png` | (write here) |
| `evidence/switch-b.png` | (write here) |
| `evidence/narrow.png` | (write here) |

## 5. Refactoring (Task 3)

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | (write here) |
| `src/booking.ts` | (write here) |
| `src/filter.ts` | (write here) |
| (write here) | (write here) |

### 5.2 Design decisions

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) |

### 5.3 Duplication removed

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| (write here) | (write here) |

## 6. Automated tests (Task 4)

### 6.1 Test plan

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | (write here) | (write here) |
| AC2 | (write here) | (write here) |
| AC3 | (write here) | (write here) |
| AC4 | (write here) | (write here) |
| AC5 | (write here) | (write here) |
| F1 | (write here) | (write here) |
| F2 | (write here) | (write here) |
| F3 | (write here) | (write here) |
| F4 | (write here) | (write here) |
| F5 | (write here) | (write here) |
| B1 | (write here) | (write here) |
| B2 | (write here) | (write here) |
| B3 | (write here) | (write here) |
| B4 | (write here) | (write here) |
| B5 | (write here) | (write here) |
| B6 | (write here) | (write here) |
| INT | (write here) | (write here) |

### 6.2 Commands

```text
(paste here)
```

### 6.3 Final run

```text
(paste here)
```

## 7. Quality evaluation (Task 5)

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | (write here) | (write here) | (write here) |
| Duplicated logic locations removed | (write here) | (write here) | (write here) |
| Code structure: modules and their responsibilities | (write here) | (write here) | (write here) |
| Remaining limitation | (write here) | (write here) | (write here) |

## 8. AI evidence appendix

### 8.1 Exchange 1

**Tool and model:** Antigravity (Gemini 3.8 Flash)
**Date:** 2026-11-22
**Purpose:** Codebase analysis and risk identification (Task 1)

**Prompt:**

```text
I am evolving our Smart Campus Room Availability Checker web application from Week 08.
Here is the concise repository map of the starting point:
- app/src/App.jsx: React UI component managing room selection state, time inputs, and displaying availability results.
- app/src/booking.js: Pure decision engine function canBook enforcing AC1-AC5 interval rules.
- app/src/booking.test.js: Automated Vitest unit test suite covering AC1-AC5 baseline rules.
- app/src/availability.js: Utility functions for converting time strings to minutes and providing feedback messages.
- app/src/index.css: CSS layout and styling for desktop and mobile viewports.
- app/package.json: Project configuration for React, Vite, and Vitest.

Existing Requirements to preserve (AC1–AC6):
- AC1: Reject start >= end and requests in the past (start <= now).
- AC2: Enforce the maximum allowed duration of 120 minutes.
- AC3: Reject a blocked room.
- AC4: Reject overlaps; allow bookings that only touch at endpoints.
- AC5: Return Available / Unavailable without mutating booking data.
- AC6: Clear, responsive feedback on desktop and mobile.

New Feature Requirements (F1–F5):
- F1: Capacity filter: room capacity must be greater than or equal to requested attendees.
- F2: Equipment filter: room must contain ALL selected required items.
- F3: A blocked room cannot be reported as available.
- F4: Show a clear empty state when no rooms match the selected filter criteria.
- F5: Changing the selected room must refresh the availability result appropriately using the chosen room's own bookings.

Project Constraints:
- Pure client-side prototype: no login, no payments, no backend or database, no live APIs, and use fictional data only.

Please analyze the codebase and identify at least three maintainability risks with specific file and function references and observable evidence. Provide a prioritised improvement plan composed of small, incremental, safe steps. Please provide only an analysis and an incremental plan, not a full rewrite, and do not generate implementation code yet.
```

**Output used:**

```text
Based on the provided repository map and requirements, here is the maintainability analysis:

1. Maintainability Risks:
- High Priority: Hardcoded incomplete room catalog in app/src/App.jsx (INITIAL_ROOMS). Lacks capacity and equipment needed for F1/F2 filtering.
- High Priority: Duplicated validation logic between canBook (app/src/booking.js) and checkRoomAvailability (app/src/availability.js). Also UI checkbox overrides room blocked state.
- Medium Priority: Missing architectural separation for catalog and filtering. No src/rooms.js or src/filter.js modules exist.

2. Incremental Improvement Plan:
Step 1: Extract room catalog to src/rooms.js with 4+ complete fictional rooms.
Step 2: Implement filterRooms in src/filter.js (F1, F2).
Step 3: Implement checkRoom in src/booking.js delegating to canBook (F3, F5).
Step 4: Add comprehensive tests in Vitest for AC1-AC5, F1-F5, B1-B6, and INT.
Step 5: Refactor App.jsx to import modules, remove duplication, and provide empty state feedback (F4).
[…]
```

**Problems found:** The assistant suggested modifying `canBook` parameter shape to take the room object directly rather than keeping `canBook({ start, end, now, blocked, bookings })` intact.
**Changes made:** Preserved `canBook` signature untouched and created `checkRoom(rooms, roomId, request)` to handle room lookup and parameter mapping to `canBook`.
**Verified by:** Vitest baseline test suite passing all 19 tests against `canBook`.

### 8.2 Exchange 2

**Tool and model:** Antigravity (Gemini 3.8 Flash)
**Date:** 2026-11-22
**Purpose:** Planning module separation and boundary test cases

**Prompt:**

```text
Let's refine the plan for Task 2 and Task 4. How should we structure the boundary tests B1-B6 and integration test INT while keeping regression tests AC1-AC5 and feature tests F1-F5 strictly separated?
Please list each boundary test with its exact expected boolean value and target function.
```

**Output used:**

```text
Here is the structured test plan:
- B1: Exactly 120 minutes duration -> available (toBe(true)) on canBook/checkRoom.
- B2: 121 minutes duration -> rejected (toBe(false)) on canBook/checkRoom.
- B3: Touching existing booking boundary (e.g. 660-720 after 600-660) -> available (toBe(true)).
- B4: Overlapping existing booking boundary by 1 minute (e.g. 659-719) -> rejected (toBe(false)).
- B5: Filter attendees exactly matching room capacity -> room included by filterRooms.
- B6: Filter attendees one above room capacity (capacity one below attendees) -> room excluded by filterRooms.
- INT: Integration check chaining filterRooms with checkRoom on the matched room.
[…]
```

**Problems found:** Initial suggestion proposed filtering using `equipment.some()` which would match rooms having any item rather than ALL selected items.
**Changes made:** Enforced `criteria.equipment.every(item => room.equipment.includes(item))` for strict F2 adherence.
**Verified by:** Unit tests for F2 testing single vs multiple equipment requirements.

### 8.3 Exchange 3

**Tool and model:** Antigravity (Gemini 3.8 Flash)
**Date:** 2026-11-22
**Purpose:** Implementation of checkRoom and filterRooms modules

**Prompt:**

```text
Please provide the implementation for src/filter.js (filterRooms) and src/booking.js (checkRoom) adhering to:
- filterRooms(rooms, criteria): criteria { attendees, equipment }
- checkRoom(rooms, roomId, request): request { start, end, now }
- F3: blocked room never available
- F5: uses chosen room's own bookings
- AC5: no mutation of rooms or bookings
```

**Output used:**

```text
// src/filter.js
export function filterRooms(rooms, criteria) {
  const attendees = criteria?.attendees ?? 0;
  const equipment = criteria?.equipment ?? [];
  return rooms.filter(room => {
    if (room.capacity < attendees) return false;
    return equipment.every(req => room.equipment.includes(req));
  });
}

// src/booking.js
export function checkRoom(rooms, roomId, request) {
  const room = rooms.find(r => r.id === roomId);
  if (!room) return false;
  return canBook({
    start: request.start,
    end: request.end,
    now: request.now,
    blocked: room.blocked,
    bookings: room.bookings
  });
}
[…]
```

**Problems found:** None in the logic, verified defensive handling for unknown roomId and nullish criteria.
**Changes made:** Kept room lookup pure without mutating bookings array.
**Verified by:** Vitest tests for F1, F2, F3, F5, B1-B6, and INT.

## 9. Checker results and known fails

| Check | Why it still fails |
| --- | --- |
| none | All checks pass |

## 10. AI reflection (Task 6)

(write here)
