import React from 'react';
import { WizardData } from '../App';

interface Props {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
}

const mockColumns = [
  'QUERY'
];

export default function SelectSearchColumnPage({ data, onUpdate }: Props) {
  const handleColumnSelect = (column: string) => {
    onUpdate({ selectedTable: column });
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Select a search column
        </h1>
        <p className="text-gray-600">
          The data in this column must be text-based and will be the column that your queries search over.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <div className="mb-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {data.selectedTable || 'Table not selected'}
            </span>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-6">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search Column"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          <div className="space-y-2">
            {mockColumns.map((column) => (
              <div key={column} className="border border-gray-200 rounded-md">
                <label className="flex items-center p-3 cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center h-5">
                    <input
                      type="radio"
                      name="search-column"
                      checked={true}
                      onChange={() => handleColumnSelect(column)}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    />
                  </div>
                  <div className="ml-3 flex items-center justify-between w-full">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-900">{column}</span>
                    </div>
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 