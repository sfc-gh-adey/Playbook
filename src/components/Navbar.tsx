import React from 'react';

interface NavbarProps {
  children?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ children }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200" style={{ zIndex: 1000 }}>
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left side - Logo and title */}
        <div className="flex items-center space-x-3">
          {/* Snowflake Logo */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(16, 16)">
              {/* Center diamond */}
              <rect x="-3" y="-3" width="6" height="6" transform="rotate(45 0 0)" fill="#29B5E8"/>
              
              {/* Top/Bottom arrows */}
              <path d="M -4 -16 L 0 -10 L 4 -16 Z" fill="#29B5E8"/>
              <path d="M -4 16 L 0 10 L 4 16 Z" fill="#29B5E8"/>
              
              {/* Left/Right arrows */}
              <path d="M -16 -4 L -10 0 L -16 4 Z" fill="#29B5E8"/>
              <path d="M 16 -4 L 10 0 L 16 4 Z" fill="#29B5E8"/>
              
              {/* Diagonal arrows */}
              <path d="M -11.31 -11.31 L -7.07 -7.07 L -11.31 -2.83 Z" transform="rotate(-45 -9.19 -7.07)" fill="#29B5E8"/>
              <path d="M 11.31 -11.31 L 7.07 -7.07 L 11.31 -2.83 Z" transform="rotate(45 9.19 -7.07)" fill="#29B5E8"/>
              <path d="M -11.31 11.31 L -7.07 7.07 L -11.31 2.83 Z" transform="rotate(45 -9.19 7.07)" fill="#29B5E8"/>
              <path d="M 11.31 11.31 L 7.07 7.07 L 11.31 2.83 Z" transform="rotate(-45 9.19 7.07)" fill="#29B5E8"/>
            </g>
          </svg>
          
          {/* Title */}
          <div className="flex items-center">
            <span className="text-lg font-semibold text-gray-900">Snowflake</span>
            <span className="text-lg font-normal text-gray-600 ml-1">Playbook</span>
          </div>
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