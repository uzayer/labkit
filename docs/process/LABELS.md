# Linear Labels

We use a simplified "Solo Dev + Scalable" label set. Labels are divided into **Types** (What kind of work) and **Areas** (Where the work happens).

**Note:** All labels are defined at the **Workspace Level** to support future teams.

## 1. Work Types (The "What")

These labels help prioritize work (Bugs first) and categorize the nature of the task.

| Label | Color | Description | Rationale |
| :--- | :--- | :--- | :--- |
| **Bug** | `Red` (#EB5757) | `[Type] Something is broken or behaving unexpectedly` | Critical fixes. High visibility. |
| **Feature** | `Blue` (#4EA7FC) | `[Type] New functionality that delivers value` | The main driver of progress. |
| **Improvement** | `Green` (#34D399) | `[Type] Enhancing existing functionality or UX` | Polish and optimization. Distinct from "New Features". |
| **Chore** | `Slate` (#94A3B8) | `[Type] Maintenance, deps, refactoring, housekeeping` | Necessary work that users don't see. Low visual noise. |
| **Design** | `Pink` (#D946EF) | `[Type] Visual design, prototyping, and research` | Pre-coding or creative work. |
| **Deprecated** | `Dark Grey` (#64748B) | `[Type] Work that is no longer relevant or replaced` | Used for closing issues without deleting history. |

## 2. Areas (The "Where")

These labels map directly to the codebase structure and mental model of the application.

| Label | Color | Description | Codebase Mapping |
| :--- | :--- | :--- | :--- |
| **Frontend** | `Cyan` (#26B5CE) | `[Area] Public website, Next.js pages, routing` | `src/app/(frontend)` |
| **Blocks** | `Indigo` (#6366F1) | `[Area] UI components, blocks, and heros` | `src/blocks`, `src/heros` |
| **Admin** | `Amber` (#F59E0B) | `[Area] Payload Admin UI, collections, and config` | `src/payload.config.ts`, `src/collections` |
| **Data** | `Orange` (#F97316) | `[Area] Schema design, data logic, and migrations` | Backend logic, `src/collections` (schema) |
| **DevOps** | `Blue Grey` (#475569) | `[Area] CI/CD, hosting, scripts, and env vars` | `.github/`, `Dockerfile`, `scripts/` |
