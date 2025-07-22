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

const mockResultsB: SearchResult[] = [
  {
    DOC_ID: "doc-xyz-789",
    TITLE: "Financial_Report_Q1_2024.pdf",
    CONTENT: "The company's net revenue increased by 15% year-over-year, driven by strong performance in the cloud services division.",
    CATEGORY: "Finance",
    PRICE: null,
    RATING: null,
    DATE: "2024-04-25",
    REGION: "Global",
    AGENT_ID: null,
    SOURCE_FILENAME: "Financial_Report_Q1_2024.pdf",
    PAGE_NUMBER: 12,
    SCORE: 0.95,
    source_type: 'PDF',
    score_components: {
      'CONTENT (vector)': 0.8,
      'TITLE (text)': 0.1,
      'freshness (decay)': 0.05
    }
  },
  {
    DOC_ID: "doc-abc-123",
    TITLE: "Marketing_Strategy_2025.pdf",
    CONTENT: "Our new marketing campaign will focus on social media engagement and influencer partnerships to target a younger demographic.",
    CATEGORY: "Marketing",
    PRICE: null,
    RATING: null,
    DATE: "2024-05-10",
    REGION: "Global",
    AGENT_ID: null,
    SOURCE_FILENAME: "Marketing_Strategy_2025.pdf",
    PAGE_NUMBER: 2,
    SCORE: 0.81,
    source_type: 'PDF',
    score_components: {
      'CONTENT (vector)': 0.7,
      'TITLE (text)': 0.05,
      'freshness (decay)': 0.06
    }
  }
];

const availableServices = [
  'CHAT_CUSTOMER_TEST_CSS_A',
  'CHAT_CUSTOMER_TEST_CSS_B',
  'PRODUCT_CATALOG_V1',
  'FINANCIAL_DOCS_SERVICE',
];

const allColumns = [
  { name: 'CONTENT', type: 'Search column' },
  { name: 'DOC_ID', type: 'Attribute column' },
  { name: 'TITLE', type: 'Attribute column' },
  { name: 'CATEGORY', type: 'Attribute column' },
  { name: 'SUBCATEGORY', type: 'Attribute column' },
  { name: 'AUTHORS', type: 'Attribute column' },
  { name: 'BRAND', type: 'Attribute column' },
  { name: 'PRICE', type: 'Attribute column' },
  { name: 'RATING', type: 'Attribute column' },
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
  value: string;
  negate: boolean;
}

