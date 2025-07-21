import React from 'react';
import { snowflakeClasses } from '../../styles/tokens';

export interface Step {
  number: number;
  id: string;
  title: string;
  completed: boolean;
}

interface WizardShellProps {
  title: string;
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepNumber: number) => void;
  onClose?: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function WizardShell({
  title,
  steps,
  currentStep,
  onStepClick,
  onClose,
  children,
  footer
}: WizardShellProps) {
  return (
    <div className={snowflakeClasses.wizard.container}>
      <div className={snowflakeClasses.wizard.panel}>
        {/* Left Sidebar */}
        <div className={snowflakeClasses.wizard.sidebar}>
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            {onClose && (
              <button
                onClick={onClose}
                className="mt-2 text-sm text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            )}
          </div>
          
          <nav className="space-y-1">
            {steps.map((step) => (
              <div
                key={step.number}
                className={`flex items-center p-3 rounded-md transition-colors ${
                  step.number === currentStep
                    ? 'bg-blue-50 border border-blue-200'
                    : step.completed
                    ? 'bg-green-50 hover:bg-green-100 cursor-pointer'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
                onClick={() => {
                  if (onStepClick && (step.completed || step.number <= currentStep)) {
                    onStepClick(step.number);
                  }
                }}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.number === currentStep
                    ? 'bg-blue-600 text-white'
                    : step.completed
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step.completed ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                <span className={`ml-3 font-medium ${
                  step.number === currentStep
                    ? 'text-blue-900'
                    : step.completed
                    ? 'text-green-900'
                    : 'text-gray-400'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className={snowflakeClasses.wizard.content}>
            {children}
          </div>
          
          {/* Footer */}
          {footer && (
            <div className="border-t border-gray-200 px-8 py-4 bg-gray-50">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 