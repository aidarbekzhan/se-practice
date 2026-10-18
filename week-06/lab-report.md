# Week 06 — Lab report

**Name:** Aidar Bekzhan
**Group:** CS (SITE)
**Date:** 2026-10-18

Fill in every section. **Do not delete, rename or renumber the headings** — the checker and the
grader find your answers by them. Add rows to any table; never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Tool | Bolt.new |
| Exact model (as Bolt shows it, or `not displayed`) | Claude 3.5 Sonnet |
| Bolt project link (or `not shared`, and why) | not-shared (free tier session; project exported locally to original/ and prototype/) |
| Browser and version | Google Chrome 141.0 |
| If you could not use Bolt.new: the tool you used instead, and why | none |

---

## 2. Task 1 — define before generating

**Two predictions, written BEFORE you send the first prompt.** Where do you expect v1 to go wrong?
Fill the first three columns now; fill the last one after Task 3.

| # | What I expect to go wrong | AC it concerns | Was I right? (after Task 3) |
| --- | --- | --- | --- |
| 1 | I expect v1 to mishandle touching booking endpoints (such as 11:00–12:00 when an existing booking ends at 11:00) by checking start <= b.end && end >= b.start and falsely flagging it as Unavailable. | AC4 | Yes — v1 falsely reported Unavailable for touching booking 11:00–12:00 because it treated touching boundary minutes as an overlap. |
| 2 | I expect v1 to rely on the browser's system clock (new Date()) instead of providing an input to supply current time, making deterministic testing of current-time rules (like T6) impossible. | AC1 | Yes — v1 had no UI control for supplied current time and read system time directly, making case T6 Not testable on v1. |

**The initial prompt exactly as I sent it** — the deck's prompt with AC1–AC6 pasted in place of
`[paste AC1–AC6]`, nothing else changed:

```text
Build a small responsive Smart Campus Room Availability Checker. Requirements: AC1: Accept a candidate interval only when 0 ≤ start < end ≤ 1440 and start is after the supplied current time. AC2: Reject a booking longer than 120 minutes. AC3: Reject the request when the selected room is blocked. AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed. AC5: Show a clear Available / Unavailable decision without changing the existing booking data. AC6: The page remains usable at desktop and narrow/mobile width and gives understandable validation feedback. Use fictional sample data only. Keep the implementation simple and within one-page scope. Do not add authentication, backend services, analytics, or unrelated features. After building, briefly list the main files/components you created.
```

---

## 3. Task 2 — prototype v1

v1 export saved in `original/` and screenshot saved as `evidence/v1.png` **before** any cleanup
prompt: yes

**Bolt's list of the files/components it created, pasted unedited:**

```text
- package.json: Project configuration and dependencies (React 18, Vite)
- index.html: Main HTML document container with responsive viewport
- src/App.jsx: Main single-page interactive room availability checker component
- src/index.css: Clean responsive styling and badge indicators
```

**What v1 does — one line per thing that works, or visibly does not:**

- Displays room selection dropdown with fictional campus rooms and existing bookings.
- Accepts start and end time inputs with an interactive Check Availability button.
- Renders a colored Available or Unavailable decision badge upon clicking Check.
- Correctly identifies blocked rooms (Room 102) and rejects them as Unavailable.
- Correctly rejects intervals strictly longer than 120 minutes (e.g., 12:00-14:01).
- Visibly fails to accept touching intervals (11:00-12:00) due to inclusive <= boundary overlap check.
- Lacks a control for supplied current time, reading system clock new Date() and making T6 not testable.
- Mutates room booking data and persists to localStorage on check, causing repeat checks to fail.
- Lacks descriptive validation feedback when start time is reversed or after end time.

**Repair prompt** (only if the first build did not run — the deck allows one, then the result is
v1). Leave empty if you did not need it:

```text
```

---

## 4. Task 3 — the nine cases

Base for every case unless the row says otherwise: **current time 09:00**, room **not blocked**,
the room's **only booking 10:00–11:00**. The Expected column comes from AC1–AC6 — do not change it.
Write each result exactly as **Available**, **Unavailable** or **Not testable** (the page gives you
no way to set up the case). Save each final run as `evidence/final-T<n>.png`.

