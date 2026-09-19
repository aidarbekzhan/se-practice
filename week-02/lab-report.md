# Lab report — Practice #02: The Prompt Is an Engineering Input

**Name:** Aidar Bekzhan
**Group:** CS (SITE)
**Date:** September 19, 2026

> Fill in every section. **Do not delete or renumber the headings** — the grading pass reads them
> by number. If something did not happen, write "did not happen" and why; an empty section and a
> fabricated one are graded the same way.

---

## 1. The frozen experiment

| | |
| --- | --- |
| AI assistant | ChatGPT (OpenAI) |
| Exact model name | GPT-4o |
| Implementation language | Python |
| Date of the runs | September 19, 2026 |

**Non-Python students only** — paste your substituted Prompt B text here, so the substitution can
be checked:

```
n/a — used Python
```

**Confirmations:**

- Each prompt was sent in a **fresh chat**: yes
- No follow-up questions were asked before Part 7: yes
- Every output was saved **before** any editing: yes

---

## 2. Prompt A — minimal

**Prompt sent** (should be exactly one sentence):

```
Write Python code to analyze student marks.
```

**Assumptions the AI made that I never gave it** — list them, one per line. A data format, a pass
threshold, a rounding rule, an input method, an invented feature all count.

1. Assumed function name `analyze_student_marks(marks)` with only one argument instead of `analyze_marks(marks, pass_mark=50)`.
2. Assumed an invented console printing behavior (`print(...)`) with formatted report strings.
3. Assumed an empty list should print a warning message and return `None` rather than raising a `ValueError`.
4. Assumed returning a custom dictionary with keys `total`, `average`, `highest`, `lowest`, and `pass_rate` without type contracts.
5. Assumed an example execution block `if __name__ == "__main__":` with sample data.

**Questions it should have asked and did not:**

1. What exact function name, parameter signature, and default parameter values should be implemented?
2. What exact keys and data structure should the function return?
3. How should edge cases and invalid inputs (empty lists, strings, negative marks, marks over 100) be handled?
4. What is the passing threshold, how is pass rate calculated, and should floating-point numbers be rounded?

**Is the function named `analyze_marks` with the required signature?** no — it is called `analyze_student_marks(marks)`

**First impression before testing** (one sentence — you will compare this with section 6 later):
The generated script looks like a clean introductory Python utility, but it completely fails the specification because it guessed the function name, signature, and error handling.

---

## 3. Prompt B — structured context

**Prompt sent** (paste it in full, including any substitutions):

```
You are a Python developer. Implement analyze_marks(marks, pass_mark=50). Return
average, highest, lowest, and pass_rate in a dictionary. Accept marks from 0 to 100;
raise ValueError for an empty list, non-numeric values, or out-of-range values. Use
no external libraries. Return code plus a short explanation.
```

**What B fixed compared to A:**

1. API signature and naming: explicitly specified `analyze_marks(marks, pass_mark=50)` and the exact required return keys (`average`, `highest`, `lowest`, `pass_rate`).
2. Input validation: explicitly mandated raising `ValueError` on empty lists, non-numeric items, and values outside the 0–100 range.
3. Noise elimination: eliminated unrequested CLI printing, extra keys (`total`), and unnecessary sample execution code.

**What B still leaves open:**

1. Precision and rounding: did not define whether `average` and `pass_rate` should be rounded to two decimals or returned as raw floats (producing `66.66666666666666` instead of `66.67`).
2. Pass condition boundary: did not define whether passing is `>= pass_mark` or `> pass_mark`, leaving marks exactly on the pass mark ambiguous.
3. Representation scale: did not specify whether `pass_rate` should be formatted as a percentage (`0..100`) or a decimal fraction (`0..1`).
4. Python boolean type leak: did not clarify that booleans (which inherit from `int` in Python) must be rejected.

---

## 4. Prompt C — examples and tests

**What I appended to Prompt B:**

```
Example: analyze_marks([40, 60, 80], 50) → average 60, highest 80, lowest 40,
pass_rate 66.67. Include tests for: one mark, decimals, custom pass_mark, empty list,
text value, and marks below 0 or above 100. State any remaining assumptions before
the code.
```

**Tests the AI wrote for itself** — how many, and which situations do they cover?

The AI generated 7 test assertions covering 6 distinct validation scenarios:

| Situation | Covered by the AI's tests? |
| --- | --- |
| one mark | yes (`[85]`, verifies single-element statistics) |
| decimals | yes (`[49.5, 50.0]`, verifies float handling) |
| custom pass_mark | yes (`[60, 70, 80]` with `pass_mark=70`) |
| empty list | yes (`[]`, verifies ValueError) |
| text value | yes (`[40, "60"]`, verifies ValueError) |
| below 0 / above 100 | yes (`[-5, 50]` and `[50, 105]`, verifies ValueError) |

