import React from 'react';
import { WizardData } from '../App';

interface Props {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
}

export default function ConfigurePDFPage({ data, onUpdate }: Props) {
  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <h1 className="text-xl font-medium text-gray-900 mb-2">
          Configure PDF Processing
        </h1>
        <p className="text-sm text-gray-600">
          Choose your processing approach based on document content and cost requirements.
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

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Processing Mode</h3>
          
          <div className="space-y-3">
            {/* Text-Heavy Processing */}
            <div 
              className={`relative rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                data.textExtractionMode === 'ocr' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400 bg-white'
              }`}
              onClick={() => onUpdate({ textExtractionMode: 'ocr' })}
            >
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="text-heavy"
                      name="extraction-mode"
                      type="radio"
                      checked={data.textExtractionMode === 'ocr'}
                      onChange={() => onUpdate({ textExtractionMode: 'ocr' })}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <label htmlFor="text-heavy" className="block text-sm font-medium text-gray-900 cursor-pointer">
                      Text-Heavy Documents
                    </label>
                    <p className="mt-1 text-sm text-gray-500">
                      10-K filings, research papers, contracts, text tables. Pure text extraction.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visuals/Image-Heavy Processing */}
            <div 
              className={`relative rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                data.textExtractionMode === 'layout' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400 bg-white'
              }`}
              onClick={() => onUpdate({ textExtractionMode: 'layout' })}
            >
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="visual-heavy"
                      name="extraction-mode"
                      type="radio"
                      checked={data.textExtractionMode === 'layout'}
                      onChange={() => onUpdate({ textExtractionMode: 'layout' })}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <label htmlFor="visual-heavy" className="block text-sm font-medium text-gray-900 cursor-pointer">
                      Visual-Heavy Documents
                    </label>
                    <p className="mt-1 text-sm text-gray-500">
                      Images, diagrams, charts, presentations, forms. Preserves visual structure.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
} 