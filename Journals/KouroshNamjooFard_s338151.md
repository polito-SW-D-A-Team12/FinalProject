## 19/04/2026
We had a meeting about splitting the project's work among team members 
## 22/04/2026 
Took a snapshot of the codebase (2026-04-01, v25.9.0) so we’re all working on the same version.
## 24/04/2026
We had a meeting to divide the work for identifying the design patterns, and I decided to take on the Observer and Strategy patterns.
## 26/04/2026
Started going through the Observer and Strategy patterns from the material to understand how they work and where they are used.
## 29/04/2026 - 04/05/2025
- **Observer Pattern Investigation:** I started working on the first pattern I selected, the Observer Pattern. I focused mainly on Node.js lib/events.js, because the EventEmitter mechanism seemed to be the clearest example of this pattern. I went through the parts where listeners are stored, added, and notified, especially the _events structure, addListener(), and emit(). At the beginning, I had to spend some time connecting the theory from the course material with the actual Node.js implementation, because the pattern is not written as a simple textbook example. What I understood is that the EventEmitter object works as the Subject, while the callback functions registered as listeners act as Observers. This helped me see how Node.js uses the pattern to support asynchronous and event-driven behavior without making modules directly depend on each other.
- **Mapping to GoF Roles:** After understanding the general logic, I started mapping the implementation to the professor’s expected UML/design pattern roles. I identified the Subject, Observer, Concrete Subject, registration operation, and notification mechanism. I also compared this approach with a more direct callback-based structure, which helped me explain why the Observer Pattern is useful in Node.js: it keeps the system flexible and avoids tight coupling between components.
