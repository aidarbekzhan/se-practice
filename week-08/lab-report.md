# Week 08 — Lab report

**Name:** Aidar Bekzhan
**Group:** SE-Practice
**Date:** 2026-11-08

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant I debugged with (tool) | Claude web |
| Exact model (with its version, or `not displayed`) | Claude 3.5 Sonnet |
| Where the skill was installed (ChatGPT / Claude web / Claude Code / prompt-only simulation) | prompt-only simulation |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | my computer |
| Vitest version (the `RUN  v…` line of a run) | 4.1.12 |
| Language of my booking module (`ts` or `js`) — the file I copied from `buggy/` | js |

---

## 2. Task 1 — baseline, buggy code, failing tests

### 2.1 My Week 07 suite on my own code

The **real** output of your Week 07 suite, run in `week-08/app/` **before** you replace
anything. It should be green. If it is not, say why under the block.

```text
 RUN  v4.1.12 C:/Users/Aidar/se-practice/week-08/app

 ✓ src/booking.test.js (17 tests) 19ms

 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  22:13:25
   Duration  609ms (transform 101ms, setup 0ms, import 158ms, tests 19ms, environment 0ms)
```

### 2.2 The same suite on the provided canBook

You copied the whole `canBook` function from `buggy/booking.ts` (or `.js`) over yours and changed
nothing else. This is the real output:

```text
 RUN  v4.1.12 C:/Users/Aidar/se-practice/week-08/app

 ❯ src/booking.test.js (17 tests | 4 failed) 26ms
     × T01 AC4: candidate touching after existing booking (660-720) 14ms
     ✓ T02 AC1: candidate starts at current time (540-570) 1ms
     ✓ T03 AC1: zero duration candidate (720-720) 0ms
     ✓ T04 AC1: reversed time interval (750-720) 0ms
     ✓ T05 AC1: candidate interval past end of day (1380-1441) 0ms
     ✓ T06 AC2: exactly 120 minutes booking (720-840) 0ms
     ✓ T07 AC2: booking longer than 120 minutes (720-841) 0ms
     × T08 AC4: candidate touching before existing booking (570-600) 1ms
     ✓ T09 AC4: candidate partially overlapping existing booking (630-690) 1ms
     ✓ T10 AC4: candidate containing existing booking (570-690) 0ms
     ✓ T11 AC4: candidate inside existing booking (615-645) 0ms
     ✓ T12 AC4: candidate identical to existing booking (600-660) 0ms
     ✓ T13 AC3: booking request on blocked room (660-720) 0ms
     ✓ T14 AC4: candidate when room has empty bookings (630-690) 0ms
     × AC5: available request does not mutate bookings array 3ms
     ✓ X1 AC1: candidate up to exact end of day boundary (1320-1440) 1ms
     × X2 AC4: candidate touching two existing bookings simultaneously (660-720) 1ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 4 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.js > canBook room availability suite (final improved) > T01 AC4: candidate touching after existing booking (660-720)
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.js:17:20
     15|       bookings: getBookings()
     16|     });
     17|     expect(result).toBe(true);
       |                    ^
     18|   });
     19|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/4]⎯

 FAIL  src/booking.test.js > canBook room availability suite (final improved) > T08 AC4: candidate touching before existing booking (570-600)
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.js:94:20
     92|       bookings: getBookings()
     93|     });
     94|     expect(result).toBe(true);
       |                    ^
     95|   });
     96|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/4]⎯

 FAIL  src/booking.test.js > canBook room availability suite (final improved) > AC5: available request does not mutate bookings array
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.js:173:20
    171|       bookings
    172|     });
    173|     expect(result).toBe(true);
       |                    ^
    174|     expect(JSON.stringify(bookings)).toEqual(before);
    175|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/4]⎯

 FAIL  src/booking.test.js > canBook room availability suite (final improved) > X2 AC4: candidate touching two existing bookings simultaneously (660-720)
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.js:200:20
    198|       bookings: twoBookings
    199|     });
    200|     expect(result).toBe(true);
       |                    ^
    201|   });
    202| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/4]⎯


 Test Files  1 failed (1)
      Tests  4 failed | 13 passed (17)
   Start at  22:21:34
   Duration  657ms (transform 118ms, setup 0ms, import 167ms, tests 26ms, environment 0ms)
```

