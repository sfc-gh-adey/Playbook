// Snowflake Design Tokens for Prototyping
export const snowflakeTokens = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe', 
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8'
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      900: '#111827'
    },
    success: {
      100: '#dcfce7',
      600: '#16a34a'
    },
    warning: {
      100: '#fef3c7',
      600: '#d97706'
    },
    error: {
      100: '#fee2e2',
      600: '#dc2626'
    }
  },
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem'     // 48px
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem'
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif']
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem'
    }
  }
};

export const snowflakeClasses = {
  // Common component classes
  wizard: {
    container: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50',
    panel: 'bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex overflow-hidden',
    sidebar: 'w-80 bg-gray-50 border-r border-gray-200 p-6',
    content: 'flex-1 p-6'
  },
  forms: {
    input: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500',
    label: 'block text-sm font-medium text-gray-700',
    select: 'px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500',
    button: {
      primary: 'px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium',
      secondary: 'px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium'
    }
  },
  status: {
    badge: {
      green: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800',
      yellow: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800',
      blue: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'
    }
  }
}; 