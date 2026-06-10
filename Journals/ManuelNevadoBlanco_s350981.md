## 19/04/2026
We had a meeting to divide the project work among team members.

## 22/04/2026
Snapshot of the codebase. We will be using the following version. 2026-04-01, Version 25.9.0 (Current), @aduh95

## 24/04/2026
Started analyzing code dependencies. Studied the `lib/` directory structure to understand the scope, split between 61 public modules and 287 internal modules under `lib/internal/`.

## 28/04/2026
Team Scope Alignment: Discussed the scope issue with the rest of the team. The complete Node.js repository is well above the recommended 100k LOC threshold, and even the lib/ directory is slightly above that limit, with approximately 114k LOC. Since the dependencies group is already working inside lib/, we agreed that focusing on the JavaScript Core may be the most coherent option. We still plan to ask the professor whether this interpretation is acceptable as a “smaller component,” especially if our analysis is limited to design patterns and dependencies within the JavaScript layer.

Coordination and Validation with the Professor: Coordinated with the team and confirmed that other members have also started their work using lib/ as the reference scope. This gives us a reasonable common baseline, but we believe it is necessary to validate the decision with the professor before proceeding further. 

## 29/04/2026 - 30/04/2026
Code dependency extraction: Wrote a Python script that statically parses all require() and import statements across `lib/`. The script classifies each dependency as internal, public, or external, and computes fan-out (outgoing dependencies) and fan-in (incoming dependents) for every file.

## 04/05/2026 - 06/05/2026
Drafted the Dependencies section of the Design report. Connected findings to course concepts: change amplification, information hiding, deep vs. shallow modules, pulling complexity downwards, and information leakage.

## 10/05/2026 - 12/05/2026
Continued working on the Software Design part.

## 22/05/2026 - 24/05/2026
Started structuring the main ideas for the C4 architecture section. Reviewed the relationship between the Level 1, Level 2, and Level 3, and began drafting the final part of the architecture report.

## 28/05/2026
C4 feedback meeting with the professor. We discussed the current direction of the architecture section and received feedback on how to improve the C4 diagrams and their explanations. The main points were to incorporate clearer system and container boundaries, keep naming consistent across the different C4 levels, and justify any simplifications made in the diagrams.

## 29/05/2026 - 31/05/2026
Worked mainly on the architectural characteristics section of the architecture report. I focused on connecting the C4 analysis with the previous dependency analysis, especially where the structure of the JavaScript core helped explain maintainability, modifiability, complexity management, and separation of responsibilities. I also helped Sofia revise and rebuild parts of the C4 diagrams after the professor's feedback, making sure that the updated diagrams used clearer boundaries, consistent naming, and responsibilities that matched the written report. In parallel, I reviewed the relationship between the Level 3 diagram and the architectural characteristics to make sure the report did not describe the diagrams as isolated artifacts, but as evidence supporting the architectural interpretation.

## 01/06/2026 - 09/06/2026
Together with Sofia, finished the codependencies part of the design report. We reviewed the final findings, checked that they were consistent with the dependency scripts and metrics, and refined the wording to better connect code dependencies with knowledge dependencies and co-change relationships.

Reviewed the architecture report in detail to improve coherence across sections. Since different parts of the report had been written and modified by different teammates, I checked for inconsistencies in terminology, repeated ideas, unclear explanations, and sections that were not aligned with the final C4 diagrams. I rewrote several parts where the wording was not precise enough or where the explanation did not properly connect with the project scope. I also checked that the architecture section remained consistent with the design report, especially regarding dependencies, information hiding, complexity management, and the role of internal modules in Node.js.

## 10/06/2026
Final submission day. I performed a final review of the architecture report, checking that the C4 diagrams, architectural characteristics, and written explanations were coherent and ready for submission. After the final checks, I pushed the architecture report to the GitHub repository as part of the final project delivery.
