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
| Bolt project link (or 
ot shared, and why) | not shared (local prototype export from week-06) |
| Assistant that generated the tests (tool) | Bolt.new |
| Exact model (with its version, or 
ot displayed) | Claude 3.5 Sonnet |
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
(paste here)
```

**The assistant's answer: run command, AC mapping and any unclear requirements it flagged,
pasted unedited.** Its test file goes to `suites/first/` and is not pasted here:

```text
(paste here)
```

The first suite was saved to `suites/first/` **before** I changed anything in it: yes / no

---

## 5. Task 4 — review of the first suite

Review it **before** you run it. Look at the imports, the expected values, isolation, duplicates
and skipped tests. Make one row per decision. At least **two** rows, and each one names the kind of
weakness (the deck's table: *no exception occurred* · *expected = current output* · *only valid
requests* · *mocked booking function*, or your own) and the AC that decides it.

| # | Test or part of the suite | What is weak or wrong | Decision: accept / revise / reject | AC or reason |
| --- | --- | --- | --- | --- |
| 1 | | | accept / revise / reject | |
| 2 | | | accept / revise / reject | |

---

## 6. Task 5 — running, diagnosing, improving

### 6.1 The first run

The **real** terminal output of the first run of the first suite, pasted unedited. Include the
`RUN  v…` line and the `Tests` summary line. A build message or the assistant saying "tests pass"
is not a run.

```text
(paste here)
```

**Each failure, diagnosed** (the deck's table: import/runner error · assertion mismatch · result
changing per run · no tests discovered). Write `none` in the first row if nothing failed.

| Failing test | Observed failure | First check | Test repair or implementation fix? | Action taken |
| --- | --- | --- | --- | --- |
| | | | | |

### 6.2 The improvement prompt

The deck's improvement prompt exactly as sent, followed by the actual output from 6.1. Then
paste the assistant's answer, unedited:

```text
(paste here)
```

### 6.3 The final run

The **real** output of the final suite (`booking.test.*` beside your module), after every
change and after restoring the correct code from section 7. Every test must pass. If a real defect
is still open, leave its test failing and explain it in 9.1.

```text
(paste here)
```

---

## 7. Task 6 — deliberate defects

You need a reviewed, passing suite first. Then introduce **one** defect at a time in your booking
module, leave the tests unchanged, run, record, and **restore** the code. A syntax or import
error does not count as detection.

| Trial | Intentional change | Detected / Survived | Failing test ID(s) | If it survived: why, and what you added |
| --- | --- | --- | --- | --- |
| M1 | Reject duration >= 120 instead of > 120 | Detected / Survived | | |
| M2 | Treat touching endpoints as an overlap | Detected / Survived | | |
| M3 | Remove the blocked-room rejection | Detected / Survived | | |

**The run of each mutant, pasted unedited.** Paste the `Tests` summary line and the failing test
names at least:

```text
(paste here)
```

All three changes reverted, and the full suite run again (section 6.3): yes / no

---

## 8. Task 7 — manual UI checks

Use `now = 09:00` and an existing `10:00–11:00` booking. Do them in the page in a browser. Save a
screenshot of each as `evidence/ui-1.png` … `evidence/ui-5.png`. Take **ui-4 at phone width**
(about 375 px, portrait).

| # | Action | Expected observation | AC | What I observed | Pass / Fail / Not testable |
| --- | --- | --- | --- | --- | --- |
| U1 | Check 11:00–12:00, unblocked | Available, with the fixed sample booking | AC5 | | Pass / Fail / Not testable |
| U2 | Enable blocked, then check again | Unavailable replaces the earlier result | AC3, AC5 | | Pass / Fail / Not testable |
| U3 | Clear a required input and submit | Understandable validation feedback | AC6 | | Pass / Fail / Not testable |
| U4 | Use a narrow (phone) width | Controls and result remain usable | AC6 | | Pass / Fail / Not testable |
| U5 | Repeat the checks on the same data | Existing bookings remain unchanged | AC5 | | Pass / Fail / Not testable |

---

## 9. Comparison and what still fails

### 9.1 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

### 9.2 Original and improved suites

| Measure | First suite | Improved suite |
| --- | --- | --- |
| Executed / passed / failed | | |
| Requirements with meaningful tests (AC IDs and gaps) | | |
| Selected mutants detected | | |
| Accepted / revised / rejected tests | | |
| Remaining limitations | | |

### 9.3 What no AC decides

Call your function with `bookings = [{ start: 700, end: 650 }]` (a reversed existing booking)
and a request of 660–720. What does it return? Does any AC say what it should return? (This is
the value you declare in `submission.yml` under `assumptions.invalid_existing_booking`.)

-

---

## 10. Conclusion (120–180 words)

<!-- Answer all three in your own words, without the assistant:
     (a) Which mistake in the FIRST suite would have let a wrong canBook pass, and how did you find it?
     (b) What does your final green run prove, and what does it NOT prove? Use a mutant or a UI check.
     (c) One testing limitation that remains.
     Worthless: "The AI wrote good tests and they all passed."
     Worth everything: "The first suite expected T06 (exactly 120 minutes) to be rejected. That
     contradicts AC2, and it failed on a correct canBook. If I had changed the code to make it
     pass, M1 would have become the real behaviour." -->

<!-- Write your conclusion below this line -->


