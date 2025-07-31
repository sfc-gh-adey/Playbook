import React, { useState } from 'react';
import { WizardData } from '../App';

interface Props {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
}

interface DataItem {
  name: string;
  type: 'table' | 'stage';
  path?: string;
  selected?: boolean;
}

const mockTables = [
  'CSS_SCRAPE',
  'LLM_GEN_CORPUS', 
  'LLM_GEN_QUERIES',
  'LLM_REL_941EB4AC271D725ABE04FD857328C251_TEMP'
];

const mockStages = [
  'ADEY_TEST_STAGE',
  'ADEY_TEST_STAGE_2',
  'DOCUMENTS_STAGE',
  'REPORTS_STAGE',
  'ARCHIVE_STAGE'
];

// Combine all data items for unified view
const getAllDataItems = (includeStages: boolean = false): DataItem[] => {
  const tables: DataItem[] = mockTables.map(name => ({ name, type: 'table' }));
  
  if (includeStages) {
    const stages: DataItem[] = mockStages.map(name => ({ name, type: 'stage' }));
    return [...tables, ...stages];
  }
  
  return tables;
};

// Mock file structure for stage browsing
interface FileItem {
  name: string;
  type: 'file' | 'folder';
  path: string;
  size?: string;
  modified?: string;
}

const getMockFiles = (path: string): FileItem[] => {
  if (path === '') {
    return [
      { name: 'documents', type: 'folder', path: 'documents/' },
      { name: 'reports', type: 'folder', path: 'reports/' },
      { name: 'archive', type: 'folder', path: 'archive/' },
      { name: 'readme.pdf', type: 'file', path: 'readme.pdf', size: '1.2 MB', modified: '2 days ago' }
    ];
  }
  
  if (path === 'documents/') {
    return [
      { name: 'contracts', type: 'folder', path: 'documents/contracts/' },
      { name: 'invoices', type: 'folder', path: 'documents/invoices/' },
      { name: 'policies', type: 'folder', path: 'documents/policies/' },
      { name: 'manual.pdf', type: 'file', path: 'documents/manual.pdf', size: '3.4 MB', modified: '1 week ago' },
      { name: 'guide.pdf', type: 'file', path: 'documents/guide.pdf', size: '2.1 MB', modified: '3 days ago' }
    ];
  }
  
  if (path === 'documents/contracts/') {
    return [
      { name: 'vendor_agreement.pdf', type: 'file', path: 'documents/contracts/vendor_agreement.pdf', size: '856 KB', modified: '5 days ago' },
      { name: 'service_contract.pdf', type: 'file', path: 'documents/contracts/service_contract.pdf', size: '1.1 MB', modified: '1 week ago' },
      { name: 'nda.pdf', type: 'file', path: 'documents/contracts/nda.pdf', size: '432 KB', modified: '2 weeks ago' }
    ];
  }
  
  if (path === 'reports/') {
    return [
      { name: 'quarterly', type: 'folder', path: 'reports/quarterly/' },
      { name: 'monthly_report.pdf', type: 'file', path: 'reports/monthly_report.pdf', size: '2.8 MB', modified: '1 day ago' },
      { name: 'annual_summary.pdf', type: 'file', path: 'reports/annual_summary.pdf', size: '4.2 MB', modified: '1 month ago' }
    ];
  }
  
  return [];
};

