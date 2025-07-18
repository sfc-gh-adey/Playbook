import React, { useState } from 'react';
import { WizardData } from '../App';

interface Props {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
  onNext: () => void;
}

type ValidationState = 'idle' | 'validating' | 'success' | 'error';

interface ValidationResult {
  state: ValidationState;
  message?: string;
  fileCount?: number;
}

// Mock validation function
const validateStage = async (stagePath: string): Promise<ValidationResult> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (!stagePath.trim()) {
    return { state: 'error', message: 'Please enter a stage path' };
  }
  
  if (!stagePath.startsWith('@')) {
    return { state: 'error', message: 'Stage path must start with @' };
  }
  
  // Mock different scenarios based on input
  if (stagePath.includes('empty') || stagePath.includes('no-pdfs')) {
    return { state: 'error', message: 'No PDF files found in this stage' };
  }
  
  if (stagePath.includes('restricted') || stagePath.includes('no-access')) {
    return { state: 'error', message: 'Access denied. Check your permissions for this stage.' };
  }
  
  // Mock success case
  const fileCount = Math.floor(Math.random() * 100) + 1;
  return { 
    state: 'success', 
    message: `Found ${fileCount} PDF files`,
    fileCount 
  };
};

export default function StageInputPage({ data, onUpdate, onNext }: Props) {
  const [inputValue, setInputValue] = useState(data.stagePath);
  const [validation, setValidation] = useState<ValidationResult>({ state: 'idle' });

  const handleValidation = async () => {
    setValidation({ state: 'validating' });
    const result = await validateStage(inputValue);
    setValidation(result);
    
    if (result.state === 'success') {
      onUpdate({ stagePath: inputValue });
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (validation.state !== 'idle') {
      setValidation({ state: 'idle' });
    }
  };

  const quickTestStage = (path: string) => {
    setInputValue(path);
    handleInputChange(path);
    setTimeout(() => handleValidation(), 100);
  };

  const canProceed = validation.state === 'success' && data.stagePath;

  return (
    <div className="max-w-2xl">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Choose Your PDF Source
        </h1>
        <p className="text-gray-600">
          Cortex Search will index PDFs located at the selected stage.
        </p>
      </div>

      {/* Stage path input */}
      <div className="space-y-6">
        <div>
          <label htmlFor="stage-path" className="block text-sm font-medium text-gray-700 mb-2">
            Stage Path
          </label>
          <div className="relative">
            <input
              id="stage-path"
              type="text"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="@my_stage/pdfs/"
              className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#29B5E8] focus:border-[#29B5E8] ${
                validation.state === 'error' 
                  ? 'border-red-300 text-red-900 placeholder-red-300' 
                  : validation.state === 'success'
                  ? 'border-green-300 text-green-900'
                  : 'border-gray-300'
              }`}
            />
            {validation.state === 'validating' && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <svg className="animate-spin h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
          </div>
          
          {/* Validation message */}
          {validation.message && (
            <div className={`mt-2 text-sm ${
              validation.state === 'error' ? 'text-red-600' : 'text-green-600'
            }`}>
              <div className="flex items-center">
                {validation.state === 'error' ? (
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {validation.message}
              </div>
            </div>
          )}

          <p className="mt-2 text-sm text-gray-500">
            Currently, only PDF files are supported.
          </p>
        </div>

        {/* Validate button */}
        <button
          onClick={handleValidation}
          disabled={!inputValue.trim() || validation.state === 'validating'}
          className="w-full bg-[#29B5E8] text-white py-2 px-4 rounded-md hover:bg-[#11567F] focus:outline-none focus:ring-2 focus:ring-[#29B5E8] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
        >
          {validation.state === 'validating' ? 'Validating...' : 'Validate Stage'}
        </button>

        {/* Quick test buttons */}
        <div className="border-t pt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Test Scenarios</h3>
          <div className="space-y-2">
            <button
              onClick={() => quickTestStage('@my_stage/pdfs/')}
              className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 transition-colors duration-200"
            >
              <span className="font-mono text-blue-600">@my_stage/pdfs/</span>
              <span className="text-gray-500 ml-2">→ Success (42 PDFs found)</span>
            </button>
            <button
              onClick={() => quickTestStage('@empty/no-pdfs/')}
              className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 transition-colors duration-200"
            >
              <span className="font-mono text-blue-600">@empty/no-pdfs/</span>
              <span className="text-gray-500 ml-2">→ No PDFs found</span>
            </button>
            <button
              onClick={() => quickTestStage('@restricted/no-access/')}
              className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 transition-colors duration-200"
            >
              <span className="font-mono text-blue-600">@restricted/no-access/</span>
              <span className="text-gray-500 ml-2">→ Access denied</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end pt-8 border-t mt-8">
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