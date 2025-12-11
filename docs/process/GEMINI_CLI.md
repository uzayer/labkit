# Gemini CLI: Linear Interaction Guide

This document provides guidelines for the Gemini CLI agent to effectively interact with Linear, ensuring consistency with the company's established workflow and organizational structure. The goal is to facilitate seamless planning and issue management within Linear.

## Core Principles & References

Always refer to the following documentation files within the `docs/linear/` directory for the most up-to-date context:

*   **`HIERARCHY.md`**: Understands how Initiatives, Projects, and Issues are structured. Use Projects for "Deliverables/Goals" and Labels for "Areas."
*   **`WORKFLOW.md`**: Details issue statuses and team communication protocols.
*   **`LABELS.md`**: Provides the definitive list of Workspace-level labels (Types and Areas) to be used.

## Accessing Linear Documentation (for Gemini)

If you need more detailed information about Linear's features or API, use the `resolve_library_id` and `get_library_docs` tools:

1.  **Resolve Linear's Library ID:**
    ```json
    {
      "name": "resolve_library_id",
      "arguments": {
        "libraryName": "Linear"
      }
    }
    ```
2.  **Get Specific Documentation (Example: "issue creation"):**
    ```json
    {
      "name": "get_library_docs",
      "arguments": {
        "context7CompatibleLibraryID": "/linear/linear",
        "topic": "issue creation"
      }
    }
    ```

## Planning Features, Bug Fixes, and Tasks

When a user requests to plan, create, or update work items in Linear:

1.  **Understand the Request:** Clarify the objective (feature, bug, chore, design task).
2.  **Consult Hierarchy:** Determine if the work belongs to an existing `Project` (from `HIERARCHY.md`). If a new project is needed, propose its creation to the user, aligning with the "Deliverable" philosophy.
3.  **Select Labels:**
    *   Refer to `LABELS.md` to identify the most appropriate **Type** label (`Bug`, `Feature`, `Improvement`, `Chore`, `Design`, `Deprecated`).
    *   Refer to `LABELS.md` to identify the most appropriate **Area** label (`Frontend`, `Blocks`, `Admin`, `Data`, `DevOps`).
    *   Ensure all selected labels are from the definitive list.
4.  **Draft Issue Details:** Propose a clear `title` and a detailed `description`. The description should include context, acceptance criteria (if applicable), and any relevant links.
5.  **Confirm with User:** Always present the proposed issue details (title, description, project, labels) to the user for approval before creation.

## Interacting with Linear (Tool Usage)

*   **Primary Team:** Unless otherwise specified, assume the primary team is "Autana labs". You can confirm the `teamId` using `list_teams`.
*   **Creating Issues:** Use the `create_issue` tool.
    *   `title`: The issue's title.
    *   `description`: Detailed description in Markdown.
    *   `team`: The team name or ID (e.g., "Autana labs").
    *   `project`: The project name or ID the issue belongs to (if applicable).
    *   `labels`: An array of selected label names (e.g., `["Feature", "Frontend"]`).
    *   `priority`: Use Linear's native priority (0=No, 1=Urgent, 2=High, 3=Normal, 4=Low) if explicitly requested by the user.
*   **Updating Issues:** Use the `update_issue` tool with the issue's `id`.
*   **Adding Comments:** Use the `create_comment` tool. Refer to `WORKFLOW.md` for communication protocols (e.g., replying in threads).
*   **Listing/Searching:** Use `list_issues`, `get_issue`, `list_projects`, `list_issue_labels` as needed for context.

## Important Considerations

*   **Clarity over Brevity:** Always prioritize clear and comprehensive communication, especially when suggesting new Linear items.
*   **User Confirmation:** Obtain explicit user confirmation for any significant action in Linear (e.g., creating new issues, projects).
*   **Adherence to Standards:** Strictly adhere to the defined hierarchy, workflow, and label standards.
