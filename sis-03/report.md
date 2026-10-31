# SIS #03 — Report: Smart Campus Room Availability Checker

<!-- The ONLY file you write prose in. Keep every numbered heading (## 1. … ## 13.) and every
     ### sub-heading, and the **Label:** words — the checker finds your answers by them.
     Replace every "(write here)" and "(paste here)". Delete these <!-- --> comments if you like. -->

## 1. Setup and reuse

<!-- Model: the exact model with its version, as the tool shows it ("ChatGPT" is a tool, not a
     model). If the tool does not show it, write: not displayed
     Reuse: week-05 if code/original/booking_v1.py is your Week 05 v1, copied unedited;
     week-06 if web/original/ is your Week 06 v1 export; fresh if you generated it for this SIS. -->

| Item | Value |
| --- | --- |
| Coding assistant (tool) | ChatGPT (OpenAI) |
| Coding assistant model | GPT-4o (version 2024-08-06) |
| Bolt.new model | Claude 3.5 Sonnet |
| Bolt project link | not-shared |
| Language | python |
| Path | A |
| Python v1 from | week-05 |
| Web v1 from | week-06 |

## 2. Baseline — before any new AI exchange

<!-- Written by you, without AI, before the first exchange of this SIS. Commit and push it
     first (README §2). Reusing Week 05/06 work does not exempt you: this section is new. -->

### 2.1 Scope in my own words

**Scope:** A single-page web interface and an availability checking function that evaluate whether a candidate room booking time is valid for a single selected room, without authentication, server-side infrastructure, database persistence, or booking creation.

### 2.2 The acceptance criteria in my own words

| AC | In my own words |
| --- | --- |
| AC1 | Candidate booking interval minutes must satisfy 0 <= start < end <= 1440 and the start time must be strictly greater than the supplied current time. |
| AC2 | The total duration calculated as end minus start must not exceed 120 minutes, with exactly 120 minutes permitted. |
| AC3 | The request must be rejected immediately whenever the selected room is marked with blocked status. |
| AC4 | Candidate intervals must not overlap with any existing booking for the room; intervals touching only at boundary endpoints are considered non-overlapping and valid. |
| AC5 | The system must return an unambiguous Boolean Available or Unavailable decision without altering the list of existing bookings. |
| AC6 | The interface must provide clear, understandable validation messages and remain usable and responsive at narrow mobile widths. |

### 2.3 Likely failure points

<!-- At least two. The brief's examples: endpoint overlap, starts-now. -->

| # | Failure point | AC | How I will check it |
| --- | --- | --- | --- |
| 1 | Touching intervals at boundary endpoints (e.g. 660–720 when existing is 600–660) rejected because code uses inclusive comparison `<=` and `>=` instead of strict inequalities `<` and `>`. | AC4 | Test case T1 with candidate 660–720 and existing (600, 660), verifying it returns Available/True. |
| 2 | Booking starting exactly at the supplied current time (e.g. 540–570 when now is 540) accepted instead of rejected due to non-strict inequality `>=` instead of `>`. | AC1 | Test case T6 with candidate 540–570 and now 540, asserting that it returns Unavailable/False. |

### 2.4 The contract

| Parameter | Meaning | Type and allowed values |
| --- | --- | --- |
| `start` | Proposed booking start time in minutes after midnight | integer, 0 <= start < 1440 |
| `end` | Proposed booking end time in minutes after midnight | integer, 1 <= end <= 1440 |
| `now` | Current reference time in minutes after midnight | integer, 0 <= now < 1440 |
| `blocked` | Administrative flag indicating whether the room is unavailable | boolean, True or False |
| `existing` | Collection of already confirmed room reservations | iterable of (start, end) integer pairs |
| returns | Decision indicating if the candidate time can be booked | boolean: True if AC1-AC4 hold, False otherwise |

### 2.5 Initial assumptions and manual checks

**Assumptions:**

1. Time values are represented strictly as whole integers representing minutes from 00:00 to 24:00 (0 to 1440).
2. Intervals are treated as half-open [start, end), including the start minute and excluding the end minute.

**Checked manually:**

- Verified that endpoint touching intervals share only an infinitesimal boundary instant and thus do not overlap.
- Confirmed that candidate intervals spanning past midnight (> 1440) are strictly outside the single-day contract scope.

## 3. Python v1 review

<!-- One row per conditional branch in code/original/booking_v1.py (your language's v1 on
     Path B). Quote the condition exactly. AC1-AC4 must all appear in the AC column. -->

| Branch in v1 (quoted) | AC | Satisfies it? | Why |
| --- | --- | --- | --- |
| `if blocked:` | AC3 | Yes | Correctly rejects the request immediately if the room is marked as blocked. |
| `if not (0 <= start < end <= 1440):` | AC1 | Yes | Validates day limits and ensures start is non-negative and strictly before end. |
| `if start <= now:` | AC1 | Yes | Guarantees that the booking start time is strictly in the future relative to now. |
| `if end - start > 120:` | AC2 | Yes | Rejects durations longer than 120 minutes while allowing exactly 120 minutes. |
| `if start <= b and end >= a:` | AC4 | No | Uses inclusive comparisons `<=`/`>=` instead of `<`/`>`, falsely rejecting touching intervals like 660-720 when existing is (600, 660). |

## 4. Prototype v1 in Bolt.new

**Prompt as sent:**

~~~~text
Build a small responsive Smart Campus Room Availability Checker. Requirements: AC1: Accept a candidate interval only when 0 ≤ start < end ≤ 1440 and start is after the supplied current time. AC2: Reject a booking longer than 120 minutes. AC3: Reject the request when the selected room is blocked. AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed. AC5: Show a clear Available / Unavailable decision without changing the existing booking data. AC6: The page remains usable at desktop and narrow/mobile width and gives understandable validation feedback. Use fictional sample data only. Keep the implementation simple and within one-page scope. Do not add authentication, backend services, analytics, or unrelated features. After building, briefly list the main files/components you created.
~~~~

<!-- Main generated files or components, with their path inside web/original/
     (for example src/App.tsx). At least two. -->

| Generated file or component | Path | Its role |
| --- | --- | --- |
| Main application component | src/App.jsx | Single-page React UI managing room selection, interval inputs, availability evaluation, and badge rendering. |
| Application stylesheet | src/index.css | Responsive CSS styling, layout containers, and color-coded status badges for mobile and desktop screens. |

**What v1 does:**

- Displays room selection dropdown with fictional campus rooms and existing bookings.
- Accepts start and end time inputs with an interactive Check Availability button.
- Renders a colored Available or Unavailable decision badge upon clicking Check.
- Correctly identifies blocked rooms (Room 102) and rejects them as Unavailable.
- Correctly rejects intervals strictly longer than 120 minutes (e.g., 12:00-14:01).
- Visibly fails to accept touching intervals (11:00-12:00) due to inclusive <= boundary overlap check.
- Lacks a control for supplied current time, reading system clock new Date() and making T6 not testable.
- Mutates room booking data and persists to localStorage on check, causing repeat checks to fail.
- Lacks descriptive validation feedback when start time is reversed or after end time.

## 5. Test cases — executed on both artifacts

<!-- Base for every case unless the row says otherwise: now = 540, blocked = False,
     existing = [(600, 660)]. Do not change the first four columns.
     Python columns: True, False or Error (it raised) — what the call actually returned.
       T11: the result of the SECOND call. T12: n/a.
       Path A: the checker runs both of your files on T1-T11 and compares (C2, C3).
     Page columns: Available, Unavailable or Not testable — what the page actually showed.
     Never write a result you did not observe. -->

| Case | Name | Input | Expected | Python v1 | Python final | Page v1 | Page final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Touching | 660–720 | Available | | | | |
| T2 | Overlap | 630–690 | Unavailable | | | | |
| T3 | Blocked | 660–720, blocked | Unavailable | | | | |
| T4 | Exactly 120 min | 720–840 | Available | | | | |
| T5 | 121 min | 720–841 | Unavailable | | | | |
| T6 | Starts now | 540–570 | Unavailable | | | | |
| T7 | Reversed | 720–660 | Unavailable | | | | |
| T8 | Ends at midnight | 1380–1440 | Available | | | | |
| T9 | Past midnight | 1380–1441 | Unavailable | | | | |
| T10 | Second booking | 720–780, existing (600–660), (700–760) | Unavailable | | | | |
| T11 | Same check twice | 660–720, twice | Available | | | | |
| T12 | Narrow screen | T1 at ~375 px wide | Available | n/a | n/a | | |

## 6. Traceability

<!-- His table. Implementation / file: where the rule lives (booking.py line, a component).
     Test input: the case IDs from section 5. v1 / final actual: what those cases gave. -->

| AC | Implementation / file | Test input | Expected | v1 actual | Final actual |
| --- | --- | --- | --- | --- | --- |
| AC1 | (write here) | (write here) | (write here) | (write here) | (write here) |
| AC2 | (write here) | (write here) | (write here) | (write here) | (write here) |
| AC3 | (write here) | (write here) | (write here) | (write here) | (write here) |
| AC4 | (write here) | (write here) | (write here) | (write here) | (write here) |
| AC5 | (write here) | (write here) | (write here) | (write here) | (write here) |
| AC6 | (write here) | (write here) | (write here) | (write here) | (write here) |

## 7. Issue log

<!-- At least two, from v1 — a functional defect and a usability or code-quality issue where you
     have them. If every case passed on v1, log the preventive cleanup and say why.
     Reproduction names a case (T1-T12) or an AC. Priority: High, Medium or Low.
     Prompt / change: the focused prompt you sent, and what changed. Never "make it better". -->

| # | Issue | Reproduction | Priority | Prompt / change | Retest result |
| --- | --- | --- | --- | --- | --- |
| 1 | (write here) | (write here) | (write here) | (write here) | (write here) |
| 2 | (write here) | (write here) | (write here) | (write here) | (write here) |

**Before / after:** `evidence/before-1.png` → `evidence/after-1.png` show issue (write here)

## 8. Critique decisions

<!-- The AI's review against AC1-AC6 (stage C), claim by claim. At least three rows.
     How I verified it: the case, test or run that confirmed or refuted the claim.
     Decision: accept, reject or modify. At least one reject or modify — the reflection asks for it. -->

| # | AI claim or recommendation | How I verified it | Decision | Reason (AC or case) |
| --- | --- | --- | --- | --- |
| 1 | (write here) | (write here) | (write here) | (write here) |
| 2 | (write here) | (write here) | (write here) | (write here) |
| 3 | (write here) | (write here) | (write here) | (write here) |

## 9. Coding-agent analysis

### 9.1 The loop

<!-- One real pass through the loop from this assignment — with your assistant or with Bolt. -->

| Step | What happened in this assignment |
| --- | --- |
| User goal | (write here) |
| Model / plan | (write here) |
| Tool call | (write here) |
| Observation | (write here) |
| Next step | (write here) |
| Human review | (write here) |

### 9.2 Context, tools and permissions

<!-- At least three rows. Last column: Observed (you saw it happen) or Assumed (you infer it
     about the internals). Use both at least once. -->

| Tool | Context it used | Tools or permissions | Observed or assumed |
| --- | --- | --- | --- |
| (write here) | (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) | (write here) |

### 9.3 Checkpoint and dependability

**Safety checkpoint:** (write here)

**Reliability, security, responsibility:** (write here)

## 10. Reflection

<!-- 100-200 words, in your own words, no AI. Compare AI-assisted coding (the Python part) with
     vibe coding (the Bolt part); one example each of a reliability, an availability/usability and
     a security risk; why review, tool permissions and tests stay human responsibilities; one AI
     recommendation you rejected or modified, and why; what you would improve next without
     expanding the scope. -->

(write here)

## 11. Appendix A — AI exchanges

<!-- At least four. Complete prompts and complete responses, as text — never screenshots. Paste
     each inside the ~~~~ block that follows its label.
     Stage: Plan, Generate, Critique or Repair (the brief's A-D) — at least one of each.
     Source: this SIS, week-05 or week-06. Reused exchanges keep their original date.
     The Generate exchange for Python must contain your v1 exactly as it is in code/original/.
     Add B5, B6 … if you ran more. -->

### B1

- **Tool:** ChatGPT (OpenAI)
- **Model:** GPT-4o (version 2024-08-06)
- **Date:** 2026-10-11
- **Stage:** Plan
- **Source:** week-05

**Prompt:**

~~~~text
I need to implement a Python function `can_book(start, end, now, blocked, existing)` for a campus room availability checker. Times are integer minutes after midnight (0 to 1440).
Criteria:
- AC1: 0 <= start < end <= 1440, and start > now.
- AC2: Duration <= 120 minutes.
- AC3: Reject if blocked is True.
- AC4: Reject overlap with existing bookings [(a, b), ...]; touching endpoints do not overlap.
- AC5: Return True only if AC1-AC4 hold, False otherwise, and never mutate existing.
Please provide an implementation plan specifying the order of checks, assumptions, and key boundary test cases before writing code.
~~~~

**Response:**

~~~~text
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
~~~~

### B2

- **Tool:** ChatGPT (OpenAI)
- **Model:** GPT-4o (version 2024-08-06)
- **Date:** 2026-10-11
- **Stage:** Generate
- **Source:** week-05

**Prompt:**

~~~~text
The plan looks good. Please generate the Python implementation of `can_book(start, end, now, blocked, existing)` following the acceptance criteria AC1 through AC5 using only Python's standard library. Do not include any explanations or external dependencies.
~~~~

**Response:**

~~~~text
def can_book(start, end, now, blocked, existing):
    # AC3: The room is not blocked.
    if blocked:
        return False

    # AC1: 0 <= start < end <= 1440, and start > now.
    if not (0 <= start < end <= 1440):
        return False
    if start <= now:
        return False

    # AC2: Duration is at most 120 minutes.
    if end - start > 120:
        return False

    # AC4: No overlap with an existing booking. Touching endpoints are allowed.
    for a, b in existing:
        if start <= b and end >= a:
            return False

    # AC5: Return True only when AC1-AC4 hold. Return False otherwise and never alter existing.
    return True
~~~~

### B3

- **Tool:** (write here)
- **Model:** (write here)
- **Date:** (write here)
- **Stage:** (write here)
- **Source:** (write here)

**Prompt:**

~~~~text
(paste here)
~~~~

**Response:**

~~~~text
(paste here)
~~~~

### B4

- **Tool:** (write here)
- **Model:** (write here)
- **Date:** (write here)
- **Stage:** (write here)
- **Source:** (write here)

**Prompt:**

~~~~text
(paste here)
~~~~

**Response:**

~~~~text
(paste here)
~~~~

## 12. Appendix B — Test output

### 12.1 Your suite

<!-- The complete terminal output of your final suite. Path A: python -m unittest -v, run inside
     code/ — the part ending in "Ran N tests" and OK or FAILED. -->

~~~~text
(paste here)
~~~~

### 12.2 Path B only — three faults you planted

<!-- Path A: leave this table as it is. Path B: three rows — the line you broke, the AC it
     breaks, the test that failed. -->

| # | Line you broke | AC | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

## 13. Remaining limitations and known fails

<!-- One row per check ID in submission.yml known_fails, and any limitation you know of.
     If the checker is clean and you know of none, one row that says so. -->

| Check ID or limitation | Why it stays | What I would do next |
| --- | --- | --- |
| (write here) | (write here) | (write here) |
