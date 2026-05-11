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

## 04/05/2026- 06/05/2026
Drafted the Dependencies section of the Design report. Connected findings to course concepts: change amplification, information hiding, deep vs. shallow modules, pulling complexity downwards, and information leakage.
