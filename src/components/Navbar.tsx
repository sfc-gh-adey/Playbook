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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L13.09 5.26L16.26 3.09L15.17 6.35L18.91 6.35L16.74 8.52L20 9.61L16.74 10.7L18.91 12.87L15.17 12.87L16.26 16.13L13.09 13.96L12 17.22L10.91 13.96L7.74 16.13L8.83 12.87L5.09 12.87L7.26 10.7L4 9.61L7.26 8.52L5.09 6.35L8.83 6.35L7.74 3.09L10.91 5.26L12 2Z" fill="#29B5E8"/>
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