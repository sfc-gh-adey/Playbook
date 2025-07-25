# The AI Prompting Playbook for Product Managers

Welcome, Product Managers! This document is your guide to effectively collaborating with an AI pair programmer to build high-fidelity, interactive prototypes. The goal is to move from idea to a "living specification" for engineering, fast.

The principles are based on proven, effective interactions that led to the successful creation of the Cortex Search Service wizard and playground.

---

## The Core Principle: Show, Don't Just Tell

The single most effective way to guide the AI is to **provide visual examples**. Raw descriptions are good, but screenshots are ground truth. They eliminate ambiguity and ensure the AI understands the target UI and UX with perfect clarity.

### Prompt Template: Using Visuals

Always start with an image. You can use screenshots of existing products, Figma mockups, or even a quick sketch.

> **Your Prompt:**
> "Here is the design I'm aiming for. Please build a component that matches this screenshot."
>
> `[Attach screenshot]`
>
> **For detailed views:**
> "Here is the original image, and here are different crops to help you see the details better. Focus on the button style and the spacing in this crop."
>
> `[Attach full screenshot and cropped screenshots]`

---

## 1. Kicking Off a New Feature

Start with a clear, high-level goal. State what you're building and its primary purpose. This helps the AI understand the project's context.

### Prompt Template: The "Vision" Prompt

> **Your Prompt:**
> "The goal is to build a [**type of interface, e.g., setup wizard, dashboard**] for [**product/feature name**]. The primary purpose is to [**main user goal, e.g., allow users to configure a new service**]. It should initially have [**number**] steps: [**list the steps**]."

**Example from our session:**
*"The primary goal is to build a setup wizard for creating a Cortex Search service that indexes PDF files stored in Snowflake stages..."*

---

## 2. Guiding UI & UX

Be specific and descriptive about layout, components, and interactions. Don't be afraid to "art direct" the AI.

### Prompt Templates: UI/UX Direction

> **Layout & Spacing:**
> "Let's refine the layout. Please [**action, e.g., reduce the wizard height**] and move the [**component**] to the [**location, e.g., bottom of the panel**]."
>
> **Component Behavior:**
> "When a user clicks the [**source component, e.g., 'Stage' button**], I want the [**target component, e.g., file browser**] to [**action, e.g., slide in and completely cover the stage selection panel**]."
>
> **Data Display:**
> "Refine the data preview table. Please add lines between each entry to make it look more like a SQL table."
>
> **Interactivity:**
> "The 'Create Service' button should be disabled until the user has [**condition, e.g., selected at least one file**]."

---

## 3. Refining Content and Copy

The AI can help with copywriting. Guide it by providing the tone and intent.

### Prompt Templates: Copy & Content

> **Conciseness:**
> "The copy on the PDF configuration screen is too verbose. Can you simplify it? Remove technical jargon like 'LAYOUT/OCR' and focus on user-friendly language."
>
> **Reframing for Users:**
> "Let's reframe the PDF processing options. Instead of technical modes, let's present it as a choice between 'Text-Heavy Documents' and 'Visually-Rich Documents'."
>
> **Adding Explanations:**
> "Let's add some helper text below the Text/Vector toggles to explain when a user should choose each option."

---

## 4. Providing Technical Context

When the "how" matters for the simulation, provide the AI with context. This is crucial for prototypes that need to reflect a specific backend process.

### Prompt Templates: Technical Guidance

> **Providing a Source of Truth:**
> "The `cortex_search_multimodal.ipynb` notebook is the source of truth for how this should work. Please use it as a reference for the data schema."
>
> **Explaining Backend Logic:**
> "For the multimodal flow, it's important to know that our backend will generate a new table on the customer's behalf. The UI should show the final schema of that generated table."
>
> **Clarifying Scope:**
> "For this prototype, we don't need to implement real-time file parsing for metadata. The metadata selection should be general, with 'Document Name' as a default."

---

## 5. Debugging and Troubleshooting

When things go wrong, help the AI fix them by providing clear, actionable information.

### Prompt Templates: Bug Reports

> **Clear Problem Description:**
> "I've run into an issue. The page is broken after I select the 'visual heavy' option. The 'Create Service' button is also inactive when it shouldn't be."
>
> **Providing Logs (Very Important!):**
> "Here are the console logs from the browser. It looks like there's a `TypeError`."
>
> `[Paste console logs]`
>
> **Reporting Build/Deployment Errors:**
> "I'm trying to deploy to Vercel and it's failing. Here are the build logs."
>
> `[Paste build logs]`

---

## 6. Managing the Workflow

You can direct the AI to perform repository and development server actions. Be direct and concise.

### Prompt Templates: Workflow Commands

> **Saving Work:**
> "Okay, this looks great. Let's commit all the changes."
> "Please add a commit message: '[Your clear, concise message]'."
>
> **Pushing to Remote:**
> "Push it."
>
> **Server Management:**
> "Can you restart the dev server? I don't think it picked up the latest changes."
> "Please run the app so I can test the flow."

By following these patterns, you will get more accurate results, iterate faster, and ultimately create better product specifications. Happy prototyping!

---
---

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