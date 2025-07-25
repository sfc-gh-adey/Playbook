// This file contains helpers for interacting with the GitHub API.

interface GitHubRepo {
  owner: string;
  repo: string;
}

// Function to get the repo details from the current Git remote URL.
// In a real app, you might want a more robust way to set this.
export const getGitHubRepo = (): GitHubRepo | null => {
  // This is a placeholder. For a real app, you'd get this from the user
  // or a configuration file. For this prototype, we'll hardcode it.
  // IMPORTANT: Replace with your actual repository owner and name.
  const owner = 'sfc-gh-adey'; 
  const repo = 'Playbook'; 

  if (owner && repo) {
    return { owner, repo };
  }
  return null;
};


// Creates a new issue on GitHub from a comment.
export const createGitHubIssue = async (
  token: string,
  repo: GitHubRepo,
  comment: any,
  pageUrl: string
): Promise<number | null> => {
  
  // Build page description including context
  let pageDescription = `\`${pageUrl}\``;
  if (comment.pageContext) {
    pageDescription += ` (${comment.pageContext})`;
  }
  
  const issueBody = `
## 💬 Comment from Playbook Prototype

**Page:** ${pageDescription}
**Author:** @${comment.author}
**Timestamp:** ${new Date(comment.timestamp).toLocaleString()}
**Location (X, Y):** (${comment.x}, ${comment.y})

---

### Comment Content:
> ${comment.text}

---
*This issue was automatically created from a comment in the Playbook prototype.*
  `;

  try {
    const response = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.repo}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        title: `[Prototype Feedback] ${comment.text.substring(0, 50)}...`,
        body: issueBody,
        labels: ['prototype-feedback', 'playbook-comment']
      })
    });

    if (response.ok) {
      const issue = await response.json();
      console.log('Successfully created GitHub issue:', issue.number);
      return issue.number;
    } else {
      const errorData = await response.json();
      console.error('Failed to create GitHub issue:', response.status, errorData);
    }
  } catch (error) {
    console.error('Network error creating GitHub issue:', error);
  }
  
  return null;
};

// Adds a reply to an existing GitHub issue.
export const addGitHubComment = async (
  token: string,
  repo: GitHubRepo,
  issueNumber: number,
  reply: any
): Promise<boolean> => {
  
  const commentBody = `
**Reply by @${reply.author}:**

> ${reply.text}

---
*Posted via Playbook prototype at ${new Date(reply.timestamp).toLocaleString()}*
  `;

  try {
    const response = await fetch(
      `https://api.github.com/repos/${repo.owner}/${repo.repo}/issues/${issueNumber}/comments`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json',
        },
        body: JSON.stringify({
          body: commentBody
        })
      }
    );

    if (response.ok) {
      console.log('Successfully added reply to GitHub issue:', issueNumber);
      return true;
    } else {
      const errorData = await response.json();
      console.error('Failed to add GitHub reply:', response.status, errorData);
      return false;
    }
  } catch (error) {
    console.error('Network error adding GitHub reply:', error);
    return false;
  }
}; 