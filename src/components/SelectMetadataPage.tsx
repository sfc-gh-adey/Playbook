import React from 'react';
import { WizardData } from '../App';

interface Props {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
}

const metadataColumns = [
  {
    name: 'DOCUMENT_NAME',
    description: 'File name',
    type: 'VARCHAR'
  },
  {
    name: 'FILE_PATH',
    description: 'Full path',
    type: 'VARCHAR'
  },
  {
    name: 'LAST_MODIFIED',
    description: 'Last modified date',
    type: 'TIMESTAMP'
  },
  {
    name: 'DOCUMENT_TITLE',
    description: 'PDF title property',
    type: 'VARCHAR'
  },
  {
    name: 'DOCUMENT_AUTHOR',
    description: 'PDF author property',
    type: 'VARCHAR'
  },
  {
    name: 'CREATION_DATE',
    description: 'PDF creation date',
    type: 'TIMESTAMP'
  },
  {
    name: 'FILE_SIZE',
    description: 'Document size',
    type: 'NUMBER'
  },
  {
    name: 'PAGE_COUNT',
    description: 'Number of pages',
    type: 'NUMBER'
  },
  {
    name: 'CHUNK',
    description: 'Text content chunk',
    type: 'VARCHAR'
  },
  {
    name: 'CHUNK_LINK',
    description: 'Link to retrieve PDF location',
    type: 'VARCHAR'
  }
];

export default function SelectMetadataPage({ data, onUpdate }: Props) {
  // Auto-include all metadata columns - no user selection needed
  React.useEffect(() => {
    onUpdate({ includeMetadata: metadataColumns.map(col => col.name.toLowerCase()) });
  }, []);

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Metadata Columns
        </h1>
        <p className="text-gray-600">
          All document properties will be indexed for filtering and retrieval.
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

        {/* Metadata Columns Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Column Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {metadataColumns.map((column, index) => (
                <tr key={column.name} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {column.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {column.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {column.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            All columns will be indexed ({metadataColumns.length} total)
          </h4>
          <p className="text-sm text-blue-700">
            These columns enable filtering by document properties and content retrieval via chunk links.
          </p>
        </div>
      </div>
    </div>
  );
} 