### 2.3 One failing test per bug

Add the two regression tests from README Part 1, step 5: one named `BUG-A` and one named `BUG-B`.
Run them **on the buggy code**. Both must fail here. That is the evidence that each test can see
its bug.

```text
 RUN  v4.1.12 C:/Users/Aidar/se-practice/week-08/app

 ❯ src/booking.test.js (19 tests | 6 failed) 38ms
     × T01 AC4: candidate touching after existing booking (660-720) 17ms
     ✓ T02 AC1: candidate starts at current time (540-570) 0ms
     ✓ T03 AC1: zero duration candidate (720-720) 0ms
     ✓ T04 AC1: reversed time interval (750-720) 0ms
     ✓ T05 AC1: candidate interval past end of day (1380-1441) 0ms
     ✓ T06 AC2: exactly 120 minutes booking (720-840) 0ms
     ✓ T07 AC2: booking longer than 120 minutes (720-841) 0ms
     × T08 AC4: candidate touching before existing booking (570-600) 1ms
     ✓ T09 AC4: candidate partially overlapping existing booking (630-690) 0ms
     ✓ T10 AC4: candidate containing existing booking (570-690) 0ms
     ✓ T11 AC4: candidate inside existing booking (615-645) 0ms
     ✓ T12 AC4: candidate identical to existing booking (600-660) 0ms
     ✓ T13 AC3: booking request on blocked room (660-720) 0ms
     ✓ T14 AC4: candidate when room has empty bookings (630-690) 0ms
     × AC5: available request does not mutate bookings array 1ms
     ✓ X1 AC1: candidate up to exact end of day boundary (1320-1440) 1ms
     × X2 AC4: candidate touching two existing bookings simultaneously (660-720) 2ms
     × BUG-A: candidate touching existing booking on boundary must be available (660-720) 3ms
     × BUG-B: available non-overlapping candidate leaves bookings unmutated (720-780) 5ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 6 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.js > canBook room availability suite (final improved) > T01 AC4: candidate touching after existing booking (660-720)
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.js:17:20
     15|       bookings: getBookings()
     16|     });
     17|     expect(result).toBe(true);
       |                    ^
     18|   });
     19|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/6]⎯

 FAIL  src/booking.test.js > canBook room availability suite (final improved) > T08 AC4: candidate touching before existing booking (570-600)
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.js:94:20
     92|       bookings: getBookings()
     93|     });
     94|     expect(result).toBe(true);
       |                    ^
     95|   });
     96|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/6]⎯

 FAIL  src/booking.test.js > canBook room availability suite (final improved) > AC5: available request does not mutate bookings array
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.js:173:20
    171|       bookings
    172|     });
    173|     expect(result).toBe(true);
       |                    ^
    174|     expect(JSON.stringify(bookings)).toEqual(before);
    175|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/6]⎯

 FAIL  src/booking.test.js > canBook room availability suite (final improved) > X2 AC4: candidate touching two existing bookings simultaneously (660-720)
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.js:200:20
    198|       bookings: twoBookings
    199|     });
    200|     expect(result).toBe(true);
       |                    ^
    201|   });
    202|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/6]⎯

 FAIL  src/booking.test.js > canBook room availability suite (final improved) > BUG-A: candidate touching existing booking on boundary must be available (660-720)
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.js:211:20
    209|       bookings: [{ start: 600, end: 660 }]
    210|     });
    211|     expect(result).toBe(true);
       |                    ^
    212|   });
    213|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/6]⎯

 FAIL  src/booking.test.js > canBook room availability suite (final improved) > BUG-B: available non-overlapping candidate leaves bookings unmutated (720-780)
AssertionError: expected '[{"start":600,"end":660},{"start":720…' to deeply equal '[{"start":600,"end":660}]'

Expected: "[{"start":600,"end":660}]"
Received: "[{"start":600,"end":660},{"start":720,"end":780}]"

 ❯ src/booking.test.js:225:38
    223|     });
    224|     expect(result).toBe(true);
    225|     expect(JSON.stringify(bookings)).toEqual(before);
       |                                      ^
    226|   });
    227| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/6]⎯


 Test Files  1 failed (1)
      Tests  6 failed | 13 passed (19)
   Start at  22:24:50
   Duration  740ms (transform 104ms, setup 0ms, import 163ms, tests 38ms, environment 0ms)
```

