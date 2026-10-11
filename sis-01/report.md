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

Software engineering methods reduce long-term system costs by structuring development around total lifecycle expenditure rather than short-term implementation speed. In classical software engineering economics, writing code represents only an initial fraction of total expenditure; ongoing maintenance, adaptation, and fault remediation routinely consume the majority of resources over an application's operational lifespan. Consequently, faster automated code generation does not inherently yield lower total system costs. When generative tools synthesize code rapidly without architectural constraints, they frequently introduce hidden coupling, missing validation logic, and fragile interfaces. When business rules or university policies inevitably shift, maintaining undisciplined code demands extensive debugging and refactoring, which rapidly eliminates any initial time savings.

In the context of the departmental laboratory equipment booking system, applying engineering discipline directly mitigates costly operational overhead. The system coordinates one hundred fifty equipment kits across three engineering departments while constrained to twenty concurrent database connections on legacy departmental Linux hardware. Furthermore, departmental privacy policies strictly forbid storing sensitive student telephone numbers, requiring clear separation between institutional identity tokens and booking entities. Under unengineered rapid prototyping, burst traffic during laboratory midterm examinations would easily exhaust the connection pool, crashing the service and triggering manual administrative recovery.

To guarantee dependability within these constraints, two specific engineering decisions are required:

First, the architecture implements a bounded database connection pool coupled with an asynchronous request queue. Rather than allowing uncontrolled connection spawning, the data access layer strictly caps active PostgreSQL connections at eighteen—reserving two connections for emergency technician administration—and queues incoming booking attempts with strict five-second timeouts. This decision directly satisfies the legacy hardware constraint while eliminating database connection starvation during peak traffic.

Second, the system enforces concurrency control through pessimistic row-level locking on inventory records within isolated database transactions. When a student initiates a reservation for a scarce single-unit oscilloscope, the transaction locks that specific hardware inventory row until commitment. This engineering decision eliminates the catastrophic risk of double-booking during exam weeks, preventing scheduling disputes, student grade grievances, and manual technician intervention. Although implementing transactional concurrency control, modular interfaces, and connection queuing requires greater upfront design effort than naive scripting, it prevents compounding operational debt, protects academic integrity, and minimizes lifetime maintenance expenditure across academic semesters.

## 3. Review

<!-- 250–300 words. What Prompt B's critique said and what you did with it; your two source
     checks and your two substantive revisions, each with a reason. Point at the rows of the
     tables in section 9 ("verification row 2", "change-log row 1"). -->

Prompt B provided four critical observations regarding the initial draft. I accepted its critique concerning overgeneralized lifecycle cost statistics and uncritical assumptions about AI code generation, qualified its connection pooling feedback by detailing queuing mechanics, and rejected its suggestion to rely on manual reconciliation instead of automated concurrency control.

The critique correctly highlighted that the draft treated the 60–80% maintenance ratio as universal. In verification row 1, I consulted Ian Sommerville’s Software Engineering (10th ed., Chapter 1, Section 1.1.2, p. 23–24, Figure 1.1) and confirmed that while evolution costs exceed development costs for custom bespoke systems, generic commercial software exhibits different economic patterns where upfront development and testing dominate. Consequently, I qualified the claim in change-log row 1 to clarify that lifecycle cost distribution depends heavily on software classification and operational lifespan.

Prompt B also challenged the assumption that manual reconciliation of exam double-bookings might be cheaper than implementing programmatic locking. I rejected this argument based on verification row 2, referencing the ACM/IEEE-CS Software Engineering Code of Ethics (Principles 1.03 and 3.01). Software engineers have a professional obligation to approve only dependable software that protects operational integrity; in an academic setting, allowing exam-day double-bookings undermines grading fairness and student trust, which cannot be excused by minor development savings.

Finally, in change-log row 2, I revised abstract connection pool claims into concrete bounded connection queuing to address the scenario's strict twenty-connection constraint on legacy Linux hardware. This change ensures that peak reservation traffic cannot starve database resources, eliminating recurring technician recovery labor.

## 4. Conclusion

