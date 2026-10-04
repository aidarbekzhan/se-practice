# Week 04 — Lab report: Modeling the System with UML

> The single worksheet for this lab. Fill in every section. **Do not delete, rename or renumber
> the headings** — the checker and the grader find your work by them. Replace every `<...>`
> placeholder; a row that still contains `<...>` counts as empty.

---

## 1. Setup

| Field | Value |
| --- | --- |
| Name | Aidar Bekzhan |
| Group | CS (SITE) |
| AI assistant | ChatGPT (OpenAI) |
| Exact model | GPT-4o |
| Renderer | PlantUML web server |
| Behaviour diagram | sequence |
| Stories used | the reference set from README §3 |

---

## 2. Prompts as sent

Paste every prompt **exactly as you sent it**, in the order you sent it, one code block each. The
AI's first replies are saved as files in `models/original/` — do not paste them here.

### 2.1 Task 1 — use-case prompt

```text
Using the supplied scenario and approved stories, generate PlantUML for a use-case diagram. Include Student and Administrator outside a named system boundary. Model their goals, show justified associations, and list assumptions. Use include or extend only with a clear reason.
```

### 2.2 Task 2 — class prompt

```text
Create a UML domain class diagram in PlantUML for Smart Campus. Start with Student, Room, and Booking. Add attributes, appropriate operations, and association multiplicities. Add other classes only when requirements justify them. Explain each relationship and list assumptions. Avoid unjustified inheritance or composition.
```

### 2.3 Task 3 — behaviour prompt (3A sequence or 3B activity)

```text
Generate PlantUML for Book room. Use Student, BookingService, and BookingRepository lifelines. Validate the supplied rules, then attempt the reservation. Show a successful confirmation and an unavailable-room alternative using alt. Label messages and replies. Explain new design components and all assumptions.
```

### 2.4 Focused correction prompts (if you sent any)

```text
none
```

### 2.5 Critique prompt

```text
Compare my diagrams with the requirements. Identify missing rules, inconsistent names, and unjustified elements. Cite each issue and propose a specific correction.
```

---

## 3. Task 1 — use-case review

**Assumptions the AI listed:**
1. Room booking duration is up to 2 hours.
2. Overlapping active bookings are prevented by the system.
3. Confirmation is sent via email or push notification to the student.

At least **two** findings. A finding names the element, the problem and the rule or story that
proves it is a problem.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Student → Send confirmation | Associated Student directly with confirmation, treating confirmation as a user goal rather than an automated transaction consequence | R4: "A successful booking produces a confirmation" | Removed direct actor link; converted to `Generate booking confirmation` included by `Book room` via `<<include>>` with `' why:` comment |
| 2 | Administrator → Book room | Associated Administrator actor with student booking goal, which is not granted to administrators in the scenario | Scenario: Students view availability, book, and cancel; Administrators only block/unblock rooms and review usage | Removed association between Administrator and Book room |
| 3 | Actor System | Created an external actor named System connected to Send confirmation, confusing internal software automation with an external human actor | UC7 / UML conventions: System is not an external actor | Removed actor System and kept confirmation entirely inside the system boundary |

---

## 4. Task 2 — class diagram review

### 4.1 Relationships, read both ways

One row per association in your **revised** class diagram.

| Association | Read left → right | Read right → left | Multiplicities |
| --- | --- | --- | --- |
| Student — Booking | One student makes zero or many bookings | Each booking belongs to exactly one student | 1 to 0..* |
| Room — Booking | One room is reserved for zero or many bookings | Each booking is for exactly one room | 1 to 0..* |

### 4.2 Constraints the multiplicities cannot show

- R2: Stated in a note attached to Booking: `R2: Active bookings for the same room cannot overlap in time.`
- R3: Stated in a note attached to Room: `R3: A room with isBlocked = true cannot accept any new booking.`

### 4.3 Assumptions

- A1: Touching bookings that meet at boundaries without interval overlap (e.g. 10:00–12:00 and 12:00–13:00) are permitted and do not conflict under R2.
- A2: Blocking a room (R3) immediately prevents future bookings from being scheduled, but does not automatically cancel pre-existing confirmed bookings without administrator intervention.

