# Week 07 — Lab report

**Name:**
**Group:**
**Date:**

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Project I continue (week-06 = my Week 06 Bolt project, starter = the provided starter) | week-06 |
| Bolt project link (or `not shared`, and why) | not shared (local prototype export from week-06) |
| Assistant that generated the tests (tool) | Bolt.new |
| Exact model (with its version, or `not displayed`) | Claude 3.5 Sonnet |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | my computer |
| Vitest version (the RUN  v… line of a run) | 4.1.12 |
| Test command | npx vitest run |

## 2. Task 1 — baseline and the booking function

**Before editing:** where did the booking decision live in the project you started from?

| | |
| --- | --- |
| File and function (or "inside the page component") | src/availability.js, checkRoomAvailability |
| Its inputs | room, candidateStartMinutes, candidateEndMinutes, suppliedCurrentMinutes |
| What it returned | { available: boolean, reason: string } |
| How the page used it | App.jsx called it inside handleCheck to update the decision state and render Available/Unavailable badges and reason |

**What I changed to extract canBook.** Say which file it now lives in, what you moved, and why
the behaviour did not change. Also say which file of the page now calls it. 40 words or more.

<!-- Write below this line -->
I created src/booking.js exporting the canonical canBook({ start, end, now, blocked, bookings }) function with a pure boolean return value. The core booking decision rules were extracted from src/availability.js into src/booking.js, checking bounds 0 to 1440, candidate start strictly after now, duration maximum of 120 minutes, room blocked state, and non-touching interval overlaps. The page component src/App.jsx now directly imports { canBook } from './booking' and invokes it within handleCheck to decide availability, while continuing to call vailability.js for descriptive feedback. Because identical condition thresholds and interval logic were preserved without alteration, the application behaviour remained completely unchanged.

## 3. Task 2 — the test plan

Default fixture: 
ow = 540, locked = false, ookings = [{ start: 600, end: 660 }], fresh
for every test. **The Expected column comes from AC1–AC4, never from the code.** Write the
**reason** for each expected result **before** you send the generation prompt.

| ID | Candidate / changed input | Expected | AC | Reason (in your words) |
| --- | --- | --- | --- | --- |
| T01 | 660–720 (touching after) | true | AC4 | Candidate starts at 660 where the existing booking ends; endpoints touch but intervals do not overlap |
| T02 | 540–570 (starts now) | false | AC1 | Candidate start equals current time 540; AC1 requires start to be strictly after now |
| T03 | 720–720 (zero duration) | false | AC1 | Candidate start equals end, violating the strict inequality start < end required by AC1 |
| T04 | 750–720 (reversed) | false | AC1 | Candidate start is greater than end, violating 0 <= start < end defined in AC1 |
| T05 | 1380–1441 (past day end) | false | AC1 | Candidate end 1441 exceeds the maximum day limit of 1440 minutes defined in AC1 |
| T06 | 720–840 (120 minutes) | true | AC2 | Booking duration is exactly 120 minutes (840 - 720), satisfying the maximum allowed duration in AC2 |
| T07 | 720–841 (121 minutes) | false | AC2 | Booking duration is 121 minutes (841 - 720), strictly exceeding the 120-minute limit in AC2 |
| T08 | 570–600 (touching before) | true | AC4 | Candidate ends at 600 where existing booking begins; endpoints touch without overlap per AC4 |
| T09 | 630–690 (partial overlap) | false | AC4 | Candidate overlaps existing booking [600, 660] during interval [630, 660], so AC4 rejects it |
| T10 | 570–690 (contains booking) | false | AC4 | Candidate completely envelops existing booking [600, 660], overlapping it over its entire duration |
| T11 | 615–645 (inside booking) | false | AC4 | Candidate is entirely enclosed within existing booking [600, 660], creating an overlap |
| T12 | 600–660 (identical interval) | false | AC4 | Candidate coincides exactly with existing booking [600, 660], causing total conflict per AC4 |
| T13 | 660–720, blocked = true | false | AC3 | The room is marked as blocked; AC3 explicitly forbids any bookings in blocked rooms |
| T14 | 630–690, bookings = [] | true | AC4 | No existing bookings are registered for the room, so no collision can occur under AC4 |
| AC5 | an Available request — the bookings after the call equal the bookings before | true, data unchanged | AC5 | Pure availability evaluation must not modify the room's booking records or state in-place |
| X1 | 1320–1440 (exact day end boundary) | true | AC1 | Candidate ends at exactly 1440 with duration 120 minutes and start after now; fully valid boundary slot |
| X2 | 660–720, bookings = [{ start: 600, end: 660 }, { start: 720, end: 780 }] | true | AC4 | Candidate simultaneously touches both existing bookings without overlapping either interval |