<!-- 100–150 words. Your recommendation for the scenario and its main limitation. -->

For the university laboratory equipment booking system, I recommend deploying a modular monolithic architecture featuring bounded database connection queuing and pessimistic inventory locking. By investing modest upfront effort into transaction boundaries and connection limits, the department prevents recurrent operational crashes, eliminates equipment double-bookings during critical laboratory examinations, and drastically lowers multi-semester maintenance overhead. Faster initial code generation should be leveraged strictly for boilerplate scaffolding and automated test generation under rigorous human architectural review.

The primary limitation of this recommendation is that pessimistic row-level locking inherently limits concurrent throughput for identical hardware items. If dozens of students simultaneously compete for the same oscilloscope model during the final minutes of a reservation window, transactional lock contention will cause minor interface latency for queued requests.

## 5. Reflection

<!-- 150–200 words. NOT part of the main total. Written by you, not by the assistant:
     what helped, what you changed, what you learned. Specific beats flattering. -->

Working through this assignment demonstrated the critical difference between rapid code generation and disciplined software engineering. Initially, I assumed that using an AI assistant would simply accelerate delivery by providing ready-made architectural advice. However, reviewing the AI's initial draft in Prompt B exposed significant gaps: the assistant generalized textbook cost ratios across all software types without considering context, and suggested abstract solutions that ignored my scenario's twenty-connection database constraint.

The most valuable step was manually verifying claims in Sommerville and the ACM/IEEE-CS Code of Ethics. Opening Chapter 1 of Sommerville forced me to re-evaluate how custom software differs economically from generic products, leading me to substantially rewrite the lifecycle cost explanation. Furthermore, defending the concurrency locking decision against Prompt B's suggestion of manual administrative reconciliation taught me that software engineering is ultimately about professional responsibility: building dependable systems that protect user workflows rather than cutting corners to minimize initial coding hours. In future projects, I will treat generative AI as an ideation partner while rigorously validating architectural decisions against domain constraints.

## 6. References

<!-- Full references, one per line, each starting with "- ". Only sources you actually opened.
     Every URL used in the verification table must also appear here. Example:
     - Sommerville, I. (2016). Software Engineering, 10th ed., Global Edition. Pearson. Ch. 1.
-->

- ACM/IEEE-CS Joint Task Force on Computing Curricula. (2014). Software Engineering Code of Ethics and Professional Practice (Short Version). https://www.acm.org/code-of-ethics/software-engineering-code (accessed 2026-10-11).
- Sommerville, I. (2016). Software Engineering, 10th ed., Global Edition. Pearson. Ch. 1, Section 1.1.2, p. 23-24, Figure 1.1.

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

- **Tool:** Antigravity
- **Model:** Gemini 3.8 Flash
- **Date:** 2026-10-11
- **Purpose:** contextual draft

**Prompt:**

```text
Act as a software engineering tutor. Help me analyze topic 1.3: Explain how engineering methods can reduce costs over a system's life. Challenge AI claims that faster code generation always means lower total cost for a first-year-level university assignment.

My scenario is Department laboratory technicians, course instructors, and student teaching assistants coordinating hardware equipment loans. Problem: Recurring equipment loss, manual scheduling friction, and high operational overhead caused by untracked kit reservations across departmental teaching laboratories. Constraints: Must execute on legacy departmental Linux hardware limited to twenty concurrent database connections; cannot store sensitive student personal telephone numbers under departmental privacy rules. Risk: Concurrency race conditions resulting in double-booking high-demand single-unit oscilloscopes, thereby disrupting mandatory laboratory midterm evaluations. My initial ideas are 1. Software lifecycle costs are predominantly driven by long-term evolution and maintenance rather than initial coding, meaning that undisciplined early development exponentially inflates future operating expenses. 2. Rapid automated code generation often introduces subtle architectural coupling and interface fragility, increasing the debugging and verification burden during subsequent feature expansions. 3. Establishing strict modular boundaries, automated regression suites, and clear specifications early reduces the effort required to adapt systems to evolving academic laboratory constraints. 4. Concurrency faults and integrity failures in resource scheduling cost substantially more to diagnose and remediate after deployment than resolving them during upfront architectural analysis. 5. Disciplined requirements engineering and connection-pool management directly prevent system crashes during peak reservation periods, avoiding costly unscheduled downtime and manual intervention. Draft a 400–500 word explanation using these details.

Separate facts from assumptions. Explain trade-offs and identify claims I should verify. Do not invent quotations, references or page numbers.
```

