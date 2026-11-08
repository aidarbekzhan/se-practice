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
(paste here)
```

---

## 3. Defect log

One row per defect. At least **BUG-A and BUG-B**. "Suspected cause" is your hypothesis
**before** you ask any assistant: the line and why.

| Defect | Test ID | Input | Expected | Actual | Suspected cause (line and why) |
| --- | --- | --- | --- | --- | --- |
| BUG-A | | | | | |
| BUG-B | | | | | |

---

## 4. Tasks 2–3 — the skill

**The checks from the deck, before you zip it.** Answer each one yes / no:

| Check | yes / no |
| --- | --- |
| The file is plain UTF-8 text, named exactly `SKILL.md` (not `SKILL.md.txt`) | yes / no |
| The first and the closing YAML delimiter are exactly three hyphens: `---` | yes / no |
| `name` is lowercase with hyphens, and `description` says WHEN to use it | yes / no |
| I read the whole file once: no passwords, API keys or private student data | yes / no |

**The contents of `skills/bug-detector.zip`.** Paste the listing (Windows: open the ZIP and copy
the paths; macOS/Linux: `unzip -l skills/bug-detector.zip`):

```text
(paste here)
```

**Installation.** Where you uploaded it, what the upload said, and whether a new chat showed the
skill as enabled. If upload was not available, write `prompt-only simulation` and say why.
Screenshot of the result: `evidence/install.png`.

<!-- Write below this line -->

---

## 5. Task 4 — without the skill

A **fresh chat, with no skill enabled**. Paste exactly what you sent: the deck's question, then
the same input you will use in section 6 (AC1–AC6, the failing test output, the code of
`canBook`):

```text
(paste here)
```

**The assistant's answer, pasted unedited:**

```text
(paste here)
```

---

## 6. Task 5 — with the skill

**Another fresh chat, with `bug-detector` enabled.** Send exactly the same input as in section 5.
Only the question changes, to the deck's skill question:

```text
(paste here)
```

**The assistant's answer, pasted unedited:**

```text
(paste here)
```

Did the environment show that the skill was invoked? yes / no / not shown

---

## 7. Comparison — judged against the actual code

Do not assume the skill did better. Judge both answers against the code and against what your
tests showed. Write a short verdict in each cell, and give a reason where they differ.

| Criterion | No skill | With skill |
| --- | --- | --- |
| Correct root cause | | |
| Reproducible test | | |
| Minimal proposed patch | | |
| Unsupported claims | | |
| Clarity of explanation | | |

**Which bugs did each answer find?** (BUG-A, BUG-B, both, neither)

-

---

## 8. Task 6 — repair and regression

Review the proposed patch yourself, then make **one minimal change per bug**, one commit each.
Rerun the test that was failing, then the full suite.

### 8.1 The BUG-A patch

The change as a diff (`git diff`, or the old and the new line), then the real run:

```text
(paste here)
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
