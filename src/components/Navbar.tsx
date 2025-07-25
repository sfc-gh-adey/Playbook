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
          <svg width="32" height="32" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Center diamond */}
            <rect x="85" y="85" width="30" height="30" rx="2" transform="rotate(45 100 100)" fill="#29B5E8"/>
            
            {/* Top chevron */}
            <path d="M100 10 L80 30 L90 40 L100 30 L110 40 L120 30 Z" fill="#29B5E8"/>
            
            {/* Right chevron */}
            <path d="M190 100 L170 80 L160 90 L170 100 L160 110 L170 120 Z" fill="#29B5E8"/>
            
            {/* Bottom chevron */}
            <path d="M100 190 L120 170 L110 160 L100 170 L90 160 L80 170 Z" fill="#29B5E8"/>
            
            {/* Left chevron */}
            <path d="M10 100 L30 120 L40 110 L30 100 L40 90 L30 80 Z" fill="#29B5E8"/>
            
            {/* Top-right chevron */}
            <path d="M160 40 L140 40 L140 50 L150 60 L140 70 L150 70 L160 60 Z" fill="#29B5E8"/>
            
            {/* Bottom-right chevron */}
            <path d="M160 160 L160 140 L150 140 L140 150 L130 140 L130 150 L140 160 Z" fill="#29B5E8"/>
            
            {/* Bottom-left chevron */}
            <path d="M40 160 L60 160 L60 150 L50 140 L60 130 L50 130 L40 140 Z" fill="#29B5E8"/>
            
            {/* Top-left chevron */}
            <path d="M40 40 L40 60 L50 60 L60 50 L70 60 L70 50 L60 40 Z" fill="#29B5E8"/>
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