**Response:**

```text
Software engineering is fundamentally concerned with managing system development and evolution throughout its complete operational lifetime, rather than merely writing functional programs during initial construction. For your university laboratory equipment booking system, applying disciplined engineering methods is indispensable for controlling total lifecycle expenditures and mitigating operational hazards.

1. Lifecycle Cost Distribution versus Initial Code Generation
In industrial software engineering, initial code construction typically accounts for only approximately twenty to forty percent of cumulative lifetime costs, whereas long-term software evolution and maintenance consume between sixty and eighty percent of total system expenditures. Consequently, while automated generative AI tools can rapidly produce application code, faster code generation does not inherently yield lower total system costs. Rapidly generated code frequently lacks modular boundary enforcement, standardized interfaces, and comprehensive architectural documentation. When departmental laboratory requirements inevitably shift—such as adding new hardware kits, integrating centralized student authentication, or altering semester borrowing rules—poorly structured code incurs severe refactoring friction and elevated debugging costs that rapidly eclipse any initial development savings.

2. Application to Departmental Hardware Constraints
Your scenario operates under strict operational constraints: hosting on legacy departmental Linux hardware limited to twenty concurrent database connections and strict departmental data privacy rules prohibiting student phone number retention. Rapid, naive code generation often neglects operational boundaries, creating unmanaged connection pooling or unbounded queries. Under peak demand periods preceding midterm exams, dozens of concurrent reservation requests would instantly saturate the twenty-connection limit, triggering cascading database connection timeouts and application failures. Disciplined upfront engineering—incorporating controlled connection pool managers, transaction queues, and defensive resource limits—prevents service interruptions, eliminating costly manual technician interventions and emergency server reboots.

3. Concurrency Hazards, Facts, and Engineering Trade-offs
A factual reality in software economics is that rectifying concurrency race conditions in production requires substantially greater effort and expense than preventing them through architectural design. If concurrent booking requests double-allocate a single-unit oscilloscope during exam week, technicians face operational chaos, conflicting student schedules, and the manual overhead of forensic database patching. Upfront engineering mitigates this risk through atomic database transactions and concurrency control (such as pessimistic locking on scarce inventory). However, an essential trade-off exists: formal concurrency design, systematic requirements analysis, and automated integration suites demand greater upfront time and cognitive effort. For a modest inventory of one hundred fifty kits, over-engineering microservice architectures would create wasteful overhead; disciplined modular monolithic design represents the cost-effective equilibrium.

4. Claims Requiring Verification
To ensure rigorous academic grounding, you must verify two key claims:
First, verify whether empirical software engineering literature demonstrates that evolution costs consistently exceed initial development costs (typically sixty to eighty percent of total costs) specifically for custom organizational systems versus commercial generic software.
Second, verify whether defect remediation costs escalate by an order of magnitude when concurrency and architectural faults are detected during operational deployment rather than during early design phases.
```

### B2 — Critique (Prompt B)

- **Tool:** Antigravity
- **Model:** Gemini 3.8 Flash
- **Date:** 2026-10-11
- **Purpose:** critical review of the draft

**Prompt:**

