# Week 05 — Lab report

**Name:** Aidar Bekzhan
**Group:** CS (SITE)
**Date:** October 11, 2026

Fill in every section. **Do not delete, rename or renumber the headings** — the checker and the
grader find your answers by them. Add rows to any table; never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant (tool) | ChatGPT (OpenAI) |
| **Exact** model name | GPT-4o (version 2024-08-06) |
| Language and version | Python 3.12 |
| Path | A |
| My Week 04 declaration for touching bookings | allowed |

In Week 04, I already assumed and declared that touching bookings are allowed (`overlap_touching_bookings: allowed`), so AC4 directly confirms my Week 04 design and no structural diagram changes were required.

---

## 2. Task 1 — the plan

**The assistant's plan, pasted unedited:**

```text
Implementation Plan for can_book:

1. Order of Checks:
   - Check 1 (AC3 - Room Status): Check if `blocked` is True. If True, return False immediately.
   - Check 2 (AC1 - Time Boundaries & Ordering): Verify `0 <= start < end <= 1440`. If not, return False.
   - Check 3 (AC1 - Future Requirement): Verify `start > now`. If `start <= now`, return False.
   - Check 4 (AC2 - Maximum Duration): Calculate `end - start`. If duration > 120 minutes, return False.
   - Check 5 (AC4 - Overlap Detection): Iterate through every active booking (a, b) in `existing`.
     An overlap occurs when `start < b` and `end > a`. Touching endpoints (start == b or end == a) are permitted.
     If any booking overlaps, return False.
   - Check 6 (AC5 - Final Approval): If all checks pass and no overlaps occur, return True. Guarantee that `existing` is never altered.

2. Assumptions:
   - Input times are valid integers per contract; `now` is between 0 and 1439, and `blocked` is a Boolean.
   - `existing` is a list of valid (start, end) tuples, but might not be sorted. We could consider sorting or defensive type checking for robustness.

3. Boundary Cases Suggested:
   - Touching endpoints: (660, 720) when existing has (600, 660) -> True.
   - Reverse touching: (570, 600) when existing has (600, 660) -> True.
   - Starts at current time: start == now (e.g. 540) -> False.
   - Starts one minute ahead: start == now + 1 (541) -> True.
   - Exactly 120 minutes: (720, 840) -> True.
   - Over 120 minutes: (720, 841) -> False.
   - Zero-length booking: start == end (700, 700) -> False.
   - Midnight boundary: end == 1440 -> True; end == 1441 -> False.
   - Complete containment: (570, 690) around (600, 660) -> False.
```

**What the plan invented or changed.** One row for every rule in the plan that is not in the
contract or in AC1–AC5, or that says something different from them. If you found none, write one
row saying which lines of the plan you checked against which AC.

| # | What the plan said | What the contract or the AC says | What I did |
| --- | --- | --- | --- |
| 1 | In Assumptions, suggested defensive type checking and input validation for non-integer values | Contract states times are integer minutes as a caller guarantee; AC5 states: return False otherwise and never alter existing | Dropped defensive type validation or raising exceptions. Kept behavior strictly within AC1–AC5 returning Booleans. |
| 2 | In Assumptions, suggested sorting `existing` to optimize overlap checks | Contract states "Keep all inputs unchanged" and AC5 states "never alter existing" | Rejected sorting. In Python `list.sort()` mutates in-place, which violates AC5. Kept linear scan through `existing` without modifying it. |

**Boundary cases the assistant suggested that I kept as tests:**

- Touching end endpoint: `(660, 720)` with existing `[(600, 660)]` -> `True` (AC4)
- Touching start endpoint: `(570, 600)` with existing `[(600, 660)]` -> `True` (AC4)
- Start equal to current time: `start == now` (`540 == 540`) -> `False` (AC1)
- Exactly 120 minutes duration: `(720, 840)` -> `True` (AC2)
- One minute over duration limit: `(720, 841)` -> `False` (AC2)
- Zero-length request: `start == end` (`700, 700`) -> `False` (AC1)
- Booking extending to day limit: `end == 1440` -> `True` (AC1)
- Booking exceeding day limit: `end == 1441` -> `False` (AC1)
- Enclosing interval containing existing booking: `(570, 690)` containing `(600, 660)` -> `False` (AC4)

---

## 3. Task 2 — the first version (v1), read before it was run

v1 is saved as `code/original/booking_v1.py`, exactly as the assistant returned it: yes

**AC map.** One row per condition in v1. Quote the line.