### 4.4 Findings

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Room *-- "1..*" Booking | Composition implies bookings cannot exist independently and `1..*` multiplicity falsely implies a room cannot exist without already having a booking | Scenario & CL4: Rooms can exist with zero bookings; historical records exist independently of room lifecycle | Replaced composition with plain association `Room "1" -- "0..*" Booking` |
| 2 | BookingService | Service/controller class placed into a pure domain model | CL6: Domain class diagrams model real-world concepts, not service implementation classes | Removed BookingService from domain class diagram |
| 3 | Room.isAvailable | Used `isAvailable` boolean instead of tracking blocked administrative status | R3: Explicitly specifies room blocking | Replaced with `isBlocked : boolean` on Room |

---

## 5. Task 3 — behaviour diagram review

**Option chosen and why:** 3A sequence — sequence diagrams directly model component-level message ordering, verifying that validation strictly precedes persistence and illustrating alternative outcomes with lifelines.

**Design components added beyond the domain model:** `BookingService` coordinates application business rules and validates reservations; `BookingRepository` encapsulates persistence access for querying and storing Room and Booking records.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | BookingService → BookingRepository: saveBooking | The AI attempted to save the booking to the repository before validating rules R1, R2, and R3 | SQ3: Validation must strictly precede creation/persistence | Moved `validateTimeRange` and availability checks before `saveBooking` |
| 2 | else branch deletes booking | The AI created the booking eagerly and deleted it upon failure rather than aborting before saving | SQ4: Nothing should be saved on a failure branch | Reordered flow so `saveBooking` occurs only inside the success branch |
| 3 | alt [room available] | Guard used square brackets which cause PlantUML hyperlink rendering artifacts | PlantUML sequence convention (§4) | Removed square brackets from guards (`alt room is free...`) |

---

## 6. AI critique

Run the critique prompt once, on all your revised diagrams together. At least **three** rows. A
critique is another claim to evaluate, not a verdict: reject what is wrong and say why.

| # | Issue the AI raised | Element it cited | Verdict | Why |
| --- | --- | --- | --- | --- |
| 1 | Claimed BookingStatus enum is redundant and should be merged into a string attribute on Booking | BookingStatus enum | reject | Using a formal enum `BookingStatus` (ACTIVE, CANCELLED) makes the state explicit, preventing invalid status values and directly supporting R2's constraint on active bookings. |
| 2 | Claimed BookingService should appear in the domain class diagram since it appears in the sequence diagram | BookingService | reject | The domain class diagram models domain entities (Student, Room, Booking). BookingService is a design/architecture component, forbidden in domain models by rule CL6. |
| 3 | Recommended adding explicit R1 and R3 checks in the sequence diagram before invoking the repository | Sequence validation messages | accept | Validating duration <= 2h (R1) in memory before querying repository for room blocked state (R3) and overlapping bookings (R2) clarifies separation of responsibilities. |
| 4 | Claimed Student should be associated with Generate booking confirmation via extend relationship | Generate booking confirmation | reject | Confirmation is an automated system outcome specified by R4, not a user-initiated optional extension of student action. Associating Student with confirmation violates UC5. |

---

## 7. Consistency table

One row for each of **R1–R4**, then one row for **every use case in your revised use-case
diagram**, spelled exactly as in the diagram, with the story ID it traces to.

| Requirement / story | Use case | Classes | Behaviour element |
| --- | --- | --- | --- |
| R1 (US-01) | Book room | Booking (startTime, endTime) | BookingService.validateTimeRange(startTime, endTime) |
| R2 (US-01, US-03) | Book room, Cancel booking | Booking (status), note on Booking | BookingService.findOverlappingActiveBookings() |
| R3 (US-04, US-05) | Block / unblock room, Book room | Room (isBlocked), note on Room | BookingService.checkRoomBlockedStatus() |
| R4 (US-01) | Generate booking confirmation | Booking, Student | BookingService.returnBookingConfirmation() |
| US-01 | Book room | Student, Room, Booking | requestBooking(), saveBooking() |
| US-01 | Generate booking confirmation | Booking, Student | returnBookingConfirmation() |
| US-02 | View availability | Room, Booking | checkRoomAvailability() |
| US-03 | Cancel booking | Student, Booking | cancel() |
| US-04 | Block / unblock room | Room | block(), unblock() |
| US-06 | Review usage | Room, Booking | query usage records |

---

## 8. Change log

At least **three** rows, and at least one for each required diagram (use case, class, your
behaviour diagram). "Before" is what the AI produced; "After" is what you submitted.

