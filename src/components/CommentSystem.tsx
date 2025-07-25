import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { createGitHubIssue, addGitHubComment, getGitHubRepo } from '../utils/github';

interface Comment {
  id: string;
  x: number;
  y: number;
  text: string;
  author: string;
  timestamp: Date;
  replies: Reply[];
  pageUrl: string;
  githubIssueNumber?: number;
}

interface LocalComment {
  id: string;
  x: number;
  y: number;
  pageUrl: string;
  githubIssueNumber?: number;
}

interface Reply {
  id: string;
  text: string;
  author: string;
  timestamp: Date;
}

interface CommentPin {
  comment: Comment;
  isActive: boolean;
}

interface CommentSystemProps {
  githubUser?: any;
  githubToken?: string;
}

const CommentSystem: React.FC<CommentSystemProps> = ({ githubUser, githubToken }) => {
  const [isCommentMode, setIsCommentMode] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [activeComment, setActiveComment] = useState<string | null>(null);
  const [showCommentButton, setShowCommentButton] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Load comments from localStorage and fetch from GitHub on mount
  useEffect(() => {
    loadComments();
  }, [githubToken]);

  // Save minimal comment data to localStorage whenever comments change
  useEffect(() => {
    if (comments.length > 0) {
      const localComments: LocalComment[] = comments.map(c => ({
        id: c.id,
        x: c.x,
        y: c.y,
        pageUrl: c.pageUrl,
        githubIssueNumber: c.githubIssueNumber
      }));
      localStorage.setItem('playbook-comment-markers', JSON.stringify(localComments));
    }
  }, [comments]);

  const loadComments = async () => {
    const savedMarkers = localStorage.getItem('playbook-comment-markers');
    if (!savedMarkers) return;

    const localComments: LocalComment[] = JSON.parse(savedMarkers);
    const fullComments: Comment[] = [];

    for (const marker of localComments) {
      if (marker.githubIssueNumber && githubToken) {
        // Fetch the full comment data from GitHub
        const repo = getGitHubRepo();
        if (repo) {
          try {
            const issueResponse = await fetch(
              `https://api.github.com/repos/${repo.owner}/${repo.repo}/issues/${marker.githubIssueNumber}`,
              {
                headers: {
                  'Authorization': `Bearer ${githubToken}`,
                  'Accept': 'application/vnd.github.v3+json',
                }
              }
            );

            if (issueResponse.ok) {
              const issue = await issueResponse.json();
              
              // Extract comment text from issue body
              const bodyMatch = issue.body.match(/### Comment Content:\s*>\s*(.+?)(?=\n\n---|\n\*This issue)/s);
              const text = bodyMatch ? bodyMatch[1].trim() : '';
              
              // Fetch replies from issue comments
              const commentsResponse = await fetch(issue.comments_url, {
                headers: {
                  'Authorization': `Bearer ${githubToken}`,
                  'Accept': 'application/vnd.github.v3+json',
                }
              });

              const replies: Reply[] = [];
              if (commentsResponse.ok) {
                const issueComments = await commentsResponse.json();
                for (const comment of issueComments) {
                  const replyMatch = comment.body.match(/\*\*Reply by @(.+?):\*\*\s*>\s*(.+?)(?=\n\n---|\s*$)/s);
                  if (replyMatch) {
                    replies.push({
                      id: comment.id.toString(),
                      text: replyMatch[2].trim(),
                      author: replyMatch[1],
                      timestamp: new Date(comment.created_at)
                    });
                  }
                }
              }

              fullComments.push({
                ...marker,
                text,
                author: issue.user.login,
                timestamp: new Date(issue.created_at),
                replies
              });
            }
          } catch (error) {
            console.error('Failed to fetch comment from GitHub:', error);
            // Fall back to local marker without content
            fullComments.push({
              ...marker,
              text: '[Failed to load comment]',
              author: 'Unknown',
              timestamp: new Date(),
              replies: []
            });
          }
        }
      } else {
        // No GitHub issue yet, just show the marker
        fullComments.push({
          ...marker,
          text: '',
          author: githubUser?.login || 'Anonymous',
          timestamp: new Date(),
          replies: []
        });
      }
    }

    setComments(fullComments);
  };

  // Watch for route changes and close active comments
  useEffect(() => {
    // Close any active comment when navigating to a new page
    setActiveComment(null);
    setIsCommentMode(false);
  }, [location.pathname]);

  // Add keyboard shortcut for toggling comment mode
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        event.preventDefault();
        setIsCommentMode(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Filter comments for current page
  const pageComments = comments.filter(c => c.pageUrl === location.pathname);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!isCommentMode) return;
    
    // Prevent event from bubbling
    e.stopPropagation();
    e.preventDefault();

    const x = e.clientX;
    const y = e.clientY;

    console.log('Creating comment at:', x, y); // Debug log

    const newComment: Comment = {
      id: Date.now().toString(),
      x,
      y,
      text: '',
      author: githubUser?.login || 'Local User',
      timestamp: new Date(),
      replies: [],
      pageUrl: location.pathname
    };

    setComments([...comments, newComment]);
    setActiveComment(newComment.id);
    setIsCommentMode(false);
  };

  const updateComment = async (commentId: string, text: string) => {
    let issueNumber: number | null | undefined = null;
    const commentToUpdate = comments.find(c => c.id === commentId);

    if (!commentToUpdate) return;

    // If the comment doesn't have text, it's a new comment. Create a GitHub issue.
    if (!commentToUpdate.text && text.trim() !== '') {
      if (githubToken && githubUser) {
        const repo = getGitHubRepo();
        if (repo) {
          // Use the login for consistency
          const updatedComment = { ...commentToUpdate, text, author: githubUser.login };
          issueNumber = await createGitHubIssue(githubToken, repo, updatedComment, location.pathname);
        }
      }
    }
    
    setComments(comments.map(c => 
      c.id === commentId 
        ? { ...c, text, author: githubUser?.login || c.author, githubIssueNumber: issueNumber ?? c.githubIssueNumber } 
        : c
    ));
  };

  const addReply = async (commentId: string, replyText: string) => {
    const comment = comments.find(c => c.id === commentId);
    if (!comment) return;

    const newReply: Reply = {
      id: Date.now().toString(),
      text: replyText,
      author: githubUser?.login || 'Anonymous',
      timestamp: new Date()
    };
    
    if (githubToken && comment.githubIssueNumber) {
      const repo = getGitHubRepo();
      if (repo) {
        await addGitHubComment(githubToken, repo, comment.githubIssueNumber, newReply);
      }
    }

    setComments(comments.map(c =>
      c.id === commentId 
        ? { ...c, replies: [...c.replies, newReply] }
        : c
    ));
  };

  const deleteComment = (commentId: string) => {
    const updatedComments = comments.filter(c => c.id !== commentId);
    setComments(updatedComments);
    setActiveComment(null);
    
    // Update localStorage
    const localComments: LocalComment[] = updatedComments.map(c => ({
      id: c.id,
      x: c.x,
      y: c.y,
      pageUrl: c.pageUrl,
      githubIssueNumber: c.githubIssueNumber
    }));
    localStorage.setItem('playbook-comment-markers', JSON.stringify(localComments));
  };

  return (
    <>
      {/* Floating Comment Button */}
      {showCommentButton && (
        <div className="fixed bottom-6 right-6" style={{ zIndex: 1001 }}>
          <button
            onClick={() => {
              console.log('Comment button clicked, current mode:', isCommentMode);
              setIsCommentMode(!isCommentMode);
            }}
            className={`
              px-4 py-3 rounded-full shadow-lg transition-all transform hover:scale-105
              ${isCommentMode 
                ? 'bg-[#29B5E8] text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }
            `}
          >
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" 
                />
              </svg>
              <span className="font-medium">
                {isCommentMode ? 'Click to comment' : 'Comments'}
              </span>
              {pageComments.length > 0 && !isCommentMode && (
                <span className="bg-[#0073E6] text-white text-xs px-2 py-0.5 rounded-full">
                  {pageComments.length}
                </span>
              )}
              {comments.length > pageComments.length && !isCommentMode && (
                <span className="text-xs text-gray-500 ml-1">
                  ({comments.length} total)
                </span>
              )}
            </div>
          </button>
        </div>
      )}

      {/* Comment Mode Overlay */}
      {isCommentMode && createPortal(
        <div 
          ref={overlayRef}
          className="fixed inset-0 cursor-crosshair"
          style={{ 
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            zIndex: 1004 
          }}
          onClick={handleCanvasClick}
        >
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 
                          bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg pointer-events-none">
            Click anywhere to add a comment
          </div>
        </div>,
        document.body
      )}

      {/* Comment Pins */}
      {pageComments.map(comment => (
        <CommentPin
          key={comment.id}
          comment={comment}
          isActive={activeComment === comment.id}
          onActivate={() => setActiveComment(comment.id)}
          onClose={() => setActiveComment(null)}
          onUpdate={updateComment}
          onReply={addReply}
          onDelete={deleteComment}
        />
      ))}
    </>
  );
};

