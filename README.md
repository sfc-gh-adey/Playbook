# Playbook – Rapid Product Prototyping at Snowflake

This platform helps you build interactive "living specs" for engineering, faster. Turn your product vision into a high-fidelity prototype using pre-built components and AI assistance.

Our goal is to streamline the transition from product vision to engineering execution. We do this through:
-   **Prototype as Specification:** The prototype serves as a living spec, reducing ambiguity for engineering.
-   **Rapid Iteration:** Leverage templates and AI to quickly build and validate product ideas.
-   **Design Consistency:** All prototypes use Snowflake's design system for a consistent user experience.

---

### Why Now?

The convergence of AI capabilities and market dynamics makes this the critical moment for a platform like Playbook.

**AI has changed the game.** We're no longer limited by the speed of manual UI development. With the right guidance, AI can translate product vision into working prototypes in hours, not weeks. But this is only valuable if PMs know how to harness it effectively—which is exactly what Playbook enables.

**Snowflake is uniquely positioned.** We're not just a platform company; we're building a comprehensive product experience. As competitors race to add features, our ability to rapidly prototype, test, and ship user-facing capabilities becomes a critical differentiator. The companies that can move from idea to user value fastest will win.

**The pace is only accelerating.** Customer expectations are rising, shaped by consumer software experiences. Enterprise users want powerful capabilities delivered through intuitive interfaces. This demands a new velocity of product development—one where the time from PM insight to engineering spec is measured in days, not months.

Playbook is our response to this moment. It's how we ensure Snowflake's product innovation keeps pace with our platform innovation.

---

### Get Started

1.  `npm install`
2.  `npm run dev`
3.  Open `http://localhost:5173`

To create a new prototype from a template, run `npm run create-prototype <feature-name> <template-name>`.

#### GitHub OAuth Setup (Optional - for commenting system)

1. Create a GitHub OAuth App at https://github.com/settings/applications/new
2. Set Authorization callback URL to `http://localhost:5173` (or your deployment URL)
3. Create `.env` file:
   ```
   VITE_GITHUB_CLIENT_ID=your-client-id
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

| Tactic | Your Prompt | Why It Works |
| :--- | :--- | :--- |
| **Show, Don't Tell** | "Here's a screenshot. Build this." `[Attach image]` | Eliminates ambiguity on UI/UX. The AI sees exactly what you want. |
| **Start with Intent** | "I'm building a [UI type] for [feature] to let users [goal]." | Provides context, helping the AI make better architectural choices. |
| **Give Clear Bug Reports** | "The app crashed after I did X. Here are the logs." `[Paste logs]` | The fastest way to a fix. Logs tell the AI exactly where to look. |

➡️ **[View the full AI Prompting Playbook](./PROMPTING_PLAYBOOK.md)** for detailed examples and templates.

---

### Learn More

-   **[Architecture & Roles](./ARCHITECTURE.md)** – Understand the repository structure, roles, and platform philosophy.
-   **What This Is (and Isn't):** This is a tool for creating interactive blueprints, not production code. It's for validating user flows and communicating with engineering, not replacing them.