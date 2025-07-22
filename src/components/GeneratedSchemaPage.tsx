import React from 'react';
import { WizardData } from '../App';

const SCHEMA_COLUMNS = [
  { name: 'TEXT', type: 'VARCHAR', description: 'The extracted text content from each page.' },
  { name: 'VECTOR_MAIN', type: 'VECTOR', description: 'The multimodal vector embedding of the page\'s image.' },
  { name: 'PAGE_NUMBER', type: 'NUMBER', description: 'The page number within the original PDF document.' },
  { name: 'IMAGE_FILEPATH', type: 'VARCHAR', description: 'The path to the generated page image in the internal stage.' },
];

interface Props {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
}

export default function GeneratedSchemaPage({ data, onUpdate }: Props) {
  return (
    <div className="flex-1 space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Generated Table Schema</h1>
        <p className="text-sm text-gray-600">
          To power your multimodal search service, a new table will be created. This table will store the processed text and image embeddings from your PDFs.
        </p>
      </div>

      <div className="space-y-4 max-w-lg">
        <h3 className="text-lg font-medium text-gray-900">Destination for Generated Table</h3>
        <div>
          <label htmlFor="db-select" className="block text-sm font-medium text-gray-700 mb-1">Database</label>
          <select 
            id="db-select" 
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
            value={data.generatedTableDatabase || data.database}
            onChange={(e) => onUpdate({ generatedTableDatabase: e.target.value })}
          >
            <option>{data.database || 'Select a database'}</option>
            {/* Add other mock databases if needed */}
          </select>
        </div>
        <div>
          <label htmlFor="schema-select" className="block text-sm font-medium text-gray-700 mb-1">Schema</label>
          <select 
            id="schema-select" 
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
            value={data.generatedTableSchema || data.schema}
            onChange={(e) => onUpdate({ generatedTableSchema: e.target.value })}
          >
            <option>{data.schema || 'Select a schema'}</option>
            {/* Add other mock schemas if needed */}
          </select>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg bg-white">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700">Schema for the new table:</h3>
        </div>
        <div className="p-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Column Name</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Data Type</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {SCHEMA_COLUMNS.map(col => (
                <tr key={col.name} className="hover:bg-gray-50">
                  <td className="px-4 py-2 font-mono text-gray-800">{col.name}</td>
                  <td className="px-4 py-2 font-mono text-gray-600">{col.type}</td>
                  <td className="px-4 py-2 text-gray-600">{col.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500">
            This table will be automatically created and populated when you create the service.
          </p>
        </div>
      </div>
    </div>
  );
} 