import React from 'react';
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Visual & Complex Documents Pipeline */}
          <div 
            className={`relative rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              data.pipelineType === 'visual' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400 bg-white'
            }`}
            onClick={() => onUpdate({ pipelineType: 'visual' })}
          >
            <div className="p-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="visual-pipeline"
                    name="pipeline-type"
                    type="radio"
                    checked={data.pipelineType === 'visual'}
                    onChange={() => onUpdate({ pipelineType: 'visual' })}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  />
                </div>
                <div className="ml-3 flex-1">
                  <label htmlFor="visual-pipeline" className="block text-base font-medium text-gray-900 cursor-pointer mb-2">
                    Visual & Complex Documents
                  </label>
                  <p className="text-sm text-gray-600 mb-3">
                    Reports with charts, diagrams, and complex layouts.
                  </p>
                  <p className="text-xs text-gray-500">
                    Uses voyage-multimodal-3 embedding and document parsing that preserves document structure, tables, headings, and visual relationships for accurate content understanding.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Text-Heavy & Lightweight Pipeline */}
          <div 
            className={`relative rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              data.pipelineType === 'text' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400 bg-white'
            }`}
            onClick={() => onUpdate({ pipelineType: 'text' })}
          >
            <div className="p-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="text-pipeline"
                    name="pipeline-type"
                    type="radio"
                    checked={data.pipelineType === 'text'}
                    onChange={() => onUpdate({ pipelineType: 'text' })}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  />
                </div>
                <div className="ml-3 flex-1">
                  <label htmlFor="text-pipeline" className="block text-base font-medium text-gray-900 cursor-pointer mb-2">
                    Text-Heavy & Lightweight
                  </label>
                  <p className="text-sm text-gray-600 mb-3">
                    Contracts, articles, and text-based reports.
                  </p>
                  <p className="text-xs text-gray-500">
                    Uses OCR to parse text efficiently and arctic-embed for fast, cost-optimized text processing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 