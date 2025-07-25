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

  // Load comments from localStorage on mount
  useEffect(() => {
    const savedComments = localStorage.getItem('playbook-comments');
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
  }, []);

  // Watch for route changes and close active comments
  useEffect(() => {
    // Close any active comment when navigating to a new page
    setActiveComment(null);
    setIsCommentMode(false);
  }, [location.pathname]);

  // Save comments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('playbook-comments', JSON.stringify(comments));
  }, [comments]);

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
      author: githubUser?.name || githubUser?.login || 'Anonymous User',
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
      if (githubToken) {
        const repo = getGitHubRepo();
        if (repo) {
          const updatedComment = { ...commentToUpdate, text, author: githubUser.login };
          issueNumber = await createGitHubIssue(githubToken, repo, updatedComment, location.pathname);
        }
      }
    }
    
    setComments(comments.map(c => 
      c.id === commentId 
        ? { ...c, text, githubIssueNumber: issueNumber ?? c.githubIssueNumber } 
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
    setComments(comments.filter(c => c.id !== commentId));
    setActiveComment(null);
  };

  return (
    <>
      {/* Floating Comment Button */}
      {showCommentButton && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => {
              console.log('Comment button clicked, current mode:', isCommentMode);
              setIsCommentMode(!isCommentMode);
            }}
            className={`
              px-4 py-3 rounded-full shadow-lg transition-all transform hover:scale-105
              ${isCommentMode 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
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
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
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
            zIndex: 9999 
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

  return createPortal(
    <>
      {/* Comment Pin */}
      <div
        className={`
          fixed w-8 h-8 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2
          transition-all hover:scale-110 z-50
          ${isActive ? 'bg-blue-600 ring-4 ring-blue-200' : 'bg-blue-500 hover:bg-blue-600'}
        `}
        style={{ left: comment.x, top: comment.y }}
        onClick={onActivate}
      >
        <span className="flex items-center justify-center h-full text-white text-sm font-bold">
          {comment.replies.length + (comment.text ? 1 : 0)}
        </span>
      </div>

      {/* Comment Thread */}
      {isActive && (
        <div
          className="fixed bg-white rounded-lg shadow-xl border border-gray-200 z-50"
          style={{ 
            left: Math.min(comment.x + 20, window.innerWidth - 320),
            top: Math.min(comment.y, window.innerHeight - 400),
            width: '300px',
            maxHeight: '400px'
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b">
            <div>
              <h3 className="font-medium text-gray-900">Comment Thread</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                on page: {comment.pageUrl === '/' ? 'Wizard' : 
                 comment.pageUrl.includes('playground') ? 'Playground' :
                 comment.pageUrl.includes('service') ? 'Service Page' :
                 comment.pageUrl}
              </p>
            </div>
            {comment.githubIssueNumber && (
              <a 
                href={`https://github.com/${getGitHubRepo()?.owner}/${getGitHubRepo()?.repo}/issues/${comment.githubIssueNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                title="View on GitHub"
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Comments */}
          <div className="overflow-y-auto" style={{ maxHeight: '250px' }}>
            {/* Original Comment */}
            {(comment.text || isEditing) && (
              <div className="p-3 border-b">
                <div className="flex items-start justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{comment.author}</span>
                  <button
                    onClick={() => onDelete(comment.id)}
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
                {isEditing ? (
                  <textarea
                    autoFocus
                    className="w-full p-2 border rounded text-sm resize-none"
                    placeholder="Add your comment..."
                    value={comment.text}
                    onChange={(e) => onUpdate(comment.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        setIsEditing(false);
                      }
                    }}
                  />
                ) : (
                  <p className="text-sm text-gray-700">{comment.text}</p>
                )}
                <span className="text-xs text-gray-500">
                  {new Date(comment.timestamp).toLocaleString()}
                </span>
              </div>
            )}

            {/* Replies */}
            {comment.replies.map(reply => (
              <div key={reply.id} className="p-3 border-b bg-gray-50">
                <div className="flex items-start justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{reply.author}</span>
                </div>
                <p className="text-sm text-gray-700">{reply.text}</p>
                <span className="text-xs text-gray-500">
                  {new Date(reply.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Reply Input */}
          <div className="p-3">
            <div className="flex space-x-2">
              <input
                type="text"
                className="flex-1 px-3 py-2 border rounded-md text-sm"
                placeholder="Add a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && replyText.trim()) {
                    onReply(comment.id, replyText);
                    setReplyText('');
                  }
                }}
              />
              <button
                onClick={() => {
                  if (replyText.trim()) {
                    onReply(comment.id, replyText);
                    setReplyText('');
                  }
                }}
                className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
              >
                Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </>,
    document.body
  );
};

export default CommentSystem; 