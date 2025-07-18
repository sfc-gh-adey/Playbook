import React from 'react';
import { WizardData } from '../App';

interface Props {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
}

export default function ConfigureIndexingPage({ data, onUpdate }: Props) {
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

        {/* Embedding Model */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Embedding model <span className="text-gray-500 font-normal">(optional)</span>
          </h3>
          
          <select
            value={data.embeddingModel}
            onChange={(e) => onUpdate({ embeddingModel: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="snowflake-arctic-embed-m-v1.5">snowflake-arctic-embed-m-v1.5</option>
            <option value="snowflake-arctic-embed-l-v2.0">snowflake-arctic-embed-l-v2.0</option>
            <option value="snowflake-arctic-embed-l-v2.0-8k">snowflake-arctic-embed-l-v2.0-8k</option>
            <option value="voyage-multilingual-2">voyage-multilingual-2</option>
          </select>
          
          <p className="mt-2 text-sm text-gray-600">
            Each model may incur a different cost per million input tokens processed. Refer to the{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500">
              Snowflake Service Consumption Table
            </a>
            .
          </p>
          <p className="mt-1 text-sm text-gray-600">
            For more information about each embedding model, refer to the{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500">
              Cortex Search documentation
            </a>
            .
          </p>
        </div>

        {/* Warehouse for Indexing */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Warehouse for indexing</h3>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">⚡</span>
            <select
              value={data.indexingWarehouse}
              onChange={(e) => onUpdate({ indexingWarehouse: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select warehouse...</option>
              <option value="ADEY_TEST">ADEY_TEST</option>
              <option value="COMPUTE_WH">COMPUTE_WH</option>
              <option value="DEMO_WH">DEMO_WH</option>
            </select>
          </div>
          
          <p className="mt-2 text-sm text-gray-600">
            Indexing can take couple minutes to an hour depending on size of data.{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500">
              See documentation
            </a>
            .
          </p>
        </div>


      </div>
    </div>
  );
} 