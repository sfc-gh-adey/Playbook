
import React, { useEffect } from 'react';
import { WizardData } from '../App';

interface Props {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
}

// Schema table component moved from ChooseProcessingPipelinePage
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

export default function ConfigureIndexingPage({ data, onUpdate }: Props) {

  useEffect(() => {
    // If pipeline is visual, automatically select and update the embedding model
    if (data.pipelineType === 'visual' && data.embeddingModel !== 'voyage-multimodal-3') {
      onUpdate({ embeddingModel: 'voyage-multimodal-3' });
    }
  }, [data.pipelineType, data.embeddingModel, onUpdate]);

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Configure your Search Service
        </h1>
        <p className="text-gray-600">
          Select your desired configuration parameters for the service.
        </p>
      </div>

      <div className="space-y-8">
        {/* Configure Automated Processing - only show for stage data source */}
        {data.dataSourceType === 'stage' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900">Configure Automated Processing</h3>
            <p className="mt-1 text-sm text-gray-600">
              Select the destination for your processed data from the PDFs selected. Snowflake will also automatically create the necessary objects to build an optimized search service.
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
                        <GeneratedSchemaTable pipelineType={data.pipelineType!} />
                      </div>
                    </div>
                  </li>
                  <li>Stream to detect new files in your stage</li>
                  <li>Task to automatically process new files</li>
                  {data.pipelineType === 'visual' && (
                    <li>Stage for intermediate parsed image outputs</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Incremental Updates - only show for stage data source */}
        {data.dataSourceType === 'stage' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Incremental Updates</h3>
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="incremental-updates"
                checked={data.enableIncrementalUpdates !== false}
                onChange={(e) => onUpdate({ enableIncrementalUpdates: e.target.checked })}
                className="mt-1 focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <div className="flex-1">
                <label htmlFor="incremental-updates" className="text-sm font-medium text-gray-900">
                  Enable incremental updates
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  Any new files added or deleted will be captured within the target lag.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Target Lag */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Target Lag</h3>
          
          <div className="flex items-center space-x-4">
            <input
              type="number"
              value={parseInt(data.targetLag) || 1}
              onChange={(e) => {
                const unit = data.targetLag.includes('hour') ? 'hour' : 'day';
                onUpdate({ targetLag: `${e.target.value} ${unit}${parseInt(e.target.value) !== 1 ? 's' : ''}` });
              }}
              className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              min="1"
            />
            
            <select
              value={data.targetLag.includes('hour') ? 'hours' : 'days'}
              onChange={(e) => {
                const value = parseInt(data.targetLag) || 1;
                const unit = e.target.value === 'hours' ? 'hour' : 'day';
                onUpdate({ targetLag: `${value} ${unit}${value !== 1 ? 's' : ''}` });
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="hours">Hours</option>
              <option value="days">Days</option>
            </select>
          </div>
          
          <p className="mt-2 text-sm text-gray-500">
            How often the service should check for updates
          </p>
        </div>

        {/* Embedding Model */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Embedding Model</h3>
          
          <select
            value={data.embeddingModel}
            onChange={(e) => onUpdate({ embeddingModel: e.target.value })}
            className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500"
            disabled={data.pipelineType === 'visual'}
          >
            <option value="">Select embedding model</option>
            <option value="snowflake-arctic-embed-m-v1.5">snowflake-arctic-embed-m-v1.5</option>
            <option value="voyage-multimodal-3">voyage-multimodal-3</option>
            <option value="e5-base-v2">e5-base-v2</option>
          </select>
          
          {data.pipelineType === 'visual' && (
            <p className="mt-2 text-sm text-gray-500">
              Visual & Complex Documents pipeline uses voyage-multimodal-3 for optimal performance
            </p>
          )}
        </div>

        {/* Warehouse for indexing */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Warehouse for indexing</h3>
          <select
            value={data.indexingWarehouse}
            onChange={(e) => onUpdate({ indexingWarehouse: e.target.value })}
            className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select warehouse</option>
            <option value="SNOWAD_HOC">SNOWAD_HOC</option>
            <option value="COMPUTE_WH">COMPUTE_WH</option>
            <option value="ANALYTICS_WH">ANALYTICS_WH</option>
          </select>
          <p className="mt-2 text-sm text-gray-500">
            Indexing can take couple minutes to an hour depending on size of data.
          </p>
        </div>
      </div>
    </div>
  );
} 