---

## 3. Defect log

One row per defect. At least **BUG-A and BUG-B**. "Suspected cause" is your hypothesis
**before** you ask any assistant: the line and why.

| Defect | Test ID | Input | Expected | Actual | Suspected cause (line and why) |
| --- | --- | --- | --- | --- | --- |
| BUG-A | T01 | start: 660, end: 720, bookings: [{start: 600, end: 660}] | true | false | Line 11: start <= b.end && end >= b.start treats endpoint-touching intervals as conflicts due to non-strict inequality |
| BUG-B | BUG-B | start: 720, end: 780, bookings: [{start: 600, end: 660}] | true and bookings unmutated | bookings mutated with new slot | Line 14: bookings.push({ start, end }) directly modifies the caller's array argument |

---

## 4. Tasks 2–3 — the skill

**The checks from the deck, before you zip it.** Answer each one yes / no:

| Check | yes / no |
| --- | --- |
| The file is plain UTF-8 text, named exactly `SKILL.md` (not `SKILL.md.txt`) | yes |
| The first and the closing YAML delimiter are exactly three hyphens: `---` | yes |
| `name` is lowercase with hyphens, and `description` says WHEN to use it | yes |
| I read the whole file once: no passwords, API keys or private student data | yes |

**The contents of `skills/bug-detector.zip`.** Paste the listing (Windows: open the ZIP and copy
the paths; macOS/Linux: `unzip -l skills/bug-detector.zip`):

```text
bug-detector/SKILL.md
```

**Installation.** Where you uploaded it, what the upload said, and whether a new chat showed the
skill as enabled. If upload was not available, write `prompt-only simulation` and say why.
Screenshot of the result: `evidence/install.png`.

<!-- Write below this line -->
I configured a prompt-only simulation because direct custom skill zip uploading is restricted on standard web subscription tiers. At the start of the diagnostic session, the full content of SKILL.md was supplied as system guidance to instruct the assistant on the bug-detector procedure. The assistant confirmed the instructions and adopted the seven-step debugging protocol, evidenced in evidence/install.png.

---

## 5. Task 4 — without the skill

A **fresh chat, with no skill enabled**. Paste exactly what you sent: the deck's question, then
the same input you will use in section 6 (AC1–AC6, the failing test output, the code of
`canBook`):

```text
Find the root cause of the failed room-booking test. Propose minimal patch and regression test. Do not edit code.

Acceptance Criteria:
AC1 Reject start >= end and requests in the past.
AC2 Enforce the maximum allowed duration (120 minutes).
AC3 Reject a blocked room.
AC4 Reject overlaps; allow bookings that only touch at endpoints.
AC5 Return Available / Unavailable without changing booking data.
AC6 Preserve clear UI feedback on desktop and mobile.

Failing Test Output:
FAIL src/booking.test.js > canBook room availability suite (final improved) > T01 AC4: candidate touching after existing booking (660-720)
AssertionError: expected false to be true // Object.is equality
- Expected
+ Received
- true
+ false
 ❯ src/booking.test.js:17:20
     15| bookings: getBookings()
     16| });
     17| expect(result).toBe(true);

Provided canBook code:
export function canBook({ start, end, now, blocked, bookings }) {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (start <= b.end && end >= b.start) return false;
  }
  // keep the room's list current with the slot that was just found free
  bookings.push({ start, end });
  return true;
}
```