| # | Line in v1 | AC it implements | Correct as written? If not, why |
| --- | --- | --- | --- |
| 1 | `if blocked: return False` | AC3 | Correct as written. Rejects any request when the room is marked as blocked. |
| 2 | `if not (0 <= start < end <= 1440): return False` | AC1 | Correct as written. Enforces day bounds and strict ordering: `0 <= start < end <= 1440`. |
| 3 | `if start <= now: return False` | AC1 | Correct as written. Enforces that the booking starts strictly in the future (`start > now`). |
| 4 | `if end - start > 120: return False` | AC2 | Correct as written. Enforces maximum duration of at most 120 minutes. |
| 5 | `if start <= b and end >= a: return False` | AC4 | Incorrect. Using `<=` and `>=` erroneously rejects touching endpoints (`start == b` or `end == a`), violating AC4 which permits touching bookings. Must use strict inequalities `<` and `>`. |
| 6 | `return True` | AC5 | Correct as written. Returns `True` only when AC1–AC4 all hold and leaves `existing` unchanged. |

**Anything in v1 that no AC asks for** (extra validation, a buffer between bookings, logging,
saving the booking, a different return type):

- None. The assistant's v1 stayed strictly within the required signature and contract without adding extra parameters, logging, exceptions, or external dependencies.

---

## 4. Task 3 — my tests

Base input for every row unless the row says otherwise: `now=540, blocked=False, existing=[(600, 660)]`.

| # | Test name | Request (start, end) | What differs from the base input | Expected | AC | Result on v1 | Result on final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | | | | | | | |
| 2 | | | | | | | |
| 3 | | | | | | | |
| 4 | | | | | | | |
| 5 | | | | | | | |
| 6 | | | | | | | |
| 7 | | | | | | | |
| 8 | | | | | | | |
| 9 | | | | | | | |
| 10 | | | | | | | |
| 11 | | | | | | | |

---

## 5. Task 4 — debugging with evidence

One row per defect you found — in v1, in a later version, or in your own tests. If v1 passed
everything, the row is the **new edge case you added**, with expected and actual equal, and the
cause column says why no change was needed.

| # | Input (the full call) | Expected | Actual | Cause (quote the line) | Fix | Who proposed the fix |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | | | | | | |

**The debug prompt I sent, and the assistant's answer** (leave the block empty if you did not use it):

```text
```

---

## 6. Task 5 — the critique

**The assistant's critique, pasted unedited:**

```text
(paste here)
```

| # | Suggestion | accept / reject | Reason — cite the AC or the contract line | Suite after the change |
| --- | --- | --- | --- | --- |
| 1 | | accept / reject | | |
| 2 | | accept / reject | | |

---

## 7. Change log — v1 to final

| # | What changed (the line, before → after) | Why | Evidence: the test or check that moved |
| --- | --- | --- | --- |
| 1 | | | |

---

## 8. Evidence — real output

### 8.1 My suite, final run

Paste the **complete** terminal output. For Python: everything `python -m unittest -v` printed.

```text
(paste here)
```

### 8.2 The checker, final run

Paste the **complete** output of `python tests/check_booking.py`. Paste it **last**: if you edit
this file afterwards, run the checker again and paste again.

```text
(paste here)
```

### 8.3 Path B only — three faults I planted myself

Break your own function on purpose, one line at a time, run your suite, restore the line.

| # | Line I changed (before → after) | AC it breaks | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

The three failing runs (Path A students leave this block empty):

```text
```

---

## 9. What still fails, and what the contract does not say

### 9.1 Checks I am keeping as FAIL or ERROR

The same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

### 9.2 Outside the contract

The contract says times are integers. It does not say what `can_book` does when one is not —
`600.5`, or the string `"600"`. What does **your** function do, and why is that the right call?

-

### 9.3 A bound that never decides

One of the bounds written in AC1 can never be the *only* reason a request is rejected. Which one,
and why?

-

---

## 10. Conclusion (120–180 words)

<!-- Answer all three, in your own words, without the assistant:
     (a) Explain the overlap condition in your final code — why those two comparisons, and why
         they let touching bookings through.
     (b) Which fault did your tests miss the longest, and what did the missing test have in common
         with the ones you already had?
     (c) What did you have to decide that neither the contract nor the assistant decided for you?
     Worthless: "the AI made a mistake and I fixed it."
     Worth everything: "F7 failed on can_book(570, 600, ...): v1 compared with <= on the start
     side, so a booking that ends exactly when another begins was rejected." -->

<!-- Write your conclusion below this line -->
