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
          {/* Official Snowflake Logo */}
          <svg width="32" height="28" viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.6917 4.20571L16 11.2L11.6917 4.20571ZM16 11.2L20.3083 4.20571L16 11.2ZM11.6917 17.0143L16 11.2L11.6917 17.0143ZM20.3083 17.0143L16 11.2L20.3083 17.0143Z" fill="#29B5E8"/>
            <path d="M4.34167 7L8.65 14L4.34167 7ZM27.6583 7L23.35 14L27.6583 7ZM8.65 14L4.34167 21L8.65 14ZM23.35 14L27.6583 21L23.35 14Z" fill="#29B5E8"/>
            <path d="M16 0L11.6917 4.20571L16 11.2L20.3083 4.20571L16 0ZM16 22.4L20.3083 17.0143L16 11.2L11.6917 17.0143L16 22.4Z" fill="#29B5E8"/>
            <path d="M23.35 14L27.6583 7H20.3083L23.35 14ZM8.65 14L4.34167 21H11.6917L8.65 14Z" fill="#29B5E8"/>
            <path d="M11.6917 21H4.34167L8.65 14L11.6917 21ZM23.35 14L20.3083 21H27.6583L23.35 14Z" fill="#29B5E8"/>
            <path d="M20.3083 2.8L16 8.4L11.6917 2.8H20.3083V2.8ZM11.6917 18.2L16 12.6L20.3083 18.2H11.6917Z" fill="#29B5E8"/>
            <path d="M32 14L27.6583 7L23.35 14L27.6583 21L32 14ZM0 14L4.34167 21L8.65 14L4.34167 7L0 14Z" fill="#29B5E8"/>
            <path d="M20.3083 2.8H11.6917L16 8.4L20.3083 2.8ZM11.6917 18.2H20.3083L16 12.6L11.6917 18.2Z" fill="#29B5E8"/>
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