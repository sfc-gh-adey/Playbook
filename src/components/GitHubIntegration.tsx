import React, { useState } from 'react';

interface GitHubConfig {
  owner: string;
  repo: string;
  token: string;
}

interface GitHubIntegrationProps {
  onConfigSave: (config: GitHubConfig) => void;
  isConfigured: boolean;
}

const GitHubIntegration: React.FC<GitHubIntegrationProps> = ({ onConfigSave, isConfigured }) => {
  const [showConfig, setShowConfig] = useState(false);
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [token, setToken] = useState('');

  const handleSave = () => {
    if (owner && repo && token) {
      // Store in localStorage for now (in production, this should be server-side)
      const config = { owner, repo, token };
      localStorage.setItem('github-config', JSON.stringify(config));
      onConfigSave(config);
      setShowConfig(false);
    }
  };

  return (
    <div className="fixed top-6 right-6 z-40">
      {!isConfigured ? (
        <button
          onClick={() => setShowConfig(true)}
          className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <span>Connect GitHub</span>
        </button>
      ) : (
        <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm">GitHub Connected</span>
        </div>
      )}

      {showConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Connect GitHub Repository</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Repository Owner
                </label>
                <input
                  type="text"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  placeholder="e.g., sfc-gh-adey"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Repository Name
                </label>
                <input
                  type="text"
                  value={repo}
                  onChange={(e) => setRepo(e.target.value)}
                  placeholder="e.g., Playbook"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Personal Access Token
                </label>
                <input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="ghp_..."
                  className="w-full px-3 py-2 border rounded-md"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Create a token with 'repo' scope at github.com/settings/tokens
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowConfig(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to create GitHub issue from comment
export const createGitHubIssue = async (
  config: GitHubConfig,
  comment: any,
  pageUrl: string
): Promise<number | null> => {
  const { owner, repo, token } = config;
  
  const issueBody = `
## Comment from Playbook Prototype

**Page:** ${pageUrl}
**Author:** ${comment.author}
**Timestamp:** ${new Date(comment.timestamp).toLocaleString()}
**Location:** (${comment.x}, ${comment.y})

### Comment:
${comment.text}

---
*This issue was automatically created from a comment in the Playbook prototype.*
  `;

  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: `[Prototype Feedback] ${comment.text.substring(0, 50)}...`,
        body: issueBody,
        labels: ['prototype-feedback', 'playbook']
      })
    });

    if (response.ok) {
      const issue = await response.json();
      return issue.number;
    }
  } catch (error) {
    console.error('Failed to create GitHub issue:', error);
  }
  
  return null;
};

// Helper function to add reply as comment on GitHub issue
export const addGitHubComment = async (
  config: GitHubConfig,
  issueNumber: number,
  reply: any
): Promise<boolean> => {
  const { owner, repo, token } = config;
  
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/comments`,
      {
        method: 'POST',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          body: `**${reply.author}:** ${reply.text}\n\n*Posted at ${new Date(reply.timestamp).toLocaleString()}*`
        })
      }
    );

    return response.ok;
  } catch (error) {
    console.error('Failed to add GitHub comment:', error);
    return false;
  }
};

export default GitHubIntegration; 