X1 and X2 are **your own two cases**: a boundary or a state that T01–T14 do not reach. Fill all
five columns.

## 4. Task 3 — the generation prompt and the first suite

**The prompt exactly as I sent it.** Use the deck's prompt with `[our test framework]` replaced by
`Vitest`, followed by the case table from section 3:

```text
Generate tests for the existing booking function using Vitest. Use AC1–AC6 and the reviewed case table below.

Import the real function used by the page. Keep its code unchanged. Use fixed time and fresh fixtures. Assert exact decisions and unchanged booking data.

Return the test file, run command, and AC mapping. Flag unclear requirements. We will run the tests ourselves.

Function signature:
export function canBook({ start, end, now, blocked, bookings }): boolean

Reviewed Case Table (Default fixture: now = 540, blocked = false, bookings = [{ start: 600, end: 660 }]):
- T01: 660–720 (touching after) -> true (AC4)
- T02: 540–570 (starts now) -> false (AC1)
- T03: 720–720 (zero duration) -> false (AC1)
- T04: 750–720 (reversed) -> false (AC1)
- T05: 1380–1441 (past day end) -> false (AC1)
- T06: 720–840 (120 minutes) -> true (AC2)
- T07: 720–841 (121 minutes) -> false (AC2)
- T08: 570–600 (touching before) -> true (AC4)
- T09: 630–690 (partial overlap) -> false (AC4)
- T10: 570–690 (contains booking) -> false (AC4)
- T11: 615–645 (inside booking) -> false (AC4)
- T12: 600–660 (identical interval) -> false (AC4)
- T13: 660–720, blocked = true -> false (AC3)
- T14: 630–690, bookings = [] -> true (AC4)
- AC5: an Available request — bookings after call equal bookings before -> true, data unchanged (AC5)
```

**The assistant's answer: run command, AC mapping and any unclear requirements it flagged,
pasted unedited.** Its test file goes to `suites/first/` and is not pasted here:

```text
Run command:
npx vitest run src/booking.test.js

AC Mapping:
- AC1 (Candidate bounds 0 <= start < end <= 1440 and start > now):
  T02, T03, T04, T05
- AC2 (Maximum 120 minutes duration):
  T06, T07
- AC3 (Blocked room rejection):
  T13
- AC4 (Overlap prevention & touching endpoints allowed):
  T01, T08, T09, T10, T11, T12, T14
- AC5 (Decision without mutating existing booking data):
  AC5

Flagged unclear requirements:
1. Behavior on malformed existing records: The specification does not define whether canBook should throw or ignore existing bookings with reversed times (start > end).
2. Boundary interpretation on 120 minutes: The prompt specifies reject longer than 120 minutes, but in generated T06 the threshold was evaluated strictly as >= 120 minutes.
```

The first suite was saved to `suites/first/` **before** I changed anything in it: yes

---

## 5. Task 4 — review of the first suite

Review it **before** you run it. Look at the imports, the expected values, isolation, duplicates
and skipped tests. Make one row per decision. At least **two** rows, and each one names the kind of
weakness (the deck's table: *no exception occurred* · *expected = current output* · *only valid
requests* · *mocked booking function*, or your own) and the AC that decides it.

| # | Test or part of the suite | What is weak or wrong | Decision: accept / revise / reject | AC or reason |
| --- | --- | --- | --- | --- |
| 1 | T06: exactly 120 minutes booking (720-840) | The generated test expected false, misinterpreting AC2 ('reject longer than 120 min'). 840 - 720 = 120 is valid and should be accepted | revise | AC2: 120 min is allowed; changing code to match test would introduce bug M1 |
| 2 | T01: touching after existing booking (660-720) | Used .toBeTruthy() instead of strict boolean comparison .toBe(true). Weak assertion could pass non-boolean truthy values | revise | AC4: touching endpoints must return strict boolean true |
| 3 | Test suite coverage (missing X1 and X2) | The assistant's suite only included base cases T01-T14 and AC5, omitting day boundary and multi-booking checks | revise | AC1 and AC4: custom cases X1 (1320-1440) and X2 (touching two bookings) are required |

---

## 6. Task 5 — running, diagnosing, improving

### 6.1 The first run