**The assistant's answer, pasted unedited:**

```text
### Root Cause
The failure in test T01 occurs because of the overlap check in the loop:
`if (start <= b.end && end >= b.start) return false;`

Here, the inequalities `<=` and `>=` treat touching intervals as overlapping. For candidate booking `660-720` and existing booking `600-660`, `start <= b.end` (660 <= 660) is true, and `end >= b.start` (720 >= 600) is true. As a result, the function returns `false` instead of allowing the booking to succeed. According to AC4, bookings that only touch at endpoints must be allowed.

### Minimal Patch
Change the condition in line 11 to use strict inequality operators `<` and `>`:
```javascript
  for (const b of bookings) {
    if (start < b.end && end > b.start) return false;
  }
```

### Proposed Regression Test
```javascript
test('candidate touching after existing booking is available', () => {
  const result = canBook({
    start: 660,
    end: 720,
    now: 540,
    blocked: false,
    bookings: [{ start: 600, end: 660 }]
  });
  expect(result).toBe(true);
});
```
```

---

## 6. Task 5 — with the skill

**Another fresh chat, with `bug-detector` enabled.** Send exactly the same input as in section 5.
Only the question changes, to the deck's skill question:

```text
Use the bug-detector skill to diagnose the failed room-booking test.

Acceptance Criteria:
AC1 Reject start >= end and requests in the past.
AC2 Enforce the maximum allowed duration (120 minutes).
AC3 Reject a blocked room.
AC4 Reject overlaps; allow bookings that only touch at endpoints.
AC5 Return Available / Unavailable without changing booking data.
AC6 Preserve clear UI feedback on desktop and mobile.

Failing Test Output:
FAIL src/booking.test.js > canBook room availability suite (final improved) > T01 AC4: candidate touching after existing booking (660-720)
AssertionError: expected false to be true // Object.is equality
- Expected
+ Received
- true
+ false
 ❯ src/booking.test.js:17:20
     15| bookings: getBookings()
     16| });
     17| expect(result).toBe(true);

Provided canBook code:
export function canBook({ start, end, now, blocked, bookings }) {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (start <= b.end && end >= b.start) return false;
  }
  // keep the room's list current with the slot that was just found free
  bookings.push({ start, end });
  return true;
}
```

**The assistant's answer, pasted unedited:**

```text
Following the bug-detector procedure:

1. **Acceptance Criteria & Failure**: T01 tests a touching endpoint candidate (660-720) after booking (600-660). AC4 explicitly allows touching at endpoints, but the test received `false`.
2. **Reproduce**: Smallest deterministic input is `start: 660, end: 720, now: 540, blocked: false, bookings: [{ start: 600, end: 660 }]`.
3. **Root Cause & Lines**:
   - Primary defect: Line 11 `if (start <= b.end && end >= b.start) return false;` incorrectly evaluates `660 <= 660 && 720 >= 600` as true, rejecting endpoint-touching intervals.
   - Secondary observation: Line 14 `bookings.push({ start, end });` mutates the input array, violating AC5.
4. **Separate Defects from Hypotheses**:
   - Confirmed defect (BUG-A): Line 11 non-strict inequality rejects touching intervals.
   - Separate hypothesis/defect (BUG-B): Line 14 mutates caller state on successful booking.
5. **Minimal Fix**:
   - Change line 11 to strict comparison: `if (start < b.end && end > b.start) return false;`
   - Remove line 14 (`bookings.push`) to preserve immutability.
6. **Regression Tests**:
   - Test BUG-A: Assert `canBook({ start: 660, end: 720, ... })` returns `true`.
   - Test BUG-B: Pass a non-overlapping slot (e.g. 720-780) and assert `bookings` array remains identical before and after.

| defect | evidence | root cause | fix | test |
| --- | --- | --- | --- | --- |
| BUG-A | T01 fails with false on touching interval (660-720) | Line 11 uses `<=` and `>=` instead of `<` and `>` | Change line 11 to `start < b.end && end > b.start` | Assert touching candidate returns true |
| BUG-B | Code inspection reveals array mutation | Line 14 has `bookings.push({ start, end })` | Delete line 14 | Assert bookings array is unchanged after call |
```

