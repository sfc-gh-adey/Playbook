# The AI Prompting Playbook

This document is your guide to effectively collaborating with an AI pair programmer to build high-fidelity, interactive prototypes.

---

### Quick Reference: The Cheat Sheet

| Tactic | Your Prompt | Why It Works |
| :--- | :--- | :--- |
| **Show, Don't Tell** | "Here's a screenshot. Build this." `[Attach image]` | Eliminates ambiguity on UI/UX. The AI sees exactly what you want. |
| **Start with Intent** | "I'm building a [type of UI] for [feature] to let users [achieve goal]." | Provides context, helping the AI make better architectural and naming choices. |
| **Direct the UI** | "Move the button," "Make the panel slide," "Disable the input until..." | You are the art director. Specific, command-like instructions are best. |
| **Provide Tech Context** | "The backend generates X, so the UI needs to show Y." | Simulates real-world constraints and ensures the prototype is realistic. |
| **Give Clear Bug Reports** | "The app crashed after I did X. Here are the logs." `[Paste logs]` | The fastest way to a fix. Logs tell the AI exactly where to look. |
| **Manage the Workflow** | "Commit the changes," "Push it," "Restart the server." | Direct commands for repository and environment management work best. |

---
<details>
<summary><strong>View Detailed Examples & Templates</strong></summary>

### The Core Principle: Show, Don't Just Tell

The single most effective way to guide the AI is to **provide visual examples**. Raw descriptions are good, but screenshots are ground truth.

**Template: Using Visuals**
> "Here is the design I'm aiming for. Please build a component that matches this screenshot." `[Attach screenshot]`
>
> "Here is the original image, and here are different crops to help you see the details better. Focus on the button style and the spacing in this crop." `[Attach full screenshot and cropped screenshots]`

---

### 1. Kicking Off a New Feature

Start with a clear, high-level goal.

**Template: The "Vision" Prompt**
> "The goal is to build a [setup wizard] for [Cortex Search Service]. The primary purpose is to [allow users to configure a new service]. It should initially have [3] steps: [Select Stage, Define Content, Review]."

---

### 2. Guiding UI & UX

Be specific and descriptive about layout, components, and interactions.

**Templates: UI/UX Direction**
> **Layout:** "Let's refine the layout. Please reduce the wizard height and move the 'Cancel' button to the bottom left."
>
> **Behavior:** "When a user clicks a stage, the file browser should slide in and completely cover the stage selection panel."
>
> **Data Display:** "Refine the data preview table. Add lines between each entry to make it look more like a SQL table."
>
> **Interactivity:** "The 'Create Service' button should be disabled until the user has selected at least one file."

---

### 3. Refining Content and Copy

Guide the AI by providing the tone and intent.

**Templates: Copy & Content**
> **Conciseness:** "The copy on this page is too verbose. Simplify it. Remove technical jargon like 'LAYOUT/OCR' and focus on user-friendly language."
>
> **Reframing:** "Reframe the PDF processing options as a choice between 'Text-Heavy Documents' and 'Visually-Rich Documents'."
>
> **Adding Explanations:** "Add helper text below the Text/Vector toggles to explain when a user should choose each option."

---

### 4. Providing Technical Context

This is crucial for prototypes that need to reflect a specific backend process.

**Templates: Technical Guidance**
> **Source of Truth:** "The `cortex_search_multimodal.ipynb` notebook is the source of truth for the data schema."
>
> **Backend Logic:** "For the multimodal flow, our backend will generate a table on the customer's behalf. The UI should show the final schema of that generated table."
>
> **Scope:** "For this prototype, we don't need real-time file parsing for metadata. The selection should be general, with 'Document Name' as a default."

---

### 5. Debugging and Troubleshooting

Provide clear, actionable information.

**Templates: Bug Reports**
> **Problem Description:** "The page is broken after I select the 'visual heavy' option. The 'Create Service' button is also inactive when it shouldn't be."
>
> **Logs (Very Important!):** "Here are the console logs from the browser: `[Paste console logs]`"
>
> **Build Errors:** "I'm trying to deploy to Vercel and it's failing. Here are the build logs: `[Paste build logs]`"

---

### 6. Managing the Workflow

Use direct, concise commands.

**Templates: Workflow Commands**
> **Saving:** "Okay, this looks great. Commit the changes with the message: 'feat: Implement new visual flow'."
>
> **Pushing:** "Push it."
>
> **Server:** "Restart the dev server." / "Run the app so I can test."

</details> 