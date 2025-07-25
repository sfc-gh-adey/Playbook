
import React, { useState } from 'react';
import { WizardData } from '../App';

const MOCK_COLUMNS = ['DOC_ID', 'TITLE', 'CONTENT', 'CATEGORY', 'SUBCATEGORY', 'TRANSCRIPT_TEXT', 'COLUMN_A', 'COLUMN_B'];
const MOCK_DATA_PREVIEW: Record<string, string[]> = {
  'DOC_ID': ['doc_101', 'doc_102', 'doc_103', 'doc_104', 'doc_105'],
  'TITLE': ['Q1 Report', 'Project Phoenix Spec', 'Meeting Notes', 'Competitor Analysis', 'User Survey Results'],
  'CONTENT': ['The quick brown fox...', 'Lorem ipsum dolor sit amet...', 'Key takeaways from the...', 'Our main competitor, Acme...', 'Users reported high satisfaction...'],
  'CATEGORY': ['Finance', 'Engineering', 'Sales', 'Strategy', 'UX'],
  'SUBCATEGORY': ['Quarterly Reports', 'Product Specs', 'Meeting Minutes', 'Market Research', 'User Feedback'],
  'TRANSCRIPT_TEXT': ['...so I said, let\'s ship it.', '...the user feedback was positive...', '...we need to focus on...', '...the data shows a clear trend...', '...our next steps will be...'],
  'COLUMN_A': ['Value A1', 'Value A2', 'Value A3', 'Value A4', 'Value A5'],
  'COLUMN_B': ['Value B1', 'Value B2', 'Value B3', 'Value B4', 'Value B5'],
};

interface Props {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
}

export default function SelectSearchColumnPage({ data, onUpdate }: Props) {
  const [previewColumn, setPreviewColumn] = useState<string | null>(null);

  const handleColumnToggle = (columnName: string) => {
    const currentSelection = data.searchColumns || [];
    const isSelected = currentSelection.some(col => col.name === columnName);
    let newSelection;

    if (isSelected) {
      newSelection = currentSelection.filter(col => col.name !== columnName);
    } else {
      newSelection = [...currentSelection, { name: columnName, isText: true, isVector: false }];
    }
    onUpdate({ searchColumns: newSelection });
  };

  const handleSearchTypeToggle = (columnName: string, type: 'isText' | 'isVector') => {
    const currentSelection = [...(data.searchColumns || [])];
    const columnIndex = currentSelection.findIndex(col => col.name === columnName);
    if (columnIndex === -1) return;

    const columnToUpdate = { ...currentSelection[columnIndex] };
    columnToUpdate[type] = !columnToUpdate[type];

    // Ensure at least one type is selected
    if (!columnToUpdate.isText && !columnToUpdate.isVector) {
      // If user is deselecting the last type, re-select the other one
      columnToUpdate[type === 'isText' ? 'isVector' : 'isText'] = true;
    }

    currentSelection[columnIndex] = columnToUpdate;
    onUpdate({ searchColumns: currentSelection });
  };

  const handlePreview = (columnName: string) => {
    setPreviewColumn(columnName);
  };

  return (
    <div className="flex space-x-8">
      {/* Left Panel: Column Selection */}
      <div className="flex-1 flex flex-col">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Select search columns</h1>
          <p className="text-sm text-gray-600 mb-6">
            Select one or more columns to index. For each, choose whether to index for text, vector (semantic), or hybrid search.
          </p>
        </div>
        
        <div className="flex-grow border border-gray-200 rounded-lg flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-700">{data.selectedTable || 'SNOWFLAKE_SAMPLE_DATA.TPCH_SF1.SUPPLIER'}</h3>
          </div>
          <div className="p-4 flex-grow overflow-y-auto">
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
            <ul className="divide-y divide-gray-200">
              {MOCK_COLUMNS.map(col => {
                const isSelected = (data.searchColumns || []).some(c => c.name === col);
                const selection = isSelected ? (data.searchColumns || []).find(c => c.name === col) : null;

                return (
                  <li key={col} className={`p-3 ${isSelected ? 'bg-blue-50' : ''}`}>
                    <div className="flex items-center justify-between">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleColumnToggle(col)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <svg className="w-5 h-5 text-gray-400 ml-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 4v16m-4-10h8M9 4a2 2 0 11-4 0 2 2 0 014 0zM5 14a2 2 0 11-4 0 2 2 0 014 0zM9 20a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-800">{col}</span>
                      </label>
                      <button 
                        onClick={() => handlePreview(col)}
                        className="text-gray-400 hover:text-blue-500"
                        aria-label={`Preview column ${col}`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                    {isSelected && selection && (
                      <div className="pl-8 pt-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600 mr-2">Index for:</span>
                          <button
                            onClick={() => handleSearchTypeToggle(col, 'isText')}
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              selection.isText
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            Text
                          </button>
                          <button
                            onClick={() => handleSearchTypeToggle(col, 'isVector')}
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              selection.isVector
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            Vector
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <p className="text-xs text-gray-500">
              Select one or more columns to be indexed for searching.
            </p>
          </div>
        </div>
        
        <div className="mt-4 flex-shrink-0">
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h4 className="text-sm font-medium text-gray-800 mb-2">When to use Text vs. Vector search?</h4>
            <div className="text-xs text-gray-600 space-y-2">
              <p><strong>Text Index:</strong> Ideal for exact or keyword matches. Use this for fields like product codes, names, or categories where users will search for specific terms.</p>
              <p><strong>Vector Index:</strong> Ideal for semantic, meaning-based search. Use this for fields with longer text like descriptions or reviews, where users might search for concepts or ideas.</p>
              <p><strong>Hybrid (Both):</strong> The most powerful option. Use for critical fields where you need both keyword precision and semantic understanding (e.g., product titles).</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Data Preview */}
      <div className="w-96">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Data preview</h2>
        <div className="border border-gray-200 rounded-lg bg-white h-[484px]">
          {previewColumn ? (
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-gray-200 flex-shrink-0">
                <h3 className="text-sm font-medium text-gray-700">{previewColumn}</h3>
              </div>
              <div className="flex-grow overflow-y-auto">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-200">
                    {(MOCK_DATA_PREVIEW[previewColumn] || []).map((value, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-gray-600 truncate" title={value}>
                          {value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <p className="mt-2 text-sm">Select a column to preview its data</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 