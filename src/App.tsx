import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import NewServicePage from './components/NewServicePage.tsx';
import SelectDataPage from './components/SelectDataPage.tsx';
import ChooseProcessingPipelinePage from './components/ChooseProcessingPipelinePage.tsx';
import SelectSearchColumnPage from './components/SelectSearchColumnPage.tsx';
import SelectAttributesPage from './components/SelectAttributesPage.tsx';
import SelectReturnColumnsPage from './components/SelectReturnColumnsPage.tsx';
import ConfigureIndexingPage from './components/ConfigureIndexingPage.tsx';
import ServiceLandingPage from './components/ServiceLandingPage.tsx';
import PlaygroundPage from './components/PlaygroundPage.tsx';
import CommentSystem from './components/CommentSystem.tsx';
import GitHubAuth from './components/GitHubAuth.tsx';
import Navbar from './components/Navbar.tsx';
import './App.css';


export interface WizardData {
  // Step 1: New service
  serviceName: string;
  database: string;
  schema: string;
  warehouse: string;
  
  // Step 2: Select data source
  dataSourceType: 'table' | 'stage' | null;
  stagePath: string;
  selectedTable: string;
  selectedFiles: string[];
  enableIncrementalUpdates: boolean;
  
  // Step 3 (Table Flow): Select search columns
  searchColumns: { name: string; isText: boolean; isVector: boolean; }[];

  // Step 4 (Table Flow): Select attribute columns
  attributeColumns: string[];

  // Step 5 (Table Flow): Select columns to return
  returnColumns: string[];

  // Step 4 (Stage Flow): Generated Table Destination
  generatedTableDatabase: string;
  generatedTableSchema: string;

  // Step 3 (Stage Flow): Choose processing pipeline
  pipelineType: 'visual' | 'text' | null;
  advancedDualVector: boolean;
  advancedHeadingChunk: boolean;
  
  // Step 4: Select metadata
  includeMetadata: string[];
  
  // Step 5: Configure indexing
  targetLag: string;
  embeddingModel: string;
  indexingWarehouse: string;
}

const initialWizardData: WizardData = {
  serviceName: '',
  database: '',
  schema: '',
  warehouse: '',
  dataSourceType: null,
  stagePath: '',
  selectedTable: '',
  selectedFiles: [],
  enableIncrementalUpdates: false,
  searchColumns: [],
  attributeColumns: [],
  returnColumns: [],
  pipelineType: null,
  advancedDualVector: false,
  advancedHeadingChunk: false,
  includeMetadata: [],
  targetLag: '1 hour',
  embeddingModel: 'snowflake-arctic-embed-m-v1.5',
  indexingWarehouse: '',
  generatedTableDatabase: '',
  generatedTableSchema: ''
};


function App() {
  const [githubUser, setGithubUser] = useState<any>(null);
  const [githubToken, setGithubToken] = useState<string>('');

  // Load GitHub user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('github-user');
    const savedToken = localStorage.getItem('github-token');
    if (savedUser && savedToken) {
      setGithubUser(JSON.parse(savedUser));
      setGithubToken(savedToken);
    }
  }, []);

  const handleAuthSuccess = (user: any, token: string) => {
    setGithubUser(user);
    setGithubToken(token);
  };

  return (
    <>
      <Navbar>
        <GitHubAuth onAuthSuccess={handleAuthSuccess} />
      </Navbar>
      <div style={{ paddingTop: '72px' }}> {/* Adjusted padding for h-16 navbar */}
        <Routes>
          <Route path="/" element={<Wizard />} />
          <Route path="/service/:serviceName" element={<ServiceLandingPage />} />
          <Route path="/service/:serviceName/playground" element={<PlaygroundPage />} />
        </Routes>
      </div>
      <CommentSystem 
        githubUser={githubUser}
        githubToken={githubToken}
      />
    </>
  );
}

