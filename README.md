# 🚀 Snowflake Prototype Base

A rapid prototyping template for building consistent Snowflake UI experiences with reusable components and design patterns.

## 🎯 Purpose

This template enables fast iteration on product features with:
- **Consistent Snowflake design language**
- **Reusable component library**
- **Multiple prototype templates**
- **Rapid deployment capabilities**

## 🏗️ Architecture

```
snowflake-prototype-base/
├── core/                    # Shared foundation
│   ├── components/         # Reusable UI components
│   │   ├── Wizard/        # Wizard shells and navigation
│   │   ├── Tables/        # Data tables and lists
│   │   ├── Forms/         # Form inputs and validation
│   │   └── ...
│   ├── styles/            # Design tokens and themes
│   ├── hooks/             # Common React hooks
│   └── utils/             # Shared utilities
├── templates/             # Feature-specific starting points
│   ├── wizard-flow/       # Multi-step configuration flows
│   ├── data-explorer/     # Data browsing interfaces
│   ├── service-dashboard/ # Service management panels
│   └── analytics-view/    # Metrics and reporting
├── scripts/               # Automation tools
│   └── create-prototype.js # Prototype generator
└── src/                   # Current prototype (Cortex Search)
    ├── components/        # Feature-specific components
    └── ...
```

## 🚀 Quick Start

### Creating a New Prototype

```bash
# Generate a new prototype from this template
npm run create-prototype my-new-feature wizard-flow

# Navigate and start developing
cd my-new-feature
npm install
npm run dev
```

### Available Templates

| Template | Description | Best For |
|----------|-------------|----------|
| `wizard-flow` | Multi-step wizard interfaces | Setup flows, configurations |
| `data-explorer` | Data browsing and filtering | File browsers, table views |
| `service-dashboard` | Service management | Status pages, monitoring |
| `analytics-view` | Charts and metrics | Reporting, analytics |

## 🧩 Core Components

### WizardShell
```tsx
import { WizardShell } from '../core/components/Wizard/WizardShell';

<WizardShell
  title="Create Search Service"
  steps={steps}
  currentStep={currentStep}
  onStepClick={handleStepClick}
  footer={<NavigationButtons />}
>
  {children}
</WizardShell>
```

### Design Tokens
```tsx
import { snowflakeTokens, snowflakeClasses } from '../core/styles/tokens';

// Use consistent colors, spacing, typography
const primaryColor = snowflakeTokens.colors.primary[600];
const inputClass = snowflakeClasses.forms.input;
```

## 📋 Prototype Workflow

### 1. Requirements Gathering
- Define user flow and key interactions
- Identify reusable vs. custom components
- Choose appropriate template

### 2. Rapid Prototyping
```bash
# Create prototype in 30 seconds
npm run create-prototype feature-name template-type
cd feature-name && npm install && npm run dev
```

### 3. Iteration & Feedback
- Share live demo URLs
- Gather stakeholder feedback
- Iterate quickly on core flows

### 4. Component Extraction
- Extract reusable patterns back to core/
- Update design tokens
- Document new components

## 🎨 Design System

### Colors
- Primary: Blue scale for actions and highlights
- Gray: Neutral scale for text and backgrounds  
- Status: Green (success), Yellow (warning), Red (error)

### Typography
- Font: Inter (system fallback)
- Scales: xs (12px) → 2xl (24px)
- Weights: Regular (400), Medium (500), Semibold (600)

### Components
- Consistent spacing and borders
- Focus states and accessibility
- Hover animations and transitions

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run create-prototype # Generate new prototype
```

### Adding Core Components
1. Create component in `core/components/`
2. Export from appropriate index file
3. Add to design tokens if needed
4. Document usage patterns

### Template Customization
1. Modify templates in `templates/` directory
2. Update `scripts/create-prototype.js` with new templates
3. Test generation process

## 📦 Current Prototype: Cortex Search

This repository currently contains a **Cortex Search PDF Wizard** prototype featuring:

- ✅ 5-step wizard flow (New Service → Configure Indexing)
- ✅ Two document processing pipelines (Visual vs. Text)
- ✅ Metadata table with automatic column inclusion
- ✅ Service landing page with INITIALIZING status
- ✅ Horizontal carousel file browser
- ✅ voyage-multimodal-3 and arctic-embed integration

## 🚀 Future Enhancements

### Planned Features
- [ ] Storybook integration for component documentation
- [ ] Automated demo deployment (Vercel/Netlify)
- [ ] Component testing framework
- [ ] Design system documentation site
- [ ] CLI with interactive template selection
- [ ] Component usage analytics

### Template Roadmap
- [ ] `admin-panel` - User management interfaces
- [ ] `data-pipeline` - ETL configuration flows  
- [ ] `monitoring` - Metrics and alerting dashboards
- [ ] `onboarding` - User onboarding sequences

## 💡 Best Practices

### Component Design
- Start with core components, customize as needed
- Keep prototypes focused on key user flows
- Document component variations and use cases

### Prototype Management
- Use descriptive names for prototypes
- Keep prototypes lightweight and focused
- Extract patterns back to core regularly

### Feedback Integration
- Share live demos early and often
- Document feedback and decisions
- Iterate quickly on critical paths

---

## 🎉 Happy Prototyping!

This foundation enables rapid iteration while maintaining design consistency. Focus on the user experience, and let the tooling handle the infrastructure.

For questions or suggestions, create an issue or reach out to the product team. 