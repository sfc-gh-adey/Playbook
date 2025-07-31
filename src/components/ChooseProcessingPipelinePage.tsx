
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
      </div>
    </div>
  );
} 