```text
Review the draft below against my chosen question and scenario. Identify inaccuracies, missing reasoning, vague claims and unsupported assumptions.
For each concern, explain why it matters and how I could check it. Include a counterexample or alternative interpretation. Do not rewrite the answer yet.
Question: How do systematic software engineering practices reduce total system costs across a product's lifecycle, and why does faster initial code synthesis not inherently reduce overall engineering expenditure? Scenario: Department laboratory technicians, course instructors, and student teaching assistants coordinating hardware equipment loans. Problem: Recurring equipment loss, manual scheduling friction, and high operational overhead caused by untracked kit reservations across departmental teaching laboratories. Constraints: Must execute on legacy departmental Linux hardware limited to twenty concurrent database connections; cannot store sensitive student personal telephone numbers under departmental privacy rules. Risk: Concurrency race conditions resulting in double-booking high-demand single-unit oscilloscopes, thereby disrupting mandatory laboratory midterm evaluations. Assumptions: Fictional inventory of one hundred fifty laboratory kits across three engineering departments; fictional semester schedule lasting fifteen instructional weeks. Draft: Software engineering is fundamentally concerned with managing system development and evolution throughout its complete operational lifetime, rather than merely writing functional programs during initial construction. For your university laboratory equipment booking system, applying disciplined engineering methods is indispensable for controlling total lifecycle expenditures and mitigating operational hazards.

1. Lifecycle Cost Distribution versus Initial Code Generation
In industrial software engineering, initial code construction typically accounts for only approximately twenty to forty percent of cumulative lifetime costs, whereas long-term software evolution and maintenance consume between sixty and eighty percent of total system expenditures. Consequently, while automated generative AI tools can rapidly produce application code, faster code generation does not inherently yield lower total system costs. Rapidly generated code frequently lacks modular boundary enforcement, standardized interfaces, and comprehensive architectural documentation. When departmental laboratory requirements inevitably shift—such as adding new hardware kits, integrating centralized student authentication, or altering semester borrowing rules—poorly structured code incurs severe refactoring friction and elevated debugging costs that rapidly eclipse any initial development savings.

2. Application to Departmental Hardware Constraints
Your scenario operates under strict operational constraints: hosting on legacy departmental Linux hardware limited to twenty concurrent database connections and strict departmental data privacy rules prohibiting student phone number retention. Rapid, naive code generation often neglects operational boundaries, creating unmanaged connection pooling or unbounded queries. Under peak demand periods preceding midterm exams, dozens of concurrent reservation requests would instantly saturate the twenty-connection limit, triggering cascading database connection timeouts and application failures. Disciplined upfront engineering—incorporating controlled connection pool managers, transaction queues, and defensive resource limits—prevents service interruptions, eliminating costly manual technician interventions and emergency server reboots.

3. Concurrency Hazards, Facts, and Engineering Trade-offs
A factual reality in software economics is that rectifying concurrency race conditions in production requires substantially greater effort and expense than preventing them through architectural design. If concurrent booking requests double-allocate a single-unit oscilloscope during exam week, technicians face operational chaos, conflicting student schedules, and the manual overhead of forensic database patching. Upfront engineering mitigates this risk through atomic database transactions and concurrency control (such as pessimistic locking on scarce inventory). However, an essential trade-off exists: formal concurrency design, systematic requirements analysis, and automated integration suites demand greater upfront time and cognitive effort. For a modest inventory of one hundred fifty kits, over-engineering microservice architectures would create wasteful overhead; disciplined modular monolithic design represents the cost-effective equilibrium.

4. Claims Requiring Verification
To ensure rigorous academic grounding, you must verify two key claims:
First, verify whether empirical software engineering literature demonstrates that evolution costs consistently exceed initial development costs (typically sixty to eighty percent of total costs) specifically for custom organizational systems versus commercial generic software.
Second, verify whether defect remediation costs escalate by an order of magnitude when concurrency and architectural faults are detected during operational deployment rather than during early design phases.
```

**Response:**

