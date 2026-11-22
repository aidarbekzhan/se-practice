# AI Usage Disclosure — SIS #04

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Date | Used for | Which files it touched |
| --- | --- | --- | --- | --- |
| Antigravity | Gemini 3.8 Flash | 2026-11-22 | codebase analysis (Task 1) | report.md |
| Antigravity | Gemini 3.8 Flash | 2026-11-22 | improvement plan | report.md |
| Antigravity | Gemini 3.8 Flash | 2026-11-22 | feature extension (Task 2) | src/rooms.js, src/filter.js |
| Antigravity | Gemini 3.8 Flash | 2026-11-22 | refactoring (Task 3) | src/booking.js, src/App.jsx, diagrams/after.puml |
| Antigravity | Gemini 3.8 Flash | 2026-11-22 | tests (Task 4) | src/booking.test.js |

**The assistant wrote, or helped write, tests in `app/`:** yes. The assistant helped generate test outlines for F1–F5, B1–B6, and INT. I personally reviewed each test assertion to verify that expected values were derived directly from AC1–AC5 and F1–F5 rules (such as enforcing strict equipment matching with .every() and verifying exact boundary values for 120 vs 121 minutes) rather than accepting whatever the implementation returned.

**Every run pasted in report.md was produced by my code on my machine (or Codespace), unedited:** yes

**Every number in report.md section 7 was measured the way its row says:** yes

**I shared no credentials, keys or private data with any tool:** yes

**Everything I submitted, I can explain and defend in class — including filterRooms, checkRoom and why each module exists:** yes

**Anything I accepted from the AI without fully understanding it:** none; all modular boundaries, filter logic, and dispatcher mechanisms were thoroughly inspected and tested.

Signed: Aidar Bekzhan
Date: 2026-11-22
