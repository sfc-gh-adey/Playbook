import React from 'react';
import { WizardData } from '../App';

interface Props {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
}

interface MetadataField {
  id: string;
  name: string;
  description: string;
  type: string;
  recommended?: boolean;
}

const availableMetadata: MetadataField[] = [
  {
    id: 'filename',
    name: 'FILENAME',
    description: 'The name of the PDF file',
    type: 'VARCHAR',
    recommended: true
  },
  {
    id: 'file_size',
    name: 'FILE_SIZE',
    description: 'Size of the PDF file in bytes',
    type: 'NUMBER'
  },
  {
    id: 'last_modified',
    name: 'LAST_MODIFIED',
    description: 'Timestamp when the file was last modified',
    type: 'TIMESTAMP',
    recommended: true
  },
  {
    id: 'file_path',
    name: 'FILE_PATH',
    description: 'Full path to the file in the stage',
    type: 'VARCHAR',
    recommended: true
  },
  {
    id: 'page_count',
    name: 'PAGE_COUNT',
    description: 'Number of pages in the PDF document',
    type: 'NUMBER'
  },
  {
    id: 'document_title',
    name: 'DOCUMENT_TITLE',
    description: 'Title extracted from PDF metadata',
    type: 'VARCHAR'
  },
  {
    id: 'document_author',
    name: 'DOCUMENT_AUTHOR',
    description: 'Author extracted from PDF metadata',
    type: 'VARCHAR'
  },
  {
    id: 'creation_date',
    name: 'CREATION_DATE',
    description: 'Creation date from PDF metadata',
    type: 'TIMESTAMP'
  }
];

export default function SelectMetadataPage({ data, onUpdate }: Props) {
  const handleMetadataToggle = (fieldId: string) => {
    const currentMetadata = data.includeMetadata || [];
    const isSelected = currentMetadata.includes(fieldId);
    
    if (isSelected) {
      onUpdate({ 
        includeMetadata: currentMetadata.filter(id => id !== fieldId) 
      });
    } else {
      onUpdate({ 
        includeMetadata: [...currentMetadata, fieldId] 
      });
    }
  };

  const selectAll = () => {
    onUpdate({ includeMetadata: availableMetadata.map(field => field.id) });
  };

  const selectRecommended = () => {
    onUpdate({ 
      includeMetadata: availableMetadata
        .filter(field => field.recommended)
        .map(field => field.id) 
    });
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Select metadata to include
        </h1>
        <p className="text-gray-600">
          Select the metadata fields that you want to include in the search index. These fields will be available for filtering and will be returned in search results.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          PDF content and metadata must be part of the included fields.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <div className="mb-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Stage: {data.stagePath || 'Not selected'}
            </span>
          </div>
        </div>

        {/* Quick Selection Actions */}
        <div className="flex space-x-3">
          <button
            onClick={selectRecommended}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
          >
            Select recommended
          </button>
          <button
            onClick={selectAll}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium"
          >
            Select all
          </button>
          <button
            onClick={() => onUpdate({ includeMetadata: [] })}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium"
          >
            Clear all
          </button>
        </div>

        {/* Metadata Fields List */}
        <div className="border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search metadata fields..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {availableMetadata.map((field) => (
              <div key={field.id} className="border-b border-gray-200 last:border-b-0">
                <label className="flex items-start p-4 cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center h-5 mt-1">
                    <input
                      type="checkbox"
                      checked={(data.includeMetadata || []).includes(field.id)}
                      onChange={() => handleMetadataToggle(field.id)}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">{field.name}</span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {field.type}
                      </span>
                      {field.recommended && (
                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded font-medium">
                          Recommended
                        </span>
                      )}
                      {(data.includeMetadata || []).includes(field.id) && (
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{field.description}</p>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Selection Summary */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Selected fields ({(data.includeMetadata || []).length} of {availableMetadata.length})
          </h4>
          {(data.includeMetadata || []).length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {(data.includeMetadata || []).map(fieldId => {
                const field = availableMetadata.find(f => f.id === fieldId);
                return field ? (
                  <span
                    key={fieldId}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {field.name}
                  </span>
                ) : null;
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No metadata fields selected</p>
          )}
        </div>
      </div>
    </div>
  );
} 