```text
Here is a critical review of the draft against your question and scenario, categorizing four key weaknesses:

1. Inaccuracy in Generalizing the 60–80% Maintenance Cost Ratio
- Concern: The draft presents the 60–80% maintenance ratio as a universal truth for all software systems. While widely cited in classical software engineering literature, this distribution applies primarily to long-lived, bespoke custom enterprise software. For small-scale utilities or commercial off-the-shelf software, development and testing can represent the majority of lifecycle costs.
- Why it matters: Claiming universal cost ratios undermines the credibility of your financial analysis for a 150-kit departmental booking tool.
- Counterexample: A simple internal web portal used without modification across three academic semesters might never enter extended evolution, meaning development expenses dominate its entire lifecycle.
- How to check: Review Ian Sommerville's Software Engineering (10th ed.), Chapter 1, Section 1.1.2 and Figure 1.1, which distinguish generic products from custom systems.

2. Vague Assertions Regarding AI Code Generation and Technical Debt
- Concern: The draft claims faster AI code generation inherently leads to higher maintenance costs due to poor abstractions. This treats AI output as uniformly poor quality without addressing engineering practices.
- Why it matters: Generative AI can produce clean, maintainable modular code if constrained by strict specification prompts, automated linting, and generated test suites. The root cause of technical debt is an absence of human architectural verification, not automated code synthesis itself.
- Alternative interpretation: Rapid AI prototyping accompanied by rigorous automated regression tests can decrease total lifecycle costs by accelerating both initial implementation and test harness construction.
- How to check: Consult empirical software engineering research evaluating LLM code generation quality and defect density in software maintenance.

3. Missing Concrete Mechanics for the Database Connection Constraint
- Concern: The draft mentions the twenty-connection limit on legacy Linux hardware but offers abstract advice ("controlled connection pool managers") without specifying operational behavior under load spikes.
- Why it matters: If twenty connections are saturated, an unhandled connection pool either blocks indefinitely or throws unhandled exceptions, crashing the web service during peak laboratory exams.
- Counterexample: Instead of expensive application-level distributed locking, a queue-based request throttle or in-memory reservation cache could satisfy the twenty-connection ceiling with minimal architectural complexity.
- How to check: Review database connection pooling patterns and queuing architectures for constrained legacy servers.

4. Unsubstantiated Cost Magnitude for Production Defect Remediation
- Concern: The claim that fixing race conditions in production costs "substantially greater effort" is accepted without qualification.
- Why it matters: While resolving production defects in avionics or banking involves enormous financial and regulatory penalties, fixing a booking collision in a 150-item university lab may only cost an hour of database administrative cleanup.
- Counterexample: If double-bookings occur once per semester, manual operational intervention might be financially preferable to engineering complex two-phase locking.
- How to check: Examine empirical defect cost escalation literature (e.g., Boehm or McConnell) to evaluate whether defect cost escalation applies equally to minor organizational tooling.
```

### B3 — Revision (Prompt C)

- **Tool:** Antigravity
- **Model:** Gemini 3.8 Flash
- **Date:** 2026-10-11
- **Purpose:** revision using my decisions and verified evidence

**Prompt:**

