
import { WizardData } from '../App';

const MOCK_COLUMNS = ['DOC_ID', 'TITLE', 'CONTENT', 'CATEGORY', 'SUBCATEGORY', 'TRANSCRIPT_TEXT', 'COLUMN_A', 'COLUMN_B'];

interface Props {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
}

export default function SelectAttributesPage({ data, onUpdate }: Props) {
  const handleAttributeToggle = (columnName: string) => {
    const currentSelection = data.attributeColumns || [];
    const isSelected = currentSelection.includes(columnName);
    let newSelection: string[];

    if (isSelected) {
      newSelection = currentSelection.filter(col => col !== columnName);
    } else {
      newSelection = [...currentSelection, columnName];
    }
    onUpdate({ attributeColumns: newSelection });
  };

  return (
    <div className="flex-1">
      <h1 className="text-xl font-semibold text-gray-900 mb-2">Select attribute column(s)</h1>
      <p className="text-sm text-gray-600 mb-6">
        Select a set of columns that you'd wish to use as filters when querying the service.
      </p>
      
      <div className="border border-gray-200 rounded-lg max-w-lg">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-sm font-medium text-gray-700">{data.selectedTable || 'SNOWFLAKE_SAMPLE_DATA.TPCH_SF1.SUPPLIER'}</h3>
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
            {MOCK_COLUMNS.map(col => (
              <li key={col} className="p-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(data.attributeColumns || []).includes(col)}
                    onChange={() => handleAttributeToggle(col)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <svg className="w-5 h-5 text-gray-400 ml-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 4v16m-4-10h8M9 4a2 2 0 11-4 0 2 2 0 014 0zM5 14a2 2 0 11-4 0 2 2 0 014 0zM9 20a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-800">{col}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50 max-w-lg">
        <h4 className="text-sm font-medium text-gray-800 mb-2">How are Attributes different from Search Columns?</h4>
        <div className="text-xs text-gray-600 space-y-2">
          <p><strong>Search Columns</strong> are what you search <em>for content</em>. Your query will look for matches inside these columns.</p>
          <p><strong>Attribute Columns</strong> are what you use to <em>filter results</em>. You can narrow down your search to only include records where an attribute matches a specific value (e.g., `CATEGORY = 'Finance'`).</p>
        </div>
      </div>
    </div>
  );
} 