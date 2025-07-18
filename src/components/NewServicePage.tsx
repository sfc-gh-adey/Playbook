import React from 'react';
import { WizardData } from '../App';

interface Props {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
}

export default function NewServicePage({ data, onUpdate }: Props) {
  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center text-blue-600 mb-4">
          <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h1 className="text-2xl font-semibold text-gray-900">Let's create a new Cortex Search Service</h1>
        </div>
        <p className="text-gray-600">
          We'll guide you through the steps of selecting a data source, setting service parameters, and creating the Search Service.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Select a warehouse to power the service. This warehouse will be used for materializing the results of the source query upon creation and refresh.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Role and Warehouse</h3>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md">
                <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">PRODUCT_MANAGER</span>
              </div>
              
              <select
                value={data.warehouse}
                onChange={(e) => onUpdate({ warehouse: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select warehouse...</option>
                <option value="ADEY_TEST (X-Small)">ADEY_TEST (X-Small)</option>
                <option value="COMPUTE_WH (X-Small)">COMPUTE_WH (X-Small)</option>
                <option value="DEMO_WH (Medium)">DEMO_WH (Medium)</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Database and Schema</h3>
          
          <div className="space-y-4">
            <select
              value={data.database}
              onChange={(e) => {
                const [database, schema] = e.target.value.split('.');
                onUpdate({ 
                  database: e.target.value,
                  schema: schema || ''
                });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select database...</option>
              <option value="ADEY_TEST_DB.TEST">ADEY_TEST_DB.TEST</option>
              <option value="CORTEX_SEARCH_DB.PUBLIC">CORTEX_SEARCH_DB.PUBLIC</option>
              <option value="DEMO_DB.PUBLIC">DEMO_DB.PUBLIC</option>
            </select>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Name</h3>
          
          <div className="relative">
            <input
              type="text"
              value={data.serviceName}
              onChange={(e) => onUpdate({ serviceName: e.target.value })}
              placeholder="Enter service name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {data.serviceName && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 