export default function SelectDataPage({ data, onUpdate }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState('');
  const [currentPath, setCurrentPath] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [showFileBrowser, setShowFileBrowser] = useState(false);

  const handleDatabaseChange = (database: string) => {
    onUpdate({ database });
  };

  const handleDataSourceTypeChange = (type: 'table' | 'stage') => {
    onUpdate({ 
      dataSourceType: type,
      selectedTable: type === 'table' ? data.selectedTable : undefined
    });
    setSelectedStage('');
    setShowFileBrowser(false);
  };

  const handleItemSelect = (item: DataItem) => {
    if (item.type === 'table') {
      onUpdate({ selectedTable: item.name });
    } else if (item.type === 'stage') {
      setSelectedStage(item.name);
      setShowFileBrowser(true);
      setCurrentPath('');
      setSelectedFiles(new Set());
    }
  };

  const handleBackToStages = () => {
    setShowFileBrowser(false);
    // Keep selectedStage so it remains highlighted when we go back
  };

  const navigateToFolder = (path: string) => {
    setCurrentPath(path);
  };

  const navigateUp = () => {
    const pathParts = currentPath.split('/').filter(p => p);
    pathParts.pop();
    setCurrentPath(pathParts.length > 0 ? pathParts.join('/') + '/' : '');
  };

  const toggleFileSelection = (item: FileItem) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(item.path)) {
      newSelected.delete(item.path);
    } else {
      newSelected.add(item.path);
    }
    setSelectedFiles(newSelected);
    
    // Update wizard data
    onUpdate({ 
      selectedFiles: Array.from(newSelected)
    });
  };

  const dataItems = data.dataSourceType === 'table' ? getAllDataItems(false) : getAllDataItems(true).filter(item => item.type === 'stage');
  const filteredDataItems = dataItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentFiles = getMockFiles(currentPath);
  const breadcrumbs = currentPath ? currentPath.split('/').filter(p => p) : [];
  const hasSelectedFolders = Array.from(selectedFiles).some(path => path.endsWith('/'));

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-medium text-gray-900 mb-2">
          Select data to be indexed
        </h1>
        <p className="text-sm text-gray-600">
          {data.dataSourceType === 'table' 
            ? 'Select a table or view containing text data that you would like to search over. At least one column in this table or view must be a text column that you would like to search over.'
            : data.dataSourceType === 'stage'
            ? 'Select a stage containing PDF files that you would like to search over. The PDFs in this stage will be processed and indexed for search.'
            : 'Choose the type of data source you want to create a search service for.'
          }
        </p>
        {data.dataSourceType && (
          <p className="text-xs text-gray-500 mt-1">
            If you wish to specify multiple data sources or perform transformations when defining your service, please use the{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500">SQL surface</a>.
          </p>
        )}
      </div>

      <div className="space-y-4">
        {/* Database Selection */}
        <div>
          <select
            value={data.database}
            onChange={(e) => handleDatabaseChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="ADEY_TEST_DB.TEST">ADEY_TEST_DB.TEST</option>
            <option value="CORTEX_SEARCH_DB.PUBLIC">CORTEX_SEARCH_DB.PUBLIC</option>
            <option value="DEMO_DB.PUBLIC">DEMO_DB.PUBLIC</option>
          </select>
        </div>

        {/* Data Source Type Selection */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Data Source Type</h3>
          <div className="grid grid-cols-2 gap-3">
            <div 
              className={`relative rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                data.dataSourceType === 'table' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400 bg-white'
              }`}
              onClick={() => handleDataSourceTypeChange('table')}
            >
              <div className="p-3">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="table-source"
                      name="data-source-type"
                      type="radio"
                      checked={data.dataSourceType === 'table'}
                      onChange={() => handleDataSourceTypeChange('table')}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="table-source" className="block text-sm font-medium text-gray-900 cursor-pointer">
                      Table or View
                    </label>
                    <p className="mt-1 text-xs text-gray-500">
                      Text columns
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div 
              className={`relative rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                data.dataSourceType === 'stage' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400 bg-white'
              }`}
              onClick={() => handleDataSourceTypeChange('stage')}
            >
              <div className="p-3">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="stage-source"
                      name="data-source-type"
                      type="radio"
                      checked={data.dataSourceType === 'stage'}
                      onChange={() => handleDataSourceTypeChange('stage')}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="stage-source" className="block text-sm font-medium text-gray-900 cursor-pointer">
                      Files
                    </label>
                    <p className="mt-1 text-xs text-gray-500">
                      PDF files in a stage
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Container for Stage Selection */}
        {data.dataSourceType === 'stage' && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="relative h-80">
              <div 
                className="flex transition-transform duration-300 ease-in-out h-full"
                style={{ transform: `translateX(${showFileBrowser ? '-100%' : '0%'})` }}
              >
                {/* Panel 1: Stage Selection */}
                <div className="w-full flex-shrink-0">
                  <div className="p-3 border-b border-gray-200 bg-gray-50">
                    <input
                      type="text"
                      placeholder="Search Stages"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                  
                  <div className="divide-y divide-gray-200 h-64 overflow-y-auto">
                    {filteredDataItems.map((item) => (
                      <div key={item.name} className="hover:bg-gray-50">
                        <label className="flex items-center p-3 cursor-pointer">
                          <div className="flex items-center h-5">
                            <input
                              type="radio"
                              name="selected-stage"
                              checked={selectedStage === item.name}
                              onChange={() => handleItemSelect(item)}
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                            />
                          </div>
                          <div className="ml-3 flex items-center justify-between w-full">
                            <div className="flex items-center space-x-3">
                              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0" />
                              </svg>
                              <span className="text-sm font-medium text-gray-900">{item.name}</span>
                            </div>
                            {selectedStage === item.name && (
                              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Panel 2: File Browser */}
                <div className="w-full flex-shrink-0">
                  {/* File Browser Header */}
                  <div className="p-3 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={handleBackToStages}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <h4 className="text-sm font-medium text-gray-900">{selectedStage}</h4>
                      </div>
                      <span className="text-xs text-gray-500">{selectedFiles.size} items selected</span>
                    </div>
                    
                    {/* Breadcrumb Navigation */}
                    <div className="flex items-center space-x-2 text-xs">
                      <button
                        onClick={() => setCurrentPath('')}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Root
                      </button>
                      {breadcrumbs.map((folder, index) => (
                        <React.Fragment key={index}>
                          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                          <button
                            onClick={() => navigateToFolder(breadcrumbs.slice(0, index + 1).join('/') + '/')}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {folder}
                          </button>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* File Browser Content */}
                  <div className="h-52 overflow-y-auto">
                    <div className="divide-y divide-gray-200">
                      {/* Up/Back Navigation */}
                      {currentPath && (
                        <div className="hover:bg-gray-50">
                          <button
                            onClick={navigateUp}
                            className="flex items-center w-full p-2 text-left"
                          >
                            <svg className="w-4 h-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="text-sm text-gray-600">.. (Back)</span>
                          </button>
                        </div>
                      )}

                      {/* Files and Folders */}
                      {currentFiles.map((item) => (
                        <div key={item.path} className="hover:bg-gray-50">
                          <div className="flex items-center p-2">
                            {/* Checkbox for selection */}
                            <div className="flex items-center h-5 mr-3">
                              <input
                                type="checkbox"
                                checked={selectedFiles.has(item.path)}
                                onChange={() => toggleFileSelection(item)}
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                              />
                            </div>

                            {/* Item Content */}
                            <div 
                              className="flex-1 flex items-center cursor-pointer"
                              onClick={() => item.type === 'folder' ? navigateToFolder(item.path) : toggleFileSelection(item)}
                            >
                              {/* Icon */}
                              <div className="mr-3">
                                {item.type === 'folder' ? (
                                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0" />
                                  </svg>
                                ) : (
                                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                )}
                              </div>

                              {/* Name and details */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-900 truncate">{item.name}</span>
                                  {item.type === 'folder' && (
                                    <svg className="w-3 h-3 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                  )}
                                </div>
                                {item.type === 'file' && (
                                  <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                                    <span>{item.size}</span>
                                    <span>Modified {item.modified}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Table Selection (when table type is selected) */}
        {data.dataSourceType === 'table' && (
          <div className="border border-gray-200 rounded-lg">
            <div className="p-3 border-b border-gray-200 bg-gray-50">
              <input
                type="text"
                placeholder="Search Tables and Views"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            
            <div className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
              {filteredDataItems.map((item) => (
                <div key={item.name} className="hover:bg-gray-50">
                  <label className="flex items-center p-3 cursor-pointer">
                    <div className="flex items-center h-5">
                      <input
                        type="radio"
                        name="selected-table"
                        checked={data.selectedTable === item.name}
                        onChange={() => handleItemSelect(item)}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                      />
                    </div>
                    <div className="ml-3 flex items-center justify-between w-full">
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-900">{item.name}</span>
                      </div>
                      {data.selectedTable === item.name && (
                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 