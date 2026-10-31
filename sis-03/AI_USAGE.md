# AI Usage Disclosure — SIS #03

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched | Reused from |
| --- | --- | --- | --- | --- |
| ChatGPT (OpenAI) | GPT-4o (version 2024-08-06) | the plan (stage A) | `report.md` §11 (B1) | week-05 |
| ChatGPT (OpenAI) | GPT-4o (version 2024-08-06) | Python v1 (stage B) | `code/original/booking_v1.py` | week-05 |
| Bolt.new | Claude 3.5 Sonnet | web prototype v1 (stage B) | `web/original/` | week-06 |
| ChatGPT (OpenAI) | GPT-4o (version 2024-08-06) | critique (stage C) | `report.md` §8, §11 (B3) | this SIS |
| Bolt.new | Claude 3.5 Sonnet | repair (stage D) | `web/final/`, `report.md` §11 (B4) | this SIS |

**The assistant wrote, or helped write, my tests in `code/`:** yes
The assistant proposed initial boundary test cases during planning. I manually reviewed each test case to guarantee that all assertion expectations strictly reflect acceptance criteria AC1 through AC5 rather than any generated implementation quirks.

**`code/original/` and `web/original/` hold the AI's first versions exactly as returned:** yes

**Every result in report.md section 5 was actually run or seen, not assumed:** yes

**Everything I submitted, I can explain and defend in class — including the overlap condition
and what the agent did in section 9:** yes

**Anything I accepted from the AI without fully understanding it:**
None. All logic, interval overlap conditions, state management, and test assertions were independently verified and understood.

Signed: Aidar Bekzhan
Date: 2026-10-31
