# Week 09 — Lab Report: canBook as a Tool

Fill in every section. Do not delete or renumber the headings: the README and the checker point at
them. Replace every `<!-- comment -->` with your own text (comments are ignored by the checker).

**Name:** Aidar Bekzhan
**Student ID:** 25B031167
**GitHub:** aidarbekzhan

---

## 1. Setup

| | |
| --- | --- |
| Assistant (frozen for the whole lab) | Gemini |
| Exact model (or "not displayed") | Gemini 3.8 Flash (High) |
| Three fresh chats for R1, R2, R3? (yes / no) | yes |
| Python version (`python --version`) | Python 3.11.9 |

## 2. Your tool definition — a reason for every constraint

Paste your final `tool/check_room.json`, then fill the table: one row per constraint you wrote.

```json
{
  "name": "check_room",
  "description": "Checks whether a room is available for booking given requested start and end times, the current time now, whether the room is blocked, and existing bookings. All times must be provided in whole minutes since midnight in the range 0 to 1440. This tool only checks room availability and does not save, reserve, create, or modify any bookings.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "start": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Requested booking start time in whole minutes since midnight (0-1440)."
      },
      "end": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Requested booking end time in whole minutes since midnight (0-1440)."
      },
      "now": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Current time in whole minutes since midnight (0-1440)."
      },
      "blocked": {
        "type": "boolean",
        "description": "Whether the room is currently blocked for maintenance or admin reasons."
      },
      "bookings": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "start": {
              "type": "integer",
              "minimum": 0,
              "maximum": 1440,
              "description": "Start time of existing booking in whole minutes since midnight (0-1440)."
            },
            "end": {
              "type": "integer",
              "minimum": 0,
              "maximum": 1440,
              "description": "End time of existing booking in whole minutes since midnight (0-1440)."
            }
          },
          "required": [
            "start",
            "end"
          ],
          "additionalProperties": false
        },
        "description": "List of existing bookings for the room, each with start and end times in minutes since midnight. Can be empty."
      }
    },
    "required": [
      "start",
      "end",
      "now",
      "blocked",
      "bookings"
    ],
    "additionalProperties": false
  }
}
```

| Field | Constraint (e.g. `"type": "integer"`, `"maximum": 1440`) | What goes wrong without it |
| --- | --- | --- |
| `start` | `"type": "integer"` | Non-integer types such as fractional minutes (e.g. 600.5) or timestamp strings would reach the function. |
| `start` | `"minimum": 0` | Negative minutes representing times before midnight (e.g. -30) would be accepted. |
| `start` | `"maximum": 1440` | Minute values exceeding the 24-hour daily boundary would pass validation. |
| `end` | `"type": "integer"` | String timestamps (e.g. "11:00") or float values would be passed instead of integer minute counts. |
| `end` | `"minimum": 0` | Negative minute values before midnight would be accepted as valid end times. |
| `end` | `"maximum": 1440` | End times exceeding 24:00 (e.g. 1500) would pass unchecked. |
| `now` | `"type": "integer"` | String timestamps or non-integer representations of current time would be accepted. |
| `now` | `"minimum": 0` | Negative values for the current time would pass validation. |
| `now` | `"maximum": 1440` | Current times beyond midnight of the current day would be accepted. |
| `blocked` | `"type": "boolean"` | String values like "false" or integer flags like 0/1 would be accepted instead of genuine booleans. |
| `bookings` | `"type": "array"` | Non-array types such as single objects, null, or strings would be passed where an iterable list is required. |
| `bookings.items` | `"type": "object"` | Malformed booking entries represented as pairs (e.g. [660, 720]) or primitives would be accepted. |
| `bookings.items.properties.start` | `"type": "integer"`, `"minimum": 0`, `"maximum": 1440` | Existing bookings with non-integer or out-of-range start times would be accepted. |
| `bookings.items.properties.end` | `"type": "integer"`, `"minimum": 0`, `"maximum": 1440` | Existing bookings with non-integer or out-of-range end times would be accepted. |
| `bookings.items` | `"required": ["start", "end"]` | Incomplete booking objects missing an endpoint (e.g. `{"start": 660}`) would be accepted. |
| `bookings.items` | `"additionalProperties": false` | Booking objects containing extraneous or hallucinated fields would pass schema validation. |
| root | `"required": ["start", "end", "now", "blocked", "bookings"]` | Required arguments could be omitted by the caller (e.g. missing `now`), causing runtime undefined errors. |
| root | `"additionalProperties": false` | Callers could supply unrecognised arguments (e.g. `"room": "204"`) that do not belong to the tool interface. |

## 3. The twelve calls — first run and final run

Your **first** run's S verdicts (before any fix), and your final ones. For every case that changed,
say what you changed.

