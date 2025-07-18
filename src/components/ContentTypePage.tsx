import React from 'react';
import { WizardData } from '../App';

interface Props {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ContentTypePage({ data, onUpdate, onNext, onBack }: Props) {
  const handleContentTypeChange = (contentType: 'visual' | 'text-only') => {
    onUpdate({ contentType });
  };

  const canProceed = data.contentType !== null;

  return (
    <div className="max-w-2xl">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Describe Your Documents
        </h1>
        <p className="text-gray-600">
          Help us optimize your search by describing what's inside your PDFs.
        </p>
      </div>

      {/* Content type options */}
      <div className="space-y-4 mb-8">
        {/* Visual content option */}
        <div 
          className={`relative rounded-lg border-2 cursor-pointer transition-all duration-200 ${
            data.contentType === 'visual' 
              ? 'border-[#29B5E8] bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400 bg-white'
          }`}
          onClick={() => handleContentTypeChange('visual')}
        >
          <div className="p-6">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="visual-content"
                  name="content-type"
                  type="radio"
                  checked={data.contentType === 'visual'}
                  onChange={() => handleContentTypeChange('visual')}
                  className="focus:ring-[#29B5E8] h-4 w-4 text-[#29B5E8] border-gray-300"
                />
              </div>
              <div className="ml-3 flex-1">
                <label htmlFor="visual-content" className="block text-sm font-medium text-gray-900 cursor-pointer">
                  My documents have images, diagrams, charts, or other visual components
                </label>
                <p className="mt-2 text-sm text-gray-500">
                  We'll analyze both images and extract text for richer search capabilities.
                </p>
                <div className="mt-3 flex items-center space-x-2 text-xs text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Best for: Documents with charts, diagrams, images, or complex layouts</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Text-only option */}
        <div 
          className={`relative rounded-lg border-2 cursor-pointer transition-all duration-200 ${
            data.contentType === 'text-only' 
              ? 'border-[#29B5E8] bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400 bg-white'
          }`}
          onClick={() => handleContentTypeChange('text-only')}
        >
          <div className="p-6">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="text-only"
                  name="content-type"
                  type="radio"
                  checked={data.contentType === 'text-only'}
                  onChange={() => handleContentTypeChange('text-only')}
                  className="focus:ring-[#29B5E8] h-4 w-4 text-[#29B5E8] border-gray-300"
                />
              </div>
              <div className="ml-3 flex-1">
                <label htmlFor="text-only" className="block text-sm font-medium text-gray-900 cursor-pointer">
                  My documents are mostly just text
                </label>
                <p className="mt-2 text-sm text-gray-500">
                  We'll focus on extracting and searching text content for optimal performance.
                </p>
                <div className="mt-3 flex items-center space-x-2 text-xs text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Best for: Text-heavy documents like reports, contracts, or articles</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional information */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-gray-900">Need more information?</h4>
            <p className="mt-1 text-sm text-gray-600">
              You can change this setting later by updating your Cortex Search service configuration. 
              This choice affects which embedding models and processing techniques are used.
            </p>
            <a 
              href="#" 
              className="mt-2 text-sm text-[#29B5E8] hover:text-[#11567F] inline-flex items-center"
            >
              Learn more about content type optimization
              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-8 border-t">
        <button
          onClick={onBack}
          className="bg-white text-gray-700 py-2 px-6 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#29B5E8] focus:ring-offset-2 transition-colors duration-200 font-medium"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="bg-[#29B5E8] text-white py-2 px-6 rounded-md hover:bg-[#11567F] focus:outline-none focus:ring-2 focus:ring-[#29B5E8] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
        >
          Next
        </button>
      </div>
    </div>
  );
} 