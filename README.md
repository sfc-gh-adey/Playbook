# Snowflake Product Prototyping Platform

**Welcome to the new standard for product innovation at Snowflake.**

This platform is designed for one purpose: to empower Product Managers to build high-fidelity, interactive prototypes that serve as a **living specification** for our engineering teams. Think of it as a bridge between vision and execution—fast, consistent, and always aligned with Snowflake's design language.

## The New World Order: Our Philosophy

We are moving away from static mockups and ambiguous requirements. Our new process is built on three core principles:

1.  **Prototype as the Spec:** Your prototype *is* the specification. It communicates the user flow, interactions, and UI with perfect clarity, eliminating guesswork for Engineering.
2.  **Build, Don't Describe:** Instead of writing lengthy documents, you build the experience. This forces clarity of thought and uncovers edge cases early.
3.  **Speed and Consistency:** By building with a centrally managed library of Snowflake components, you can launch a new prototype in minutes, not weeks, ensuring every idea looks and feels like a real Snowflake product from day one.

---

## Who Governs What?

-   **Product Managers (You):** You own the prototype (`src/`). You decide the user flow, the features, and the logic required to create a compelling, interactive spec.
-   **Product Design:** The Design team owns the `core/` component library. They are the stewards of our design system, ensuring all foundational components (buttons, tables, forms) are pixel-perfect, accessible, and reusable.

---

## Quick Start: Go from Idea to Live Demo in 5 Minutes

Ready to build? Your first prototype is minutes away.

### 1. Generate Your Prototype

Open your terminal and run the prototype generator. You'll give your feature a name and choose a starting template.

```bash
# Usage: npm run create-prototype <feature-name> <template-name>
npm run create-prototype my-amazing-feature wizard-flow
```

**Available Templates:**

| Template | Description | Best For |
| :--- | :--- | :--- |
| `wizard-flow` | A multi-step wizard interface | Setup flows, configurations, onboarding |
| `data-explorer` | Data browsing and filtering | File browsers, table views, search results |
| `service-dashboard` | A classic service management panel | Status pages, monitoring, settings |

### 2. Start Developing

Navigate into your new prototype's directory, install dependencies, and start the development server.

```bash
cd my-amazing-feature
npm install
npm run dev
```

Your browser will open with a live-reloading preview of your prototype. Now, you can start building your user flow in the `src/` directory.

---

## The Rules of Engagement: What This Is (and Isn't)

*   ✅ **This IS a tool for communication.** Its goal is to create an unambiguous spec for Engineering.
*   ✅ **This IS for validating user flows.** You can put your interactive demo in front of customers and stakeholders to get real feedback.
*   ✅ **This IS built on real components.** The `core/` library ensures your prototype is visually identical to the final product.

*   ❌ **This IS NOT production code.** Do not add complex business logic, authentication, or direct API integrations. Keep it simple. The goal is to simulate the experience, not re-implement the backend.
*   ❌ **This IS NOT a replacement for engineering.** The engineering team will take your living spec and build a robust, scalable, and tested feature. They will reuse `core/` components, but they will write their own feature-specific code.

---

## How It Works: The Architecture

The repository is simple by design:

```
/
├── core/              # 🎨 Product Design's territory. The shared component library.
│   ├── components/    # Reusable UI components (Wizard, Tables, Forms).
│   └── styles/        # Design tokens, themes, and CSS classes.
├── templates/         # 🚀 Starting points for new prototypes.
├── scripts/           # 🛠️ Automation tools (like the prototype generator).
└── src/               # 🧑‍💻 Your territory. The current prototype you're building.
```

When you need a new component that feels reusable, file a request with the Product Design team. They will build it, add it to `core/`, and make it available for everyone.

## Available Scripts

```bash
npm run dev          # Start the development server for your prototype
npm run build        # Create a production build of your prototype for sharing
npm run preview      # Preview the production build locally
npm run lint         # Check your code for style issues
npm run create-prototype # Generate a new prototype from a template
```

Happy Prototyping!