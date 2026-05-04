# 19/04/2026

We had a meeting to divide the project work among team members. I will be working on design patterns with 2 other teammates.

# 24/04/2026

Studied the design pattern slides. Identified 6 candidate patterns in Node.js (Observer, Strategy, Decorator, Factory Method, Template Method, Singleton). Planned the work distribution for the design patterns sub-team — 2 patterns per person.

# 27/04/2026 - 30/04/2026

# Decorator Pattern Investigation:

I started working on my first assigned pattern — the Decorator. I browsed the Node.js source at the v25.9.0 tag on GitHub, focusing on the streams subsystem. I read through lib/internal/streams/transform.js, lib/stream.js, and lib/zlib.js to understand how Transform streams work. What I found is that Transform extends Duplex (which itself combines Readable and Writable), and acts as a wrapper that adds behavior — like compression or encryption — without changing the stream interface. In lib/zlib.js, classes like Gzip and Deflate extend Transform to add specific compression logic. I started mapping these to the professor's UML roles: Stream as the Component, Readable/Writable as ConcreteComponents, Transform as the Decorator, and zlib.Gzip/Deflate as ConcreteDecorators. I also noticed that the real power of this pattern shows up when you chain streams with .pipe() — e.g., readStream.pipe(gzip).pipe(encrypt).pipe(writeStream) — each layer decorates the data flow independently.

# Factory Method – Initial Reading:

I also began looking into my second pattern — Factory Method. I opened lib/http.js and found the createServer() function, which simply wraps new Server(opts, requestListener). The same pattern appears in net.createConnection() and fs.createReadStream(). Still need to write this one up properly, but the code examples are clear.

# Scope Discussion with Team:

Coordinated with the rest of the team about the scope concern. Since the full Node.js repository far exceeds the 100k LOC guideline, and our lib/ folder sits at around 114k LOC, we discussed whether focusing exclusively on the JavaScript core is acceptable. The dependencies sub-team has also been working within lib/, so we are aligned. We plan to ask the professor to confirm that this approach satisfies the "smaller component" requirement — analyzing patterns and dependencies within the JS layer.
