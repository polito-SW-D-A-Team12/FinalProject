## 19/04/2026
We had a meeting about splitting the project's work among team members 
## 22/04/2026 
Took a snapshot of the codebase (2026-04-01, v25.9.0) so we’re all working on the same version.
## 24/04/2026
We had a meeting to divide the work for identifying the design patterns, and I decided to take on the Observer and Strategy patterns.
## 26/04/2026
Started going through the Observer and Strategy patterns from the material to understand how they work and where they are used.
## 29/04/2026 - 04/05/2026
- **Observer Pattern Investigation:** I started working on the first pattern I selected, the Observer Pattern. I focused mainly on Node.js lib/events.js, because the EventEmitter mechanism seemed to be the clearest example of this pattern. I went through the parts where listeners are stored, added, and notified, especially the _events structure, addListener(), and emit(). At the beginning, I had to spend some time connecting the theory from the course material with the actual Node.js implementation, because the pattern is not written as a simple textbook example. What I understood is that the EventEmitter object works as the Subject, while the callback functions registered as listeners act as Observers. This helped me see how Node.js uses the pattern to support asynchronous and event-driven behavior without making modules directly depend on each other.
- **Mapping to GoF Roles:** After understanding the general logic, I started mapping the implementation to the professor’s expected UML/design pattern roles. I identified the Subject, Observer, Concrete Subject, registration operation, and notification mechanism. I also compared this approach with a more direct callback-based structure, which helped me explain why the Observer Pattern is useful in Node.js: it keeps the system flexible and avoids tight coupling between components.
## 06/05/2026 - 10/05/2026
- **Strategy Pattern Investigation:** I then moved to the Strategy Pattern, focusing on Node.js lib/crypto.js. I looked at the createHash() function and how the selected hashing algorithm is passed as a parameter. At first, this was less obvious than the Observer Pattern, because the concrete algorithms are not implemented directly as JavaScript classes in the same file. However, after reviewing the structure, I understood that the stable interface remains the same, while the actual hashing behavior changes depending on the algorithm selected, such as SHA-256, SHA-512, or MD5.
- **Understanding the Design Choice:** I mapped createHash() and the related Hash object pipeline as the Context, the algorithm parameter as the Strategy selector, and the OpenSSL-supported algorithms as the Concrete Strategies. I also worked on explaining why this pattern is useful: the developer can change the hashing behavior at runtime without changing the surrounding code. This made the API more flexible and avoids creating separate hardcoded functions for every possible hashing algorithm.
## 11/05/2026
We had a meeting with the design pattern's members to decide which design patterns to keep for the final report, focusing on those with clearer Node.js code references. I confirmed that Observer and Strategy were suitable choices because they connect well to both the theory and the real implementation.
## 13/05/2026
We had a full team meeting to discuss the remaining architecture work, especially the C4 diagrams and related explanations. We reviewed the different sections together, but we decided not to finalize the division immediately because we first wanted everyone to analyze the parts and see which areas each person preferred to work on.
## 20/05/2026
We discussed how to finalize the division of the C4 architecture sections, since the diagrams needed to be prepared soon. I agreed to take Context level, while the team started assigning the remaining container , component and architecture sections.
## 21/05/2026 
I started studying the Context Level (C4 Level 1) and understanding what information should appear in the diagram. I began analyzing which Node.js files and components could help identify the external systems and users interacting with Node.js, while also reviewing how to structure the analysis for the report.
## 22/05/2026 - 27/05/2026 
I worked on designing the C4 Level 1 System Context diagram for Node.js, focusing on showing the system from a high-level architectural perspective.
I represented Node.js as one central runtime environment and connected it with the main external actors and systems, such as developers, the terminal, npm, the operating system, databases, APIs, and native addons.
## 29/05/2026 - 01/06/2026
After the feedback session, I reviewed my assigned parts again, especially the C4 Level 1 System Context diagram and its explanation.
I focused on checking whether the diagram was clear, whether the abstraction level was correct, and how I could improve the written description to make my section more consistent
## 07/06/2026 - 08/06/2026
I reviewed the design patterns section again to make sure that my analysis of the Observer and Strategy patterns was clear, correct, and consistent for the final report.I checked the connection between the theoretical GoF roles and the real Node.js implementation, especially the references to EventEmitter, emit(), addListener(), and createHash().
