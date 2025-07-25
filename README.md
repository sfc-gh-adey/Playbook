# Playbook – Rapid Product Prototyping at Snowflake

This platform helps you build interactive “living specs” for engineering, faster. Turn your product vision into a high-fidelity prototype using pre-built components and AI assistance.

Our goal is to streamline the transition from product vision to engineering execution. We do this through:
-   **Prototype as Specification:** The prototype serves as a living spec, reducing ambiguity for engineering.
-   **Rapid Iteration:** Leverage templates and AI to quickly build and validate product ideas.
-   **Design Consistency:** All prototypes use Snowflake's design system for a consistent user experience.

---

### Get Started

1.  `npm install`
2.  `npm run dev`
3.  Open `http://localhost:5173`

To create a new prototype from a template, run `npm run create-prototype <feature-name> <template-name>`.

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