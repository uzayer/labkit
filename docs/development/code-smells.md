# Code Smells in LabKit (and How to Improve Them)

This guide is for engineers who want to improve code quality while shipping features.
It uses examples from this repository so you can practice with real context instead of generic advice.

## How to use this document

- Start with one smell category below.
- Pick one small refactor in one file.
- Keep behavior the same.
- Run validation (`pnpm tsc`, `pnpm lint`) before and after.
- Commit small, explain *why* in the message.

---

## 1) Duplicate logic (DRY violations)

**Example:** `src/actions/search.ts` (fallback filtering in the `catch` branch)

The fallback search logic duplicates field matching in multiple places (title, extracted text, meta title/description).  
This increases the chance that one branch is updated and the other is forgotten.

### Why this is a smell

- More lines to maintain for the same behavior
- Easy to introduce subtle inconsistencies
- Harder to test because logic is spread out

### Refactor pattern

Extract a single predicate function (for example `matchesQuery`) and use it in every filter path.

---

## 2) Type unsafety with `any`

**Example:** `src/utilities/richtext.ts`

This file uses `any` in shared utility paths (`splitRichText`, `extractTextContent`, `getSideMenuStructure`, `extractPlainText`).

### Why this is a smell

- TypeScript cannot protect you from bad shapes
- IDE autocomplete and refactoring become less reliable
- Runtime failures are discovered later than necessary

### Refactor pattern

- Replace `any` with narrowly defined types (`RichTextNode`, `RichTextContent`)
- Use `unknown` at boundaries, then narrow with type guards
- Keep utility function signatures explicit and reusable

---

## 3) Silent or low-context error handling

**Examples:**  
- `src/actions/search.ts`  
- `src/actions/auth/login.ts`

Some catch blocks return empty results or generic errors without enough context for diagnosis.

### Why this is a smell

- Real failures look like “no data”
- Incident debugging is slower
- Product behavior can degrade quietly

### Refactor pattern

- Return user-safe errors while logging actionable context
- Distinguish recoverable vs non-recoverable failures
- Prefer structured error messages over generic strings

---

## 4) Non-null assertions (`!`) in auth/control flow

**Example:** `src/utilities/getMeUser.ts` (`token!`)

Non-null assertions bypass safety checks and can hide edge-case crashes.

### Why this is a smell

- Assumptions are encoded without runtime verification
- Future code changes can break those assumptions silently

### Refactor pattern

Use explicit guards before returning values:

- validate token existence
- fail fast with a clear error or redirect
- return a fully safe typed object

---

## 5) Unstructured console logging in server actions

**Example:** `src/components/AdminDashboard/BackupDashboard/actions.tsx`

`console.log`/`console.warn`/`console.error` are used throughout backup/restore operations.

### Why this is a smell

- Logs are inconsistent and hard to query
- Operational debugging is harder at scale
- Sensitive details can accidentally leak to logs

### Refactor pattern

- Use consistent structured logs (level + event + metadata)
- Keep messages actionable (what failed, where, which collection)
- Avoid logging sensitive payloads

---

## 6) Long server-action functions with mixed responsibilities

**Example:** `src/components/AdminDashboard/BackupDashboard/actions.tsx` (`restoreBackup`, `createBackup`)

These functions parse data, access DB, upload files, revalidate cache, and redirect in one flow.

### Why this is a smell

- Hard to test in isolation
- Hard to reason about failure modes
- High blast radius for small edits

### Refactor pattern

Split into focused helpers:

- parse input backup
- restore collection docs
- restore media files
- run revalidation
- finalize/redirect

---

## 7) Weak input validation at external boundaries

**Example:** `src/components/AdminDashboard/BackupDashboard/actions.tsx` (downloaded backup parsing + collection iteration)

External input (backup file content) is parsed and used with limited schema validation.

### Why this is a smell

- Invalid or malformed input can fail late
- Error messages appear far from root cause
- Risk of partially applied restores

### Refactor pattern

- Validate shape immediately after parsing
- Fail fast before DB writes
- Report which collection/record failed

---

## 8) Expensive in-memory fallback behavior

**Example:** `src/actions/search.ts` (loads broad result set and filters in memory)

When query-level search fails, fallback loads many docs and filters in app code.

### Why this is a smell

- Performance degrades as data grows
- User-visible latency spikes under load
- Makes scaling unpredictable

### Refactor pattern

- Keep fallback bounded and observable
- Avoid broad unindexed scans in request paths
- Add metrics to detect fallback frequency

---

## Practical learning plan (2 weeks)

### Week 1: low-risk maintainability wins

1. Extract duplicated search predicate in `src/actions/search.ts`
2. Remove one non-null assertion with explicit guard in `src/utilities/getMeUser.ts`
3. Replace 2–3 high-noise console logs in backup actions with consistent messages

### Week 2: deeper quality improvements

1. Introduce stricter types in `src/utilities/richtext.ts` (small steps)
2. Break one long backup function into helper functions
3. Add boundary validation before backup restore writes

---

## Engineer mindset: how to spot smells early

Before merging, ask:

1. **Did I duplicate logic?**
2. **Did I bypass type safety with `any` or `!`?**
3. **Will errors be diagnosable in production?**
4. **Is this function doing too many jobs?**
5. **Does this path scale with more data?**

If any answer is “yes” or “not sure,” make one small refactor before merge.