function Wizard() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>(initialWizardData);

  const updateWizardData = (updates: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...updates }));
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  // Get dynamic steps based on data source type
  const getSteps = () => {
    const baseSteps = [
      { id: 1, name: 'New service', completed: currentStep > 1 },
      { id: 2, name: 'Select data', completed: currentStep > 2 }
    ];

    if (wizardData.dataSourceType === 'stage') {
      return [
        ...baseSteps,
        { id: 3, name: 'Choose processing pipeline', completed: currentStep > 3 },
        { id: 4, name: 'Configure indexing', completed: currentStep > 4 }
      ];
    } else if (wizardData.dataSourceType === 'table') {
      return [
        ...baseSteps,
        { id: 3, name: 'Select search columns', completed: currentStep > 3 },
        { id: 4, name: 'Select attributes', completed: currentStep > 4 },
        { id: 5, name: 'Select columns to return', completed: currentStep > 5 },
        { id: 6, name: 'Configure indexing', completed: currentStep > 6 }
      ];
    }

    // Default steps when no data source is selected
    return baseSteps;
  };

  const steps = getSteps();
  const totalSteps = steps.length;

  const canGoNext = () => {
    switch (currentStep) {
      case 1:
        return !!(wizardData.serviceName && wizardData.database && wizardData.schema && wizardData.warehouse);
      case 2:
        return wizardData.dataSourceType === 'table' ? !!wizardData.selectedTable : wizardData.selectedFiles.length > 0;
      case 3:
        if (wizardData.dataSourceType === 'stage') {
          return !!(wizardData.pipelineType && wizardData.generatedTableDatabase && wizardData.generatedTableSchema);
        }
        return wizardData.searchColumns.length > 0;
      case 4:
        if (wizardData.dataSourceType === 'stage') {
          // Removed indexingWarehouse from this check
          return !!(wizardData.targetLag && wizardData.embeddingModel);
        }
        return wizardData.attributeColumns.length > 0;
      case 5:
        return wizardData.returnColumns.length > 0;
      case 6:
        return !!(wizardData.targetLag && wizardData.embeddingModel && wizardData.indexingWarehouse);
      default:
        return false;
    }
  };

  const handleCreateService = () => {
    // Here you would typically make an API call to create the service
    console.log('Creating service with data:', wizardData);
    const serviceName = wizardData.serviceName || 'new-service';
    navigate(`/service/${encodeURIComponent(serviceName)}`);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <NewServicePage data={wizardData} onUpdate={updateWizardData} />;
      case 2:
        return <SelectDataPage data={wizardData} onUpdate={updateWizardData} />;
      case 3:
        if (wizardData.dataSourceType === 'table') {
          return <SelectSearchColumnPage data={wizardData} onUpdate={updateWizardData} />;
        } else if (wizardData.dataSourceType === 'stage') {
          return <ChooseProcessingPipelinePage data={wizardData} onUpdate={updateWizardData} />;
        }
        // Fallback - shouldn't happen with proper navigation
        return <div>Please select a data source type</div>;
      case 4:
        if (wizardData.dataSourceType === 'table') {
          return <SelectAttributesPage data={wizardData} onUpdate={updateWizardData} />;
        } else if (wizardData.dataSourceType === 'stage') {
          return <ConfigureIndexingPage data={wizardData} onUpdate={updateWizardData} />;
        }
        return <div>Please select a data source type</div>;
      case 5:
        if (wizardData.dataSourceType === 'table') {
          return <SelectReturnColumnsPage data={wizardData} onUpdate={updateWizardData} />;
        }
        return <div>Please select a data source type</div>;
      case 6:
        if (wizardData.dataSourceType === 'table') {
          return <ConfigureIndexingPage data={wizardData} onUpdate={updateWizardData} />;
        }
        return <div>Please select a data source type</div>;
      default:
        return <NewServicePage data={wizardData} onUpdate={updateWizardData} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 bg-gray-50 border-r border-gray-200 p-6">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900">Create Search Service</h2>
          </div>
          
          <nav className="space-y-1">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center p-3 rounded-md cursor-pointer transition-colors ${
                  step.id === currentStep
                    ? 'bg-blue-50 border border-blue-200'
                    : step.completed
                    ? 'hover:bg-gray-100'
                    : 'text-gray-400'
                }`}
                onClick={() => step.completed || step.id <= currentStep ? goToStep(step.id) : null}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium mr-3 ${
                  step.id === currentStep
                    ? 'bg-blue-600 text-white'
                    : step.completed
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {step.completed ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>
                <span className={`text-sm font-medium ${
                  step.id === currentStep
                    ? 'text-blue-900'
                    : step.completed
                    ? 'text-gray-900'
                    : 'text-gray-400'
                }`}>
                  {step.name}
                </span>
              </div>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 p-8 overflow-y-auto">
            {renderCurrentStep()}
          </div>

          {/* Bottom Navigation */}
          <div className="border-t border-gray-200 px-8 py-4 flex justify-between items-center bg-gray-50">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Cancel
            </button>
            
            <div className="flex space-x-3">
              {currentStep > 1 && (
                <button
                  onClick={() => goToStep(currentStep - 1)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
                >
                  Previous: {steps[currentStep - 2]?.name}
                </button>
              )}
              
              <button
                onClick={() => {
                  if (currentStep < totalSteps) {
                    goToStep(currentStep + 1);
                  } else {
                    handleCreateService();
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!canGoNext()}
              >
                {currentStep === totalSteps ? 'Create Search Service' : `Next: ${steps[currentStep]?.name || ''}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 