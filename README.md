# Cortex Search PDF Setup Wizard

A React-based setup wizard for creating Cortex Search services that index PDF files stored in Snowflake stages.

## Features

- **Step 1**: Choose PDF source stage with validation
- **Step 2**: Select document content type (visual vs text-only)
- **Step 3**: Review configuration and create service

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** to `http://localhost:5173`

## Demo Features

### Stage Validation
The wizard includes mock validation that simulates real Snowflake stage interactions:

- **Valid stage**: `@my_stage/pdfs/` - Returns success with PDF count
- **No PDFs**: `@empty/no-pdfs/` - Shows "No PDF files found" error
- **Access denied**: `@restricted/no-access/` - Shows permission error
- **Not found**: `@missing/not-found/` - Shows stage not found error

### Content Type Selection
Choose between:
- **Visual documents**: Images, diagrams, charts (uses LAYOUT mode)
- **Text-only documents**: Pure text content (uses OCR mode)

### Review & Creation
Final review page shows:
- Configuration summary
- Next steps explanation
- Processing time estimate

## Project Structure

```
src/
├── App.tsx                 # Main wizard orchestrator
├── components/
│   ├── StageInputPage.tsx  # Step 1: PDF source selection
│   ├── ContentTypePage.tsx # Step 2: Document type selection
│   └── ReviewPage.tsx      # Step 3: Review and confirm
├── main.tsx               # React entry point
├── index.css              # Global styles
└── App.css                # App-specific styles
```

## Technology Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Mock validation** simulating Snowflake APIs

## Notes

This is a frontend prototype with simulated backend responses. In a real implementation, the validation would connect to actual Snowflake APIs to:

- Verify stage access permissions
- Scan for PDF files
- Create Cortex Search services
- Monitor indexing progress 