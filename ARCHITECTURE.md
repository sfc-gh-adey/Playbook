# Architecture & Roles

This document outlines the structure of the Playbook platform and the roles associated with each part of the repository.

---

## Philosophy

Our goal is to streamline the transition from product vision to engineering execution by enabling Product Managers to build high-fidelity, interactive prototypes that serve as a **living specification**.

-   **Prototype as Specification:** The interactive prototype clearly defines user flows, interactions, and UI, reducing ambiguity for engineering.
-   **Rapid Iteration:** Leverage pre-built components and templates to quickly build and validate product ideas.
-   **Design Consistency:** All prototypes adhere to Snowflake's design system, ensuring a consistent user experience from concept to production.

---

## Roles & Responsibilities

-   **Product Managers (You):** Own the prototype content within the `src/` directory. You define the user experience, features, and logic required for the interactive specification.
-   **Product Design Team:** Governs and maintains the shared component library within the `core/` directory. They ensure all foundational components are high-quality, accessible, and reusable.

---

## Repository Structure

```
/
├── core/              # Product Design owned: Shared component library and design system.
│   ├── components/    # Reusable UI components (e.g., Wizard, Tables, Forms).
│   └── styles/        # Design tokens, themes, and CSS classes.
├── templates/         # Pre-defined starting points for new prototypes.
├── scripts/           # Automation tools (e.g., prototype generator).
└── src/               # Product Manager owned: The current prototype under development.
```

-   **`core/`**: This is the heart of the design system. Do not modify files here. If you need a new shared component, please file a request with the Product Design team.
-   **`templates/`**: These are the starting points for new features, accessible via the `npm run create-prototype` script.
-   **`src/`**: This is your sandbox. All of your feature-specific code, components, and logic live here.
-   **`scripts/`**: Contains the `create-prototype` script for generating new prototypes.

---

## Available Scripts

```bash
npm run dev          # Starts the local development server
npm run build        # Creates a production-ready build of your prototype
npm run preview      # Previews the production build locally
npm run lint         # Runs ESLint for code quality checks
npm run create-prototype # Generates a new prototype from a template
``` 