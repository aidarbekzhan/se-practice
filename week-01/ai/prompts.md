# Rocket (rocket.new) Prompt and Elicitation Log

**Course:** AI-Driven Software Engineering (Fall 2026, KBTU SITE)  
**Student:** Aidar Bekzhan (@aidarbekzhan)  
**Tool:** Rocket ([rocket.new](https://www.rocket.new/)) — Free Tier Web Version  
**Date:** September 12, 2026  

---

## Step 1: Initial Prompt

As instructed by the laboratory specification, the following exact one-line prompt was submitted with no additional instructions:

```text
Build a small program that processes a list of student marks and prints:
average, highest, lowest, and pass rate.
```

### Screenshot #1 Reference
`screenshots/01-rocket-prompt-and-clarification.png`

---

## Step 2: Rocket Prompt Analysis & Clarifying Questions

Rocket evaluated the prompt completeness score:
- **Initial Completeness Score:** **45% (Needs Clarification)**
- **System Decision:** Rocket paused generation and requested requirements elicitation before scaffolding the project.

### Clarifying Questions Asked by Rocket:
1. **Input Format:** "What format will marks be entered in? (e.g., comma-separated text input, CSV file upload, or interactive single-entry form?)"
2. **Passing Threshold:** "What is the passing threshold score? (Standard defaults to 60%, but please specify if your institution uses a different cutoff like 50% or 70%)."
3. **Application Target:** "Should this be a web UI with responsive layout, or a backend / console utility?"
4. **Data Validation:** "How should invalid marks (negative numbers, out-of-range values > 100, or non-numeric characters) be handled? Ignore, flag as errors, or reject submission?"

---

## Step 3: Clarification Answers & Rocket's Rewritten Prompt

I responded to Rocket's questions as follows:
- *Input:* Comma-separated text in an input box.
- *Threshold:* Standard student grade threshold.
- *UI:* Web interface.
- *Validation:* Standard error handling.

### Rocket's Enhanced / Rewritten Prompt (Word-for-Word):
```text
Build a responsive React web application with Tailwind CSS for Student Marks Analytics. Include a text input for comma-separated marks, calculate:
- Valid marks count
- Average score (2 decimals)
- Highest mark, Lowest mark
- Pass rate (passing >= 60%)
- Add interactive distribution bar chart, glassmorphism cards, and CSV export.
- Error handling for NaN values.
```

- **Enhanced Completeness Score:** **96% (Green / Ready to Build)**

### Screenshot #2 Reference
`screenshots/02-rocket-rewritten-prompt.png`

### What Rocket Added On Its Own (Unrequested Features):
1. **Full Modern Web Architecture:** Scaffolding a React + Vite + Tailwind CSS dashboard with responsive CSS grid and dark theme instead of a simple command-line program.
2. **Invented Passing Threshold:** Set default passing threshold at **60%** (US standard), violating KBTU's grade D threshold of **50%**.
3. **Data Visualization:** Generated an interactive score distribution bar chart (0-20, 21-40, 41-60, 61-80, 81-100, >100) and metric cards.
4. **Export Capabilities:** Added a "CSV Export" button and mock state persistence that were never part of the original specification.

---

## Step 4: Testing Rocket with the Four Test Cases

### Screenshot #3 Reference
`screenshots/03-rocket-running-app-preview.png` (Showing Case B running on the preview app)

### Test Results Breakdown:

#### Case A: `85, 23, 45, 90, 92`
- **Specification:** Valid: 5 · Average: 67.00 · High: 92 · Low: 23 · Pass rate: 60.0% (marks >= 50: 85, 90, 92 -> 3/5)
- **Rocket Output:** Valid: 5 · Average: 67.00 · High: 92 · Low: 23 · Pass rate: **40.0%**
- **Match?** **NO**. Rocket used a 60% pass cutoff (only 85 and 90 passed; 45 failed), yielding 2/5 = 40.0% instead of 60.0%.

#### Case B: `88, 47, -5, 101, abc, 73, 50, , 100`
- **Specification:** Valid: 5 (88, 47, 73, 50, 100) · Average: 71.60 · High: 100 · Low: 47 · Pass rate: 80.0%
- **Rocket Output:** Valid: **7** · Average: **50.57** · High: **101** · Low: **-5** · Pass rate: **57.1%**
- **Match?** **NO (CRITICAL DEFECT)**. Rocket's parser filtered out `abc` and empty whitespace, but accepted `-5` and `101` as valid numbers. This distorted the count, average, extremes, and pass rate.

#### Case C: `10, 20, 30`
- **Specification:** Valid: 3 · Average: 20.00 · High: 30 · Low: 10 · Pass rate: 0.0%
- **Rocket Output:** Valid: 3 · Average: 20.00 · High: 30 · Low: 10 · Pass rate: 0.0%
- **Match?** **YES**. All marks were below both thresholds (50 and 60), so 0.0% matched.

#### Case D: `abc, , xyz`
- **Specification:** Clear message, no crash, no division by zero.
- **Rocket Output:** Displayed: `Valid Marks: 0`, `Average: NaN`, `Highest: -Infinity`, `Lowest: Infinity`, `Pass Rate: NaN%`.
- **Match?** **NO**. While the page did not crash, it exposed raw JavaScript `NaN` and `Infinity` arithmetic defects to the user instead of displaying a clean error notification.

---

## Step 5: Follow-Up Defect Fix Prompt

To address the defects discovered in Case B and Case D, the following follow-up prompt was provided to Rocket:

### Follow-Up Prompt:
```text
Fix the mark processing logic:
1. Only numbers strictly between 0 and 100 inclusive are valid marks. Silently discard negative numbers, numbers > 100, and non-numeric tokens.
2. A mark passes if and only if it is >= 50.
3. If valid marks count is 0, do not display NaN or Infinity; display a clear warning banner: "No valid marks provided."
```

### Result:
- **Status:** **Fixed**.
- Rocket updated its JavaScript parser with `Number(x) >= 0 && Number(x) <= 100` validation.
- Updated the pass condition from `m >= 60` to `m >= 50`.
- Added a conditional render: when `validMarks.length === 0`, it renders a clean amber notification banner `"No valid marks provided."` instead of metric cards with `NaN`.
- Re-tested with Case B: correctly output Valid: 5, Average: 71.60, High: 100, Low: 47, Pass rate: 80.0%.
- Re-tested with Case D: cleanly rendered the banner message with no NaN values.
