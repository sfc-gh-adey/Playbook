import React, { useState } from 'react';
import { WizardData } from '../App';

interface Props {
  data: WizardData;
  onBack: () => void;
  onComplete: () => void;
}

export default function ReviewPage({ data, onBack, onComplete }: Props) {
  const [isCreating, setIsCreating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCreate = async () => {
    setIsCreating(true);
    // Simulate service creation
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsCreating(false);
    setShowSuccess(true);
    
    // Auto-complete after showing success
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="max-w-3xl">
        {/* Success State */}
        <div className="text-center py-12">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Cortex Search Service Created Successfully!
          </h1>
          <p className="text-gray-600 mb-8">
            Your PDF search service is being initialized and will be ready for queries shortly.
          </p>
          
          {/* Service Details */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-left max-w-2xl mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Service Details</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Service Name:</span>
                <span className="font-medium text-gray-900">{data.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Database:</span>
                <span className="font-medium text-gray-900">{data.database}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  INITIALIZING
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Target Lag:</span>
                <span className="font-medium text-gray-900">{data.targetLag}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Embedding Model:</span>
                <span className="font-medium text-gray-900">{data.embeddingModel}</span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Service Query URL</h4>
              <div className="bg-gray-50 p-3 rounded-md">
                <code className="text-xs text-gray-700 break-all">
                  pm-pm-aws-us-west-2.snowflakecomputing.com/api/v2/databases/{data.database?.split('.')[0]}/schemas/{data.database?.split('.')[1]}/cortex-search-services/{data.serviceName}:query
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isCreating) {
    return (
      <div className="max-w-2xl">
        <div className="text-center py-12">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
            <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Creating Cortex Search Service...
          </h1>
          <p className="text-gray-600">
            Setting up your PDF search service. This may take a few moments.
          </p>
          
          <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Validating stage configuration
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Creating search service schema
              </div>
              <div className="flex items-center">
                <svg className="animate-spin w-4 h-4 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing PDF documents and building search index
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Review and Create Service
        </h1>
        <p className="text-gray-600">
          Review your Cortex Search service configuration before creation.
        </p>
      </div>

      <div className="space-y-8">
        {/* Service Configuration */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">Service Configuration</h3>
          </div>
          
          <div className="px-6 py-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Basic Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Name:</span>
                    <span className="font-medium text-gray-900">{data.serviceName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Database:</span>
                    <span className="font-medium text-gray-900">{data.database}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Warehouse:</span>
                    <span className="font-medium text-gray-900">{data.warehouse}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Data Source</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stage Path:</span>
                    <span className="font-medium text-gray-900 font-mono">{data.stagePath}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Processing Mode:</span>
                    <span className="font-medium text-gray-900">{data.textExtractionMode?.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Indexing Configuration */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">Indexing Configuration</h3>
          </div>
          
          <div className="px-6 py-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Performance Settings</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Target Lag:</span>
                    <span className="font-medium text-gray-900">{data.targetLag}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Indexing Warehouse:</span>
                    <span className="font-medium text-gray-900">{data.indexingWarehouse}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">AI Configuration</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Embedding Model:</span>
                    <span className="font-medium text-gray-900">{data.embeddingModel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Search Type:</span>
                    <span className="font-medium text-gray-900">Hybrid (Vector + Keyword)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metadata Configuration */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">Metadata Fields ({(data.includeMetadata || []).length} selected)</h3>
          </div>
          
          <div className="px-6 py-6">
            {(data.includeMetadata || []).length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {(data.includeMetadata || []).map(fieldId => (
                  <span
                    key={fieldId}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {fieldId.toUpperCase().replace('_', ' ')}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No additional metadata fields selected</p>
            )}
          </div>
        </div>

        {/* Estimated Costs and Time */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-blue-900">Setup Information</h4>
              <p className="mt-1 text-sm text-blue-700">
                Your Cortex Search service will be ready in approximately 5-15 minutes depending on the number of PDF documents. 
                The service will automatically process and index your PDFs using {data.textExtractionMode?.toUpperCase()} mode.
              </p>
              <p className="mt-2 text-sm text-blue-700">
                You'll be able to query the service via SQL, REST API, or the Python SDK once indexing is complete.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <button
            onClick={onBack}
            disabled={isCreating}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
          >
            Previous: Configure indexing
          </button>
          
          <button
            onClick={handleCreate}
            disabled={isCreating}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium inline-flex items-center"
          >
            {isCreating ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Service...
              </>
            ) : (
              'Create Cortex Search Service'
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 