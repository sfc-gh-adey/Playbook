import React from 'react';
import snowflakeLogo from '../assets/snowflake-logo-final.png';

interface NavbarProps {
  children?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ children }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200" style={{ zIndex: 1000 }}>
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left side - Logo and title */}
        <div className="flex items-center">
          {/* Snowflake Logo - includes "Snowflake" text */}
          <img 
            src={snowflakeLogo} 
            alt="Snowflake" 
            className="h-8 w-auto mr-2"
          />
          
          {/* Playbook text */}
          <span className="text-lg font-normal text-gray-600">Playbook</span>
        </div>

        {/* Center - Keyboard shortcut hint */}
        <div className="text-sm text-gray-500 font-mono">
          <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-md">⌘</kbd>
          <span className="mx-1">+</span>
          <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-md">Enter</kbd>
          <span className="ml-2">to toggle comments</span>
        </div>

        {/* Right side - Auth and other controls */}
        <div className="flex items-center space-x-4">
          {children}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 