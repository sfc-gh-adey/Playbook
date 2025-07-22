import React from 'react';
import { WizardData } from '../App';

interface Props {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
}

export default function SelectSearchColumn({ data, onUpdate }: Props) {
  return (
    <div className="flex-1 p-6">
      <h1 className="text-xl font-medium text-gray-900 mb-2">
        Select a search column
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        The data in this column must be text-based and will be the column that your queries search over.
      </p>
      
      <div className="border border-gray-200 rounded-lg max-w-lg">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-sm font-medium text-gray-700">{data.selectedTable}</h3>
        </div>
        <div className="p-4">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search Column"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <ul className="mt-4 max-h-60 overflow-y-auto">
            {['DOC_ID', 'TITLE', 'CONTENT', 'CATEGORY', 'SUBCATEGORY'].map(col => (
              <li key={col} className="flex items-center justify-between p-3 rounded-md hover:bg-gray-50">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 4v16m-4-10h8M9 4a2 2 0 11-4 0 2 2 0 014 0zM5 14a2 2 0 11-4 0 2 2 0 014 0zM9 20a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-800">{col}</span>
                </div>
                <input
                  type="radio"
                  name="search-column"
                  checked={data.searchColumn === col}
                  onChange={() => onUpdate({ searchColumn: col })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
} 