## 19/04
Had a meeting to assigne **project roles**. It was decided that Manuel and I are focusing on the dependencies analysis, while the rest of the team focuses on the architectural patterns.
## 22/04
Created a specific code **snapshot** of the Node.js repository to ensure we all work on the same version.
## 26/04
**Studied** the relationship between **code and knowledge dependencies** and the four dimensions taught in the lectures (structural, runtime, data and behavioral dependencies) in order to understand them as well as possible and start looking for them in the next days.
## 27/04 - 28/04
- **Overview Report & Scope Investigation**: Started the overview report by investigating the system’s purpose and stakeholders, mainly using the repo’s README.md and the official Node.js About page. While auditing the code statistics with cloc, I found the repository is massive, far exceeding the 100k LOC guideline.
Based on the system's purpose, I thought focusing on the **lib/** folder (~114k LOC) would be a logical way to reduce scope while staying within the project's complexity limits. This folder contains the core JavaScript logic and public API, making it a possible representative "smaller component", as indicated in the project's guidelines. Additionally,  during the overview work I wondered if a **Bibliography** section is expected for the project.
- **Initial Dependency Exploration**: I began exploring dependencies within lib/. For example, I analyzed lib/os.js and found a structural dependency on a C++ binding (internalBinding('os')). 
- **Coordination and Asking for Guidance**: Talked to the team to coordinate. They have also started working within lib/, so we may be at a good starting point. However, we think it is a good idea to talk to the professor to confirm this direction, by focusing on the JavaScript Core. We want to propose a strategy that balances depth and the 100k limit:
  - Use the Design Report to analyze dependencies and patterns strictly within this 114k LOC JS layer.
  - Use the Architecture Report (C4 Level 1 & 2) to show how this JS Core interacts with the C++ Engine and V8 as external containers.
  - Focus our C4 Level 3 (Component) and SOLID analysis exclusively on the JS Core.

Our goal is to confirm if this approach satisfies the requirement of focusing on a "smaller component" while still providing a complete architectural view of the system.