const PlaygroundPage = () => {
  const { serviceName } = useParams<{ serviceName: string }>();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Query');
  const [comparisonServices, setComparisonServices] = useState([serviceName || 'CHAT_CUSTOMER_TEST_CSS_A']);
  const [results, setResults] = useState<any[][]>([[]]);
  const [explainResult, setExplainResult] = useState<any | null>(null);
  
  // State for all configurable parameters
  const [limit, setLimit] = useState(10);
  const [selectedColumns, setSelectedColumns] = useState(['TITLE', 'CONTENT']);
  const [columnWeights, setColumnWeights] = useState<{ [key: string]: number }>({ CONTENT: 1, TITLE: 1 });
  const [techniqueBalance, setTechniqueBalance] = useState(50);
  const [logicalOperator, setLogicalOperator] = useState<'@and' | '@or'>('@and');
  const [activeConfig, setActiveConfig] = useState('Default');
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [filters, setFilters] = useState<Filter[]>([
    { id: 1, column: 'CATEGORY', operator: '@eq', value: 'Technology', negate: false }
  ]);
  
  const handleSearch = async () => {
    // This is now a simplified, local search simulation
    const newResults = comparisonServices.map(service => {
      let mockData = service === 'CHAT_CUSTOMER_TEST_CSS_B' ? mockResultsB : mockResultsA;

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
    handleSearch();
  }, [comparisonServices, limit]);
  
  const renderResults = (serviceResults: any[], serviceName: string) => {
    const serviceTitle = serviceName === 'CHAT_CUSTOMER_TEST_CSS_A' ? 'Customer Support Search' : 'Financial Document Search';
    if (serviceResults.length === 0) {
      return <div className="p-4 text-center text-gray-500">No results for {serviceTitle}.</div>;
    }
    return serviceResults.map(result => <ResultCard key={result.DOC_ID} result={result} columns={selectedColumns} onExplain={setExplainResult} />);
  };

  const isCompareView = comparisonServices.length > 1;

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
                {comparisonServices.map((service, index) => (
                  <React.Fragment key={service}>
                    <ServiceSelector 
                      service={service} 
                      setService={(newService) => {
                        const newServices = [...comparisonServices];
                        newServices[index] = newService;
                        setComparisonServices(newServices);
                      }} 
                      label={String.fromCharCode(65 + index)} 
                    />
                    {index < comparisonServices.length - 1 && <span className="text-gray-400">vs.</span>}
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

          {/* Results Area */}
          <div className={`flex-1 flex overflow-y-auto`}>
            {comparisonServices.map((service, index) => (
              <div 
                key={service} 
                className={`p-6 space-y-4 ${isCompareView ? 'border-r' : 'max-w-4xl mx-auto w-full'}`}
                style={{ width: `${100 / comparisonServices.length}%` }}
              >
                {results[index] && results[index].length > 0 
                  ? renderResults(results[index], service) 
                  : <InitialState serviceName={service} />
                }
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar - Configure Panel */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <nav className="flex space-x-2">
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
              />
            </div>
            <div className={activeTab === 'Compare' ? 'block' : 'hidden'}>
              <ComparePanel 
                services={comparisonServices} 
                setServices={setComparisonServices} 
              />
            </div>
          </div>
        </div>
      </div>
      <ExplainPanel result={explainResult} onClose={() => setExplainResult(null)} />
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

const InitialState = ({ serviceName }: { serviceName: string }) => (
  <div className="h-full flex items-center justify-center text-center">
    <div>
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{serviceName}</h3>
      <p className="text-gray-500 text-sm">Enter a search query to see results.</p>
    </div>
  </div>
);

const ResultCard = ({ result, columns, onExplain }: { result: any, columns: string[], onExplain: (result: any) => void }) => {
  if (!result) return null;

  const score = result.SCORE ?? 0;
  const scoreComponents = result.score_components || {};
  const totalScore = Object.values(scoreComponents).reduce((sum: number, s: any) => sum + s, 0) || 1;
  const rank = result.rank || '-';
  const sourceType = result.source_type || 'Unknown';
  const sourceId = sourceType === 'PDF'
    ? `Source: ${result.SOURCE_FILENAME || 'N/A'} (Page ${result.PAGE_NUMBER || 'N/A'})`
    : `AGENT_ID: ${result.AGENT_ID || 'N/A'}`;

  return (
    <div className="border-b border-gray-200 py-4">
      <div className="flex items-start space-x-4">
        <span className="text-gray-500 text-sm font-medium pt-1">{rank}.</span>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <p className="text-xs text-gray-500 font-semibold mb-2">{sourceId}</p>
            <div className="text-right">
              <span className="text-lg font-bold text-gray-700">{score.toFixed(2)}</span>
              <div className="flex h-1.5 w-24 mt-1 rounded-full overflow-hidden bg-gray-200">
                <div style={{ width: `${((scoreComponents['CONTENT (text)'] || scoreComponents['CONTENT (vector)'] || 0) / totalScore) * 100}%` }} className="bg-blue-500" title="Content Score"></div>
                <div style={{ width: `${((scoreComponents['TITLE (text)'] || 0) / totalScore) * 100}%` }} className="bg-green-500" title="Title Score"></div>
                <div style={{ width: `${((scoreComponents['RATING (boost)'] || scoreComponents['freshness (decay)'] || 0) / totalScore) * 100}%` }} className="bg-purple-500" title="Boost/Decay"></div>
              </div>
            </div>
          </div>

          <div className="space-y-3 mt-2">
            {columns.map(colName => {
              if (result[colName]) {
                return (
                  <div key={colName}>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{colName}</p>
                    <p className="text-sm text-gray-800 mt-1">{result[colName]}</p>
                  </div>
                );
              }
              return null;
            })}
            <div className="mt-2">
              <button className="text-xs text-blue-600 hover:underline" onClick={() => onExplain(result)}>Explain</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const QueryPanel = ({ limit, setLimit, selectedColumns, setSelectedColumns, filters, setFilters, logicalOperator, setLogicalOperator }: QueryPanelProps) => {
  const [isColumnSelectorOpen, setIsColumnSelectorOpen] = useState(false);
  const allColumns = ['DOC_ID', 'TITLE', 'CONTENT', 'CATEGORY', 'PRICE', 'RATING', 'DATE', 'REGION', 'AGENT_ID'];

  const handleFilterChange = (index: number, field: keyof Filter, value: any) => {
    const newFilters = filters.map((filter, i) => {
      if (i === index) {
        return { ...filter, [field]: value };
      }
      return filter;
    });
    setFilters(newFilters);
  };

  const addFilter = () => {
    setFilters([...filters, { id: Date.now(), column: 'CATEGORY', operator: '@eq', value: 'Electronics', negate: false }]);
  };

  const removeFilter = (id: number) => {
    setFilters(filters.filter(f => f.id !== id));
  };
  
  const generatedJson = () => {
    const filterClauses = filters.map(f => {
      const clause = { [f.operator]: { [f.column]: f.value } };
      return f.negate ? { "@not": clause } : clause;
    });

    if (filterClauses.length === 0) return '';
    if (filterClauses.length === 1) {
      return JSON.stringify(filterClauses[0], null, 2);
    }
    return JSON.stringify({ [logicalOperator]: filterClauses }, null, 2);
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
              <div key={index} className="flex items-center space-x-2">
                <button 
                  onClick={() => handleFilterChange(index, 'negate', !filter.negate)}
                  className={`w-12 px-2 py-1 text-xs rounded ${filter.negate ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                >
                  {filter.negate ? 'NOT' : 'IS'}
                </button>
                <select 
                  value={filter.column}
                  onChange={e => handleFilterChange(index, 'column', e.target.value)}
                  className="w-1/3 px-2 py-1 border border-gray-300 rounded-md text-sm"
                >
                  <option>CATEGORY</option>
                  <option>BRAND</option>
                  <option>PRICE</option>
                  <option>RATING</option>
                </select>
                <select 
                  value={filter.operator}
                  onChange={e => handleFilterChange(index, 'operator', e.target.value)}
                  className="w-1/4 px-2 py-1 border border-gray-300 rounded-md text-sm"
                >
                  <option>@eq</option>
                  <option>@contains</option>
                  <option>@gte</option>
                  <option>@lte</option>
                </select>
                <input
                  type="text"
                  value={filter.value}
                  onChange={e => handleFilterChange(index, 'value', e.target.value)}
                  className="w-1/3 px-2 py-1 border border-gray-300 rounded-md text-sm"
                />
                <button onClick={() => removeFilter(filter.id)} className="text-gray-400 hover:text-red-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
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
}

const TuningPanel = ({ columnWeights, setColumnWeights, techniqueBalance, setTechniqueBalance, activeConfig, setActiveConfig }: TuningPanelProps) => {
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Relevance Tuning</h3>
      </div>
      <div className="space-y-4">
        <AccordionItem
          title="Column Weights"
          description="Boost the importance of a match in certain columns."
        >
          <div className="space-y-4">
            <ColumnWeightSlider column="CONTENT" weight={columnWeights['CONTENT']} setWeight={val => setColumnWeights({...columnWeights, 'CONTENT': val})} />
            <ColumnWeightSlider column="TITLE" weight={columnWeights['TITLE']} setWeight={val => setColumnWeights({...columnWeights, 'TITLE': val})} />
            <ColumnWeightSlider column="CATEGORY" weight={columnWeights['CATEGORY']} setWeight={val => setColumnWeights({...columnWeights, 'CATEGORY': val})} />
          </div>
        </AccordionItem>
        <AccordionItem
          title="Technique Balance"
          description="Adjust the balance between keyword and semantic search."
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
      <div className="mt-6 pt-6 border-t space-y-3">
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
            console.log(`Saving config: ${name}, is default: ${isDefault}`);
            if (isDefault) {
              setActiveConfig(name);
            }
            setIsSaveModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

const ComparePanel = ({ services, setServices }: { services: string[], setServices: (services: string[]) => void }) => {
  const addService = (serviceToAdd: string) => {
    if (services.length < 3 && !services.includes(serviceToAdd)) {
      setServices([...services, serviceToAdd]);
    }
  };

  const removeService = (serviceToRemove: string) => {
    if (services.length > 1) {
      setServices(services.filter(s => s !== serviceToRemove));
    }
  };

  const unusedServices = availableServices.filter(s => !services.includes(s));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Service Comparison</h3>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">Services to Compare</label>
        <div className="mt-2 space-y-2">
          {services.map((service, index) => (
            <div key={service} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
              <span className="text-sm font-medium text-gray-800">{String.fromCharCode(65 + index)}: {service}</span>
              {services.length > 1 && (
                <button onClick={() => removeService(service)} className="text-gray-400 hover:text-red-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      {services.length < 3 && (
        <div className="pt-4 border-t">
          <label className="text-sm font-medium text-gray-700">Add another service</label>
          <div className="flex items-center space-x-2 mt-2">
            <select
              onChange={e => addService(e.target.value)}
              className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm"
              value=""
            >
              <option value="" disabled>Select a service...</option>
              {unusedServices.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
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

const ExplainPanel = ({ result, onClose }: { result: any, onClose: () => void }) => {
  if (!result) return null;

  const score = result.SCORE ?? 0;
  const scoreComponents = result.score_components || {};

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl z-20 p-6 border-l flex flex-col">
      <div className="flex items-center justify-between pb-4 border-b">
        <h3 className="text-lg font-medium">Explain Score</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
      </div>
      <div className="py-4 space-y-2">
        <div>
          <span className="font-semibold">DOC_ID:</span> {result.DOC_ID || 'N/A'}
        </div>
        <div>
          <span className="font-semibold">Final Score:</span> {score.toFixed(2)}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left bg-gray-50">
              <th className="p-2 font-medium">Component</th>
              <th className="p-2 font-medium">Score</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(scoreComponents).map(([key, value]) => (
              <tr key={key} className="border-b">
                <td className="p-2">{key}</td>
                <td className="p-2 font-mono">{(value as number).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface BoostDecayItem {
  column: string;
  func: 'linear' | 'logarithmic' | 'quadratic';
  start: number;
  end: number;
  weight: number;
}

const BoostDecayConfigurator = ({ type }: { type: 'Boost' | 'Decay' }) => {
  const [items, setItems] = useState<BoostDecayItem[]>([]);

  const addItem = () => {
    setItems([...items, { column: 'RATING', func: 'linear', start: 0, end: 5, weight: 1 }]);
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="p-2 bg-gray-100 rounded-md border">
          <p className="text-sm font-medium">{item.column} ({item.func})</p>
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
          <button onClick={onClose} className="px-4 py-2 border rounded-md">Cancel</button>
          <button onClick={() => onSave(name, isDefault)} className="px-4 py-2 bg-blue-600 text-white rounded-md">Save</button>
        </div>
      </div>
    </div>
  );
};

export default PlaygroundPage; 