```text
Revise the draft using my review decisions and source notes below. Keep the answer relevant to my scenario and preserve uncertainty where evidence is limited.

My decisions: Accepted Concern 1: Qualified the 60-80% maintenance cost claim because Sommerville shows generic and custom software have different cost distributions; for small custom systems, evolution dominates only if the system survives across multiple academic years. Accepted Concern 2: Refined the critique of AI code generation—the risk is unverified architectural assumptions and missing integration tests, not automated synthesis itself. Qualified Concern 3: Specified connection pooling queue limits and atomic SQL transactions to protect the 20-connection legacy server constraint. Rejected Concern 4: Maintained that concurrency protection must be built into software, because an exam-day double-booking of a single-unit oscilloscope disrupts student grading and violates departmental fairness, which cannot be cured by manual administrative reconciliation. Verified evidence: 1. Sommerville, I. (2016). Software Engineering, 10th ed., Pearson, Chapter 1, Section 1.1.2, p. 23-24, Figure 1.1: For custom software systems, evolution costs typically exceed development costs (frequently accounting for 60% or more of total costs over long lifecycles), whereas for generic systems, development and validation costs dominate. 2. ACM/IEEE-CS Software Engineering Code of Ethics and Professional Practice (Short Version), https://www.acm.org/code-of-ethics/software-engineering-code (accessed 2026-10-11), Principles 1.03 and 3.01: Engineers shall approve software only if it has been tested and meets standards of reliability and safety, establishing that rapid delivery cannot compromise dependable operational behavior. Draft: Software engineering is fundamentally concerned with managing system development and evolution throughout its complete operational lifetime, rather than merely writing functional programs during initial construction. For your university laboratory equipment booking system, applying disciplined engineering methods is indispensable for controlling total lifecycle expenditures and mitigating operational hazards.

1. Lifecycle Cost Distribution versus Initial Code Generation
In industrial software engineering, initial code construction typically accounts for only approximately twenty to forty percent of cumulative lifetime costs, whereas long-term software evolution and maintenance consume between sixty and eighty percent of total system expenditures. Consequently, while automated generative AI tools can rapidly produce application code, faster code generation does not inherently yield lower total system costs. Rapidly generated code frequently lacks modular boundary enforcement, standardized interfaces, and comprehensive architectural documentation. When departmental laboratory requirements inevitably shift—such as adding new hardware kits, integrating centralized student authentication, or altering semester borrowing rules—poorly structured code incurs severe refactoring friction and elevated debugging costs that rapidly eclipse any initial development savings.

2. Application to Departmental Hardware Constraints
Your scenario operates under strict operational constraints: hosting on legacy departmental Linux hardware limited to twenty concurrent database connections and strict departmental data privacy rules prohibiting student phone number retention. Rapid, naive code generation often neglects operational boundaries, creating unmanaged connection pooling or unbounded queries. Under peak demand periods preceding midterm exams, dozens of concurrent reservation requests would instantly saturate the twenty-connection limit, triggering cascading database connection timeouts and application failures. Disciplined upfront engineering—incorporating controlled connection pool managers, transaction queues, and defensive resource limits—prevents service interruptions, eliminating costly manual technician interventions and emergency server reboots.

3. Concurrency Hazards, Facts, and Engineering Trade-offs
A factual reality in software economics is that rectifying concurrency race conditions in production requires substantially greater effort and expense than preventing them through architectural design. If concurrent booking requests double-allocate a single-unit oscilloscope during exam week, technicians face operational chaos, conflicting student schedules, and the manual overhead of forensic database patching. Upfront engineering mitigates this risk through atomic database transactions and concurrency control (such as pessimistic locking on scarce inventory). However, an essential trade-off exists: formal concurrency design, systematic requirements analysis, and automated integration suites demand greater upfront time and cognitive effort. For a modest inventory of one hundred fifty kits, over-engineering microservice architectures would create wasteful overhead; disciplined modular monolithic design represents the cost-effective equilibrium.

4. Claims Requiring Verification
To ensure rigorous academic grounding, you must verify two key claims:
First, verify whether empirical software engineering literature demonstrates that evolution costs consistently exceed initial development costs (typically sixty to eighty percent of total costs) specifically for custom organizational systems versus commercial generic software.
Second, verify whether defect remediation costs escalate by an order of magnitude when concurrency and architectural faults are detected during operational deployment rather than during early design phases.

Show what you changed and why. Use only the sources I supplied. Flag remaining gaps instead of inventing details.
```

**Response:**

