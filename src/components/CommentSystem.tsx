import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface Comment {
  id: string;
  x: number;
  y: number;
  text: string;
  author: string;
  timestamp: Date;
  replies: Reply[];
  pageUrl: string;
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

  // Load comments from localStorage on mount
  useEffect(() => {
    const savedComments = localStorage.getItem('playbook-comments');
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
  }, []);

  // Save comments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('playbook-comments', JSON.stringify(comments));
  }, [comments]);

  // Filter comments for current page
  const pageComments = comments.filter(c => c.pageUrl === window.location.pathname);

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
      pageUrl: window.location.pathname
    };

    setComments([...comments, newComment]);
    setActiveComment(newComment.id);
    setIsCommentMode(false);
  };

  const updateComment = (commentId: string, text: string) => {
    setComments(comments.map(c => 
      c.id === commentId ? { ...c, text } : c
    ));
  };

  const addReply = (commentId: string, replyText: string) => {
    const newReply: Reply = {
      id: Date.now().toString(),
      text: replyText,
      author: 'Anonymous User',
      timestamp: new Date()
    };

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
            <h3 className="font-medium text-gray-900">Comment Thread</h3>
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