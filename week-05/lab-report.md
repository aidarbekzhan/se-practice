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
| 1 | `test_touching_end_is_allowed` | `(660, 720)` | None (base input) | True | AC4 | FAIL | PASS |
| 2 | `test_overlap_rejected` | `(630, 690)` | None (base input) | False | AC4 | PASS | PASS |
| 3 | `test_blocked_room_rejected` | `(660, 720)` | `blocked=True` | False | AC3 | PASS | PASS |
| 4 | `test_exactly_two_hours_allowed` | `(720, 840)` | None (base input) | True | AC2 | PASS | PASS |
| 5 | `test_over_two_hours_rejected` | `(720, 841)` | None (base input) | False | AC2 | PASS | PASS |
| 6 | `test_starts_now_rejected` | `(540, 570)` | None (base input) | False | AC1 | PASS | PASS |
| 7 | `test_zero_length_rejected` | `(700, 700)` | Zero duration (`start == end`) | False | AC1 | PASS | PASS |
| 8 | `test_reversed_times_rejected` | `(720, 700)` | Reversed interval (`start > end`) | False | AC1 | PASS | PASS |
| 9 | `test_ends_exactly_at_day_bound_allowed` | `(1380, 1440)` | Reaches day boundary (`end=1440`) | True | AC1 | PASS | PASS |
| 10 | `test_ends_after_day_bound_rejected` | `(1380, 1441)` | Past day boundary (`end=1441`) | False | AC1 | PASS | PASS |
| 11 | `test_empty_existing_allowed` | `(600, 660)` | `existing=[]` | True | AC4 | PASS | PASS |
| 12 | `test_multiple_bookings_overlap_second` | `(720, 780)` | `existing=[(600, 660), (700, 760)]` | False | AC4 | PASS | PASS |
| 13 | `test_existing_list_remains_unmodified` | `(780, 840)` | `existing=[(900, 960), (600, 660)]`, check unmutated | True | AC5 | PASS | PASS |
| 14 | `test_touching_start_is_allowed` | `(570, 600)` | None (base input) | True | AC4 | FAIL | PASS |
| 15 | `test_inside_existing_booking_rejected` | `(615, 645)` | None (base input) | False | AC4 | PASS | PASS |
| 16 | `test_contains_existing_booking_rejected` | `(570, 690)` | None (base input) | False | AC4 | PASS | PASS |

---

## 5. Task 4 — debugging with evidence

One row per defect you found — in v1, in a later version, or in your own tests. If v1 passed
everything, the row is the **new edge case you added**, with expected and actual equal, and the
cause column says why no change was needed.

| # | Input (the full call) | Expected | Actual | Cause (quote the line) | Fix | Who proposed the fix |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `can_book(660, 720, 540, False, [(600, 660)])` | True | False | Line 17 in v1: `if start <= b and end >= a:` | Replace `<=` and `>=` with strict `<` and `>`: `if start < b and end > a:` | Assistant (prompted with failing test and AC4) |

**The debug prompt I sent, and the assistant's answer** (leave the block empty if you did not use it):

```text
Prompt:
The expected result is True, but I get False. Here are my code and failing test. Explain the cause and propose the smallest fix without changing the contract.

Code:
for a, b in existing:
    if start <= b and end >= a:
        return False

Test:
can_book(660, 720, 540, False, [(600, 660)]) -> expected True, got False

Assistant reply:
Cause: In your overlap condition, `start <= b` evaluates to True when `start == b` (660 <= 660), and `end >= a` evaluates to True when `end >= a` (720 >= 600). As a result, touching endpoints are treated as an overlap and rejected, violating AC4 which specifies that touching endpoints are allowed.

Fix: Use strict inequalities `<` and `>` instead of `<=` and `>=`. An interval [start, end) overlaps [a, b) if and only if `start < b` and `end > a`.

Replace:
    if start <= b and end >= a:
with:
    if start < b and end > a:
```

---

## 6. Task 5 — the critique

**The assistant's critique, pasted unedited:**

```text
Review of can_book implementation:

1. Issue: No input type validation for start, end, now.
   Line: `if not (0 <= start < end <= 1440):`
   Concern: Contract line 1 ("Times are integer minutes..."). If a caller passes floats like 600.5 or strings "600", Python might either compare unexpectedly or raise a TypeError.

2. Issue: Redundant check for start <= now versus start < 0.
   Line: `if not (0 <= start < end <= 1440):` and `if start <= now:`
   Concern: AC1 ("0 <= start < end <= 1440, and start > now"). Since now is guaranteed to be >= 0, the check `start > now` already guarantees `start > 0 >= 0`. Thus `0 <= start` is logically subsumed whenever now >= 0.

3. Issue: No check ensuring each item in existing is a 2-tuple.
   Line: `for a, b in existing:`
   Concern: Contract line 3 ("existing contains valid (start, end) tuples"). If an invalid tuple or malformed element is provided, unpacking will raise ValueError.

4. Issue: No defense against caller mutating existing concurrently.
   Line: `for a, b in existing:`
   Concern: AC5 ("never alter existing"). The function iterates directly over `existing`; while it does not mutate it, if the caller modifies the list concurrently, behavior is undefined.
```