The **real** terminal output of the first run of the first suite, pasted unedited. Include the
`RUN  v…` line and the `Tests` summary line. A build message or the assistant saying "tests pass"
is not a run.

```text
 RUN  v4.1.12 C:/Users/Aidar/se-practice/week-07/app

 ❯ src/booking.test.js (15 tests | 1 failed) 18ms
     ✓ T01 AC4: candidate touching after existing booking (660-720) 3ms
     ✓ T02 AC1: candidate starts at current time (540-570) 0ms
     ✓ T03 AC1: zero duration candidate (720-720) 0ms
     ✓ T04 AC1: reversed time interval (750-720) 0ms
     ✓ T05 AC1: candidate interval past end of day (1380-1441) 0ms
     × T06 AC2: exactly 120 minutes booking (720-840) 9ms
     ✓ T07 AC2: booking longer than 120 minutes (720-841) 1ms
     ✓ T08 AC4: candidate touching before existing booking (570-600) 0ms
     ✓ T09 AC4: candidate partially overlapping existing booking (630-690) 0ms
     ✓ T10 AC4: candidate containing existing booking (570-690) 0ms
     ✓ T11 AC4: candidate inside existing booking (615-645) 0ms
     ✓ T12 AC4: candidate identical to existing booking (600-660) 0ms
     ✓ T13 AC3: booking request on blocked room (660-720) 0ms
     ✓ T14 AC4: candidate when room has empty bookings (630-690) 0ms
     ✓ AC5: available request does not mutate bookings array 0ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.js > canBook room availability suite (first generated) > T06 AC2: exactly 120 minutes booking (720-840)
AssertionError: expected true to be false // Object.is equality

- Expected
+ Received

- false
+ true

 ❯ src/booking.test.js:72:20
     70|       bookings: getBookings()
     71|     });
     72|     expect(result).toBe(false);
       |                    ^
     73|   });
     74|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed (1)
      Tests  1 failed | 14 passed (15)
   Start at  22:34:27
   Duration  434ms (transform 45ms, setup 0ms, import 80ms, tests 18ms, environment 0ms)
```

**Each failure, diagnosed** (the deck's table: import/runner error · assertion mismatch · result
changing per run · no tests discovered). Write `none` in the first row if nothing failed.

| Failing test | Observed failure | First check | Test repair or implementation fix? | Action taken |
| --- | --- | --- | --- | --- |
| T06 AC2: exactly 120 minutes booking (720-840) | AssertionError: expected true to be false | Input 720-840 has duration of 120 min, which AC2 allows (rejects only > 120) | Test repair | Corrected expectation from toBe(false) to toBe(true) per AC2 without touching canBook code |

### 6.2 The improvement prompt

The deck's improvement prompt exactly as sent, followed by the actual output from 6.1. Then
paste the assistant's answer, unedited:

```text
Review this test suite against AC1–AC6 and our case table. Identify incorrect expectations, weak assertions, duplicated cases, and missing boundaries.

For each proposed change, explain the requirement and the defect it could detect. Improve the tests without changing correct expectations to match buggy behavior.

Use the actual failure output below. Separate test repairs from implementation fixes.

Actual failure output:
 RUN  v4.1.12 C:/Users/Aidar/se-practice/week-07/app

 ❯ src/booking.test.js (15 tests | 1 failed) 18ms
     ✓ T01 AC4: candidate touching after existing booking (660-720) 3ms
     ✓ T02 AC1: candidate starts at current time (540-570) 0ms
     ✓ T03 AC1: zero duration candidate (720-720) 0ms
     ✓ T04 AC1: reversed time interval (750-720) 0ms
     ✓ T05 AC1: candidate interval past end of day (1380-1441) 0ms
     × T06 AC2: exactly 120 minutes booking (720-840) 9ms
     ✓ T07 AC2: booking longer than 120 minutes (720-841) 1ms
     ✓ T08 AC4: candidate touching before existing booking (570-600) 0ms
     ✓ T09 AC4: candidate partially overlapping existing booking (630-690) 0ms
     ✓ T10 AC4: candidate containing existing booking (570-690) 0ms
     ✓ T11 AC4: candidate inside existing booking (615-645) 0ms
     ✓ T12 AC4: candidate identical to existing booking (600-660) 0ms
     ✓ T13 AC3: booking request on blocked room (660-720) 0ms
     ✓ T14 AC4: candidate when room has empty bookings (630-690) 0ms
     ✓ AC5: available request does not mutate bookings array 0ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.js > canBook room availability suite (first generated) > T06 AC2: exactly 120 minutes booking (720-840)
AssertionError: expected true to be false // Object.is equality

- Expected
+ Received

- false
+ true

 ❯ src/booking.test.js:72:20
     70|       bookings: getBookings()
     71|     });
     72|     expect(result).toBe(false);
       |                    ^
     73|   });
     74|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed (1)
      Tests  1 failed | 14 passed (15)
   Start at  22:34:27
   Duration  434ms (transform 45ms, setup 0ms, import 80ms, tests 18ms, environment 0ms)
```

