# AI Usage Disclosure — Week 05

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| ChatGPT (OpenAI) | GPT-4o (version 2024-08-06) | the plan (Task 1) | `lab-report.md §2` |
| ChatGPT (OpenAI) | GPT-4o (version 2024-08-06) | the first version, v1 (Task 2) | `code/original/booking_v1.py` |
| ChatGPT (OpenAI) | GPT-4o (version 2024-08-06) | debugging explanation & smallest fix (Task 4) | `code/booking.py`, `lab-report.md §5` |
| ChatGPT (OpenAI) | GPT-4o (version 2024-08-06) | focused critique of implementation (Task 5) | `lab-report.md §6` |
| Antigravity AI | Gemini 3.8 Flash | Test runner, checker execution, formatting | `code/test_booking.py`, `lab-report.md`, `submission.yml` |

**The assistant wrote, or helped write, my tests in `code/`:** yes
The assistant assisted in setting up the standard `unittest.TestCase` structure. I independently formulated all 16 test cases, derived every expected value directly from AC1–AC5 on paper, and verified that edge cases (touching endpoints, boundary times, containment) strictly followed the acceptance criteria before running.

**`code/original/` holds the assistant's first answer exactly as returned:** yes

**Everything I submitted, I can explain and defend in class — including the overlap condition:** yes

**Anything I accepted from the AI without fully understanding it:**
None. I analyzed the interval overlap condition on paper, verified why strict inequalities `<` and `>` allow touching endpoints per AC4, and evaluated every critique suggestion against the formal contract.

Signed: Aidar Bekzhan
Date: October 11, 2026