| # | Case | What you set up and request | Expected | AC | Result on v1 | Result on final | Final screenshot |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Touching | 11:00–12:00 | Available | AC4 | Unavailable | Available | final-T1.png |
| T2 | Overlap | 10:30–11:30 | Unavailable | AC4 | Unavailable | Unavailable | final-T2.png |
| T3 | Blocked | 11:00–12:00, room blocked | Unavailable | AC3 | Unavailable | Unavailable | final-T3.png |
| T4 | Exactly 2 hours | 12:00–14:00 | Available | AC2 | Available | Available | final-T4.png |
| T5 | Over 2 hours | 12:00–14:01 | Unavailable | AC2 | Unavailable | Unavailable | final-T5.png |
| T6 | Starts now | 09:00–09:30 (current time 09:00) | Unavailable | AC1 | Not testable | Unavailable | final-T6.png |
| T7 | Reversed times | 12:00–11:00, and the page says why | Unavailable | AC1, AC6 | Unavailable | Unavailable | final-T7.png |
| T8 | Same check twice | T1, then T1 again without reloading | Available | AC5 | Unavailable | Available | final-T8.png |
| T9 | Narrow screen | T1 at about 375 px wide | Available | AC6 | Unavailable | Available | final-T9.png |

---

## 5. Issue log — cleanup targets

One row per issue you chose to act on (or deliberately not act on). At least **two**: one
functional and one usability or code-quality issue when you have them. If v1 passed every case,
log a justified cleanup that preserves behaviour. Save a screenshot of each as
`evidence/issue-<n>.png`.

| # | Issue | Evidence: steps → expected → observed | Priority | Decision |
| --- | --- | --- | --- | --- |
| 1 | Touching interval falsely flagged as overlap (AC4) | Steps: Select Room 101 (existing booking 10:00-11:00), enter candidate 11:00-12:00, click Check. Expected: Available (AC4 explicitly allows touching endpoints). Observed: Unavailable because v1 used <= and >= on boundary endpoints. | High | Fix |
| 2 | Missing supplied current time control and system clock dependency (AC1) | Steps: Attempt to test case T6 (candidate 09:00-09:30 with supplied current time 09:00). Expected: An input field allowing user to supply current time = 09:00 and rejecting start <= now. Observed: v1 read system time new Date(), offering no way to supply current time; T6 was Not testable. | High | Fix |
| 3 | Lack of understandable validation error messages on invalid input ranges (AC6) | Steps: Enter reversed interval 12:00 to 11:00 and click Check. Expected: Unavailable decision accompanied by an understandable validation error explaining that start time must precede end time. Observed: Generic Unavailable badge with no explanatory message. | Medium | Fix |

---

## 6. Task 4 — cleanup with focused prompts

One issue per prompt. Paste every prompt **as sent** (every `[bracketed field]` and `AC#` filled
in) and Bolt's answer, unedited.

**Functional fix prompt, as sent, and Bolt's answer:**

```text
(paste here)
```

**Cleanup prompt, as sent, and Bolt's answer:**

```text
(paste here)
```

Add further blocks for further prompts.

**Every change or suggestion Bolt made, judged.** Accepting is a decision; so is rejecting. Cite
the AC (or the scope) that justifies it.

| # | What Bolt changed or suggested | accept / reject | Reason — cite the AC or the scope | Retest: which cases, result |
| --- | --- | --- | --- | --- |
| 1 | | accept / reject | | |
| 2 | | accept / reject | | |

---

## 7. Change log — v1 to final

Two to four concrete changes, each one retested.

| # | Issue | Decision | Change (file or component) | Result after retest |
| --- | --- | --- | --- | --- |
| 1 | | | | |
| 2 | | | | |

---

## 8. One generated component, in my own words

Pick one file or component Bolt generated that matters for AC1–AC5 — the one that decides
availability is the best choice. Name its path in backticks, then explain in your own words, without
the assistant, what it does and how it decides. 60 words or more.

**File:** `(write here, e.g. src/App.tsx)`

<!-- Write your explanation below this line -->

---

## 9. What still fails, and what the criteria do not say

### 9.1 Checks I am keeping as FAIL or ERROR

The same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

### 9.2 The end of the day

AC1 allows `end ≤ 1440` — a booking may end at 24:00. Can a user of your final page ask for
23:00–24:00? How — and if not, why is that acceptable or not? (This is the value you declare in
`submission.yml` under `assumptions.end_of_day`.)

-

### 9.3 Which "now"?

AC1 says "after the supplied current time". What did **v1** use as the current time, and what did
that mean for testing case T6?

-

---

## 10. Conclusion (120–180 words)

<!-- Answer all three, in your own words, without the assistant:
     (a) Which of your two predictions in section 2 was right, and what did v1 actually get wrong?
     (b) Which AI suggestion did you reject, or would have been wrong to accept, and why?
     (c) What is the difference between "the prototype looks finished" and "the prototype meets
         AC1-AC6" - shown with one case from section 4?
     Worthless: "Bolt made some mistakes and I fixed them."
     Worth everything: "T8 failed on v1: the Check button also added the booking to the list, so
     checking 11:00-12:00 a second time said Unavailable. AC5 says the check must not change the
     booking data." -->

<!-- Write your conclusion below this line -->
