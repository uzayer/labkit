# The Evolution of ResearchNet: A Thought Process

This document traces the step-by-step evolution of the ResearchNet idea, from the initial observation to the core insights that define its current direction.

### Phase 1: The Initial Observation

The journey began with a practical goal: building a better website for a university HCI lab. I observed that most academic websites fall into two categories:
1.  **Outdated:** They look and feel like they were built in 2004.
2.  **Inaccessible:** The few impressive ones (like MIT Media Lab's) are expensive, custom-commissioned projects unavailable to the average lab.

My initial assumption was that professors and lab staff are too focused on research to invest time in web development, and their outdated websites, while ugly, must still serve their core purpose.

### Phase 2: Deconstructing the "Good Enough" Website

To understand *why* these sites were still functional, I analyzed their purpose and structure.

-   **Core Functions:** They successfully facilitate research dissemination, establish academic credibility through publications and awards, attract student talent, and serve as a point of contact for collaborators.
-   **Structural Predictability:** Despite bad UX, the sites are highly structured and predictable. Most stick to a few common pages: Home, Research, Publications, Team, News, and Awards. This consistency makes them easy for users to scan and navigate.
-   **Technical Simplicity:** Old, static HTML sites are incredibly easy for search engines and academic indexers (like Google Scholar) to scrape and index. In contrast, modern Client-Side Rendered (CSR) sites can harm discoverability if not perfectly optimized for SEO.

The conclusion was that the 2004-style site succeeds based on its simple, predictable information architecture, not its visual design.

### Phase 3: The First Attempt - "Shadcn for Science"

My first solution was to create a more polished version of the same lab sites—a "Shadcn for science."

I chose a modern tech stack based on a template called Payblocks:
-   **Framework:** Next.js
-   **CMS:** Payload CMS
-   **Components:** shadcn/ui, with pre-built blocks from shadcnblocks.com
-   **Infrastructure:** Native support for MongoDB and Vercel hosting.

I began by creating rudimentary data models in Payload (e.g., Research Themes, Publications, Projects, Team) and building out the front-end with layout blocks that could display this data.

### Phase 4: The Pivot - Uncovering the Deeper Problem

While implementing auto-populated blocks, I hit a wall and uncovered the true reason academic websites are stale: **data entry is a massive hindrance.**

I realized the block-based, layout-focused approach was fundamentally wrong for this context:
-   **Static Layouts:** An academic lab's website structure rarely changes. Only the content within it does. A flexible block-based layout is overkill.
-   **Cumbersome Editing:** Editing content on a page-by-page, block-by-block basis is tedious and inefficient.
-   **Disconnected Data:** Most of a lab's data (projects, papers, people) is deeply interconnected, but a block-based system treats it as separate, unstructured content on a webpage.

This was the key insight: the problem wasn't the visual presentation, but the friction of manually maintaining the site's content.

### Phase 5: The New Direction - A Data-Centric, Template-Driven Model

This realization prompted a pivot away from a flexible page-builder to a more rigid, data-centric model.

-   **From Blocks to Templates:** The new approach was to build static page templates (e.g., a "Publications" page, a "Team" page) that are fed from a centralized, structured database, similar to how a typical blog renders posts from a database. The admin panel would be for managing the data, not the page layout.
-   **A Schema for Academia:** The data schema itself should reflect the mental models researchers already use. By structuring the data around concepts from grant applications and research papers, the system becomes more intuitive and purpose-built for the academic workflow.

The idea evolved from simply making a "prettier website" to building a smart, structured data management system that happens to output a clean, professional website as one of its functions.