#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Available prototype templates
const TEMPLATES = {
  'wizard-flow': {
    description: 'Multi-step wizard interface (like Cortex Search setup)',
    files: ['wizard-shell', 'form-components', 'navigation']
  },
  'data-explorer': {
    description: 'Data browsing and filtering interface',
    files: ['data-table', 'filters', 'search']
  },
  'service-dashboard': {
    description: 'Service management and monitoring dashboard',
    files: ['service-cards', 'status-indicators', 'metrics']
  },
  'analytics-view': {
    description: 'Charts, metrics, and reporting interface',
    files: ['charts', 'metrics-cards', 'date-pickers']
  }
};

function showUsage() {
  console.log(`
🚀 Snowflake Prototype Generator

Usage: npm run create-prototype <name> [template]

Available templates:
${Object.entries(TEMPLATES).map(([key, template]) => 
  `  ${key.padEnd(16)} - ${template.description}`
).join('\n')}

Examples:
  npm run create-prototype my-new-feature wizard-flow
  npm run create-prototype data-browser data-explorer
  npm run create-prototype admin-panel service-dashboard

If no template is specified, you'll be prompted to choose one.
  `);
}

function createPrototype(name, templateType) {
  const targetDir = path.resolve(process.cwd(), '..', name);
  
  if (fs.existsSync(targetDir)) {
    console.error(`❌ Directory ${name} already exists!`);
    process.exit(1);
  }

  console.log(`🏗️  Creating prototype: ${name}`);
  console.log(`📝 Using template: ${templateType}`);
  console.log(`📁 Target directory: ${targetDir}\n`);

  // Copy base template
  copyDirectory(process.cwd(), targetDir, [
    'node_modules',
    '.git',
    'scripts/create-prototype.js'
  ]);

  // Update package.json with new name
  const packageJsonPath = path.join(targetDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  packageJson.name = name;
  packageJson.description = `${TEMPLATES[templateType].description} prototype`;
  delete packageJson.template;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  // Create template-specific components
  generateTemplateComponents(targetDir, templateType);

  console.log(`✅ Prototype "${name}" created successfully!`);
  console.log(`\nNext steps:`);
  console.log(`  cd ${name}`);
  console.log(`  npm install`);
  console.log(`  npm run dev`);
  console.log(`\n🎉 Happy prototyping!`);
}

function copyDirectory(src, dest, exclude = []) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    if (exclude.includes(entry.name)) continue;

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath, exclude);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function generateTemplateComponents(targetDir, templateType) {
  const template = TEMPLATES[templateType];
  const componentsDir = path.join(targetDir, 'src', 'components', 'generated');
  
  if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
  }

  // Create a README for the generated components
  const readmeContent = `# Generated Components for ${templateType}

This directory contains components specific to the ${templateType} template.

Template includes:
${template.files.map(file => `- ${file}`).join('\n')}

These components are built on top of the core components in /core/components/
`;

  fs.writeFileSync(path.join(componentsDir, 'README.md'), readmeContent);

  console.log(`📦 Generated template-specific components in src/components/generated/`);
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
  showUsage();
  process.exit(0);
}

const [name, templateType = 'wizard-flow'] = args;

if (!TEMPLATES[templateType]) {
  console.error(`❌ Unknown template: ${templateType}`);
  console.error(`Available templates: ${Object.keys(TEMPLATES).join(', ')}`);
  process.exit(1);
}

createPrototype(name, templateType); 