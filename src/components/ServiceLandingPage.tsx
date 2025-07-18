import React from 'react';

interface ServiceData {
  serviceName: string;
  database: string;
  schema: string;
  warehouse: string;
  stagePath: string;
  pipelineType: 'visual' | 'text' | null;
  targetLag: string;
  embeddingModel: string;
  metadataCount: number;
}

interface Props {
  serviceData: ServiceData;
  onClose: () => void;
}

export default function ServiceLandingPage({ serviceData, onClose }: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Cortex Search</h1>
            <span className="text-gray-500">•</span>
            <span className="text-gray-600">{serviceData.serviceName}</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              INITIALIZING
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow">
          {/* Service Overview */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Service Details</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Service Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{serviceData.serviceName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Database</dt>
                  <dd className="mt-1 text-sm text-gray-900">{serviceData.database}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Schema</dt>
                  <dd className="mt-1 text-sm text-gray-900">{serviceData.schema}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Warehouse</dt>
                  <dd className="mt-1 text-sm text-gray-900">{serviceData.warehouse}</dd>
                </div>
              </div>

              {/* Data Source */}
              <div className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Source</dt>
                  <dd className="mt-1 text-sm text-gray-900">{serviceData.stagePath}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Pipeline Type</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {serviceData.pipelineType === 'visual' ? 'Visual & Complex Documents' : 
                     serviceData.pipelineType === 'text' ? 'Text-Heavy & Lightweight' : 'Not specified'}
                  </dd>
                </div>
                                 <div>
                   <dt className="text-sm font-medium text-gray-500">Embedding Model</dt>
                   <dd className="mt-1 text-sm text-gray-900">
                     {serviceData.pipelineType === 'visual' ? 'voyage-multimodal-3' : 'arctic-embed'}
                   </dd>
                 </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Metadata Columns</dt>
                  <dd className="mt-1 text-sm text-gray-900">{serviceData.metadataCount} columns</dd>
                </div>
              </div>

              {/* Configuration */}
              <div className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Target Lag</dt>
                  <dd className="mt-1 text-sm text-gray-900">{serviceData.targetLag}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      INITIALIZING
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="mt-1 text-sm text-gray-900">{new Date().toLocaleString()}</dd>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Initialization Progress</h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Service Configuration</p>
                  <p className="text-sm text-gray-500">Service parameters validated and saved</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-yellow-600 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">PDF Processing & Indexing</p>
                  <p className="text-sm text-gray-500">Processing documents and creating search indexes...</p>
                </div>
              </div>

              <div className="flex items-center opacity-50">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Service Activation</p>
                  <p className="text-sm text-gray-500">Finalizing service and enabling search capabilities</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Estimated completion:</strong> 5-15 minutes depending on document volume. 
                You will receive a notification when the service is ready.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 