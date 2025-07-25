import React, { useState, useEffect } from 'react';

interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  email: string;
}

interface GitHubAuthProps {
  onAuthSuccess: (user: GitHubUser, token: string) => void;
  clientId: string; // You'll need to register an OAuth app on GitHub
}

const GitHubAuth: React.FC<GitHubAuthProps> = ({ onAuthSuccess, clientId }) => {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    // Check for OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      handleOAuthCallback(code);
    }

    // Check for existing session
    const savedUser = localStorage.getItem('github-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleOAuthCallback = async (code: string) => {
    setIsAuthenticating(true);
    
    // In production, this should go through your backend to keep client_secret secure
    // For now, we'll use a Vercel function or similar
    try {
      // This is a placeholder - you'd need a backend endpoint
      const response = await fetch('/api/github-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });

      if (response.ok) {
        const { access_token, user } = await response.json();
        
        localStorage.setItem('github-token', access_token);
        localStorage.setItem('github-user', JSON.stringify(user));
        
        setUser(user);
        onAuthSuccess(user, access_token);
        
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (error) {
      console.error('OAuth callback failed:', error);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const initiateOAuth = () => {
    const redirectUri = encodeURIComponent(window.location.origin);
    const scope = encodeURIComponent('repo user:email');
    
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  };

  const logout = () => {
    localStorage.removeItem('github-token');
    localStorage.removeItem('github-user');
    setUser(null);
  };

  if (isAuthenticating) {
    return (
      <div className="fixed top-6 right-6" style={{ zIndex: 9998 }}>
        <div className="bg-white rounded-lg shadow-lg px-4 py-2 flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
          <span className="text-sm">Authenticating...</span>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="fixed top-6 right-6" style={{ zIndex: 9998 }}>
        <div className="flex items-center space-x-3 bg-white rounded-lg shadow-lg px-3 py-2">
          <img 
            src={user.avatar_url} 
            alt={user.name} 
            className="w-8 h-8 rounded-full"
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">{user.name || user.login}</span>
            <button 
              onClick={logout}
              className="text-xs text-gray-500 hover:text-gray-700 text-left"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-6 right-6" style={{ zIndex: 9998 }}>
      <button
        onClick={initiateOAuth}
        className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 flex items-center space-x-2 shadow-lg"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        <span>Sign in with GitHub</span>
      </button>
    </div>
  );
};

export default GitHubAuth; 