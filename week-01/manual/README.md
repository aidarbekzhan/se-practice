# Manual Solution — Student Marks Statistics

**Course:** AI-Driven Software Engineering (Fall 2026, KBTU SITE)  
**Author:** Aidar Bekzhan (@aidarbekzhan)  
**Language:** Python 3 (standard library only, no AI tools used)

---

## How It Works

1. **Input Processing:** Reads comma-separated input values from command line arguments, interactive console input, or the test runner.
2. **Robust Validation:**
   - Converts each token to a floating-point number.
   - Discards non-numeric values (`abc`, `xyz`), empty strings, and values outside `[0, 100]` (`-5`, `101`).
   - Does not crash on missing or corrupt values.
3. **Statistical Calculations:**
   - Valid marks count ($N$).
   - Average formatted to 2 decimal places: $\bar{x} = \frac{\sum x}{N}$.
   - Highest and lowest mark.
   - Pass rate formatted to 1 decimal place: $\frac{\text{marks} \ge 50}{N} \times 100\%$.
4. **Zero Valid Marks Safety:**
   - If no valid marks exist (e.g. Case D: `abc, , xyz`), outputs `No valid marks provided.` without division by zero or crashing.

---

## How to Run

### Interactive Mode:
```bash
python marks.py
```
Type any marks list, e.g.:
```
88, 47, -5, 101, abc, 73, 50, , 100
```

### Direct CLI Argument Mode:
```bash
python marks.py "85, 23, 45, 90, 92"
```

### Run All 4 Specification Test Cases:
```bash
python marks.py --test
```

---

## Test Cases Summary

| Case | Input | Valid | Average | Highest | Lowest | Pass rate | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **A** | `85, 23, 45, 90, 92` | 5 | 67.00 | 92 | 23 | 60.0% | PASS |
| **B** | `88, 47, -5, 101, abc, 73, 50, , 100` | 5 | 71.60 | 100 | 47 | 80.0% | PASS |
| **C** | `10, 20, 30` | 3 | 20.00 | 30 | 10 | 0.0% | PASS |
| **D** | `abc, , xyz` | 0 | — | — | — | No valid marks | PASS |
