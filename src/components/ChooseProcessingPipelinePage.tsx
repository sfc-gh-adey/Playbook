
import { WizardData } from '../App';

interface Props {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
}

export default function ChooseProcessingPipelinePage({ data, onUpdate }: Props) {
  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <h1 className="text-xl font-medium text-gray-900 mb-2">
          Choose Processing Pipeline
        </h1>
        <p className="text-sm text-gray-600">
          Select the pipeline that best matches your documents and performance needs.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <div className="mb-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Stage: {data.selectedFiles && data.selectedFiles.length > 0 ? `${data.selectedFiles.length} files selected` : 'Not selected'}
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className={`p-6 border rounded-lg cursor-pointer ${
              data.pipelineType === 'visual' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400 bg-white'
            }`}
            onClick={() => onUpdate({ pipelineType: 'visual' })}
          >
            <div className="flex items-center">
              <input
                id="pipeline-visual"
                name="pipeline-type"
                type="radio"
                checked={data.pipelineType === 'visual'}
                onChange={() => onUpdate({ pipelineType: 'visual' })}
                className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="pipeline-visual" className="ml-3 text-lg font-medium text-gray-900">
                Visual & Complex Documents
              </label>
            </div>
            <div className="mt-4 pl-8 text-sm text-gray-600 space-y-2">
              <p>
                <strong>Best for:</strong> Reports with charts, diagrams, images, and complex layouts.
              </p>
              <p className="text-xs text-gray-500">
                Analyzes the full page layout for the most accurate, context-aware answers.
              </p>
            </div>
          </div>

          <div
            className={`p-6 border rounded-lg cursor-pointer ${
              data.pipelineType === 'text' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400 bg-white'
            }`}
            onClick={() => onUpdate({ pipelineType: 'text' })}
          >
            <div className="flex items-center">
              <input
                id="pipeline-text"
                name="pipeline-type"
                type="radio"
                checked={data.pipelineType === 'text'}
                onChange={() => onUpdate({ pipelineType: 'text' })}
                className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="pipeline-text" className="ml-3 text-lg font-medium text-gray-900">
                Text-Heavy & Lightweight
              </label>
            </div>
            <div className="mt-4 pl-8 text-sm text-gray-600 space-y-2">
              <p>
                <strong>Best for:</strong> Contracts, legal documents, or long articles where extracting text is the main priority.
              </p>
              <p className="text-xs text-gray-500">
                Optimized for speed and cost on text-dense documents.
              </p>
            </div>
          </div>
        </div>

        {data.pipelineType && (
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-medium text-gray-900">Configure Automated Processing</h3>
            <p className="mt-1 text-sm text-gray-600">
              Select the destination for your processed data from the PDFs selected. Snowflake will also automatically create the necessary objects to keep your search service up-to-date.
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <h4 className="font-medium text-gray-800">Destination</h4>
                <p className="text-xs text-gray-500 mb-2">Choose where the generated objects will be stored.</p>
                <div className="flex items-center gap-2 max-w-md">
                  <select
                    value={data.generatedTableDatabase || ''}
                    onChange={(e) => onUpdate({ generatedTableDatabase: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Select Database</option>
                    <option value="DB_1">DB_1</option>
                    <option value="DB_2">DB_2</option>
                  </select>
                  <select
                    value={data.generatedTableSchema || ''}
                    onChange={(e) => onUpdate({ generatedTableSchema: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Select Schema</option>
                    <option value="SCHEMA_A">SCHEMA_A</option>
                    <option value="SCHEMA_B">SCHEMA_B</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-2 text-sm text-gray-600 max-w-md">
                <p className="font-medium text-gray-800">The following objects will be created for you:</p>
                <ul className="mt-2 list-disc list-inside space-y-2">
                  <li>
                    Table to store parsed document content
                    <div className="relative inline-block ml-2 group">
                      <span className="text-blue-600 cursor-pointer text-xs font-medium hover:underline">(View Schema)</span>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-lg bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 p-1">
                        <GeneratedSchemaTable pipelineType={data.pipelineType} />
                      </div>
                    </div>
                  </li>
                  <li>Stream to detect new files in your stage</li>
                  <li>Task to automatically process new files</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const GeneratedSchemaTable = ({ pipelineType }: { pipelineType: 'visual' | 'text' }) => {
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

  const schema = pipelineType === 'visual' ? visualSchema : textSchema;

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Column</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {schema.map((col) => (
            <tr key={col.name}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{col.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{col.type}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{col.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 