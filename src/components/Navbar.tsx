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
            <path d="M16 0L17.4 4.8L22.2 2.4L20.8 7.2L25.6 7.2L22.2 10.6L27 12L22.2 13.4L25.6 16.8L20.8 16.8L22.2 21.6L17.4 19.2L16 24L14.6 19.2L9.8 21.6L11.2 16.8L6.4 16.8L9.8 13.4L5 12L9.8 10.6L6.4 7.2L11.2 7.2L9.8 2.4L14.6 4.8L16 0Z" fill="#29B5E8"/>
            <circle cx="16" cy="12" r="2" fill="#29B5E8"/>
          </svg>
          
          {/* Title */}
          <div className="flex items-center">
            <span className="text-lg font-semibold text-gray-900">Snowflake</span>
            <span className="text-lg font-normal text-gray-600 ml-1">Playbook</span>
          </div>
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