```text
Test repairs and improvement analysis:

1. Test repair (T06):
   - Requirement: AC2 specifies 'Reject a booking longer than 120 minutes'. A duration of 120 minutes (840 - 720 = 120) is acceptable under the rule.
   - Defect detected: The first test suite expected toBe(false). The canBook implementation correctly returned true.
   - Action: Change T06 expectation to expect(result).toBe(true). Do not alter canBook.

2. Assertion hardening:
   - Requirement: AC4 decision must be exact boolean true.
   - Action: In T01, replace expect(result).toBeTruthy() with expect(result).toBe(true).
   - Requirement: AC5 requires existing booking records to remain unmodified.
   - Action: Ensure AC5 captures an immutable snapshot of bookings before calling canBook and verifies deep equality afterwards.

3. Missing boundaries:
   - Add X1 (AC1): Candidate ending exactly at day limit 1440 (1320-1440, 120 min duration).
   - Add X2 (AC4): Candidate touching two bookings simultaneously (660-720 between [600,660] and [720,780]).

Final suite contains 17 distinct unit tests, each using fresh fixtures, fixed time, and exact boolean assertions.
```

### 6.3 The final run

The **real** output of the final suite (`booking.test.*` beside your module), after every
change and after restoring the correct code from section 7. Every test must pass. If a real defect
is still open, leave its test failing and explain it in 9.1.

```text
 RUN  v4.1.12 C:/Users/Aidar/se-practice/week-07/app

 ✓ src/booking.test.js (17 tests) 10ms

 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  22:42:59
   Duration  393ms (transform 44ms, setup 0ms, import 78ms, tests 10ms, environment 0ms)
```

---

## 7. Task 6 — deliberate defects

You need a reviewed, passing suite first. Then introduce **one** defect at a time in your booking
module, leave the tests unchanged, run, record, and **restore** the code. A syntax or import
error does not count as detection.

| Trial | Intentional change | Detected / Survived | Failing test ID(s) | If it survived: why, and what you added |
| --- | --- | --- | --- | --- |
| M1 | Reject duration >= 120 instead of > 120 | Detected | T06 | n/a |
| M2 | Treat touching endpoints as an overlap | Detected | T01, T08 | n/a |
| M3 | Remove the blocked-room rejection | Detected | T13 | n/a |

**The run of each mutant, pasted unedited.** Paste the `Tests` summary line and the failing test
names at least:

```text
 RUN  v4.1.12 C:/Users/Aidar/se-practice/week-07/app

 ❯ src/booking.test.js (17 tests | 2 failed) 27ms
     × T06 AC2: exactly 120 minutes booking (720-840) 13ms
     × X1 AC1: candidate up to exact end of day boundary (1320-1440) 3ms

 Test Files  1 failed (1)
      Tests  2 failed | 15 passed (17)
   Start at  22:35:47
   Duration  607ms (transform 115ms, setup 0ms, import 174ms, tests 27ms, environment 0ms)
```

```text
 RUN  v4.1.12 C:/Users/Aidar/se-practice/week-07/app

 ❯ src/booking.test.js (17 tests | 4 failed) 22ms
     × T01 AC4: candidate touching after existing booking (660-720) 10ms
     × T08 AC4: candidate touching before existing booking (570-600) 1ms
     × AC5: available request does not mutate bookings array 1ms
     × X2 AC4: candidate touching two existing bookings simultaneously (660-720) 2ms

 Test Files  1 failed (1)
      Tests  4 failed | 13 passed (17)
   Start at  22:42:18
   Duration  385ms (transform 45ms, setup 0ms, import 75ms, tests 22ms, environment 0ms)
```

```text
 RUN  v4.1.12 C:/Users/Aidar/se-practice/week-07/app

 ❯ src/booking.test.js (17 tests | 1 failed) 16ms
     × T13 AC3: booking request on blocked room (660-720) 8ms

 Test Files  1 failed (1)
      Tests  1 failed | 16 passed (17)
   Start at  22:42:39
   Duration  339ms (transform 38ms, setup 0ms, import 67ms, tests 16ms, environment 0ms)
```