**Do the AI's own tests pass against the AI's own code?** yes

**Do they agree with the harness in section 6?** yes — all 6 cases match the harness expectations.

**Assumptions C stated explicitly before the code:**
1. Marks must be numeric (`int` or `float`), strictly excluding Python `bool`.
2. A mark is considered passing when `mark >= pass_mark` (inclusive boundary).
3. `pass_rate` is a percentage (0 to 100) rounded to 2 decimal places matching `66.67`.
4. `average` is rounded to 2 decimal places when necessary.
5. Any invalid input (empty list, non-numeric value, or marks < 0 or > 100) raises `ValueError`.

---

## 5. Prompt D — my combined prompt

**The complete prompt I wrote** (one message, sent to a fresh chat):

```
You are a senior Python engineer. Write a self-contained Python function analyze_marks(marks, pass_mark=50) that analyzes student marks and returns a dictionary with keys: 'average', 'highest', 'lowest', and 'pass_rate'.

Requirements:
1. Validation:
   - 'marks' must be a non-empty sequence of numbers. Raise ValueError if 'marks' is empty, None, or not a sequence.
   - Every mark must be an int or float, strictly excluding bool (raise ValueError if isinstance(x, bool) or not isinstance(x, (int, float))).
   - Every mark must be between 0 and 100 inclusive (0 <= mark <= 100). Raise ValueError otherwise.
   - 'pass_mark' must be a valid numeric value (int or float, not bool) between 0 and 100 inclusive (default: 50). Raise ValueError otherwise.
2. Calculations:
   - 'average': arithmetic mean of marks, rounded to 2 decimal places (float).
   - 'highest': maximum mark (int or float).
   - 'lowest': minimum mark (int or float).
   - 'pass_rate': percentage of marks that pass (where mark >= pass_mark), calculated as (count_passed / total_marks) * 100, rounded to 2 decimal places (float).
3. Constraints:
   - Use no external libraries (standard library only).
   - Return clean Python code containing only the function definition, without extra markdown or boilerplate.
```

**What I deliberately added that A, B and C did not have:**

1. Strict boolean type guard: explicitly prevented Python's subtype trap (`isinstance(True, int) == True`) by mandating `isinstance(x, bool)` check before numeric validation.
2. Parameter validation for `pass_mark`: required `pass_mark` to be a valid numeric value (not bool) between 0 and 100.
3. Explicit rounding and return contract: mandated `round(val, 2)` for float calculations and defined `pass_rate` as a percentage (0–100 scale), removing precision ambiguities.

**The ambiguity I found in the specification, and how I resolved it inside Prompt D:**
The specification required returning `average`, `highest`, `lowest`, and `pass_rate` and showed `pass_rate 66.67` in the example, but left two critical ambiguities unaddressed:
First, it did not state whether `pass_rate` was a percentage (0..100) or a ratio (0.0..1.0), nor did it specify whether floating-point numbers should be rounded to 2 decimal places or preserved as full-precision IEEE-754 floats (which produce `66.66666666666666` in Case 1).
Second, in Python, `bool` is a subclass of `int` (`isinstance(True, int)` evaluates to `True`), meaning boolean values would silently pass naive type checks without raising `ValueError`.
I resolved both inside Prompt D by explicitly requiring `round(..., 2)` on percentage calculations (0–100 scale) and explicitly excluding boolean types via `isinstance(x, bool)`.

---

## 6. Test results — the evidence

Six cases × four prompts. Verdicts are **PASS**, **FAIL** or **ERROR** only.

