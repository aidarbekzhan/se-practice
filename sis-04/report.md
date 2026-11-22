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

I added a structured catalog of 5 fictional rooms in `src/rooms.js` equipped with projectors, whiteboards, displays, computers, microphones, and video-conferencing units. The user can filter the catalog on the page by specifying minimum required attendee capacity (F1) and selecting required equipment checkboxes (F2). If no room meets the combined criteria, a prominent red empty-state notification appears explaining that no catalog rooms match (F4). When the user selects a different matching room, the availability check and existing bookings table refresh immediately for that chosen room's schedule (F5).

### 4.2 Demonstration

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | Filter with 25 attendees and projector leaving only two matching high-capacity seminar rooms |
| `evidence/filter-empty.png` | Filter with 100 attendees matching zero rooms and showing the red empty-state feedback |
| `evidence/switch-a.png` | Room 101 selected for 10:00 to 11:00 showing an Unavailable decision due to booking overlap |
| `evidence/switch-b.png` | Same times 10:00 to 11:00 with Room 102 selected showing an Available decision |
| `evidence/narrow.png` | Responsive mobile portrait view at 390px width with accessible form controls and clean layout |

## 5. Refactoring (Task 3)

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.js` | Static catalog data exporting ROOMS array with room IDs, capacities, equipment, blocked flags, and bookings |
| `src/booking.js` | Core availability decision engine hosting pure canBook (AC1-AC5) and room lookup checkRoom (F3, F5) |
| `src/filter.js` | Pure filtering logic filterRooms enforcing attendee capacity (F1) and equipment subset matching (F2) |
| `src/availability.js` | Time format conversion utilities (toMinutes, formatMinutes) without any business rule logic |
| `src/App.jsx` | React UI presentation component managing input state, invoking filterRooms, and displaying results |

### 5.2 Design decisions

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| Retain blocked rooms in the catalog dropdown marked with a [BLOCKED] label rather than filtering them out completely. | Automatically excluding blocked rooms during filterRooms execution. | Allows users to see that a room exists on campus and understand that it is currently under maintenance or administratively locked (AC3/F3) rather than wondering why the room disappeared from the campus catalog. |
| Keep canBook signature purely positional/destructured and create a separate checkRoom dispatcher. | Modifying canBook parameter shape to accept a Room object directly. | Preserves regression compatibility with Practice #07 and #08 tests (AC1-AC5) while isolating room lookup and parameter mapping into checkRoom (F3, F5). |

### 5.3 Duplication removed

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| `app/src/availability.js`, `checkRoomAvailability()` repeated 120-min duration, interval order, and overlap loops | Removed from `availability.js`; centralized in `src/booking.js` (`canBook()` and `checkRoom()`) |
| `app/src/App.jsx`, `handleCheck()` evaluated both `canBook` and `checkRoomAvailability` with local `isBlocked` override | Replaced with a single call to `checkRoom(ROOMS, roomId, request)` using room's catalog `blocked` status |

## 6. Automated tests (Task 4)

### 6.1 Test plan

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | T02 AC1: candidate starts at current time (540-570) | start=540, end=570, now=540 → false |
| AC2 | T06 B1 AC2: exactly 120 minutes booking (720-840) | start=720, end=840 (120 min) → true |
| AC3 | T13 AC3: booking request on blocked room (660-720) | blocked=true → false |
| AC4 | T01 B3 AC4: candidate touching after existing booking (660-720) | start=660 after booking 600-660 → true |
| AC5 | AC5: available request does not mutate bookings array | bookings array checked before/after → JSON unchanged |
| F1 | F1 B5: filterRooms capacity greater than or equal to attendees includes room at exact boundary | attendees=12 against cap 12 room → included |
| F2 | F2: filterRooms requires room to contain ALL selected equipment items | req=['projector', 'whiteboard'] → only rooms with both |
| F3 | F3: checkRoom always returns false for blocked room regardless of request time | checkRoom on 't-blocked' → false |
| F4 | F4: filterRooms returns empty list when no room satisfies required criteria | attendees=100 → empty array [] |
| F5 | F5: checkRoom uses chosen room own bookings and evaluates room-specific conflicts | slot 600-660 on t-small vs t-large → false vs true |
| B1 | T06 B1 AC2: exactly 120 minutes booking (720-840) | duration=120 min → toBe(true) |
| B2 | T07 B2 AC2: booking longer than 120 minutes (720-841) | duration=121 min → toBe(false) |
| B3 | T01 B3 AC4: candidate touching after existing booking (660-720) | touching at 660 → toBe(true) |
| B4 | T09 B4 AC4: candidate partially overlapping existing booking (630-690) | overlap 630-690 with 600-660 → toBe(false) |
| B5 | F1 B5: filterRooms capacity greater than or equal to attendees includes room at exact boundary | attendees=12 for cap 12 → included |
| B6 | F1 B6: filterRooms capacity one below attendees excludes room from results | attendees=13 for cap 12 → excluded |
| INT | INT: filterRooms narrows catalog and checkRoom validates slot on selected room | filterRooms then checkRoom on matched[0] → true |

### 6.2 Commands

```bash
cd app
npm install
npx vitest run
```

### 6.3 Final run

```text
 RUN  v4.1.12 C:/Users/Aidar/se-practice/sis-04/app

 ✓ src/booking.test.js (26 tests) 21ms

 Test Files  1 passed (1)
      Tests  26 passed (26)
   Start at  21:39:29
   Duration  616ms (transform 92ms, setup 0ms, import 146ms, tests 21ms, environment 0ms)
```

## 7. Quality evaluation (Task 5)

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | 19/19 | 26/26 | Baseline 1.1 and final 6.3 Vitest test run summaries |
| Duplicated logic locations removed | 0 | 2 | Counted removed duplicated validation locations documented in section 5.3 |
| Code structure: modules and their responsibilities | 3 modules (App.jsx, booking.js, availability.js) | 5 modules (rooms.js, filter.js, booking.js, availability.js, App.jsx) | Compared git ls-files app/src between baseline and final commits |
| Remaining limitation | Single-day time window only | Multi-day or recurring reservations across calendar dates are not supported | Observed system design: start and end times are constrained to single 0-1440 minute day cycle |

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

For this assignment, I provided the assistant with our Week 08 repository map, the preserved criteria AC1–AC6, the new feature requirements F1–F5, and strict project constraints against databases and external APIs. I specifically asked for maintainability risks and an incremental plan rather than a code rewrite.

The assistant was very useful in structuring the step-by-step refactoring sequence and defining boundary cases for B1–B6. However, it generated two problematic suggestions: first, it proposed modifying `canBook` to accept a room object, which would break backward compatibility with Practice 08 tests; second, its initial filtering recommendation used `equipment.some()`, which would incorrectly match rooms having only a subset of requested gear instead of all required items (F2).

I personally verified that `canBook` remained pure and untouched, that `filterRooms` used `.every()` to enforce full equipment matching, and that `checkRoom` correctly dispatched availability using each room's own bookings without mutating catalog state. Automated testing heavily influenced my engineering workflow: I executed Vitest after each isolated modification, ensuring that regression tests AC1–AC5 stayed green while developing F1–F5 and boundary checks B1–B6. When boundary test B4 caught an edge case in minute-level overlaps, having deterministic tests gave me confidence that touching intervals (B3) remained valid.

Next, I would improve the application by supporting multi-day bookings across calendar dates and allowing users to dynamically add new reservations to the in-memory room schedules while persisting them cleanly.
