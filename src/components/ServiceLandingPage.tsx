import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CheckIcon = () => (
  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const ServiceLandingPage = () => {
  const { serviceName } = useParams<{ serviceName: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'INITIALIZING' | 'ACTIVE'>('INITIALIZING');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('ACTIVE');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handlePlaygroundClick = () => {
    if (status === 'ACTIVE') {
      navigate(`/service/${serviceName}/playground`);
    }
  };

  const columns = [
    { name: 'CONTENT', searchable: true, attribute: false },
    { name: 'DOC_ID', searchable: false, attribute: true },
    { name: 'TITLE', searchable: false, attribute: true },
    { name: 'CATEGORY', searchable: false, attribute: true },
  ];

  const pythonCode = `import os
from snowflake.core import Root
from snowflake.snowpark import Session

CONNECTION_PARAMETERS = {
  ...
}`;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col text-sm text-gray-800">
      {/* Top Header */}
      <div className="bg-white border-b px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button onClick={() => navigate('/')} className="text-gray-500 hover:bg-gray-100 p-1 rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <span className="text-gray-800 font-medium">Cortex Search</span>
          <span className="text-gray-500">/</span>
          <span className="text-gray-800 font-medium">{serviceName}</span>
          <span className="px-2 py-0.5 text-xs font-semibold text-blue-700 bg-blue-100 rounded-md align-middle">PREVIEW</span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePlaygroundClick}
            disabled={status !== 'ACTIVE'}
            className={`px-3 py-1.5 border rounded-md font-medium flex items-center space-x-2 transition-all ${
              status === 'ACTIVE'
                ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                : 'bg-gray-200 text-gray-500 border-gray-200 cursor-not-allowed'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4.555 5.168A6.967 6.967 0 001.05 12c0 3.866 3.134 7 7 7s7-3.134 7-7a6.967 6.967 0 00-3.505-6.832L10 10 4.555 5.168zM10 13a3 3 0 100-6 3 3 0 000 6z"></path></svg>
            <span>Playground</span>
          </button>
          <button className="text-gray-500 hover:bg-gray-100 p-1 rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto bg-white">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-6">
            <a href="#" className="py-2 px-1 border-b-2 font-medium border-blue-600 text-blue-600">Search Service</a>
            <a href="#" className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">Data Preview</a>
            <a href="#" className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">Costs</a>
          </nav>
        </div>

        {/* Service Name */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">ADEY_TEST_DB.TEST</p>
            <h1 className="text-2xl font-semibold text-gray-900">{serviceName}</h1>
          </div>
          <button className="text-gray-500 hover:bg-gray-200 p-2 rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5M20 20v-5h-5M4 4l5 5M20 20l-5-5" /></svg>
          </button>
        </div>

        {/* Columns List */}
        <div className="border rounded-lg mb-6">
          <div className="p-4 border-b">
            <p className="text-xs text-gray-500">Base table</p>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-3 gap-4 border-b pb-2 mb-2">
              <div className="font-medium text-gray-500 text-xs uppercase tracking-wider">Column</div>
              <div className="font-medium text-gray-500 text-xs uppercase tracking-wider text-center">Searchable</div>
              <div className="font-medium text-gray-500 text-xs uppercase tracking-wider text-center">Attribute</div>
            </div>
            <div className="space-y-1">
              {columns.map(col => (
                <div key={col.name} className="grid grid-cols-3 gap-4 items-center p-2 rounded hover:bg-gray-50">
                  <div className="font-medium text-gray-800">{col.name}</div>
                  <div className="flex justify-center">{col.searchable && <CheckIcon />}</div>
                  <div className="flex justify-center">{col.attribute && <CheckIcon />}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 border-t flex items-center space-x-4 text-xs text-gray-600">
            <a href="#" className="flex items-center space-x-1 text-blue-600 hover:text-blue-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              <span>View more columns</span>
            </a>
            <span>•</span>
            <span>6,000 rows</span>
            <span>•</span>
            <a href="#" className="text-blue-600 hover:text-blue-700">View SQL</a>
          </div>
        </div>

        {/* Service Info Grid */}
        <div className="grid grid-cols-4 gap-x-6 gap-y-4 mb-6 text-xs">
          <div><span className="text-gray-500">Serving</span><div className={`mt-1 font-medium ${status === 'ACTIVE' ? 'text-green-600' : 'text-yellow-600'}`}>{status}</div></div>
          <div><span className="text-gray-500">Indexing</span><div className={`mt-1 font-medium ${status === 'ACTIVE' ? 'text-green-600' : 'text-yellow-600'}`}>{status}</div></div>
          <div><span className="text-gray-500">Created on</span><div className="mt-1 font-medium text-gray-900">Jul 2, 2025</div></div>
          <div><span className="text-gray-500">Last updated</span><div className="mt-1 font-medium text-gray-900">2 hours ago</div></div>
          <div><span className="text-gray-500">Warehouse</span><div className="mt-1 font-medium text-gray-900">ADEY_TEST</div></div>
          <div><span className="text-gray-500">Target lag</span><div className="mt-1 font-medium text-gray-900">1 day</div></div>
          <div className="col-span-2"><span className="text-gray-500">Embedding model</span><div className="mt-1 font-medium text-gray-900">snowflake-arctic-embed-m-v1.5</div></div>
        </div>

        {/* Service Query URL */}
        <div className="space-y-1 mb-6">
          <label className="text-xs text-gray-500">Service query URL</label>
          <div className="flex items-center bg-gray-100 p-2 rounded-md border">
            <span className="font-mono text-gray-700 flex-1 truncate text-xs">pm-pm-aws-us-west-2.snowflakecomputing.com/api/v2/databases/adey_test_db/schemas/test/cortex-search-services/adey_svc_1:query</span>
            <button className="text-gray-500 hover:bg-gray-200 p-1 rounded">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            </button>
          </div>
        </div>

        {/* Code Snippet */}
        <div className="border rounded-lg">
          <div className="flex items-center border-b">
            <button className="py-2 px-4 text-sm font-medium border-b-2 border-blue-600 text-blue-600">Python</button>
            <button className="py-2 px-4 text-sm font-medium text-gray-500 hover:text-gray-700">cURL</button>
          </div>
          <div className="p-4">
            <pre className="bg-gray-50 p-3 rounded-md overflow-x-auto relative">
              <code className="text-xs font-mono whitespace-pre-wrap">{pythonCode}</code>
              <button className="absolute top-2 right-2 text-gray-500 hover:bg-gray-200 p-1 rounded">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              </button>
            </pre>
          </div>
          <div className="p-4 border-t">
            <a href="#" className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700">
              <span>Show more</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceLandingPage; 