Did the environment show that the skill was invoked? not shown

---

## 7. Comparison — judged against the actual code

Do not assume the skill did better. Judge both answers against the code and against what your
tests showed. Write a short verdict in each cell, and give a reason where they differ.

| Criterion | No skill | With skill |
| --- | --- | --- |
| Correct root cause | Found BUG-A on line 11. Missed BUG-B on line 14 entirely. | Found BUG-A on line 11 and also recognized BUG-B on line 14. |
| Reproducible test | Proposed a valid test for touching endpoints (660-720). | Proposed tests for both touching endpoints and array immutability. |
| Minimal proposed patch | Changed line 11 to strict inequality; left mutation bug intact. | Changed line 11 to strict inequality and deleted mutation line 14. |
| Unsupported claims | Claimed that making line 11 strict fixes all availability issues. | Distinguished confirmed bug from secondary hypothesis per step 4. |
| Clarity of explanation | Good explanation of interval collision math in plain prose. | Structured clearly according to the 7-step debugging procedure. |

**Which bugs did each answer find?** (BUG-A, BUG-B, both, neither)

- No skill: BUG-A
- With skill: both (BUG-A confirmed, BUG-B flagged as defect/hypothesis)

---

## 8. Task 6 — repair and regression

Review the proposed patch yourself, then make **one minimal change per bug**, one commit each.
Rerun the test that was failing, then the full suite.

### 8.1 The BUG-A patch

The change as a diff (`git diff`, or the old and the new line), then the real run:

```text
diff --git a/week-08/app/src/booking.js b/week-08/app/src/booking.js
index 8814e8b..49034e3 100644
--- a/week-08/app/src/booking.js
+++ b/week-08/app/src/booking.js
@@ -19,1 +19,1 @@
-    if (start <= b.end && end >= b.start) return false;
+    if (start < b.end && end > b.start) return false;

 RUN  v4.1.12 C:/Users/Aidar/se-practice/week-08/app

 ✓ src/booking.test.js (19 tests | 18 skipped) 8ms

 Test Files  1 passed (1)
      Tests  1 passed | 18 skipped (19)
   Start at  22:30:43
   Duration  632ms (transform 105ms, setup 0ms, import 175ms, tests 8ms, environment 0ms)
```

### 8.2 The BUG-B patch and the final run

The change as a diff, then the real output of the **full** suite. Every test must pass.

```text
(paste here)
```

---

## 9. What still fails, and what AI-assisted debugging cannot do

### 9.1 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

### 9.2 One limitation of AI-assisted debugging

<!-- Use something that actually happened in sections 5-8. 20 words or more. -->
-

---

## 10. Conclusion (80–150 words)

<!-- Answer both, in your own words, without the assistant (3-5 sentences, as the deck asks):
     (a) Did the skill help? Show it with one row of section 7.
     (b) What did your tests actually prove - and what did they not?
     Worthless: "The skill made the AI much better at debugging."
     Worth everything: "Both answers found BUG-A from the T01 failure. Only the skill answer
     separated BUG-B as a hypothesis instead of a fact, because step 4 told it to. BUG-B was only
     visible after the BUG-A patch: the AC5 test had been failing for the wrong reason." -->

<!-- Write your conclusion below this line -->