| # | Suggestion | accept / reject | Reason — cite the AC or the contract line | Suite after the change |
| --- | --- | --- | --- | --- |
| 1 | Add runtime type validation and reject or raise on non-integer inputs | reject | Contract guarantees that caller passes integer minutes and valid now; AC5 states to return Booleans only, never raise exceptions. | 16 tests passed |
| 2 | Remove redundant check `0 <= start` since `now >= 0` and `start > now` | reject | AC1 explicitly specifies `0 <= start < end <= 1440`; keeping it maintains 1-to-1 traceability with AC1 without performance harm. | 16 tests passed |
| 3 | Validate structure of items in `existing` list | reject | Contract states `existing` contains valid (start, end) tuples as a caller precondition; defensive validation violates scope. | 16 tests passed |
| 4 | Defensive copy of `existing` before iteration | reject | AC5 requires `can_book` itself to never alter `existing`; read-only iteration alters nothing and avoids unnecessary allocations. | 16 tests passed |

---

## 7. Change log — v1 to final

| # | What changed (the line, before → after) | Why | Evidence: the test or check that moved |
| --- | --- | --- | --- |
| 1 | `if start <= b and end >= a:` → `if start < b and end > a:` | Allow touching endpoints where new start equals existing end (`start == b`) or new end equals existing start (`end == a`) per AC4. | `test_touching_end_is_allowed` and `test_touching_start_is_allowed` moved from FAIL to PASS; checks F1, F7 moved from FAIL to PASS. |

---

## 8. Evidence — real output

### 8.1 My suite, final run

Paste the **complete** terminal output. For Python: everything `python -m unittest -v` printed.

```text
test_blocked_room_rejected (test_booking.BookingTests.test_blocked_room_rejected) ... ok
test_contains_existing_booking_rejected (test_booking.BookingTests.test_contains_existing_booking_rejected) ... ok
test_empty_existing_allowed (test_booking.BookingTests.test_empty_existing_allowed) ... ok
test_ends_after_day_bound_rejected (test_booking.BookingTests.test_ends_after_day_bound_rejected) ... ok
test_ends_exactly_at_day_bound_allowed (test_booking.BookingTests.test_ends_exactly_at_day_bound_allowed) ... ok
test_exactly_two_hours_allowed (test_booking.BookingTests.test_exactly_two_hours_allowed) ... ok
test_existing_list_remains_unmodified (test_booking.BookingTests.test_existing_list_remains_unmodified) ... ok
test_inside_existing_booking_rejected (test_booking.BookingTests.test_inside_existing_booking_rejected) ... ok
test_multiple_bookings_overlap_second (test_booking.BookingTests.test_multiple_bookings_overlap_second) ... ok
test_over_two_hours_rejected (test_booking.BookingTests.test_over_two_hours_rejected) ... ok
test_overlap_rejected (test_booking.BookingTests.test_overlap_rejected) ... ok
test_reversed_times_rejected (test_booking.BookingTests.test_reversed_times_rejected) ... ok
test_starts_now_rejected (test_booking.BookingTests.test_starts_now_rejected) ... ok
test_touching_end_is_allowed (test_booking.BookingTests.test_touching_end_is_allowed) ... ok
test_touching_start_is_allowed (test_booking.BookingTests.test_touching_start_is_allowed) ... ok
test_zero_length_rejected (test_booking.BookingTests.test_zero_length_rejected) ... ok

----------------------------------------------------------------------
Ran 16 tests in 0.001s

OK
```

### 8.2 The checker, final run

Paste the **complete** output of `python tests/check_booking.py`. Paste it **last**: if you edit
this file afterwards, run the checker again and paste again.

