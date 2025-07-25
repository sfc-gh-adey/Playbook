# Playbook – Rapid Product Prototyping at Snowflake

This platform helps you build interactive "living specs" for engineering, faster. Turn your product vision into a high-fidelity prototype using pre-built components and AI assistance.

![GitHub Comment Integration](docs/images/github-comment-integration.gif)
*Live collaboration: Leave contextual comments directly on prototypes that automatically sync to GitHub Issues for seamless PM-Engineering handoff*

## The Playbook Paradigm Shift

Traditional product development creates silos: PMs write specs, designers create mockups, engineers build from scratch. **Playbook changes the game** by turning prototypes into living specifications that bridge all three worlds.

### What Makes Playbook Different

1. **GitHub-Native Feedback Loop**: Comments on prototypes automatically become GitHub Issues. No more screenshot-laden documents or lost Slack threads. Every piece of feedback is tracked, actionable, and lives where engineers work.

2. **No Tool Lock-in**: Unlike proprietary prototyping tools, Playbook outputs standard React code. Use your favorite IDE, deploy anywhere, integrate with any toolchain. You own the code.

3. **Context-Aware Intelligence**: Our comment system automatically detects UI context (wizard steps, modal states, tab selections) without any configuration. Comments stay exactly where they belong, even in complex single-page applications.

4. **From Prototype to Production**: The code you prototype with is production-ready. No throwaway work. Every component follows Snowflake's design system and engineering standards.

### Why This Matters Now

The convergence of AI capabilities and market dynamics makes this the critical moment for a platform like Playbook.

**AI has changed the game.** We're no longer limited by the speed of manual UI development. With the right guidance, AI can translate product vision into working prototypes in hours, not weeks. But this is only valuable if PMs know how to harness it effectively—which is exactly what Playbook enables.

**Snowflake is uniquely positioned.** We're not just a platform company; we're building a comprehensive product experience. As competitors race to add features, our ability to rapidly prototype, test, and ship user-facing capabilities becomes a critical differentiator. The companies that can move from idea to user value fastest will win.

**The pace is only accelerating.** Customer expectations are rising, shaped by consumer software experiences. Enterprise users want powerful capabilities delivered through intuitive interfaces. This demands a new velocity of product development—one where the time from PM insight to engineering spec is measured in days, not months.

Playbook is our response to this moment. It's how we ensure Snowflake's product innovation keeps pace with our platform innovation.

---

### Run the Project

This project uses Vite for frontend serving and Vercel Serverless Functions for the backend (for handling GitHub OAuth). To run everything correctly locally, you must use the Vercel CLI.

1.  **Install Vercel CLI** (if you haven't already):
    ```bash
    npm install -g vercel
    ```
2.  **Set up Environment Variables**:
    -   Copy `.env.example` to a new file named `.env`.
    -   Fill in your `VITE_GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` from your GitHub OAuth App.
3.  **Run the development server**:
    ```bash
    vercel dev
    ```
4.  Open the local URL provided by the command.

This will start a local server that perfectly mimics the Vercel cloud environment, running both your React app and the serverless API function.

To create a new prototype from a template, run `npm run create-prototype <feature-name> <template-name>`.

#### GitHub OAuth Setup (For the commenting system)

1. Create a GitHub OAuth App at https://github.com/settings/applications/new
2. Set Authorization callback URL to `http://localhost:5173` (or your deployment URL)
3. Create `.env` file:
    ```
    VITE_GITHUB_CLIENT_ID=your-client-id
    GITHUB_CLIENT_SECRET=your-client-secret
    ```
4. For production, add `GITHUB_CLIENT_SECRET` to your Vercel environment variables

<details>
<summary>View available templates</summary>

| Template | Description | Best For |
| :--- | :--- | :--- |
| `wizard-flow` | Multi-step wizard interfaces | Setup flows, configurations, onboarding |
| `data-explorer` | Data browsing and filtering | File browsers, table views, search results |
| `service-dashboard` | Service management panels | Status pages, monitoring, settings |

</details>

---

### AI Prompting Cheat Sheet

Collaborating with the AI is key. Here are the core tactics for effective guidance.

| Tactic | What to Say | Why It Works |
| :--- | :--- | :--- |
| **Set Context First** | "Building a wizard for creating Cortex Search services" | AI understands the domain and constraints |
| **Reference What Exists** | "Similar to the table selector, but for stages" | Reuses patterns, maintains consistency |
| **Describe User Journey** | "User selects files, configures processing, reviews settings" | Creates intuitive flow |
| **Specify Visual Details** | "Show selected count in blue badge, disable if none selected" | Results match your vision |
| **Request Standard Patterns** | "Add loading state while fetching" | Gets production-ready behavior |

<details>
<summary>Detailed Examples & Templates</summary>

See [PROMPTING_PLAYBOOK.md](PROMPTING_PLAYBOOK.md) for comprehensive examples, templates, and advanced techniques.

</details>

---

### The Playbook Philosophy

-   **Prototype as Specification:** The prototype serves as a living spec, reducing ambiguity for engineering.
-   **Rapid Iteration:** Leverage templates and AI to quickly build and validate product ideas.
-   **Design Consistency:** All prototypes use Snowflake's design system for a consistent user experience.

For architecture details and contribution guidelines, see [ARCHITECTURE.md](ARCHITECTURE.md).