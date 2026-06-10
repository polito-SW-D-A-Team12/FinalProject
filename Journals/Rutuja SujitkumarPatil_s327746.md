# 19/04/2026

We had a meeting to divide the project work among team members. I will be working on design patterns with 2 other teammates.

# 24/04/2026

Studied the design pattern slides. Started identifying patterns in Node.js. Planned the work distribution for the design patterns sub-team - 2 patterns per person.

# 28/04/2026 - 30/04/2026

- **Decorator Pattern Investigation:** Started looking into the Decorator pattern in the streams subsystem. I read through transform.js, stream.js and zlib.js on GitHub at the v25.9.0 tag. The basic idea is that Transform extends Duplex and adds extra behavior (like compression) without changing the stream interface. Classes like Gzip and Deflate in zlib.js build on top of that. I mapped the classes to the UML roles from the lectures and started drafting the write-up.

- **Factory Method - Initial Reading:** I also began looking into my second pattern - Factory Method. I opened [lib/http.js](https://github.com/nodejs/node/blob/v25.9.0/lib/http.js) and found the `createServer()` function, which simply returns `new Server(opts, requestListener)`.Still need to write this one up properly.

- **Scope Discussion with Team:** Coordinated with the rest of the team about the scope concern. Since the full Node.js repository far exceeds the 100k LOC guideline and our `lib/` folder sits at around 114k LOC, we discussed whether focusing exclusively on the JavaScript core is acceptable. The dependencies sub-team has also been working within `lib/`, so we are aligned. We plan to ask the professor to confirm that this approach satisfies the "smaller component" requirement analyzing patterns and dependencies within the JS layer.

# 05/05/2026

-**Factory Method - Analysis:** Looked into Factory Method as my second pattern. Found it in lib/http.js where createServer() just returns new Server(opts, requestListener) with the Server class imported from an internal module. Same structure in net.js and fs.js — net.createServer() wraps new Server(), fs.createReadStream() wraps new ReadStream(). Mapped everything to the GoF roles and started drafting the write-up alongside the Decorator one.

# 08/05/2026

Drafted the Decorator Pattern and Factory Method write up for design pattern section of the Design report.

# 11/05/2026

Meeting with Sina and Kourosh (the design patterns sub-team) to decide which four patterns to include in the final design report. We compared all and selected Decorator, Observer, Template, and Strategy. We also reviewed each other's draft write-ups and gave feedback to finalize the design pattern section.

# 13/05/2026

Meeting with the whole group. Each subgroup explained what they have been doing for the past weeks and planned on doing a first complete version of the Design Report this weekend. Talked about how to approach the architecture part. Decided when to have the C4 feedback meeting with the professor.

# 18/05/2026 - 27/05/2026

Began working on my assigned section of the architecture report: C4 Level 2 Container Diagram. I started by investigating more in detail how C4 works by watching again the lecture where it was explained and visiting https://c4model.com/. I then read src/README.md and BUILDING.md in the Node.js repository to understand how the runtime components (V8, libuv, C++ bindings layer) connect to the JavaScript core. I also explored lib/internal/bootstrap/ to see how the runtime initializes and how internalBinding() bridges JavaScript to C++. Based on this, I built a C4 Level 2 Container Diagram in PlantUML using the C4-PlantUML library.

# 28/05/2026
C4 feedback meeting with the professor. I was absent because I was sick, but my teammates filled me in afterwards. Some key ideas were introduced such as incorporating the boundaries to the diagrams, keep naming consistent across C4 levels, write key responsibilities inside the container boxes rather than general descriptions.

# 31/05/2026 - 01/06/2026
Started making changes to my Level 2 Container Diagram based on the professor's feedback. Sofia then shared some changes she had made to the diagram. I looked through her version and noticed some good improvements, like adding the npm CLI as an external system and adding a "Bundled Native Libraries" container for the deps/ folder, which I had not included before. I incorporated these into my version and also removed Node-API as a separate container since it is really part of the C++ Bindings Layer.

# 07/06/2026
Wrote the Level 2 container section for the architecture report. This covered the five containers how they relate to each other and the Clean Architecture comparison. Ran the word count a few times to make sure I stayed within budget.

# 08/06/2026
Went through the design report and made changes. Fixed some wording in my Decorator section and helped revise the summary at the end so it joins the dependency findings and the pattern findings together.

# 09/06/2026
Worked on the overview report. Checked the actual numbers from cloc and added the code statistics table with verified numbers from the v25.9.0 tag.
