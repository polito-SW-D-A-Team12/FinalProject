# Node.js Architecture and Design Analysis

This repository contains an analysis of Node.js, focusing on both the architecture and design.

## Team Members
* **Kourosh Namjoo Fard** - s338151
* **Manuel Nevado Blanco** - s350981
* **Sina Sohrabian** - s337342
* **Rutuja Sujitkumar Patil** - s327746
* **Sofía Tejedor Alonso** - s350727


## Repository Structure

* **`assets/`**: Rendered `.svg` diagrams used across the reports.
* **`diagrams/`**: Original PlantUML (`.puml`) source files for the architectural and coupling diagrams.
* **`Journals/`**: Individual progress logs and updates from team members.
* **`Scripts/`**: Custom Node.js scripts used to mine Git history, compute Fan-In/Fan-Out metrics and cross-reference dependency graphs.
* **`Overview.md`**: High-level introduction to the project and stakeholder analysis.
* **`arch_report.md`**: Details the global architecture using the C4 model, evaluates Clean Architecture alignment, SOLID principles and architectural characteristics.
* **`design_report.md`**: Explores the software design of the JavaScript core library. Includes structural dependency analysis, knowledge dependency analysis and evaluation design patterns.

## Reproducing the Analysis

The metrics and findings in the Design Report are fully reproducible. To run the analysis yourself, you will need a local clone of the [Node.js repository](https://github.com/nodejs/node) checked out at `v25.9.0`.

Detailed, step-by-step reproduction instructions and commands are available in the **Annex** at the bottom of `design_report.md`.
