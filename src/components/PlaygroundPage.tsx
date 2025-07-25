import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface SearchResult {
  DOC_ID: string;
  TITLE: string;
  CONTENT: string;
  CATEGORY: string;
  PRICE: number | null;
  RATING: number | null;
  DATE: string;
  REGION: string;
  AGENT_ID: string | null;
  SCORE: number;
  source_type: 'Table' | 'PDF';
  score_components: { [key: string]: number };
  SOURCE_FILENAME?: string;
  PAGE_NUMBER?: number;
}

const mockResultsA: SearchResult[] = [
  {
    DOC_ID: "dke9o01345",
    TITLE: "Customer inquiry about pricing",
    CONTENT: "The customer is asking about the pricing for our enterprise plan. They want to know the per-seat cost and any available discounts.",
    CATEGORY: "Sales",
    PRICE: 100,
    RATING: 4.5,
    DATE: "2024-05-20",
    REGION: "US",
    AGENT_ID: "dke9o01345",
    SCORE: 0.92,
    source_type: 'Table',
    score_components: {
      'CONTENT (text)': 0.7,
      'TITLE (text)': 0.2,
      'RATING (boost)': 0.02
    }
  },
  {
    DOC_ID: "ppa8b92134",
    TITLE: "Billing issue escalation",
    CONTENT: "A customer is reporting a double charge on their last invoice. We need to investigate and issue a refund if necessary.",
    CATEGORY: "Billing",
    PRICE: 50,
    RATING: 2.8,
    DATE: "2024-05-19",
    REGION: "EU",
    AGENT_ID: "ppa8b92134",
    SCORE: 0.87,
    source_type: 'Table',
    score_components: {
      'CONTENT (text)': 0.65,
      'TITLE (text)': 0.15,
      'RATING (boost)': 0.07
    }
  },
];

interface QueryPanelProps {
  limit: number;
  setLimit: (limit: number) => void;
  selectedColumns: string[];
  setSelectedColumns: (columns: string[]) => void;
  filters: Filter[];
  setFilters: (filters: Filter[]) => void;
  logicalOperator: '@and' | '@or';
  setLogicalOperator: (operator: '@and' | '@or') => void;
}

interface Filter {
  id: number;
  column: string;
  operator: string;
  value: string | string[] | number[] | [number, number];
  negate: boolean;
}

interface BoostDecayItem {
  id: number;
  column: string;
  func: 'linear' | 'logarithmic' | 'quadratic';
  weight: number;
  minValue?: number;
  maxValue?: number;
}