| # | Call | Required | A | B | C | D |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `analyze_marks([40, 60, 80], 50)` | avg 60 · high 80 · low 40 · rate 66.67 | ERROR | PASS | PASS | PASS |
| 2 | `analyze_marks([100], 50)` | avg 100 · high 100 · low 100 · rate 100 | ERROR | PASS | PASS | PASS |
| 3 | `analyze_marks([49.5, 50], 50)` | avg 49.75 · high 50 · low 49.5 · rate 50 | ERROR | PASS | PASS | PASS |
| 4 | `analyze_marks([], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| 5 | `analyze_marks([40, "60"], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| 6 | `analyze_marks([-1, 50, 101], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| | **Totals** | | 0/6 | 6/6 | 6/6 | 6/6 |

**For every FAIL and ERROR above, one line: what was returned or raised instead.**

| Prompt | Case | What actually happened |
| --- | --- | --- |
| A | 1 | ERROR: module defines no callable named 'analyze_marks' (defined 'analyze_student_marks') |
| A | 2 | ERROR: module defines no callable named 'analyze_marks' (defined 'analyze_student_marks') |
| A | 3 | ERROR: module defines no callable named 'analyze_marks' (defined 'analyze_student_marks') |
| A | 4 | ERROR: module defines no callable named 'analyze_marks' (defined 'analyze_student_marks') |
| A | 5 | ERROR: module defines no callable named 'analyze_marks' (defined 'analyze_student_marks') |
| A | 6 | ERROR: module defines no callable named 'analyze_marks' (defined 'analyze_student_marks') |

### Pasted terminal output — all four runs

> This is the part that makes the table above count. Paste the **whole** output, unedited,
> including the header lines. A table with nothing behind it is not accepted.

**Prompt A**

```
ERROR: code\prompt_a.py defines no callable named 'analyze_marks'.
All six cases count as ERROR. Record that in lab-report.md.
```

**Prompt B**

```
========================================================================
analyze_marks harness — code/prompt_b.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.66666666666666
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: The marks list cannot be empty.
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: Invalid non-numeric mark found: 60
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: Mark out of valid range (0-100): -1
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (code/prompt_b.py)
========================================================================
```

**Prompt C**

```
========================================================================
analyze_marks harness — code/prompt_c.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.67
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: Marks collection cannot be empty.
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: Non-numeric mark encountered: 60
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: Mark out of valid range (0-100): -1
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (code/prompt_c.py)
========================================================================
```

**Prompt D**

```
========================================================================
analyze_marks harness — code/prompt_d.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.67
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: marks cannot be empty
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: Invalid non-numeric mark: 60
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: Mark out of range [0, 100]: -1
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (code/prompt_d.py)
========================================================================
```

---

## 7. Scoring

0–2 per criterion, using the rubric in `README.md` Part 7.

| Criterion | A | B | C | D |
| --- | --- | --- | --- | --- |
| Correctness (cases passed) | 0 | 2 | 2 | 2 |
| Requirement coverage | 0 | 2 | 2 | 2 |
| Verifiability (tests) | 0 | 0 | 2 | 1 |
| Assumptions stated | 0 | 0 | 2 | 2 |
| Noise (2 = none) | 0 | 1 | 1 | 2 |
| **Total / 10** | **0** | **5** | **9** | **9** |

**Prompt length, in words:** A 7 · B 44 · C 84 · D 191

**Words added per point gained** — B over A, C over B, D over C. One line on what that ratio says:
B over A gained 5 points for 37 words (7.4 words/pt); C over B gained 4 points for 40 words (10.0 words/pt); D over C maintained peak score while adding 107 words to engineer production type safety and eliminate noise. The ratio demonstrates high initial returns for basic structural contracts, followed by diminishing score returns where additional words buy essential defensive robustness rather than easy rubric points.

---

## 8. Conclusion — 150–200 words

Answer in this order: (1) which prompt scored best, and whether it is the one you would actually
use at work; (2) which single addition bought the most correctness, naming the exact case that
changed verdict; (3) what was pure noise; (4) the ambiguity and your resolution.

Name test cases and real returned values. "More detailed prompts work better" scores zero.

```
Prompt D scored highest overall and represents the exact specification format I would use at work because it establishes unambiguous contracts, eliminates conversational noise, and prevents defensive edge-case defects. The single addition that bought the most correctness was providing the explicit function signature and validation contract in Prompt B: in Prompt A, all six cases crashed with ERROR because the model arbitrarily generated analyze_student_marks(marks) with no analyze_marks callable. Moving from A to B immediately turned all cases into PASS. The worked example in Prompt C added noticeable noise—generating redundant narrative explanations and unrequested unit tests that merely verified the author's own circular assumptions. The critical ambiguity lay in floating-point precision and percentage conventions: Case 1 expected pass_rate: 66.67, but Prompt B returned raw unrounded float 66.66666666666666, which only passed due to test tolerance. In Prompt D, I resolved this by explicitly defining pass_rate as a percentage on a 0–100 scale rounded to two decimal places (round(val, 2)), while explicitly forbidding Python's boolean type inheritance trap (isinstance(x, bool)).
```

**Word count:** 167

---

## 9. Two questions for the debrief

Written before class, answered in class.

1. How should engineering teams balance prompt verbosity (to eliminate subtle edge cases like Python's `bool` subclassing `int`) against prompt token cost and maintainability in large automated code-generation pipelines?
2. When evaluating LLM-generated code in production CI/CD, should tests rely on loose numerical tolerances (e.g. `abs(a - b) <= 0.01`) or enforce strict type and formatting contracts to prevent downstream serialization discrepancies?
