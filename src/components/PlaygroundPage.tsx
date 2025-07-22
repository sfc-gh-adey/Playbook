import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PlaygroundPage = () => {
  const { serviceName } = useParams<{ serviceName: string }>();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(10);
  const [columns, setColumns] = useState(['CONTENT']);

  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="flex h-[calc(100vh-73px)]">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Search Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className="flex-1 p-6">
            <div className="bg-white rounded-lg shadow h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{serviceName}</h3>
                <p className="text-gray-500">Enter a search query to get started</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Configure Panel */}
        <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900">Configure</h2>
              <button className="text-sm text-blue-600 hover:text-blue-800">
                View code snippet
              </button>
            </div>

            {/* Limit */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Limit
                <span className="ml-1 text-gray-400">○</span>
              </label>
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            {/* Columns */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Columns
                <span className="ml-1 text-gray-400">○</span>
              </label>
              <select
                value={columns[0]}
                onChange={(e) => setColumns([e.target.value])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="CONTENT">CONTENT</option>
                <option value="TITLE">TITLE</option>
                <option value="CATEGORY">CATEGORY</option>
              </select>
            </div>

            {/* Filter JSON */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter JSON
                <span className="ml-1 text-gray-400">○</span>
              </label>
              <textarea
                placeholder='{"categories": ["Finance", "HR"]}'
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                rows={3}
              />
            </div>

            {/* Multi-Index Query */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Multi-Index Query
                <span className="ml-1 text-gray-400">○</span>
              </label>
              <textarea
                placeholder="Enter multi-index query configuration..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                rows={4}
              />
            </div>

            {/* Scoring Config */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scoring Config
                <span className="ml-1 text-gray-400">○</span>
              </label>
              <textarea
                placeholder="Enter scoring configuration..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                rows={4}
              />
            </div>

            {/* Help Text */}
            <div className="text-xs text-gray-500 mt-8">
              <p className="mb-2">
                Find services or tutorials matching scoring configs
                and multi-index queries.{' '}
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  View a guide
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaygroundPage; 