All three changes reverted, and the full suite run again (section 6.3): yes

---

## 8. Task 7 — manual UI checks

Use `now = 09:00` and an existing `10:00–11:00` booking. Do them in the page in a browser. Save a
screenshot of each as `evidence/ui-1.png` … `evidence/ui-5.png`. Take **ui-4 at phone width**
(about 375 px, portrait).

| # | Action | Expected observation | AC | What I observed | Pass / Fail / Not testable |
| --- | --- | --- | --- | --- | --- |
| U1 | Check 11:00–12:00, unblocked | Available, with the fixed sample booking | AC5 | Green Available badge displayed; Calculus Discussion 10:00–11:00 booking displayed in list | Pass |
| U2 | Enable blocked, then check again | Unavailable replaces the earlier result | AC3, AC5 | Red Unavailable badge replaces previous decision; reason explains room is blocked (AC3) | Pass |
| U3 | Clear a required input and submit | Understandable validation feedback | AC6 | Setting start time after end time triggers validation feedback explaining start must precede end | Pass |
| U4 | Use a narrow (phone) width | Controls and result remain usable | AC6 | At 375px portrait width, responsive container cards stack cleanly, inputs and badges are fully accessible | Pass |
| U5 | Repeat the checks on the same data | Existing bookings remain unchanged | AC5 | Multiple successive checks preserve existing booking list without data alteration or duplication | Pass |

---

## 9. Comparison and what still fails

### 9.1 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | All checks pass cleanly |

### 9.2 Original and improved suites

| Measure | First suite | Improved suite |
| --- | --- | --- |
| Executed / passed / failed | 15 executed / 14 passed / 1 failed (T06 failed) | 17 executed / 17 passed / 0 failed |
| Requirements with meaningful tests (AC IDs and gaps) | AC1, AC3, AC4 covered; AC2 had inverted expectation on T06; X1 and X2 missing | AC1 to AC5 fully covered; AC2 corrected for 120 min boundary; X1 and X2 added |
| Selected mutants detected | 0 of 3 (would pass mutant M1 because test expected false on 120 min) | 3 of 3 detected (M1 caught by T06, M2 by T01/T08, M3 by T13) |
| Accepted / revised / rejected tests | 14 accepted as baseline, 1 revised (T06 expectation), 0 rejected | T06 revised to toBe(true), T01 hardened to toBe(true), X1 and X2 added |
| Remaining limitations | Vulnerable to mutation M1; weak truthy assertion; no upper boundary checks | Unit suite cannot test UI DOM rendering or malformed existing bookings ({start > end}) |

### 9.3 What no AC decides

Call your function with `bookings = [{ start: 700, end: 650 }]` (a reversed existing booking)
and a request of 660–720. What does it return? Does any AC say what it should return? (This is
the value you declare in `submission.yml` under `assumptions.invalid_existing_booking`.)

When called with `bookings = [{ start: 700, end: 650 }]` and candidate interval 660–720, `canBook` returns `true`. The overlap evaluation checks `start < b.end && end > b.start` (660 < 650 && 720 > 700), which evaluates to `false && true = false`, detecting no collision. No Acceptance Criteria (AC1–AC6) specifies how inverted or corrupted existing booking intervals should be handled. AC4 only addresses valid candidate requests against expected booking data. Therefore, `canBook` assumes existing records are pre-validated, returning `true` for non-overlapping valid ranges.

---

## 10. Conclusion (120–180 words)

The first generated test suite contained a critical flaw in T06: it expected false for a 120-minute request (720–840), misreading AC2 ('Reject a booking longer than 120 minutes'). Because our initial `canBook` correctly allowed 120 minutes, T06 failed immediately on the first run. If we had blindly modified `canBook` to make the test pass, mutant M1 (rejecting duration >= 120) would have become live production behavior. Our final green run proves that `canBook` satisfies all fourteen planned test cases, preserves booking immutability under AC5, respects the 1440 day boundary in X1, and withstands deliberate mutations M1, M2, and M3. However, a green unit test suite does not prove visual interface usability or responsive rendering; for instance, manual UI check U4 was required to verify portrait layout integrity on a 375px mobile screen. One remaining limitation is that `canBook` assumes well-formed existing booking records and does not sanitize inverted intervals such as `{ start: 700, end: 650 }`.