| Case | First run | Final run | What you changed |
| --- | --- | --- | --- |
| S01 | PASS | PASS | None; valid baseline call accepted on both runs. |
| S02 | PASS | PASS | None; empty bookings array accepted on both runs. |
| S03 | FAIL | PASS | Added `"type": "integer"` to `end` to reject string values like `"11:00"`. |
| S04 | FAIL | PASS | Added `"now"` to root `required` list so calls missing `now` are refused. |
| S05 | FAIL | PASS | Added `"additionalProperties": false` to root `inputSchema` to refuse extra fields like `"room"`. |
| S06 | FAIL | PASS | Added `"minimum": 0` to `start` to reject negative times like `-30`. |
| S07 | FAIL | PASS | Added `"maximum": 1440` to `end` to reject values beyond the day like `1500`. |
| S08 | FAIL | PASS | Added `"required": ["start", "end"]` to `bookings.items` to refuse bookings missing `end`. |
| S09 | FAIL | PASS | Added `"type": "boolean"` to `blocked` to reject string representations like `"false"`. |
| S10 | FAIL | PASS | Added `"type": "integer"` to `start` to reject fractional minute floats like `600.5`. |
| S11 | PASS | PASS | None; boundary end time of 1440 accepted on both runs. |
| S12 | FAIL | PASS | Added `"type": "object"` to `bookings.items` to reject booking pairs like `[660, 720]`. |

## 4. Function calling — what the model wrote

For each request, paste the model's reply exactly, then judge it against the request.

### R1

```text
{"name": "check_room", "arguments": {"start": 600, "end": 660, "now": 540, "blocked": false, "bookings": [{"start": 660, "end": 720}]}}
```

The model's reply matched all expected arguments exactly: `now` at 9:00 was converted to 540 minutes, requested interval 10:00–11:00 was mapped to `start: 600, end: 660`, `blocked` was set to `false`, and the existing booking from 11:00 to 12:00 was properly structured as `[{"start": 660, "end": 720}]`. F3 passed without any mismatch.

### R2

```text
{"name": "check_room", "arguments": {"start": 840, "end": 990, "now": 810, "blocked": true, "bookings": []}}
```

The model correctly converted 13:30 to 810 (`now`), 14:00 to 840 (`start`), 16:30 to 990 (`end`), mapped "blocked for maintenance" to `blocked: true`, and "no other bookings" to `bookings: []`. Crucially, even though `canBook` will evaluate this as Unavailable due to `blocked: true`, the model made the tool call as requested rather than preemptively deciding availability. Deciding room availability is the business function's responsibility, not the caller's. F6 passed cleanly.

### R3

```text
What specific start and end times do you need the room for?
```

The request "Can I have the room tomorrow afternoon for a couple of hours?" omitted almost all necessary arguments: the current time `now` was unspecified, exact `start` and `end` times were missing ("tomorrow afternoon" and "a couple of hours" are underspecified), and room status (`blocked`, `bookings`) was absent. Following the prompt instruction ("do not guess: reply with one short question instead"), the model did not invent arbitrary times or default values. It asked a single direct clarifying question, which was saved to `calls/r3.txt`. F7 passed.

## 5. What the schema cannot check

A JSON Schema using the allowed keywords checks only individual value shapes, independent scalar boundaries, and structural property requirements; it cannot evaluate relational semantics, cross-field constraints, or algorithmic logic. Specifically:

1. **AC1 (`0 <= start < end <= 1440` and `start after now`):** While the schema can enforce the static scalar range `[0, 1440]` on each field individually via `minimum` and `maximum`, it cannot enforce the relational comparisons `start < end` or `start > now`. JSON Schema properties are evaluated independently without cross-property comparison operators.
2. **AC2 (maximum duration 120 minutes, `end - start <= 120`):** Enforcing maximum booking duration requires arithmetic subtraction between two separate fields (`end - start`), which is impossible with structural schema validation keywords.
3. **AC3 (reject when blocked, `blocked == false`):** The schema cannot decide whether a booking request should be rejected based on room status. Restricting `blocked` to `enum: [false]` in the schema would prevent users from querying availability when a room is blocked (as demonstrated in R2), confusing schema validity with domain availability.
4. **AC4 (no overlap with existing bookings, touching allowed):** Evaluating whether `[start, end]` overlaps with any interval in `bookings` requires iterative comparison across array items against requested endpoints. JSON Schema cannot perform collection-level overlap algorithms.
5. **AC5 (pure query, side-effect free):** The schema validates incoming payload format; it has no control over runtime execution behavior or code purity.

Only the `canBook` function possesses the executable logic and context to evaluate AC1–AC6.

## 6. Permissions — allow, ask or block