const PlaygroundPage = () => {
  const { serviceName } = useParams<{ serviceName: string }>();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Query');
  const [limit, setLimit] = useState(10);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(['CONTENT', 'TITLE', 'CATEGORY']);
  const [results, setResults] = useState<any[][]>([[]]);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [logicalOperator, setLogicalOperator] = useState<'@and' | '@or'>('@and');
  const [columnWeights, setColumnWeights] = useState<{[key: string]: number}>({ CONTENT: 1, TITLE: 1, CATEGORY: 1 });
  const [techniqueBalance, setTechniqueBalance] = useState(50);
  const [activeConfig, setActiveConfig] = useState('Default');
  
  // Saved configurations
  const [savedConfigs, setSavedConfigs] = useState<{[key: string]: any}>({
    'Default': {
      name: 'Default',
      columnWeights: { CONTENT: 1, TITLE: 1 },
      techniqueBalance: 50,
      filters: [],
      boosts: [],
      decays: []
    }
  });
  const [comparisonConfigs, setComparisonConfigs] = useState<string[]>(['Default']);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  
  const handleSearch = async () => {
    // This is now a simplified, local search simulation
    const newResults = comparisonConfigs.map(configName => {
      // For now, just return the same mock data for each config
      // In a real implementation, you'd apply the config's weights/filters
      let mockData = mockResultsA;

      // Super simple query filter
      if (query) {
        mockData = mockData.filter(item =>
          item.CONTENT.toLowerCase().includes(query.toLowerCase())
        );
      }
      
      const limitedResults = mockData.slice(0, limit);
      return limitedResults.map((r, i) => ({ ...r, rank: i + 1 }));
    });
    setResults(newResults);
  };

  useEffect(() => {
    if (query) {
      handleSearch();
    }
  }, [comparisonConfigs, limit, query]);
  
  const renderResults = (serviceResults: any[], configName: string) => {
    if (serviceResults.length === 0) {
      return <div className="p-4 text-center text-gray-500">No results for {configName}.</div>;
    }
    return serviceResults.map(result => <ResultCard key={result.DOC_ID} result={result} columns={selectedColumns} />);
  };

  const isCompareView = comparisonConfigs.length > 1;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(`/service/${serviceName}`)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Cortex Search</h1>
            <span className="text-gray-500">•</span>
            <span className="text-gray-600">Playground</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">ADEY_TEST_DB.TEST_{serviceName}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex h-[calc(100vh-73px)]">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Search Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            {isCompareView && (
              <div className="flex items-center space-x-4 mb-4">
                {comparisonConfigs.map((service, index) => (
                  <React.Fragment key={service}>
                    <ServiceSelector 
                      service={service} 
                      setService={(newService) => {
                        const newServices = [...comparisonConfigs];
                        newServices[index] = newService;
                        setComparisonConfigs(newServices);
                      }} 
                      label={String.fromCharCode(65 + index)} 
                    />
                    {index < comparisonConfigs.length - 1 && <span className="text-gray-400">vs.</span>}
                  </React.Fragment>
                ))}
              </div>
            )}
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search..."
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button 
                onClick={handleSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="flex-1 bg-gray-50">
            <div className="p-4 border-b bg-white">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">
                  {isCompareView ? 'Comparison Results' : 'Search Results'}
                </h2>
                <span className="text-sm text-gray-500">
                  {results[0]?.length || 0} results
                </span>
              </div>
            </div>
            
            {/* Results Area */}
            <div className={`p-4 ${isCompareView ? 'flex gap-4' : ''}`}>
              {isCompareView ? (
                comparisonConfigs.map((configName, index) => (
                  <div key={configName} className="flex-1 bg-white rounded-lg shadow-sm">
                    <div className="p-3 border-b bg-gray-50">
                      <h3 className="font-medium text-sm">{configName}</h3>
                      {savedConfigs[configName] && (
                        <p className="text-xs text-gray-500 mt-1">
                          Balance: {savedConfigs[configName].techniqueBalance}%
                        </p>
                      )}
                    </div>
                    <div className="divide-y max-h-[600px] overflow-y-auto">
                      {renderResults(results[index] || [], configName)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg shadow-sm max-w-4xl mx-auto w-full">
                  <div className="divide-y">
                    {renderResults(results[0] || [], comparisonConfigs[0] || 'Default')}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Configure Panel */}
        <div className="w-[36rem] bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <nav className="flex space-x-1">
              {['Query', 'Tuning', 'Compare'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                    activeTab === tab ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <div className={activeTab === 'Query' ? 'block' : 'hidden'}>
              <QueryPanel 
                limit={limit}
                setLimit={setLimit}
                selectedColumns={selectedColumns}
                setSelectedColumns={setSelectedColumns}
                filters={filters}
                setFilters={setFilters}
                logicalOperator={logicalOperator}
                setLogicalOperator={setLogicalOperator}
              />
            </div>
            <div className={activeTab === 'Tuning' ? 'block' : 'hidden'}>
              <TuningPanel 
                columnWeights={columnWeights}
                setColumnWeights={setColumnWeights}
                techniqueBalance={techniqueBalance}
                setTechniqueBalance={setTechniqueBalance}
                activeConfig={activeConfig}
                setActiveConfig={setActiveConfig}
                onSaveConfig={(name: string, isDefault: boolean) => {
                  // Save current configuration
                  const newConfig = {
                    name,
                    columnWeights,
                    techniqueBalance,
                    filters,
                    boosts: [], // TODO: Get from BoostDecayConfigurator
                    decays: []  // TODO: Get from BoostDecayConfigurator
                  };
                  
                  // Update saved configs
                  const updatedConfigs = { ...savedConfigs, [name]: newConfig };
                  setSavedConfigs(updatedConfigs);
                  console.log('Saved config:', name, updatedConfigs); // Debug log
                  
                  if (isDefault) {
                    setActiveConfig(name);
                  }
                  
                  // Show success message
                  setSaveSuccess(`Configuration "${name}" saved successfully!`);
                  setTimeout(() => setSaveSuccess(null), 3000);
                }}
              />
            </div>
            <div className={activeTab === 'Compare' ? 'block' : 'hidden'}>
              <ComparePanel 
                savedConfigs={savedConfigs}
                comparisonConfigs={comparisonConfigs}
                setComparisonConfigs={setComparisonConfigs}
                activeConfig={activeConfig}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Success message */}
      {saveSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg z-50">
          {saveSuccess}
        </div>
      )}
    </div>
  );
};

const ServiceSelector = ({ service, setService, label }: { service: string, setService: (s: string) => void, label: string }) => (
  <div className="flex items-center space-x-2">
    <span className={`w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-semibold text-xs`}>{label}</span>
    <select 
      value={service} 
      onChange={e => setService(e.target.value)}
      className="border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm font-medium"
    >
      <option>CHAT_CUSTOMER_TEST_CSS_A</option>
      <option>CHAT_CUSTOMER_TEST_CSS_B</option>
      <option>PRODUCT_CATALOG_V1</option>
    </select>
  </div>
);

const ResultCard = ({ result, columns }: { result: any, columns: string[] }) => {
  if (!result) return null;

  const score = result.SCORE ?? 0;
  const scoreComponents = result.score_components || {};
  const totalScore = Object.values(scoreComponents).reduce((sum: number, s: any) => sum + s, 0) || 1;
  const rank = result.rank || '-';

  return (
    <div className="border-b border-gray-200 py-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start space-x-4">
        <span className="text-gray-400 text-sm font-medium w-6">{rank}</span>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              {columns.map(colName => {
                if (result[colName] && colName !== 'DOC_ID' && colName !== 'AGENT_ID') {
                  return (
                    <div key={colName} className="mb-2">
                      {colName === 'TITLE' ? (
                        <h4 className="font-medium text-gray-900">{result[colName]}</h4>
                      ) : (
                        <p className="text-sm text-gray-600 line-clamp-2">{result[colName]}</p>
                      )}
                    </div>
                  );
                }
                return null;
              })}
            </div>
            
            {/* Score with hover details */}
            <div className="ml-4 group relative">
              <div className="text-right cursor-help">
                <div className="text-2xl font-bold text-blue-600">{score.toFixed(2)}</div>
                <div className="flex h-1.5 w-20 mt-1 rounded-full overflow-hidden bg-gray-200">
                  <div style={{ width: `${((scoreComponents['CONTENT (text)'] || scoreComponents['CONTENT (vector)'] || 0) / totalScore) * 100}%` }} className="bg-blue-500" title="Content Score"></div>
                  <div style={{ width: `${((scoreComponents['TITLE (text)'] || 0) / totalScore) * 100}%` }} className="bg-green-500" title="Title Score"></div>
                  <div style={{ width: `${((scoreComponents['RATING (boost)'] || scoreComponents['freshness (decay)'] || 0) / totalScore) * 100}%` }} className="bg-purple-500" title="Boost/Decay"></div>
                </div>
              </div>
              
              {/* Hover tooltip with score breakdown */}
              <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <h5 className="font-medium text-sm mb-2 text-gray-900">Score Breakdown</h5>
                <div className="space-y-1">
                  {Object.entries(scoreComponents).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-gray-600">{key}:</span>
                      <span className="font-medium text-gray-900">{(value as number).toFixed(3)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-gray-700">Total Score:</span>
                    <span className="text-blue-600">{score.toFixed(3)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Metadata footer */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {result.DATE && (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {result.DATE}
              </span>
            )}
            {result.CATEGORY && (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {result.CATEGORY}
              </span>
            )}
            {result.SOURCE_FILENAME && (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {result.SOURCE_FILENAME} • Page {result.PAGE_NUMBER}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const QueryPanel = ({ limit, setLimit, selectedColumns, setSelectedColumns, filters, setFilters, logicalOperator, setLogicalOperator }: QueryPanelProps) => {
  const [isColumnSelectorOpen, setIsColumnSelectorOpen] = useState(false);
  const allColumns = ['DOC_ID', 'TITLE', 'CONTENT', 'CATEGORY', 'PRICE', 'RATING', 'DATE', 'REGION', 'AGENT_ID'];
  
  // Define operators with their metadata
  const operators = {
    '@eq': { label: 'equals', inputType: 'single' },
    '@contains': { label: 'contains', inputType: 'single' },
    '@gte': { label: '≥', inputType: 'single' },
    '@lte': { label: '≤', inputType: 'single' },
    '@in': { label: 'in', inputType: 'multiple' },
    '@between': { label: 'between', inputType: 'range' },
    '@startsWith': { label: 'starts with', inputType: 'single' },
    '@primarykey': { label: 'primary key', inputType: 'multiple' }
  };

  const handleFilterChange = (index: number, field: keyof Filter, value: any) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], [field]: value };
    
    // Reset value when operator changes
    if (field === 'operator') {
      const inputType = operators[value as keyof typeof operators].inputType;
      if (inputType === 'multiple') {
        newFilters[index].value = [];
      } else if (inputType === 'range') {
        newFilters[index].value = [0, 100];
      } else {
        newFilters[index].value = '';
      }
    }
    
    setFilters(newFilters);
  };

  const addFilter = () => {
    setFilters([...filters, { id: Date.now(), column: 'CATEGORY', operator: '@eq', value: '', negate: false }]);
  };

  const removeFilter = (id: number) => {
    setFilters(filters.filter(f => f.id !== id));
  };

  const renderFilterValue = (filter: Filter, index: number) => {
    const inputType = operators[filter.operator as keyof typeof operators].inputType;

    if (inputType === 'multiple') {
      // Tag input for @in and @primarykey
      const values = Array.isArray(filter.value) ? filter.value : [];
      return (
        <div className="w-1/3">
          <div className="flex flex-wrap gap-1 p-1 border border-gray-300 rounded-md min-h-[32px]">
            {values.map((val, i) => (
              <span key={i} className="inline-flex items-center px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                {val}
                <button
                  onClick={() => {
                    const newValues = values.filter((_, idx) => idx !== i);
                    handleFilterChange(index, 'value', newValues);
                  }}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder="Add value..."
              className="flex-1 min-w-[80px] text-sm outline-none"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const input = e.target as HTMLInputElement;
                  if (input.value.trim()) {
                    handleFilterChange(index, 'value', [...values, input.value.trim()]);
                    input.value = '';
                  }
                }
              }}
            />
          </div>
        </div>
      );
    } else if (inputType === 'range') {
      // Range input for @between
      const [min, max] = Array.isArray(filter.value) && filter.value.length === 2 
        ? filter.value as [number, number]
        : [0, 100];
      return (
        <div className="w-1/3 flex items-center gap-2">
          <input
            type="number"
            value={min}
            onChange={(e) => handleFilterChange(index, 'value', [Number(e.target.value), max])}
            className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm"
            placeholder="Min"
          />
          <span className="text-gray-500">to</span>
          <input
            type="number"
            value={max}
            onChange={(e) => handleFilterChange(index, 'value', [min, Number(e.target.value)])}
            className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm"
            placeholder="Max"
          />
        </div>
      );
    } else {
      // Single input for other operators
      return (
        <input
          type="text"
          value={filter.value as string}
          onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
          placeholder="Value"
          className="w-1/3 px-2 py-1 border border-gray-300 rounded-md text-sm"
        />
      );
    }
  };

  const generatedJson = () => {
    const filterClauses = filters.map(f => {
      let value = f.value;
      // Ensure proper formatting for different operators
      if (f.operator === '@between' && Array.isArray(value)) {
        value = value;
      } else if ((f.operator === '@in' || f.operator === '@primarykey') && Array.isArray(value)) {
        value = value;
      }
      
      const clause = { [f.operator]: { [f.column]: value } };
      return f.negate ? { "@not": clause } : clause;
    });

    if (filterClauses.length === 0) return '';
    if (filterClauses.length === 1) {
      return JSON.stringify(filterClauses[0], null, 2);
    }
    return JSON.stringify({ [logicalOperator]: filterClauses }, null, 2);
  };

  const getFilterExample = (operator: string) => {
    const examples: { [key: string]: string } = {
      '@eq': 'Matches exact value: category = "Electronics"',
      '@contains': 'Contains text: title contains "snow"',
      '@gte': 'Greater than or equal: price ≥ 100',
      '@lte': 'Less than or equal: rating ≤ 5',
      '@in': 'Value in list: category in ["Electronics", "Books"]',
      '@between': 'Value in range: price between 100 and 500',
      '@startsWith': 'Starts with text: product_code starts with "ABC"',
      '@primarykey': 'Primary key lookup: id in ["id1", "id2"]'
    };
    return examples[operator] || '';
  };

  const toggleColumn = (colName: string) => {
    const newSelection = [...selectedColumns];
    const index = newSelection.indexOf(colName);
    if (index > -1) {
      newSelection.splice(index, 1);
    } else {
      newSelection.push(colName);
    }
    setSelectedColumns(newSelection);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Configure</h3>
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7 7-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="limit" className="text-sm font-medium text-gray-700 flex items-center">
            Number of results
            <InfoTooltip text="The maximum number of results to return (1-100)." />
          </label>
          <input
            id="limit"
            type="number"
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value, 10))}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
            min="1"
            max="100"
          />
          <p className="text-xs text-gray-500 mt-1">1 - 100</p>
        </div>

        <div>
          <label htmlFor="search-columns" className="text-sm font-medium text-gray-700 flex items-center">
            Columns
            <InfoTooltip text="The columns to return in the search results." />
          </label>
          <div className="relative mt-1">
            <button
              onClick={() => setIsColumnSelectorOpen(!isColumnSelectorOpen)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-left text-sm flex justify-between items-center"
            >
              <span className="truncate">{selectedColumns.join(', ')}</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isColumnSelectorOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {allColumns.map(col => (
                  <div key={col} className="flex items-center justify-between px-3 py-2 hover:bg-gray-50">
                    <div>
                      <span className="font-medium text-gray-800 text-sm">{col}</span>
                      <p className="text-xs text-gray-500">{allColumns.includes(col) ? 'Search column' : 'Attribute column'}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedColumns.includes(col)}
                      onChange={() => toggleColumn(col)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 flex items-center">
            Filter
            <InfoTooltip text="Filter results by the attribute columns." />
          </label>
          <div className="mt-1 p-3 border border-gray-200 rounded-lg bg-gray-50 space-y-3">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs font-medium text-gray-600">Combine filters with:</span>
              <button 
                onClick={() => setLogicalOperator('@and')}
                className={`px-2 py-1 text-xs rounded ${logicalOperator === '@and' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                AND
              </button>
              <button 
                onClick={() => setLogicalOperator('@or')}
                className={`px-2 py-1 text-xs rounded ${logicalOperator === '@or' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                OR
              </button>
            </div>

            {filters.map((filter, index) => (
              <div key={filter.id} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <select
                    value={filter.column}
                    onChange={(e) => handleFilterChange(index, 'column', e.target.value)}
                    className="w-1/4 px-2 py-1 border border-gray-300 rounded-md text-sm"
                  >
                    {allColumns.map(col => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                  <select
                    value={filter.operator}
                    onChange={(e) => handleFilterChange(index, 'operator', e.target.value)}
                    className="w-1/4 px-2 py-1 border border-gray-300 rounded-md text-sm"
                  >
                    {Object.entries(operators).map(([op, meta]) => (
                      <option key={op} value={op}>{meta.label}</option>
                    ))}
                  </select>
                  {renderFilterValue(filter, index)}
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filter.negate}
                      onChange={(e) => handleFilterChange(index, 'negate', e.target.checked)}
                      className="h-3 w-3 text-blue-600 border-gray-300 rounded"
                    />
                    <span className="ml-1 text-xs text-gray-600">NOT</span>
                  </label>
                  <button onClick={() => removeFilter(filter.id)} className="text-gray-400 hover:text-red-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
                {/* Visual feedback - example of what this filter does */}
                <p className="text-xs text-gray-500 italic pl-2">{getFilterExample(filter.operator)}</p>
              </div>
            ))}
            <button onClick={addFilter} className="text-sm font-medium text-blue-600 hover:text-blue-700">
              + Add filter
            </button>
          </div>
          <h4 className="font-semibold mb-2">Generated Filter JSON</h4>
          <div className="relative">
            <textarea
              readOnly
              value={generatedJson()}
              className="w-full h-32 p-2 font-mono text-xs bg-gray-100 border rounded-md resize-none"
              placeholder="JSON will appear here..."
            />
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </div>

        <div>
          <button className="w-full flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm">
            <span>&lt;/&gt; View code</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const AccordionItem = ({ title, description, children }: { title: string, description: string, children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div>
          <h4 className="font-medium text-gray-800">{title}</h4>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          {children}
        </div>
      )}
    </div>
  );
};

interface TuningPanelProps {
  columnWeights: { [key: string]: number };
  setColumnWeights: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
  techniqueBalance: number;
  setTechniqueBalance: (balance: number) => void;
  activeConfig: string;
  setActiveConfig: (config: string) => void;
  onSaveConfig: (name: string, isDefault: boolean) => void;
}

const TuningPanel = ({ columnWeights, setColumnWeights, techniqueBalance, setTechniqueBalance, activeConfig, setActiveConfig, onSaveConfig }: TuningPanelProps) => {
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Relevance Tuning</h3>
        <InfoTooltip text="Adjust how different factors influence search results" />
      </div>
      
      <div className="space-y-6">
        <AccordionItem
          title="Column Weights"
          description="Adjust the importance of different columns in your search."
        >
          <div className="space-y-3">
            <ColumnWeightSlider 
              column="CONTENT"
              weight={columnWeights.CONTENT ?? 0}
              setWeight={(value) => setColumnWeights({...columnWeights, CONTENT: value})}
            />
            <ColumnWeightSlider 
              column="TITLE"
              weight={columnWeights.TITLE ?? 0}
              setWeight={(value) => setColumnWeights({...columnWeights, TITLE: value})}
            />
            <ColumnWeightSlider 
              column="CATEGORY"
              weight={columnWeights.CATEGORY ?? 0}
              setWeight={(value) => setColumnWeights({...columnWeights, CATEGORY: value})}
            />
          </div>
        </AccordionItem>
        
        <AccordionItem
          title="Technique Balance"
          description="Balance between keyword and semantic search."
        >
          <TechniqueBalanceSlider balance={techniqueBalance} setBalance={setTechniqueBalance} />
        </AccordionItem>
        
        <AccordionItem
          title="Numeric Boosts"
          description="Increase scores based on numeric values like ratings."
        >
          <BoostDecayConfigurator type="Boost" />
        </AccordionItem>
        
        <AccordionItem
          title="Time Decay"
          description="Decrease scores for older documents."
        >
          <BoostDecayConfigurator type="Decay" />
        </AccordionItem>
      </div>
      
      {/* Save configuration section - always visible */}
      <div className="pt-6 border-t space-y-3">
        <button 
          onClick={() => setIsSaveModalOpen(true)}
          className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Save Configuration
        </button>
        <div className="text-xs text-center text-gray-500">
          Active config: <span className="font-medium text-gray-700">{activeConfig}</span>
        </div>
      </div>
      
      {isSaveModalOpen && (
        <SaveConfigModal 
          onClose={() => setIsSaveModalOpen(false)}
          onSave={(name, isDefault) => {
            onSaveConfig(name, isDefault);
            setIsSaveModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

const ComparePanel = ({ savedConfigs, comparisonConfigs, setComparisonConfigs, activeConfig }: { 
  savedConfigs: {[key: string]: any}, 
  comparisonConfigs: string[], 
  setComparisonConfigs: (configs: string[]) => void,
  activeConfig: string 
}) => {
  const configNames = Object.keys(savedConfigs);
  console.log('Available configs in ComparePanel:', configNames, savedConfigs); // Debug log
  
  const addConfig = (configName: string) => {
    if (comparisonConfigs.length < 3 && !comparisonConfigs.includes(configName)) {
      setComparisonConfigs([...comparisonConfigs, configName]);
    }
  };
  
  const removeConfig = (configName: string) => {
    setComparisonConfigs(comparisonConfigs.filter(c => c !== configName));
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800">
          <strong>Configuration Comparison:</strong> Compare up to 3 saved configurations side-by-side 
          to see how different tuning parameters affect search results.
        </p>
      </div>
      
      <div>
        <h3 className="font-medium mb-3">Select configurations to compare ({configNames.length} saved):</h3>
        {configNames.length === 1 && (
          <p className="text-sm text-gray-500 mb-3">Save more configurations in the Tuning tab to compare them here.</p>
        )}
        <div className="space-y-2">
          {configNames.map(name => (
            <div key={name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={comparisonConfigs.includes(name)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      addConfig(name);
                    } else {
                      removeConfig(name);
                    }
                  }}
                  disabled={!comparisonConfigs.includes(name) && comparisonConfigs.length >= 3}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="font-medium">{name}</span>
                {name === activeConfig && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Active</span>
                )}
              </div>
              {savedConfigs[name].techniqueBalance !== undefined && (
                <span className="text-sm text-gray-600">
                  Balance: {savedConfigs[name].techniqueBalance}% • 
                  Filters: {savedConfigs[name].filters?.length || 0}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {comparisonConfigs.length > 1 && (
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>Comparison Active:</strong> Run a search to see results from {comparisonConfigs.length} configurations side-by-side.
            Each configuration's results will appear in its own column.
          </p>
        </div>
      )}
    </div>
  );
};

interface TechniqueBalanceSliderProps {
  balance: number;
  setBalance: (balance: number) => void;
}

const TechniqueBalanceSlider = ({ balance, setBalance }: TechniqueBalanceSliderProps) => {
  return (
    <div>
      <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
        <span>Keyword</span>
        <span>Semantic</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        step="1"
        value={balance}
        onChange={(e) => setBalance(parseInt(e.target.value, 10))}
        className="w-full h-2 bg-gradient-to-r from-blue-300 to-purple-300 rounded-lg appearance-none cursor-pointer"
      />
      <p className="text-xs text-center text-gray-500 mt-2">
        Current balance: {100 - balance}% Keyword, {balance}% Semantic
      </p>
    </div>
  );
};

interface ColumnWeightSliderProps {
  column: string;
  weight: number;
  setWeight: (weight: number) => void;
}

const ColumnWeightSlider = ({ column, weight, setWeight }: ColumnWeightSliderProps) => (
  <div className="flex items-center space-x-4">
    <span className="w-20 text-sm">{column}</span>
    <input
      type="range"
      min="0.1"
      max="3"
      step="0.1"
      value={weight ?? 0}
      onChange={(e) => setWeight(parseFloat(e.target.value))}
      className="flex-1"
    />
    <span className="text-sm font-medium w-10 text-right">{(weight ?? 0).toFixed(1)}x</span>
  </div>
);

const InfoTooltip = ({ text }: { text: string }) => (
  <div className="relative flex items-center group ml-1.5">
    <svg className="w-4 h-4 text-gray-400 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-xs p-2 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
      {text}
    </div>
  </div>
);

const BoostDecayConfigurator = ({ type }: { type: 'Boost' | 'Decay' }) => {
  const [items, setItems] = useState<BoostDecayItem[]>([]);
  const numericColumns = ['PRICE', 'RATING', 'LIKES', 'COMMENTS', 'VIEWS'];
  const timeColumns = ['DATE', 'CREATED_AT', 'LAST_MODIFIED', 'UPDATED_AT', 'TIMESTAMP'];

  const addItem = () => {
    setItems([...items, { 
      id: Date.now(),
      column: type === 'Boost' ? 'RATING' : 'DATE', 
      func: 'linear', 
      weight: 1,
      minValue: 0,
      maxValue: type === 'Boost' ? 100 : 24
    }]);
  };

  const updateItem = (id: number, field: keyof BoostDecayItem, value: any) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  if (type === 'Decay') {
    // Time Decay specific UI
    return (
      <div className="space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-sm text-amber-800">
            <strong>⏰ How Time Decay works:</strong> Newer content gets higher relevance scores. 
            Content older than your specified time window will have reduced relevance. 
            Perfect for news, trending topics, or time-sensitive searches.
          </p>
        </div>
        
        {items.map((item) => {
          const hoursOptions = [
            { value: 24, label: '24 hours' },
            { value: 168, label: '1 week' },
            { value: 720, label: '1 month' },
            { value: 2160, label: '3 months' },
            { value: 8760, label: '1 year' }
          ];
          
          const selectedHours = item.maxValue || 168;
          
          // Generate timeline preview
          const timelinePoints = [
            { label: 'Now', percent: 100 },
            { label: '25%', percent: 75 },
            { label: '50%', percent: 50 },
            { label: '75%', percent: 25 },
            { label: 'Limit', percent: 0 }
          ];
          
          return (
            <div key={item.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
              <div className="flex items-center gap-3">
                <select
                  value={item.column}
                  onChange={(e) => updateItem(item.id, 'column', e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-sm"
                >
                  {timeColumns.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
                
                <select
                  value={selectedHours}
                  onChange={(e) => updateItem(item.id, 'maxValue', parseInt(e.target.value))}
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-sm"
                >
                  {hoursOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                
                <button
                  onClick={() => removeItem(item.id)}
                  className="ml-auto text-gray-400 hover:text-red-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Decay strength:</span>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.1"
                  value={item.weight}
                  onChange={(e) => updateItem(item.id, 'weight', parseFloat(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-12 text-right">{item.weight.toFixed(1)}x</span>
              </div>
              
              {/* Visual timeline */}
              <div className="bg-white p-3 rounded border border-gray-200">
                <div className="flex justify-between text-xs text-gray-600 mb-2">
                  <span className="font-medium">Now</span>
                  <span>{hoursOptions.find(o => o.value === selectedHours)?.label}</span>
                </div>
                <div className="relative h-8 bg-gradient-to-r from-blue-500 to-gray-300 rounded">
                  <div className="absolute inset-0 flex justify-between items-center px-2">
                    {timelinePoints.map((point, i) => (
                      <div key={i} className="text-center">
                        <div className="h-3 w-0.5 bg-white mb-1"></div>
                        <span className="text-xs text-white font-medium">{point.percent}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Content relevance decreases over time
                </p>
              </div>
              
              {/* Real-world examples */}
              <div className="bg-blue-50 p-3 rounded-md space-y-1">
                <p className="text-xs font-medium text-blue-900">Impact on search results:</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Posted today:</span>
                    <span className="font-medium text-blue-700">100% relevance (no penalty)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Posted {Math.round(selectedHours/24/2)} days ago:</span>
                    <span className="font-medium text-blue-700">~50% relevance</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Posted {Math.round(selectedHours/24)} days ago:</span>
                    <span className="font-medium text-blue-700">Minimal relevance</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        <div className="text-center">
          <button 
            onClick={addItem}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg border border-blue-200"
          >
            + Add Time Decay
          </button>
        </div>
      </div>
    );
  }

  // Original Numeric Boost UI
  const generateChartData = (item: BoostDecayItem) => {
    const points = [];
    const range = (item.maxValue || 100) - (item.minValue || 0);
    
    for (let i = 0; i <= 50; i++) {
      const x = (item.minValue || 0) + (range * i / 50);
      let y = 0;
      
      if (item.func === 'linear') {
        y = (x / (item.maxValue || 100)) * item.weight;
      } else if (item.func === 'logarithmic') {
        y = Math.log(x + 1) / Math.log((item.maxValue || 100) + 1) * item.weight;
      } else if (item.func === 'quadratic') {
        y = Math.pow(x / (item.maxValue || 100), 2) * item.weight;
      }
      
      points.push({ x, y });
    }
    
    return points;
  };

  const renderChart = (item: BoostDecayItem) => {
    const data = generateChartData(item);
    const maxY = Math.max(...data.map(d => d.y));
    const height = 80;
    const width = 200;
    
    // Example values to show impact
    const exampleValues = [
      { value: item.minValue || 0, label: 'Low' },
      { value: ((item.minValue || 0) + (item.maxValue || 100)) / 2, label: 'Mid' },
      { value: item.maxValue || 100, label: 'High' }
    ];
    
    return (
      <div className="space-y-3">
        <svg width={width} height={height} className="border border-gray-200 rounded">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map(i => (
            <line
              key={i}
              x1={0}
              y1={height - (i * height)}
              x2={width}
              y2={height - (i * height)}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          {/* Chart line */}
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            points={data.map((d, i) => 
              `${(i / (data.length - 1)) * width},${height - (d.y / maxY) * height * 0.9}`
            ).join(' ')}
          />
          
          {/* Axes labels */}
          <text x={5} y={height - 5} className="text-xs fill-gray-500">
            {item.minValue || 0}
          </text>
          <text x={width - 30} y={height - 5} className="text-xs fill-gray-500">
            {item.maxValue || 100}
          </text>
          <text x={5} y={15} className="text-xs fill-gray-500">
            {maxY.toFixed(1)}x
          </text>
        </svg>
        
        {/* Real-world impact examples */}
        <div className="bg-blue-50 p-3 rounded-md space-y-2">
          <p className="text-xs font-medium text-blue-900">How this affects search results:</p>
          <div className="space-y-1">
            {exampleValues.map(ex => {
              let boost = 0;
              const normalizedValue = ex.value / (item.maxValue || 100);
              
              if (item.func === 'linear') {
                boost = normalizedValue * item.weight;
              } else if (item.func === 'logarithmic') {
                boost = Math.log(ex.value + 1) / Math.log((item.maxValue || 100) + 1) * item.weight;
              } else if (item.func === 'quadratic') {
                boost = Math.pow(normalizedValue, 2) * item.weight;
              }
              
              const baseScore = 0.75;
              const boostedScore = Math.min(1, baseScore * (1 + boost));
              const percentIncrease = ((boostedScore / baseScore - 1) * 100).toFixed(0);
              
              return (
                <div key={ex.label} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">
                    {item.column} = {ex.value} ({ex.label}):
                  </span>
                  <span className="font-medium text-blue-700">
                    +{percentIncrease}% relevance
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-gray-600 italic">
            {item.func === 'linear' && "Equal boost for each unit increase"}
            {item.func === 'logarithmic' && "Big boost for low values, diminishing returns for high values"}
            {item.func === 'quadratic' && "Exponential boost - high values get massive boost"}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
        <p className="text-sm text-amber-800">
          <strong>💡 How Numeric Boosts work:</strong> Products with higher values in the selected column will appear higher in search results. 
          For example, boosting by RATING means a 5-star product will rank higher than a 3-star product, even if they have similar text relevance.
        </p>
      </div>
      
      {items.map((item) => (
        <div key={item.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
          <div className="flex items-center gap-3">
            <select
              value={item.column}
              onChange={(e) => updateItem(item.id, 'column', e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm"
            >
              {numericColumns.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
            
            <select
              value={item.func}
              onChange={(e) => updateItem(item.id, 'func', e.target.value as 'linear' | 'logarithmic' | 'quadratic')}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm"
            >
              <option value="linear">Linear</option>
              <option value="logarithmic">Logarithmic</option>
              <option value="quadratic">Quadratic</option>
            </select>
            
            <button
              onClick={() => removeItem(item.id)}
              className="ml-auto text-gray-400 hover:text-red-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Weight:</span>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={item.weight}
              onChange={(e) => updateItem(item.id, 'weight', parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm font-medium w-12 text-right">{item.weight.toFixed(1)}x</span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Range:</span>
            <input
              type="number"
              value={item.minValue}
              onChange={(e) => updateItem(item.id, 'minValue', parseFloat(e.target.value))}
              placeholder="Min"
              className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm"
            />
            <span className="text-gray-500">to</span>
            <input
              type="number"
              value={item.maxValue}
              onChange={(e) => updateItem(item.id, 'maxValue', parseFloat(e.target.value))}
              placeholder="Max"
              className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm"
            />
          </div>
          
          {/* Range explanation */}
          <div className="bg-gray-50 border border-gray-200 rounded p-2">
            <p className="text-xs text-gray-600">
              <strong>Range defines boost boundaries:</strong> Values below {item.minValue || 0} get no boost, 
              values above {item.maxValue || 100} get maximum boost ({item.weight.toFixed(1)}x), 
              and values in between scale based on the {item.func} function.
            </p>
          </div>
          
          <div className="flex justify-center pt-2">
            {renderChart(item)}
          </div>
        </div>
      ))}
      
      <div className="text-center">
        <button 
          onClick={addItem}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg border border-blue-200"
        >
          + Add {type}
        </button>
      </div>
    </div>
  );
};

interface SaveConfigModalProps {
  onClose: () => void;
  onSave: (name: string, isDefault: boolean) => void;
}

const SaveConfigModal = ({ onClose, onSave }: SaveConfigModalProps) => {
  const [name, setName] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-medium mb-4">Save Configuration</h3>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Configuration name (e.g., 'E-commerce Boost')"
          className="w-full px-3 py-2 border rounded-md mb-4"
        />
        <div className="flex items-center mb-4">
          <input
            id="is-default"
            type="checkbox"
            checked={isDefault}
            onChange={e => setIsDefault(e.target.checked)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="is-default" className="ml-2 text-sm">
            Set as active configuration
          </label>
        </div>
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 border rounded-md hover:bg-gray-50">Cancel</button>
          <button 
            onClick={() => name.trim() && onSave(name.trim(), isDefault)} 
            disabled={!name.trim()}
            className={`px-4 py-2 rounded-md ${
              name.trim() 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaygroundPage;