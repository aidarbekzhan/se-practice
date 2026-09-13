# Week 01 — Manual vs AI: Comparison

**Name:** Aidar Bekzhan  
**Group:** SE-2026 / KBTU SITE  
**Date:** September 12, 2026  

---

## 1. Facts

| | Manual (Part 1) | Rocket (Part 2) |
| --- | --- | --- |
| Language / stack used | Python 3 (standard library) | React, Vite, Tailwind CSS, JavaScript |
| Time to first version that ran | 6 min | 2 min |
| Time to all 4 test cases passing | 14 min | 18 min (required follow-up debugging) |
| Number of attempts / prompts needed | 1 iteration (coded directly) | 2 prompts (initial + defect fix prompt) |
| Lines of code you actually wrote | 138 lines (including test suite) | 0 lines written (2 prompt specifications) |
| Did it handle invalid marks (case B)? | Yes (strictly checked `0 <= mark <= 100`) | No initially (accepted -5 and 101 as numbers) |
| Did it handle an empty list (case D)? | Yes (printed clear warning message) | No initially (rendered `NaN` and `Infinity`) |
| Did it use the ≥ 50 pass threshold? | Yes (configured to KBTU standard) | No initially (defaulted to US 60% threshold) |
| Output format matches the spec? | Yes (exact format and precision) | No (graphical KPI cards and charts) |
| Can you explain every line of it? | Yes, 100% | Partially (high-level React logic, not bundled UI boilerplate) |

---

## 2. Test results

| Case | Input | Manual output | Rocket output | Spec says | Match? |
| --- | --- | --- | --- | --- | --- |
| A | `85, 23, 45, 90, 92` | valid 5 · avg 67.00 · high 92 · low 23 · pass 60.0% | valid 5 · avg 67.00 · high 92 · low 23 · pass 40.0% | avg 67.00 · high 92 · low 23 · pass 60.0% | Manual: Yes / AI: No |
| B | `88, 47, -5, 101, abc, 73, 50, , 100` | valid 5 · avg 71.60 · high 100 · low 47 · pass 80.0% | valid 7 · avg 50.57 · high 101 · low -5 · pass 57.1% | avg 71.60 · high 100 · low 47 · pass 80.0% | Manual: Yes / AI: No |
| C | `10, 20, 30` | valid 3 · avg 20.00 · high 30 · low 10 · pass 0.0% | valid 3 · avg 20.00 · high 30 · low 10 · pass 0.0% | avg 20.00 · high 30 · low 10 · pass 0.0% | Manual: Yes / AI: Yes |
| D | `abc, , xyz` | No valid marks provided. | Valid: 0 · Avg: NaN · High: -Inf · Pass: NaN% | clear message, no crash | Manual: Yes / AI: No |

---

## 3. What the AI added that I never asked for

- **Full React/Tailwind Web Dashboard:** Instead of generating a simple script or utility, Rocket built an entire client-side single-page application with dark theme glassmorphism cards.
- **Interactive Distribution Histogram:** Visualized frequency intervals (0–20, 21–40, 41–60, 61–80, 81–100, >100) using animated bar components.
- **US-Centric Pass Threshold:** Imposed an arbitrary 60% passing mark assumption rather than prompting for educational institutional context.
- **CSV Data Export Feature:** Added an unprompted "Export to CSV" button and local state persistence.

---

## 4. What the AI got wrong or silently skipped

- **Failed Range Boundaries (Case B):** Rocket parsed tokens with `parseFloat(token)`. It correctly skipped non-numbers like `abc`, but failed to validate the domain constraint that educational marks must reside between 0 and 100. Consequently, `-5` and `101` were counted as valid marks, completely distorting the average (50.57 instead of 71.60) and extremes.
- **Arbitrary Pass Threshold (Case A):** Rocket assumed passing was $\ge 60\%$, causing mark `50` to be treated as a failure and dropping the pass rate from 60.0% to 40.0%.
- **Unhandled Zero Division (Case D):** When no valid marks were provided, Rocket divided 0 by 0 in JavaScript, rendering `NaN` and `Infinity` into the UI instead of presenting a clean user message.

---

## 5. The defect I asked Rocket to fix

**Prompt I used:**  
`Fix mark processing: 1. Only numbers strictly between 0 and 100 inclusive are valid marks (silently discard negative numbers, >100, and non-numeric text). 2. A mark passes if and only if it is >= 50. 3. If valid marks count is 0, do not display NaN or Infinity; display a clear warning banner: 'No valid marks provided.'`

**Result:** Fixed. Rocket integrated bounds checking `(num >= 0 && num <= 100)`, adjusted the threshold check to `>= 50`, and introduced an empty-state guard rendering a clean alert badge.

**What this tells me:**  
AI app builders excel at code generation and UI prototyping when constraints are made completely explicit. However, they lack domain context and will make silent assumptions (like default 60% thresholds or naive `parseFloat`) unless strict boundaries and edge cases are enforced by the engineer.

---

## 6. Reflection (200–300 words)

The AI tool genuinely accelerated the visual and scaffolding phases of development. Creating a modern web interface with responsive input containers, styled KPI cards, and dynamic chart elements took under two minutes in Rocket, whereas implementing the same front-end manually would have required over an hour of CSS and component setup.

However, the AI introduced significant time costs in domain correctness and edge-case verification. Rocket generated an interface that looked complete and polished on the surface, but harbored critical mathematical and logical defects. It naively treated negative marks (`-5`) and out-of-range scores (`101`) as valid, applied an American 60% passing threshold rather than KBTU's 50% rule, and produced raw `NaN%` values on empty inputs. If accepted without testing, this prototype would produce invalid grade reports in an educational environment.

Between the two artifacts, I would unequivocally put my name on the manual Python solution. The manual implementation is robust, transparent, handles boundary edge cases gracefully, and includes automated verification tests. While visually modest, its behavior is dependable and completely understandable.

This experiment proves that while AI can effortlessly handle syntax and boilerplate UI construction, the human software engineer remains fundamentally responsible for specification analysis, domain constraints, boundary validation, and end-to-end verification. A polished appearance is never a substitute for algorithmic correctness.
