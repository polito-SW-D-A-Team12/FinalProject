Sina Sohrabian
Software Design and Architecture
Node.js v25.9.0 — Design Pattern Analysis
(Behavioral) + Singleton (Creational) 

## April 24, 2026
*Hours:* 1.5h
First team meeting. I was assigned Template Method and Singleton patterns. Read the team guide. Starting files: ⁠ lib/stream.js ⁠ and ⁠ lib/internal/modules/cjs/loader.js ⁠. Set up local repository.

## April 25, 2026
*Hours:* 2h
Read ⁠ lib/stream.js ⁠ (153 lines). It is only a public facade — no pattern logic here. Line 55 assigns Stream base class, line 63 attaches Readable, line 104 attaches Writable. Actual implementation is in the internal files. Redirected focus to ⁠ writable.js ⁠ and ⁠ readable.js ⁠.

## April 26, 2026
*Hours:* 3h
 Read of ⁠ lib/internal/streams/writable.js ⁠. Comment at line 23 confirms the Template Method contract. Traced write pipeline: ⁠ write() → writeOrBuffer() → doWrite() → _write() ⁠. Base class calls primitive operation at lines 570 and 596. PrimitiveOperation defined at lines 796–801 — throws ⁠ ERR_METHOD_NOT_IMPLEMENTED ⁠ if not overridden. Noted line 409 for Strategy alternative.

## April 27, 2026
*Hours:* 2h
Read ⁠ lib/internal/streams/readable.js ⁠. PrimitiveOperation ⁠ _read() ⁠ defined at lines 908–910, called at line 742. Mapped all roles: AbstractClass = Writable/Readable, TemplateMethod = write/read pipeline, PrimitiveOperation = ⁠ _write() ⁠/⁠ _read() ⁠. Added note distinguishing Template Method from Decorator.

## April 28, 2026
*Hours:* 2.5h
Read ⁠ lib/internal/modules/cjs/loader.js ⁠ for Singleton. ⁠ Module._cache ⁠ declared at line 351. ⁠ Module._load() ⁠ at line 1238 checks cache at lines 1285–1308 and stores module at line 1338. Mapped roles: Singleton = module object, Instance = cached exports, getInstance() = ⁠ require() ⁠. Noted JS vs Java distinction.

## April 29, 2026
*Hours:* 2.5h
Wrote Template Method section for ⁠ design.md ⁠. First draft too long — removed general definitions and kept only Node.js-specific content: file locations, line numbers, roles, and Strategy alternative.

## April 30, 2026
*Hours:* 2h
Wrote Singleton section for ⁠ design.md ⁠. Focused on making the getInstance() mapping precise and including the JS vs Java distinction and Dependency Injection alternative.

## May 1, 2026
*Hours:* ~1.5h
Reviewed both sections together. Cut general definitions, cache walkthrough, and code examples. Tightened prose to stay within word count.

## May 2, 2026
*Hours:* 1h
Fixed opening sentence of Template Method section. Checked all GitHub links use v25.9.0 tag.

## May 3, 2026
*Hours:* ~1h
Final read-through. I tried to verify that I used all professor vocabulary terms are present and accurate in both sections.
