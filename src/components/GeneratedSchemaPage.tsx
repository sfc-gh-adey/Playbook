import React from 'react';
import { WizardData } from '../App';

const visualSchema = [
  { name: 'TEXT', type: 'VARCHAR', description: 'The extracted text content from each page.' },
  { name: 'VECTOR_MAIN', type: 'VECTOR', description: "The multimodal vector embedding of the page's image." },
  { name: 'PAGE_NUMBER', type: 'NUMBER', description: 'The page number within the original PDF document.' },
  { name: 'IMAGE_FILEPATH', type: 'VARCHAR', description: 'The path to the generated page image in the internal stage.' },
  { name: 'SOURCE_FILENAME', type: 'VARCHAR', description: 'The original PDF document filename.' },
  { name: 'LAST_MODIFIED', type: 'TIMESTAMP', description: 'Last modification date of the source PDF.' },
];

const textSchema = [
  { name: 'CHUNK', type: 'VARCHAR', description: 'A semantic chunk of text from the document.' },
  { name: 'CHUNK_VECTOR', type: 'VECTOR', description: 'The vector embedding of the text chunk.' },
  { name: 'CHUNK_INDEX', type: 'NUMBER', description: 'The sequential index of the chunk within the document.' },
  { name: 'SOURCE_FILENAME', type: 'VARCHAR', description: 'The original PDF document filename.' },
  { name: 'FILE_URL', type: 'VARCHAR', description: 'A URL to reference the source file within Snowflake.' },
  { name: 'LAST_MODIFIED', type: 'TIMESTAMP', description: 'Last modification date of the source PDF.' },
  { name: 'FILE_SIZE', type: 'NUMBER', description: 'The size of the source file in bytes.' },
  { name: 'DOCUMENT_TITLE', type: 'VARCHAR', description: 'The title property extracted from the PDF metadata, if available.' },
];

interface GeneratedSchemaPageProps {
  data: WizardData;
  onUpdate: (update: Partial<WizardData>) => void;
}

const GeneratedSchemaPage: React.FC<GeneratedSchemaPageProps> = ({ data, onUpdate }) => {
  const isVisual = data.pipelineType === 'visual';
  const schemaColumns = isVisual ? visualSchema : textSchema;
  const pageTitle = isVisual ? 'Generated Multimodal Table Schema' : 'Generated Text Table Schema';
  const pageDescription = isVisual
    ? 'To power your multimodal search service, a new table will be created. This table will store the processed text and image embeddings from your PDFs.'
    : 'To power your text-based search service, a new table will be created. This table will store the processed text chunks and embeddings from your PDFs.';

  const availableDatabases = ['PROD_DB', 'DEV_DB', 'STAGING_DB'];
  const availableSchemas = ['PUBLIC', 'CUSTOM_SCHEMA'];

  return (
    <div className="flex-1 space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">{pageTitle}</h2>
        <p className="mt-1 text-sm text-gray-600">{pageDescription}</p>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Destination for Generated Table</h3>
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div>
            <label htmlFor="database" className="block text-sm font-medium text-gray-700">Database</label>
            <select
              id="database"
              className="block w-full pl-3 pr-10 py-2 mt-1 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
              value={data.generatedTableDatabase || data.database}
              onChange={(e) => onUpdate({ generatedTableDatabase: e.target.value })}
            >
              {availableDatabases.map(db => <option key={db}>{db}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="schema" className="block text-sm font-medium text-gray-700">Schema</label>
            <select
              id="schema"
              className="block w-full pl-3 pr-10 py-2 mt-1 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
              value={data.generatedTableSchema || data.schema}
              onChange={(e) => onUpdate({ generatedTableSchema: e.target.value })}
            >
              {availableSchemas.map(sch => <option key={sch}>{sch}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Column Name</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Type</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {schemaColumns.map(col => (
              <tr key={col.name} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-800">{col.name}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{col.type}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{col.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500">
            This table will be automatically created and populated when you create the service.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GeneratedSchemaPage;