```text
Week 05 - can_book: the function, your tests, the evidence   (Path A)

PASS   F1   the six cases from the task table           6 of 6 cases
PASS   F2   AC1 time order and day bounds               5 of 5 cases
PASS   F3   AC1 the start is in the future              5 of 5 cases
PASS   F4   AC2 at most 120 minutes                     3 of 3 cases
PASS   F5   AC3 a blocked room accepts nothing          2 of 2 cases
PASS   F6   AC4 every kind of overlap is rejected       5 of 5 cases
PASS   F7   AC4 touching endpoints are allowed          3 of 3 cases
PASS   F8   AC4 every existing booking is checked       4 of 4 cases
PASS   F9   AC5 the result is a real Boolean            3 of 3 cases
PASS   F10  AC5 the inputs are left unchanged           2 of 2 cases
PASS   O1   the assistant's first version is kept       v1 kept (22 lines)
PASS   S1   your suite has at least 11 tests            16 tests
PASS   S2   your suite is green on your own code        16 tests, OK
PASS   M1   your tests catch a fault in AC1             caught by test_starts_now_rejected
PASS   M2   your tests catch a fault in AC1             caught by test_ends_after_day_bound_rejected
PASS   M3   your tests catch a fault in AC1             caught by test_zero_length_rejected
PASS   M4   your tests catch a fault in AC2             caught by test_exactly_two_hours_allowed
PASS   M5   your tests catch a fault in AC3             caught by test_blocked_room_rejected
PASS   M6   your tests catch a fault in AC4             caught by test_touching_end_is_allowed, test_touching_start_is_allowed
PASS   M7   your tests catch a fault in AC4             caught by test_multiple_bookings_overlap_second
PASS   M8   your tests catch a fault in AC4             caught by test_contains_existing_booking_rejected
PASS   M9   your tests catch a fault in AC5             caught by test_existing_list_remains_unmodified
PASS   M10  your tests catch a fault in AC5             caught by test_existing_list_remains_unmodified
PASS   L1   report 1: tool, model and language          tool, model and language recorded
PASS   L2   report 2: the plan, and what you corrected  plan pasted, 2 row(s) on what you corrected or verified
PASS   L3   report 3: v1 mapped to AC1-AC4              6 conditions mapped, AC1-AC4 all present
PASS   L4   report 4: at least 11 of your tests listed  16 tests listed
PASS   L5   report 5: debugging evidence                1 row(s) of input / expected / actual
PASS   L6   report 6: the critique, each point judged   critique pasted, 4 points judged
PASS   L7   report 7: change log                        1 change-log row(s)
PASS   L8   report 8.1: real output of your suite       suite output pasted
PASS   L9   report 10: conclusion of 120-180 words      163 words
------------------------------------------------------------------------------
v1 (code/original/booking_v1.py): passes F2 F3 F4 F5 F6 F9 F10 - fails F1 F7 F8 - identical to your final: no
SUMMARY pass=32 fail=0 error=0   (32 checks)
Behaviour and shape are clean. This says nothing about the quality of your review.
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
| none | All checks pass cleanly (32/32 PASS). |

### 9.2 Outside the contract

The contract says times are integers. It does not say what `can_book` does when one is not —
`600.5`, or the string `"600"`. What does **your** function do, and why is that the right call?

- In Python, passing a float such as `start=600.5` evaluates naturally via numeric comparison operators without error (e.g., `0 <= 600.5 < 700 <= 1440` evaluates accurately and returns a Boolean). Passing a non-numeric string such as `"600"` raises a `TypeError` during numeric inequality checks (`<`, `<=`). In `submission.yml`, I declare this assumption as `not-handled`. My function does not add explicit type inspection (e.g., `isinstance`) or defensive type coercion because the contract explicitly states times are integer minutes as a caller guarantee. Adding defensive checks would introduce unnecessary overhead and exceed the scope of AC1–AC5.

### 9.3 A bound that never decides

One of the bounds written in AC1 can never be the *only* reason a request is rejected. Which one,
and why?

- The lower bound `0 <= start` in AC1 can never be the sole or unique reason a booking request is rejected. The contract specifies that `now` is always valid in the range 0 to 1439 (so `now >= 0`). AC1 also mandates `start > now`. If `start < 0`, then since `now >= 0`, we have `start < 0 <= now`, which mathematically guarantees that `start <= now` is always true whenever `start < 0`. Consequently, any request where `0 <= start` is violated will simultaneously fail the `start > now` requirement. Therefore, `0 <= start` can never decide a rejection on its own.

---

## 10. Conclusion (120–180 words)

The overlap condition `start < b and end > a` correctly models half-open intervals `[start, end)` and `[a, b)`. Two intervals intersect if and only if each interval starts before the other ends. Using strict inequality `<` rather than `<=` is critical: when a new booking begins exactly at an existing booking's end (`start == b`), `start < b` evaluates to False, allowing touching endpoints to pass without conflict per AC4.

The fault our suite missed the longest was M8, where a flawed implementation only checked whether endpoints fell inside existing intervals. That implementation erroneously permitted requests that completely enveloped an existing booking (`start < a` and `end > b`). Standard table tests only tested partial overlaps, so adding a dedicated containment test (`test_contains_existing_booking_rejected`) was required to catch this gap.

Neither the contract nor the assistant decided whether to defensively sanitize non-integer inputs or sort bookings before iteration. I decided against defensive mutations or exceptions, preserving strict adherence to AC1–AC5 while ensuring `existing` remains completely untouched.
