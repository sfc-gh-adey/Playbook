import React, { useState, useEffect, useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface TranscriptEntry {
  type: 'user' | 'assistant';
  content: string;
}

const getPromptCategory = (content: string): { title: string; icon: string } | null => {
  const lowerContent = content.toLowerCase();
  if (/(fix|error|crash|bug|404|not working|issue|debug|uncaught|typeerror)/.test(lowerContent)) {
    return { title: 'Debugging', icon: '🐛' };
  }
  if (/(spacing|logo|layout|copy|ux|ui|design|style|screenshot|image|look and feel|beautify|font)/.test(lowerContent)) {
    return { title: 'UX/UI Design', icon: '🎨' };
  }
  if (/(readme|positioning|adoption|paradigm|workflows|vision|strategy|feedback|prompt)/.test(lowerContent)) {
    return { title: 'Strategy', icon: '🧭' };
  }
  if (/(VITE_GITHUB_CLIENT_ID|log|technical|component|refactor|implement|codebase|typescript|api)/.test(lowerContent)) {
    return { title: 'Technical', icon: '⚙️' };
  }
  if (/(commit|push|run|deploy|install|restart|dependencies|revert|roll back)/.test(lowerContent)) {
    return { title: 'DevOps', icon: '🚀' };
  }
  return null;
};

const CollapsibleCodeBlock = ({ language, code }: { language: string; code: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const lineCount = code.trim().split('\n').length;
  const preview = code.trim().split('\n')[0];

  return (
    <div className="my-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-left bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors text-sm"
      >
        <div className="flex items-center space-x-2">
          <svg className={`w-3 h-3 text-gray-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
          <code className="font-mono text-gray-700 text-xs">{preview}...</code>
          <span className="text-xs text-gray-500">({lineCount} lines)</span>
        </div>
      </button>
      {isExpanded && (
        <div className="mt-2 rounded-lg overflow-hidden text-sm">
          <SyntaxHighlighter language={language} style={atomDark} customStyle={{ margin: 0, fontSize: '12px' }}>
            {code.trim()}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
};

const renderContent = (content: string) => {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const parts = content.split(codeBlockRegex);

  return parts.map((part, index) => {
    if (index % 3 === 2) {
      const language = parts[index - 1] || 'bash';
      return <CollapsibleCodeBlock key={index} language={language} code={part} />;
    }
    if (index % 3 === 0) {
      return part.split('\n').filter(line => line.trim()).map((line, i) => (
        <span key={`${index}-${i}`}>
          {i > 0 && <br />}
          {line}
        </span>
      ));
    }
    return null;
  });
};

const Avatar = ({ name, isUser }: { name: string; isUser: boolean }) => {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
      isUser ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
    }`}>
      {initials}
    </div>
  );
};

const TranscriptViewerPage: React.FC = () => {
  const [entries, setEntries] = useState<TranscriptEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTranscript = async () => {
      try {
        const response = await fetch('/setup_chat_transcript.md');
        const text = await response.text();
        
        const parsedEntries: TranscriptEntry[] = [];
        const parts = text.split(/<user_query>([\s\S]*?)<\/user_query>/);

        for (let i = 0; i < parts.length; i++) {
          const content = parts[i].trim();
          if (!content) continue;

          if (i % 2 === 0) {
            parsedEntries.push({ type: 'assistant', content });
          } else {
            parsedEntries.push({ type: 'user', content });
          }
        }

        setEntries(parsedEntries);
      } catch (error) {
        console.error("Failed to fetch or parse transcript:", error);
        setEntries([{ type: 'assistant', content: "Error: Could not load the transcript file." }]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTranscript();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gray-50/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button className="text-blue-500 hover:text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="font-semibold text-gray-900">The Art of Prompting</h1>
              <p className="text-xs text-gray-500">PM + AI Building Snowflake UI</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="text-blue-500 hover:text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            <button className="text-blue-500 hover:text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="space-y-4">
            {entries.map((entry, index) => {
              const category = entry.type === 'user' ? getPromptCategory(entry.content) : null;
              const isUser = entry.type === 'user';
              const showAvatar = index === 0 || entries[index - 1].type !== entry.type;
              
              return (
                <div key={index}>
                  {/* Category label for user messages */}
                  {category && showAvatar && (
                    <div className="flex justify-end mb-1 mr-11">
                      <span className="text-xs text-gray-500">{category.title}</span>
                    </div>
                  )}
                  
                  <div className={`flex items-end space-x-2 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {/* Avatar */}
                    {showAvatar ? (
                      <Avatar name={isUser ? "You PM" : "AI Assistant"} isUser={isUser} />
                    ) : (
                      <div className="w-8" />
                    )}
                    
                    {/* Message bubble */}
                    <div className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                      isUser 
                        ? 'bg-blue-500 text-white rounded-br-sm' 
                        : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                    }`}>
                      <div className={`text-[15px] leading-relaxed ${isUser ? 'font-medium' : ''}`}>
                        {renderContent(entry.content)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Timestamp */}
                  {(index === entries.length - 1 || entries[index + 1].type !== entry.type) && (
                    <div className={`flex ${isUser ? 'justify-end mr-11' : 'ml-11'} mt-1`}>
                      <span className="text-xs text-gray-400">
                        {isUser ? 'Delivered' : 'Read'}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="border-t border-gray-200 bg-white px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center space-x-3">
          <button className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="Type your prompt..."
              className="w-full px-4 py-2 pr-10 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranscriptViewerPage; 