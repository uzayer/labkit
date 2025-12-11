# Linear Workflow & Statuses

This document defines the lifecycle of an issue and the communication protocols for the team.

## Issue Statuses

We use a granular status set to track the specific state of work.

### Backlog
*   **New:** Default state for new tickets. Needs triage.
*   **Soon:** Higher priority items selected for the near-term roadmap.
*   **Later:** Lower priority items, ideas, or "maybe later" tasks.

### Unstarted
*   **Shaping:** The "Researching Phase". Experimenting, designing, or defining the scope before coding begins.
*   **Todo:** Ready to be picked up. Scope is defined.
*   **Started:** (Often synonymous with "In Progress" in simpler workflows, but can distinguish "just started" vs "deep in work").

### In Progress
*   **In Progress:** Active development is happening.
*   **In Review:** Pull request is open and being reviewed.
*   **Ready to deploy:** Merged and waiting for deployment (or final check).

### Completed
*   **Pending & Deployed:** Code is deployed, but post-deployment tasks remain (monitoring, notifying users, data checks).
*   **Deployed:** Completely finished. Code is live and all tasks are done.

### Canceled
*   **Canceled:** Won't do.
*   **Duplicate:** Already exists.
*   **Deprecated:** For experimental spikes that were abandoned or replaced.

---

## Communication Protocols

To maintain sanity and traceability, especially in async work:

### 1. Threading
*   **Rule:** Keep one question to one comment.
*   **Action:** Reply in the thread of that comment. Do not start a new main comment for a reply.

### 2. Acknowledgement
*   **Rule:** Use emoji reactions (👍) to acknowledge receipt or agreement.
*   **Why:** Reduces notification noise ("Okay", "Got it") while confirming communication.

### 3. Quoting
*   **Rule:** Quote the specific part of the message you are replying to.
*   **Why:** Preserves context in async conversations where hours might pass between replies.

### 4. Customer Loop (Bug Reports)
*   **Rule:** If a bug is reported by a customer, link the customer (or their support ticket) in the issue description.
*   **Closing:** Once the issue is **Deployed**, send a personal note to every linked customer informing them of the fix.
