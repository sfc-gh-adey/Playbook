# Playbook: Snowflake Product Prototyping Platform

**Welcome to Playbook, the dedicated platform for high-fidelity product prototyping at Snowflake.**

This platform empowers Product Managers to rapidly build interactive prototypes that serve as a **living specification** for engineering teams. It ensures consistency with Snowflake's design language and accelerates the product development lifecycle.

---

## Purpose & Philosophy

Our goal is to streamline the transition from product vision to engineering execution by:

1.  **Prototype as Specification:** The interactive prototype clearly defines user flows, interactions, and UI, reducing ambiguity for engineering.
2.  **Rapid Iteration:** Leverage pre-built components and templates to quickly build and validate product ideas.
3.  **Design Consistency:** All prototypes adhere to Snowflake's design system, ensuring a consistent user experience from concept to production.

---

## Roles & Responsibilities

*   **Product Managers (You):** Own the prototype content within the `src/` directory. You define the user experience, features, and logic required for the interactive specification.
*   **Product Design Team:** Governs and maintains the shared component library within the `core/` directory. They ensure all foundational components are high-quality, accessible, and reusable.

----- 

## Quick Start: Building Your First Prototype

Follow these steps to generate and run a new prototype:

### 1. Generate a New Prototype

Use the `create-prototype` script to scaffold a new project based on an existing template:

```bash
# Usage: npm run create-prototype <feature-name> <template-name>
npm run create-prototype my-new-feature wizard-flow
```

**Available Templates:**

| Template | Description | Best For |
| :--- | :--- | :--- |
| `wizard-flow` | Multi-step wizard interfaces | Setup flows, configurations, onboarding |
| `data-explorer` | Data browsing and filtering | File browsers, table views, search results |
| `service-dashboard` | Service management panels | Status pages, monitoring, settings |

### 2. Start Development Server

Navigate into your new prototype's directory, install dependencies, and start the local development server:

```bash
cd my-new-feature
npm install
npm run dev
```

Your browser will open a live-reloading preview, allowing you to begin building your user flow within the `src/` directory.

---

## Prototype Nature: What It Is (and Isn't)

*   ✅ **It IS a communication tool:** An interactive blueprint for engineering.
*   ✅ **It IS for validating user flows:** Gather feedback on the user experience.
*   ✅ **It IS visually consistent:** Built with production-ready design components.

*   ❌ **It IS NOT production code:** Avoid complex business logic, authentication, or direct API integrations. Its purpose is simulation, not implementation.
*   ❌ **It IS NOT a replacement for engineering:** Engineering teams will build the final product, reusing `core/` components but implementing their own feature-specific code.

---

## Architecture Overview

```
/
├── core/              # Product Design owned: Shared component library and design system.
│   ├── components/    # Reusable UI components (e.g., Wizard, Tables, Forms).
│   └── styles/        # Design tokens, themes, and CSS classes.
├── templates/         # Pre-defined starting points for new prototypes.
├── scripts/           # Automation tools (e.g., prototype generator).
└── src/               # Product Manager owned: The current prototype under development.
```

New reusable components should be requested from the Product Design team for inclusion in `core/`.

## Available Scripts

```bash
npm run dev          # Starts the local development server
npm run build        # Creates a production build of your prototype
npm run preview      # Previews the production build locally
npm run lint         # Runs ESLint for code quality checks
npm run create-prototype # Generates a new prototype from a template
```

Happy Prototyping!