| # | Diagram | Before (AI's original) | After (your revision) | Reason |
| --- | --- | --- | --- | --- |
| 1 | Use case | Student linked directly to `Send confirmation`; `System` actor present | Removed `System` actor; converted to `Generate booking confirmation` included by `Book room` with `' why:` comment | R4 is an automated outcome of booking; System is not an external actor (UC5, UC7, UC8) |
| 2 | Class | `Room "1" *-- "1..*" Booking`; `BookingService` included; missing R2 note | `Room "1" -- "0..*" Booking`; removed `BookingService`; added R2 note and `isBlocked` | Booking is not a composite part of Room; rooms can have 0 bookings; domain models exclude services (CL4, CL5, CL6, CL8) |
| 3 | Sequence | `saveBooking` called before validation; deleted booking in `else [room unavailable]` | Validated R1-R3 before persistence; `saveBooking` called only on success branch | Preconditions must be validated before database state modification (SQ3, SQ4, SQ6, SQ7) |

---

## 9. Checker output

Paste the complete output of `python tests/check_models.py`, then explain **every FAIL you are
keeping**. The same IDs go in `submission.yml` under `checker.kept_fails`. A FAIL you report and explain costs you nothing. One you hide costs the whole criterion.

```text
Week 04 structural check - shape only, never quality

UC1  PASS  Student and Administrator declared
UC2  PASS  named system boundary: "Smart Campus Booking System"
UC3  PASS  all actors declared outside the boundary
UC4  PASS  all scenario goals present (6 use cases)
UC5  PASS  no actor is associated with a confirmation use case
UC6  PASS  actor responsibilities match the scenario
UC7  PASS  use cases are goals, not screens or components
UC8  PASS  every include / extend / generalization carries a ' why: comment (or there are none)
UC9  PASS  revised diagram differs from the AI's original
CL1  PASS  Student, Room and Booking present
CL2  PASS  Booking is associated with Student and with Room
CL3  PASS  every association has multiplicities at both ends
CL4  PASS  1 student / 1 room per booking, 0..* bookings per student and per room
CL5  PASS  every inheritance / composition / aggregation carries a ' why: comment (or there are none)
CL6  PASS  only domain concepts in the class diagram
CL7  PASS  attributes needed by R1-R3 are present
CL8  PASS  a note states R2 (no overlapping active bookings)
SQ1  PASS  Student, BookingService and BookingRepository lifelines present
SQ2  PASS  alt block with a guard on every branch (2 branches)
SQ3  PASS  validation happens before creation
SQ4  PASS  nothing is saved on a failure branch
SQ5  PASS  every message is labelled
SQ6  PASS  R1 (time range) is visible - checked or stated as a precondition
SQ7  PASS  R3 (blocked room) is visible
FI1  PASS  the AI's original output is kept for every diagram
FI2  PASS  a rendered image for every diagram
LR1  PASS  §1 setup filled (tool and model recorded)
LR2  PASS  5 prompts pasted in §2
LR3  PASS  2 use-case findings in §3
LR4  PASS  §4 relationships read both ways, 2 assumption(s) declared
LR5  PASS  3 behaviour-diagram findings in §5
LR6  PASS  4 critique issues with a verdict
LR7  PASS  3 change-log rows covering all three diagrams
CS1  PASS  6 approved stories
CS2  PASS  §7 traces R1-R4 into the diagrams
CS3  PASS  every use case traces to an approved story
CS4  PASS  every lifeline is a domain class or an explained design component

SUMMARY pass=37 fail=0 error=0
A FAIL you report and explain in lab-report.md §9 costs you nothing. One you hide costs the criterion.
```

**FAILs I am keeping, and why:** none

---

## 10. Conclusion (120–180 words)

The AI struggled most with the sequence diagram: it immediately persisted the booking to the repository before performing any rule validations, resorting to deleting the row in the failure branch. In a production environment, this backward flow would cause severe race conditions, dirty database reads, and phantom reservations. In the class diagram, the AI inappropriately introduced `BookingService` into a domain model and used composition with a `1..*` multiplicity, falsely requiring every room to possess an active reservation upon creation. The critique correctly suggested making the sequence diagram's R1 and R3 validation messages explicit before repository queries. However, it falsely claimed that `BookingService` belonged in the domain class diagram and incorrectly argued that students should trigger confirmation via an `<<extend>>` use case. Reviewing AI outputs against formal rules and domain boundaries proved critical to ensure architectural integrity.