const CommentPin: React.FC<{
  comment: Comment;
  isActive: boolean;
  onActivate: () => void;
  onClose: () => void;
  onUpdate: (id: string, text: string) => void;
  onReply: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}> = ({ comment, isActive, onActivate, onClose, onUpdate, onReply, onDelete }) => {
  const [replyText, setReplyText] = useState('');
  const [isEditing, setIsEditing] = useState(!comment.text);
  const [editText, setEditText] = useState(comment.text || '');
  const [isResolving, setIsResolving] = useState(false);

  const handleSendComment = () => {
    if (editText.trim()) {
      onUpdate(comment.id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleSendReply = () => {
    if (replyText.trim()) {
      onReply(comment.id, replyText.trim());
      setReplyText('');
    }
  };

  const handleResolve = async () => {
    if (!comment.githubIssueNumber) return;
    
    setIsResolving(true);
    const githubToken = localStorage.getItem('github-token');
    const repo = getGitHubRepo();
    
    if (githubToken && repo) {
      try {
        // Close the GitHub issue
        const response = await fetch(
          `https://api.github.com/repos/${repo.owner}/${repo.repo}/issues/${comment.githubIssueNumber}`,
          {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${githubToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/vnd.github.v3+json',
            },
            body: JSON.stringify({
              state: 'closed',
              state_reason: 'completed'
            })
          }
        );

        if (response.ok) {
          // Delete the comment locally
          onDelete(comment.id);
        } else {
          console.error('Failed to close GitHub issue');
          alert('Failed to resolve comment. Please try again.');
        }
      } catch (error) {
        console.error('Error resolving comment:', error);
        alert('Error resolving comment. Please try again.');
      }
    }
    setIsResolving(false);
  };

  return createPortal(
    <>
      {/* Comment Pin - Modern design */}
      <div
        className={`
          fixed w-10 h-10 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2
          transition-all duration-200 hover:scale-110 
          ${isActive 
            ? 'bg-gradient-to-br from-[#29B5E8] to-[#0073E6] shadow-lg ring-4 ring-[#29B5E8] ring-opacity-30' 
            : 'bg-gradient-to-br from-[#29B5E8] to-[#0073E6] shadow-md hover:shadow-lg'
          }
        `}
        style={{ left: comment.x, top: comment.y, zIndex: 1002 }}
        onClick={onActivate}
      >
        <span className="flex items-center justify-center h-full text-white text-sm font-bold">
          {comment.replies.length + (comment.text ? 1 : 0)}
        </span>
      </div>

      {/* Comment Thread - Modern card design */}
      {isActive && (
        <div
          className="fixed bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
          style={{ 
            left: Math.min(comment.x + 20, window.innerWidth - 380),
            top: Math.min(comment.y, window.innerHeight - 500),
            width: '380px',
            maxHeight: '500px',
            zIndex: 1003,
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* Header - Glassmorphism effect */}
          <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-gray-50 to-gray-100/80 backdrop-blur-sm border-b border-gray-200">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">Comment Thread</h3>
              <p className="text-xs text-gray-600 mt-0.5 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {comment.pageUrl === '/' ? 'Wizard' : 
                comment.pageUrl.includes('playground') ? 'Playground' :
                comment.pageUrl.includes('service') ? 'Service Page' :
                comment.pageUrl}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {comment.githubIssueNumber && (
                <a 
                  href={`https://github.com/${getGitHubRepo()?.owner}/${getGitHubRepo()?.repo}/issues/${comment.githubIssueNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="View on GitHub"
                  className="text-gray-500 hover:text-gray-700 transition-colors p-1.5 hover:bg-gray-200 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              )}
              {comment.text && !isEditing && comment.githubIssueNumber && (
                <button
                  onClick={handleResolve}
                  disabled={isResolving}
                  className="text-green-600 hover:text-green-700 transition-colors p-1.5 hover:bg-green-50 rounded-lg disabled:opacity-50"
                  title="Resolve comment"
                >
                  {isResolving ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors p-1.5 hover:bg-gray-200 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Comments with modern styling */}
          <div className="overflow-y-auto" style={{ maxHeight: '320px' }}>
            {/* Original Comment */}
            {(comment.text || isEditing) && (
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#29B5E8] to-[#0073E6] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {comment.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-900">{comment.author}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => onDelete(comment.id)}
                      className="text-xs text-red-500 hover:text-red-600 transition-colors px-2 py-1 hover:bg-red-50 rounded"
                    >
                      Delete
                    </button>
                  )}
                </div>
                {isEditing ? (
                  <div className="space-y-3">
                    <textarea
                      autoFocus
                      className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-[#29B5E8] focus:border-transparent transition-all"
                      placeholder="Add your comment..."
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={3}
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={handleSendComment}
                        disabled={!editText.trim()}
                        className="px-4 py-2 bg-gradient-to-r from-[#29B5E8] to-[#0073E6] text-white rounded-lg hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-700 leading-relaxed">{comment.text}</p>
                )}
              </div>
            )}

            {/* Replies with alternating background */}
            {comment.replies.map((reply, index) => (
              <div key={reply.id} className={`p-5 border-b border-gray-50 ${index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}`}>
                <div className="flex items-start gap-2 mb-2">
                  <div className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-semibold text-xs">
                    {reply.author.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{reply.author}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(reply.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1 leading-relaxed">{reply.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Reply Input with modern design */}
          {comment.text && !isEditing && (
            <div className="p-5 bg-gray-50/50 border-t border-gray-100">
              <div className="space-y-3">
                <textarea
                  className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-[#29B5E8] focus:border-transparent transition-all"
                  placeholder="Add a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={2}
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleSendReply}
                    disabled={!replyText.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-[#29B5E8] to-[#0073E6] text-white rounded-lg hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>,
    document.body
  );
};

export default CommentSystem; 