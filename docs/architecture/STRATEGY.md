# Project Architecture & Business Strategy

This document outlines the strategic architecture for the "DIAL Ecosystem" and "Autana Systems". It defines the relationship between codebases, products, and the business model.

## 1. The "Upstream Waterfall" Architecture

We avoid monorepos and microservices in favor of a **Git Upstream Waterfall**. This allows for code reuse and rapid updates while maintaining isolation for client data.

**The Hierarchy:**

1.  **`autana/base-template` (Tier 1)**
    *   **Role:** The "Parent" / Core Product.
    *   **Content:** Pure base template. Generic UI blocks, standard config, DevOps scripts.
    *   **Change Flow:** Bug fixes and generic feature additions start here.

2.  **`autana/labkit` (Tier 2)**
    *   **Role:** The "Golden Boy" / specialized product.
    *   **Relation:** Fork/Clone of the base template.
    *   **Content:** Adds complex Schema (Publications, Grants), OpenAlex integration, and Sync hooks.
    *   **Flow:** Pulls updates from the base template. Pushes Research-specific features here.

3.  **`clients/dial-web` (Tier 3)**
    *   **Role:** The "Instance" / High-Ticket Client.
    *   **Relation:** Fork/Clone of `labkit`.
    *   **Content:** DIAL-specific logos, content, custom "About" blocks, and configuration.
    *   **Flow:** Pulls updates from `labkit` (which includes base template changes).

4.  **`autana/gridforge` (Tier 4)**
    *   **Role:** The "Cash Cow" / Scaffolding.
    *   **Relation:** Extension of the base template.
    *   **Content:** Automation scripts and MCP agents to scaffold sites from PRDs.

## 2. Business Model & Products

### A. Base Template
*   **Product:** High-quality PayloadCMS + Shadcn website builder.
*   **Strategy:** The foundation for all other products.
*   **Name:** TBD — will be named when extracted into its own repo.

### B. Gridforge
*   **Product:** Automated site generation for medium-ticket clients.
*   **Strategy:** Volume play. "Cash Cow" for immediate revenue.

### C. LabKit
*   **Product:** Specialized CMS for Labs/PIs.
*   **Features:** Grant compliance, CV generation, Schema.org JSON-LD, OpenAlex sync.
*   **Strategy:** "Golden Boy". High value, niche market.

### D. DIAL Instance
*   **Product:** The specific implementation for the DIAL lab.
*   **Strategy:** The "First Customer". Proves LabKit works at scale.

### E. FieldKit (Open Source)
*   **Scope:** Project Management (Plane), HR (Frappe), Handbook.
*   **Strategy:** Low-cost ($10/mo VPS) stack for small orgs (12-50 people). Open source + Consulting services.
*   **Repository:** Separate `autana/infra-stack` repo.

## 3. Documentation Strategy

### Technical Docs (In-Repo)
*   **Location:** `docs/` folder within each repository.
*   **Content:** Architecture, CLI instructions (`GEMINI_CLI.md`), Workflows.
*   **Flow:** Docs flow down the waterfall (`core` -> `research` -> `dial`).
*   **Tooling:** Scanned by CodeWiki/Devin for API reference generation.

### Handbook (Policy)
*   **Location:** Separate `autana/handbook` repository.
*   **Tool:** Nextra.
*   **Content:** Company values, Merge Policies, Hiring guides.
*   **Governance:** Strict approval process (intentional friction).

## 4. Future Migration Plan

**Current State:** The `payblocks` repo currently contains **everything** (Base Template + LabKit + DIAL specific).

**Migration Steps:**
1.  **Stabilize DIAL:** Finish the current instance (Version 0.9).
2.  **Reverse Extract:**
    *   Clone repo to `labkit`. Remove DIAL-specific content.
    *   Clone `labkit` to `base-template`. Remove research-specific schemas.
3.  **Link Remotes:** Set up the `git remote add upstream` connections.