| # | Action | Decision (allow / ask / block) | Reason (the risk, in one sentence or more) |
| --- | --- | --- | --- |
| A1 | call `check_room` with the times the user just typed | allow | Calling `check_room` is a purely read-only query with no state mutations or external side effects. |
| A2 | read `week-08/app/src/booking.ts` | allow | Reading source files is a safe inspection operation necessary for code context without altering any repository state. |
| A3 | edit `booking.ts` to raise the 120-minute limit to 180 | ask | Modifying core business logic compromises system constraints and acceptance criteria, requiring human oversight and authorization. |
| A4 | run `npm test` in `week-08/app` | allow | Running the local test suite is a non-destructive verification process that executes safely within the workspace. |
| A5 | run `git reset --hard` to undo its own last three edits | ask | A hard git reset permanently discards uncommitted workspace changes and history with no recovery mechanism. |
| A6 | `git commit` its change on the `week-09` branch | allow | Committing on an isolated feature branch creates an inspectable checkpoint without altering main or affecting remote history. |
| A7 | `git push` to `main` | block | Pushing directly to the main branch bypasses branch protection, peer code review, and CI verification, risking production stability. |
| A8 | send the contents of `.env` to an MCP server it found online | block | Transmitting local environment files exfiltrates confidential credentials, API keys, and secrets to an untrusted external server. |

## 7. Checkpoint

Before allowing an agent to perform code edits or workspace modifications, a safe checkpoint commit was established:
- **Commit SHA:** `89d952b`
- **Commit message:** `Week 09: record model tool calls for requests R1, R2, and R3`

To revert the working directory and index back to this clean checkpoint, the exact command is:

```bash
git reset --hard 89d952b
```

This command permanently discards all uncommitted modifications, index changes, and subsequent commits created after `89d952b`, returning the branch and working tree to this known-good state.

## 8. Checker output

Paste the **whole** output of your last `python tests/check_tool.py`, unedited.

```text
PASS  D1    tool/check_room.json exists and is valid JSON
PASS  D2    has name, description and inputSchema
PASS  D3    name is exactly "check_room"
PASS  D4    description: 25+ words, says minutes, 1440, and that it does not save
PASS  D5    inputSchema: an object with exactly the five fields, all required
PASS  D6    inputSchema uses only the keywords listed in README section 5
PASS  S01   the R1 call, valid -> accept
PASS  S02   no existing bookings: bookings = [] -> accept
PASS  S03   end as a string: "11:00" -> refuse
PASS  S04   now missing -> refuse
PASS  S05   an extra field: "room": "204" -> refuse
PASS  S06   start below the day: -30 -> refuse
PASS  S07   end beyond the day: 1500 -> refuse
PASS  S08   a booking with no end: {start: 660} -> refuse
PASS  S09   blocked as a string: "false" -> refuse
PASS  S10   start not a whole minute: 600.5 -> refuse
PASS  S11   end at the end of the day: 1440 -> accept
PASS  S12   a booking as a pair: [660, 720] -> refuse
PASS  F1    calls\r1.json: a call to check_room
PASS  F2    calls\r1.json: arguments valid against your schema
PASS  F3    calls\r1.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F4    calls\r2.json: a call to check_room
PASS  F5    calls\r2.json: arguments valid against your schema
PASS  F6    calls\r2.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F7    calls/r3: exactly one of r3.json (it called) or r3.txt (it asked), not empty
PASS  L1    section 5 names at least two acceptance criteria (AC1-AC6) the schema cannot check
PASS  L2    section 6: A1-A8 each have allow / ask / block and a reason of 5+ words
PASS  L3    section 7 names the checkpoint commit (a SHA)
PASS  L4    section 10: a conclusion of 80-150 words
PASS  L5    AI_USAGE.md filled in (a tool row, and signed)

SUMMARY: 30 PASS · 0 FAIL · 0 ERROR  (of 30 checks)
Paste this whole output into lab-report.md section 8, and these three numbers into submission.yml.
```

## 9. What still fails

None. All 30 checks in `check_tool.py` pass.

## 10. Conclusion (80–150 words)

This lab clearly establishes the critical boundaries separating schema validation, model reasoning, and business logic execution. The JSON Schema acts as a structural boundary: it enforces type integrity and scalar bounds, catching malformed payloads like string times in S03 or negative minutes in S06. However, it cannot evaluate relational semantics, such as the cross-field ordering in AC1 or overlap detection in AC4. The model acts as an interface translator, interpreting natural language requests and converting them into structured arguments (R1, R2). In R2, the model appropriately issued the tool call despite the room being blocked, properly delegating domain evaluation to canBook rather than preemptively deciding availability. Finally, an agent with tool access requires strict permission controls (A1–A8): autonomous query tools can be safely allowed, but state mutations, irreversible resets, or secret exposures must be blocked or held for human verification.
