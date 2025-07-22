import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import NewServicePage from './components/NewServicePage';
import SelectDataPage from './components/SelectDataPage';
import ChooseProcessingPipelinePage from './components/ChooseProcessingPipelinePage';
import SelectSearchColumnPage from './components/SelectSearchColumnPage';

import ConfigureIndexingPage from './components/ConfigureIndexingPage';
import ServiceLandingPage from './components/ServiceLandingPage';
import SelectAttributesPage from './components/SelectAttributesPage';
import SelectReturnColumnsPage from './components/SelectReturnColumnsPage';
import GeneratedSchemaPage from './components/GeneratedSchemaPage';
import PlaygroundPage from './components/PlaygroundPage';
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
  serviceName: 'My Search Service',
  database: 'ADEY_TEST_DB.TEST',
  schema: 'TEST',
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
  return (
    <Routes>
      <Route path="/" element={<Wizard />} />
      <Route path="/service/:serviceName" element={<ServiceLandingPage />} />
      <Route path="/service/:serviceName/playground" element={<PlaygroundPage />} />
    </Routes>
  );
}

function Wizard() {
  const [wizardData, setWizardData] = useState<WizardData>(initialWizardData);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();



  const updateWizardData = (updates: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...updates }));
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const steps = [
    { number: 1, id: 'new-service', title: 'New service', completed: currentStep > 1 },
    { number: 2, id: 'select-data', title: 'Select data', completed: currentStep > 2 },
    { 
      number: 3, 
      id: wizardData.dataSourceType === 'stage' ? 'choose-pipeline' : 'select-search-column', 
      title: wizardData.dataSourceType === 'stage' ? 'Choose Processing Pipeline' : 'Select search column', 
      completed: currentStep > 3 
    },
    { 
      number: 4, 
      id: wizardData.dataSourceType === 'stage' ? 'select-metadata' : 'select-attributes', 
      title: wizardData.dataSourceType === 'stage' ? 'Select metadata' : 'Select attributes', 
      completed: currentStep > 4 
    },
    {
      number: 5,
      id: wizardData.dataSourceType === 'table' ? 'select-return-columns' : 'configure-indexing',
      title: wizardData.dataSourceType === 'table' ? 'Select columns' : 'Configure indexing',
      completed: currentStep > 5
    },
    { 
      number: 6, 
      id: 'configure-indexing', 
      title: 'Configure indexing', 
      completed: currentStep > 6 
    },
  ];

  const getCurrentStepData = () => {
    switch (currentStep) {
      case 1:
        return {
          canGoNext: !!(wizardData.serviceName && wizardData.database && wizardData.schema && wizardData.warehouse),
          nextLabel: 'Next: Select data'
        };
      case 2:
        return {
          canGoNext: wizardData.dataSourceType === 'stage' 
            ? wizardData.selectedFiles.length > 0 
            : wizardData.dataSourceType === 'table' 
            ? !!wizardData.selectedTable 
            : false,
          nextLabel: wizardData.dataSourceType === 'stage' 
            ? 'Next: Choose Processing Pipeline' 
            : 'Next: Select search column'
        };
      case 3:
        if (wizardData.dataSourceType === 'table') {
          return {
            canGoNext: wizardData.searchColumns.length > 0,
            nextLabel: 'Next: Select attributes'
          }
        }
        return {
          canGoNext: wizardData.dataSourceType === 'stage' 
            ? !!wizardData.pipelineType 
            : true, // Table flow doesn't need additional validation on this step
          nextLabel: wizardData.dataSourceType === 'stage' 
            ? 'Next: Select metadata' 
            : 'Next: Select attributes'
        };
      case 4:
        if (wizardData.dataSourceType === 'stage') {
          // The schema page is read-only, so we can always proceed.
          return { canGoNext: true, nextLabel: 'Next: Configure indexing' };
        }
        return {
          canGoNext: wizardData.attributeColumns.length > 0,
          nextLabel: 'Next: Select columns'
        };
      case 5:
        if (wizardData.dataSourceType === 'table') {
          return {
            canGoNext: wizardData.returnColumns.length > 0,
            nextLabel: 'Next: Configure indexing'
          }
        }
        return {
          canGoNext: !!(wizardData.targetLag && wizardData.embeddingModel && wizardData.indexingWarehouse),
          nextLabel: 'Create Search Service'
        };
      case 6:
        return {
          canGoNext: !!(wizardData.targetLag && wizardData.embeddingModel && wizardData.indexingWarehouse),
          nextLabel: 'Create Search Service'
        };
      default:
        return { canGoNext: false, nextLabel: 'Next' };
    }
  };

  const { canGoNext, nextLabel } = getCurrentStepData();

  const handleCreateService = () => {
    // Here you would typically make an API call to create the service
    console.log('Creating service with data:', wizardData);
    const serviceName = wizardData.serviceName || 'new-service';
    navigate(`/service/${encodeURIComponent(serviceName)}`);
  };

  const totalSteps = wizardData.dataSourceType === 'table' ? 6 : 5;

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
                key={step.number}
                className={`flex items-center p-3 rounded-md cursor-pointer transition-colors ${
                  step.number === currentStep
                    ? 'bg-blue-50 border border-blue-200'
                    : step.completed
                    ? 'hover:bg-gray-100'
                    : 'text-gray-400'
                }`}
                onClick={() => step.completed || step.number <= currentStep ? goToStep(step.number) : null}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium mr-3 ${
                  step.number === currentStep
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
                    step.number
                  )}
                </div>
                <span className={`text-sm font-medium ${
                  step.number === currentStep
                    ? 'text-blue-900'
                    : step.completed
                    ? 'text-gray-900'
                    : 'text-gray-400'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 p-8 overflow-y-auto">
            {currentStep === 1 && (
              <NewServicePage
                data={wizardData}
                onUpdate={updateWizardData}
              />
            )}
            {currentStep === 2 && (
              <SelectDataPage
                data={wizardData}
                onUpdate={updateWizardData}
              />
            )}
            {currentStep === 3 && wizardData.dataSourceType === 'stage' && (
              <ChooseProcessingPipelinePage
                data={wizardData}
                onUpdate={updateWizardData}
              />
            )}
            {currentStep === 3 && wizardData.dataSourceType === 'table' && (
              <SelectSearchColumnPage
                data={wizardData}
                onUpdate={updateWizardData}
              />
            )}
            {currentStep === 4 && wizardData.dataSourceType === 'table' && (
              <SelectAttributesPage
                data={wizardData}
                onUpdate={updateWizardData}
              />
            )}
            {currentStep === 5 && wizardData.dataSourceType === 'table' && (
              <SelectReturnColumnsPage
                data={wizardData}
                onUpdate={updateWizardData}
              />
            )}
            {currentStep === 4 && wizardData.dataSourceType === 'stage' && (wizardData.pipelineType === 'visual' || wizardData.pipelineType === 'text') && (
              <GeneratedSchemaPage
                data={wizardData}
                onUpdate={updateWizardData}
              />
            )}
            {currentStep === 5 && wizardData.dataSourceType === 'stage' && (
              <ConfigureIndexingPage
                data={wizardData}
                onUpdate={updateWizardData}
              />
            )}
            {currentStep === 6 && wizardData.dataSourceType === 'table' && (
              <ConfigureIndexingPage
                data={wizardData}
                onUpdate={updateWizardData}
              />
            )}
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
                  Previous: {steps[currentStep - 2]?.title}
                </button>
              )}
              
              <button
                onClick={() => {
                  const finalStep = wizardData.dataSourceType === 'table' ? 6 : 5;
                  if (currentStep < finalStep) {
                    goToStep(currentStep + 1);
                  } else {
                    handleCreateService();
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!canGoNext}
              >
                {nextLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 