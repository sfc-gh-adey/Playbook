
import { WizardData } from '../App';

interface Props {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
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
              <option value="hours">hours</option>
              <option value="days">days</option>
            </select>
          </div>
          
          <p className="mt-2 text-sm text-gray-600">
            Target Lag parameter specifies the maximum frequency with which the service will check for and materialize updates based on changes to its source data.
          </p>
        </div>

        <div>
          <label htmlFor="embedding-model" className="text-base font-medium text-gray-900 flex items-center">
            Embedding model
            <span className="text-sm text-gray-500 ml-2">(optional)</span>
            {data.pipelineType === 'visual' && (
              <div className="ml-2 relative group">
                <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="absolute left-0 bottom-full mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  This model is optimal for multimodal embeddings required for PDFs with visually rich data.
                </div>
              </div>
            )}
          </label>
          <select
            id="embedding-model"
            value={data.pipelineType === 'visual' ? 'voyage-multimodal-3' : data.embeddingModel || ''}
            onChange={(e) => onUpdate({ embeddingModel: e.target.value })}
            disabled={data.pipelineType === 'visual'}
            className="mt-2 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="snowflake-arctic-embed-m-v1.5">snowflake-arctic-embed-m-v1.5</option>
            <option value="voyage-multimodal-3">voyage-multimodal-3</option>
            {/* Add other models here if needed */}
          </select>
          <p className="mt-2 text-sm text-gray-500">
            Each model may incur a different cost per million input tokens processed. Refer to the <a href="#" className="text-blue-600 hover:underline">Snowflake Service Consumption Table</a>.
          </p>
        </div>

        {/* Warehouse for indexing section is removed */}
      </div>
    </div>
  );
}; 