import React, { useEffect } from 'react';
import { WizardData } from '../App';

const MOCK_COLUMNS = ['DOC_ID', 'TITLE', 'CONTENT', 'CATEGORY', 'SUBCATEGORY', 'TRANSCRIPT_TEXT', 'COLUMN_A', 'COLUMN_B'];

interface Props {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
}

export default function SelectReturnColumnsPage({ data, onUpdate }: Props) {
  useEffect(() => {
    // Pre-select search and attribute columns
    const searchColumnNames = (data.searchColumns || []).map(c => c.name);
    const preselected = Array.from(new Set([...searchColumnNames, ...(data.attributeColumns || [])]));
    onUpdate({ returnColumns: preselected });
  }, []); // Run only once on mount

  const handleColumnToggle = (columnName: string) => {
    const searchColumnNames = (data.searchColumns || []).map(c => c.name);
    const isRequired = searchColumnNames.includes(columnName) || (data.attributeColumns || []).includes(columnName);
    if (isRequired) return; // Prevent unchecking required columns

    const currentSelection = data.returnColumns || [];
    const isSelected = currentSelection.includes(columnName);
    let newSelection: string[];

    if (isSelected) {
      newSelection = currentSelection.filter(col => col !== columnName);
    } else {
      newSelection = [...currentSelection, columnName];
    }
    onUpdate({ returnColumns: newSelection });
  };

  const handleSelectAll = () => {
    onUpdate({ returnColumns: MOCK_COLUMNS });
  };

  const handleClearAll = () => {
    onUpdate({ returnColumns: [] });
  };

  return (
    <div className="flex-1 space-y-8">
      {/* Top Panel: Column Selection */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Select columns to include in the service</h1>
        <p className="text-sm text-gray-600 mb-6">
          Select the columns that you want to include in the search index. The data in these columns will be available for querying.
        </p>
        
        <div className="border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-700">{data.selectedTable || 'SNOWFLAKE_SAMPLE_DATA.TPCH_SF1.SUPPLIER'}</h3>
            <div className="space-x-2">
              <button onClick={handleSelectAll} className="text-xs text-blue-600 font-semibold hover:underline">Select all</button>
              <button onClick={handleClearAll} className="text-xs text-blue-600 font-semibold hover:underline">Clear all</button>
            </div>
          </div>
          <div className="p-4">
            <div className="relative mb-4">
              <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <ul className="max-h-80 overflow-y-auto divide-y divide-gray-200">
              {MOCK_COLUMNS.map(col => {
                const searchColumnNames = (data.searchColumns || []).map(c => c.name);
                const isRequired = searchColumnNames.includes(col) || (data.attributeColumns || []).includes(col);

                return (
                  <li key={col} className="p-3">
                    <label className={`flex items-center ${isRequired ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                      <input
                        type="checkbox"
                        checked={(data.returnColumns || []).includes(col)}
                        onChange={() => handleColumnToggle(col)}
                        disabled={isRequired}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <svg className="w-5 h-5 text-gray-400 ml-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 4v16m-4-10h8M9 4a2 2 0 11-4 0 2 2 0 014 0zM5 14a2 2 0 11-4 0 2 2 0 014 0zM9 20a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className={`text-sm font-medium ${isRequired ? 'text-gray-500' : 'text-gray-800'}`}>{col}</span>
                    </label>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500">
              Search and attribute columns must be part of the included columns.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Panel: Search Result Preview */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Search result preview</h2>
        <div className="border border-gray-200 rounded-lg bg-white">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-700">Your search results will contain these columns:</h3>
          </div>
          <div className="p-4">
            {(data.returnColumns || []).length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      {(data.returnColumns || []).map(col => (
                        <th key={col} className="px-4 py-2 text-left font-medium text-gray-600 whitespace-nowrap">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Empty rows to give the table structure */}
                    {[...Array(3)].map((_, i) => (
                      <tr key={i} className="border-t border-gray-200">
                        {(data.returnColumns || []).map(col => (
                          <td key={col} className="px-4 py-2 text-gray-400">...</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>Select columns to see a preview of your search results.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 