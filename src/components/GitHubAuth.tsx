import React, { useState, useEffect } from 'react';

interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  email: string;
}

interface GitHubAuthProps {
  onAuthSuccess: (user: GitHubUser, token: string) => void;
}

const GitHubAuth: React.FC<GitHubAuthProps> = ({ onAuthSuccess }) => {
  const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;

  const initiateOAuth = () => {
    if (!clientId) {
      console.error("VITE_GITHUB_CLIENT_ID is not set.");
      alert("GitHub authentication is not configured. Please set VITE_GITHUB_CLIENT_ID.");
      return;
    }
    const redirectUri = encodeURIComponent(window.location.origin);
    const scope = encodeURIComponent('repo user:email');
    
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  };
  
  // This is a temporary, highly visible debug button.
  return (
    <div 
      onClick={initiateOAuth}
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: 'magenta',
        color: 'white',
        padding: '15px',
        zIndex: 10001,
        cursor: 'pointer',
        border: '2px solid white',
        fontSize: '16px',
        fontWeight: 'bold'
      }}
    >
      DEBUG: CLICK TO AUTH (CLIENT ID: {clientId ? 'SET' : 'NOT SET'})
    </div>
  );
};

export default GitHubAuth; 