```text
Here is the revised analysis incorporating your review decisions and verified evidence, followed by a summary of substantive revisions and remaining limitations.

Revised Analysis:
Software engineering principles provide the structural discipline required to manage total expenditures across a system's lifecycle rather than optimizing solely for initial programming speed. For the university laboratory equipment booking system, software engineering methods reduce long-term costs through proactive architecture and verified dependable delivery.

1. Lifecycle Cost Distribution and Evolutionary Reality
As established in Sommerville (2016, Chapter 1, Section 1.1.2), the economic distribution of software expenditures depends significantly on system classification. While generic software often incurs greater upfront development and validation costs, custom bespoke software—such as this departmental booking platform—typically incurs evolution and maintenance expenditures that exceed initial construction costs over extended operational lifespans. Rapid AI code generation accelerates initial syntax generation but does not inherently reduce total lifecycle costs. If rapid synthesis bypasses architectural planning, unverified assumptions regarding database schemas and API boundaries create architectural debt. When semester laboratory curricula evolve, modifying poorly structured code requires disproportionate engineering effort, confirming that rapid coding without structural discipline merely defers and magnifies future maintenance costs.

2. Addressing Legacy Hardware and Connection Constraints
The departmental system operates under a strict operational constraint: twenty concurrent database connections on legacy Linux hardware. Rapidly synthesized prototypes that emit unmanaged database queries risk saturating this pool during registration spikes. Applying software engineering principles resolves this through architectural mechanisms: configuring bounded connection pool queues, request timeouts, and lightweight in-memory caching. These techniques prevent resource starvation while staying strictly within the twenty-connection limit, averting server crashes and eliminating recurring administrative intervention.

3. Concurrency Protection and Professional Responsibility
The primary operational risk is a race condition double-booking high-demand oscilloscopes during midterm evaluations. In accordance with Principles 1.03 and 3.01 of the ACM/IEEE-CS Software Engineering Code of Ethics, software engineers are professionally obligated to ensure systems meet verified standards of reliability before deployment. Implementing atomic database transactions and pessimistic inventory locking resolves concurrency at design time. While manual administrative overrides might seem cheaper superficially, the academic disruption and loss of exam integrity caused by double-allocating scarce hardware make algorithmic concurrency control an essential, cost-reducing engineering investment.

Summary of Changes and Rationale:
- Qualified the maintenance cost ratio to reflect Sommerville's distinction between custom and generic software lifecycles.
- Refined the critique of AI generation from a blanket dismissal to an analysis of unverified architectural assumptions and interface drift.
- Replaced abstract connection pool advice with concrete bounded queue management tailored to the twenty-connection legacy server constraint.
- Justified concurrency locking using the ACM/IEEE-CS Code of Ethics principles on dependable professional delivery.

Remaining Uncertainties and Limitations:
- The actual ratio of maintenance to development costs remains uncertain for this specific departmental application until its operational lifespan (e.g., three semesters versus ten years) is established.
- The precise throughput limits of the twenty-connection legacy database under burst concurrency have not been empirically benchmarked.
```

## 9. Appendix C — Evidence tables

### Verification table

| AI claim | Source and locator | Evidence found | Decision |
| --- | --- | --- | --- |
| In professional software systems, initial code development represents only approximately twenty to forty percent of cumulative lifetime costs, whereas long-term software evolution and maintenance consume between sixty and eighty percent of total system expenditures. | Sommerville, I. (2016). Software Engineering, 10th ed., Global Edition. Pearson. Ch. 1, Section 1.1.2, p. 23-24, Figure 1.1. | Sommerville explains that evolution costs exceed development costs for custom software systems, often reaching double or triple development expenditure over long lifecycles, whereas for generic products development and testing dominate. | qualify |
| Rectifying concurrency race conditions in production requires substantially greater effort and expense than preventing them through architectural design. | ACM/IEEE-CS Software Engineering Code of Ethics and Professional Practice (Short Version). https://www.acm.org/code-of-ethics/software-engineering-code (accessed 2026-10-11), Principles 1.03 and 3.01. | The Code mandates that engineers approve software only when tested to meet reliability standards, establishing that dependable upfront engineering is mandatory to protect stakeholders from operational failure. | qualify |

### Change log

| AI wording / suggestion | Your final version | Reason for change |
| --- | --- | --- |
| in professional software systems, initial code development represents only approximately twenty to forty percent of cumulative lifetime costs, whereas long-term software evolution and maintenance consume between sixty and eighty percent of total system expenditures. | For long-lived custom software systems, evolution costs often exceed initial development expenditures, but this ratio varies depending on system longevity and whether the solution is bespoke or generic. | Sommerville Chapter 1 Section 1.1.2 distinguishes custom software from generic products, showing that maintenance dominance depends heavily on operational lifetime. |
| controlled connection pool managers, transaction queues, and defensive resource limits prevent service interruptions, eliminating costly manual technician interventions | A bounded connection queue and atomic transaction handling enforce the twenty-connection legacy limit without unhandled thread starvation. | The scenario constraint restricts the host to twenty concurrent database connections on legacy departmental hardware. |
