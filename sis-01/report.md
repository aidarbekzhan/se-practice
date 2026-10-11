# SIS #01 — Software Engineering Fundamentals, With an AI in the Loop

<!--
  This is the only file you write your report in. README.md tells you what goes where.

  Rules the checker relies on:
  - Do not delete, rename or renumber the ## headings, the ### headings, or the **Label:** words.
  - Replace every "(write here)" and "(paste here)". None may be left when you submit.
  - Comments like this one are ignored by the word counter. Delete them or leave them.
-->

**Topic:** 1.3

---

## 1. Scenario

**Question:** How do systematic software engineering practices reduce total system costs across a product's lifecycle, and why does faster initial code synthesis not inherently reduce overall engineering expenditure?

**Users:** Department laboratory technicians, course instructors, and student teaching assistants coordinating hardware equipment loans.

**Problem:** Recurring equipment loss, manual scheduling friction, and high operational overhead caused by untracked kit reservations across departmental teaching laboratories.

**Constraints:** Must execute on legacy departmental Linux hardware limited to twenty concurrent database connections; cannot store sensitive student personal telephone numbers under departmental privacy rules.

**Risk:** Concurrency race conditions resulting in double-booking high-demand single-unit oscilloscopes, thereby disrupting mandatory laboratory midterm evaluations.

**Assumptions:** Fictional inventory of one hundred fifty laboratory kits across three engineering departments; fictional semester schedule lasting fifteen instructional weeks.

## 2. Analysis

<!-- 350–400 words. Your answer to the question, the trade-offs, and how it applies to your
     scenario. Explain at least two engineering decisions and why they fit the scenario. -->

(write here)

## 3. Review

<!-- 250–300 words. What Prompt B's critique said and what you did with it; your two source
     checks and your two substantive revisions, each with a reason. Point at the rows of the
     tables in section 9 ("verification row 2", "change-log row 1"). -->

(write here)

## 4. Conclusion

<!-- 100–150 words. Your recommendation for the scenario and its main limitation. -->

(write here)

## 5. Reflection

<!-- 150–200 words. NOT part of the main total. Written by you, not by the assistant:
     what helped, what you changed, what you learned. Specific beats flattering. -->

(write here)

## 6. References

<!-- Full references, one per line, each starting with "- ". Only sources you actually opened.
     Every URL used in the verification table must also appear here. Example:
     - Sommerville, I. (2016). Software Engineering, 10th ed., Global Edition. Pearson. Ch. 1.
-->

- (write here)

## 7. Appendix A — Initial outline

<!-- Written BEFORE you run Prompt A. Five points, your own words, numbered. These are the
     "five points" you paste into Prompt A. -->

1. Software lifecycle costs are predominantly driven by long-term evolution and maintenance rather than initial coding, meaning that undisciplined early development exponentially inflates future operating expenses.
2. Rapid automated code generation often introduces subtle architectural coupling and interface fragility, increasing the debugging and verification burden during subsequent feature expansions.
3. Establishing strict modular boundaries, automated regression suites, and clear specifications early reduces the effort required to adapt systems to evolving academic laboratory constraints.
4. Concurrency faults and integrity failures in resource scheduling cost substantially more to diagnose and remediate after deployment than resolving them during upfront architectural analysis.
5. Disciplined requirements engineering and connection-pool management directly prevent system crashes during peak reservation periods, avoiding costly unscheduled downtime and manual intervention.

## 8. Appendix B — AI exchanges

<!-- Complete prompts and complete responses, as text — never screenshots. Paste each inside
     the fenced block that follows its label. If a response itself contains ``` lines, open
     and close that block with ~~~~ instead. You may add B4, B5 … after B3 if you ran more. -->

### B1 — Draft (Prompt A)

- **Tool:** (write here)
- **Model:** (write here)
- **Date:** (write here)
- **Purpose:** contextual draft

<!-- Model: the exact model with its version, as the tool shows it (e.g. "GPT-5 Thinking",
     "Claude Sonnet 4.5"). If the tool does not show it, write: not displayed
     Date: YYYY-MM-DD -->

**Prompt:**

```text
(paste here)
```

**Response:**

```text
(paste here)
```

### B2 — Critique (Prompt B)

- **Tool:** (write here)
- **Model:** (write here)
- **Date:** (write here)
- **Purpose:** critical review of the draft

**Prompt:**

```text
(paste here)
```

**Response:**

```text
(paste here)
```

### B3 — Revision (Prompt C)

- **Tool:** (write here)
- **Model:** (write here)
- **Date:** (write here)
- **Purpose:** revision using my decisions and verified evidence

**Prompt:**

```text
(paste here)
```

**Response:**

```text
(paste here)
```

## 9. Appendix C — Evidence tables

### Verification table

<!-- At least two complete rows. Source and locator: title + page / slide / section / chapter,
     or title + URL + access date (YYYY-MM-DD). Decision: keep, qualify or reject — one word. -->

| AI claim | Source and locator | Evidence found | Decision |
| --- | --- | --- | --- |
| (write here) | (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) | (write here) |

### Change log

<!-- At least two substantive revisions. Your final version must differ from the AI wording,
     and the reason must say which evidence or scenario constraint made you change it. -->

| AI wording / suggestion | Your final version | Reason for change |
| --- | --- | --- |
| (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) |
