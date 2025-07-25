# Comment System Guide

## Overview

The Comment System is a generic, reusable component that automatically tracks page context to ensure comments are truly page-specific, even in single-page applications.

## How It Works

### Automatic Context Detection

The system automatically detects and tracks various UI states to differentiate between different "pages" or states within the same URL:

1. **Modal/Dialog Detection**: Tracks active modals by their titles
2. **Tab Detection**: Identifies active tabs
3. **Wizard/Stepper Steps**: Detects current step in multi-step processes
4. **Navigation State**: Tracks selected items in sidebars
5. **Section Headings**: Uses main headings as context
6. **Custom Context**: Supports `data-comment-context` attributes

### Example Contexts

- URL: `/` → Context: `Step: 1 New service`
- URL: `/` → Context: `Step: 2 Select data`
- URL: `/dashboard` → Context: `Tab: Analytics > Section: Revenue`
- URL: `/settings` → Context: `Modal: Edit Profile`

## Making Your App Comment-Ready

### 1. Use Semantic HTML

```html
<!-- For wizards/steppers -->
<div class="bg-blue-600 text-white">Step 1: New service</div>

<!-- For tabs -->
<button role="tab" aria-selected="true">Overview</button>

<!-- For modals -->
<div role="dialog">
  <h2>Edit Settings</h2>
</div>
```

### 2. Add Custom Context (Optional)

```html
<!-- For complex states -->
<div data-comment-context="Product View: SKU-12345">
  <!-- Your content -->
</div>
```

### 3. Use Standard Patterns

The system looks for common UI patterns:
- Active states: `.bg-blue-600.text-white`, `.bg-blue-50`
- ARIA attributes: `aria-current="step"`, `aria-selected="true"`
- Semantic roles: `role="dialog"`, `role="tab"`

## Benefits

1. **Zero Configuration**: Works out-of-the-box with standard UI patterns
2. **Framework Agnostic**: Uses DOM queries, not framework-specific code
3. **Extensible**: Easy to add new context detection rules
4. **Persistent**: Comments stay with their exact context

## Customization

To add new context detection, modify the `capturePageContext` function:

```javascript
// Add your custom detection
const customElement = document.querySelector('.your-pattern');
if (customElement) {
  context.push(`Custom: ${customElement.textContent}`);
}
``` 