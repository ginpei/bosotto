import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './components/markdown-styles.css';
import useKeydown from '../../shared/hooks/useKeydown';
import HelpDialog from './components/HelpDialog';

// Define a type for the code component props
interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

interface Post {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      console.log('Trying to load posts from localStorage');
      const savedPosts = localStorage.getItem('posts');
      console.log('Loaded from localStorage:', savedPosts);
      if (savedPosts) {
        setPosts(JSON.parse(savedPosts));
        console.log('Posts loaded successfully');
      } else {
        console.log('No posts found in localStorage');
      }
    } catch (error) {
      console.error('Error loading posts from localStorage:', error);
    }
  }, []);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    // 'n' key to focus on textarea (only when not in an input)
    if (e.key.toLowerCase() === 'n' &&
        !['INPUT', 'TEXTAREA'].includes((document.activeElement?.tagName || '').toUpperCase())) {
      e.preventDefault();
      textareaRef.current?.focus();
    }

    // Ctrl+P/Cmd+P to toggle preview (works anywhere)
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
      e.preventDefault();
      setShowPreview(prev => !prev);
    }

    // Ctrl+H/Cmd+H to show help dialog
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'h') {
      e.preventDefault();
      setShowHelpDialog(true);
    }
  }, []);

  useKeydown(handleKeyPress);

  const savePosts = useCallback((postsToSave: Post[]) => {
    try {
      console.log('Saving posts to localStorage:', postsToSave);
      localStorage.setItem('posts', JSON.stringify(postsToSave));
      console.log('Posts saved successfully');
    } catch (error) {
      console.error('Error saving posts to localStorage:', error);
    }
  }, []);

  const handleAddPost = () => {
    if (!newPostContent.trim()) return;

    const newPost: Post = {
      id: Date.now().toString(),
      content: newPostContent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    savePosts(updatedPosts);
    setNewPostContent('');
  };

  const handleDeletePost = (id: string) => {
    const updatedPosts = posts.filter((post) => post.id !== id);
    setPosts(updatedPosts);
    savePosts(updatedPosts);
  };

  return (
    <div className="container mx-auto px-2 py-4 max-w-3xl">
      <HelpDialog
        isOpen={showHelpDialog}
        onClose={() => setShowHelpDialog(false)}
      />
      <div className="bg-white">
        <div className="flex items-center p-2 bg-gray-100 border-b border-gray-300">
          <h1 className="text-lg">Notepad</h1>
        </div>

        {/* Post form */}
        <div className="p-3 bg-white">
          {/* Input area */}
          <textarea
            ref={textareaRef}
            className="w-full p-2 bg-white mb-2 outline-none resize-vertical font-mono"
            rows={5}
            placeholder="Type your note here... (Markdown supported)"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                handleAddPost();
              }
            }}
          />

          {/* Controls */}
          <div className="flex justify-between items-center mb-2 text-sm">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="show-preview"
                checked={showPreview}
                onChange={(e) => setShowPreview(e.target.checked)}
                className="mr-1"
              />
              <label htmlFor="show-preview" className="text-sm">Preview</label>
              <span className="mx-2 text-gray-400">|</span>
              <button
                onClick={() => setShowHelpDialog(true)}
                className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
                aria-label="Show markdown help"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Help
              </button>
            </div>

            <button
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800"
              onClick={handleAddPost}
            >
              Save Note
            </button>
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="w-full p-2 border-t border-gray-200 prose max-w-none overflow-auto">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSanitize]}
                components={{
                  code({node, inline, className, children, ...props}: CodeProps) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vs as any}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                  a({node, children, href, ...props}: any) {
                    return (
                      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                        {children}
                      </a>
                    );
                  }
                }}
              >
                {newPostContent}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Notes list */}
        <div className="bg-white border-t border-gray-300">
          {posts.map((post, index) => (
            <div key={post.id} className="p-3">
              <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                <p>
                  {new Date(post.createdAt).toLocaleString()}
                </p>
                <button
                  className="text-gray-500 hover:text-red-600"
                  onClick={() => handleDeletePost(post.id)}
                >
                  Delete
                </button>
              </div>
              <div className="prose max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeSanitize]}
                  components={{
                    code({node, inline, className, children, ...props}: CodeProps) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={vs as any}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                    a({node, children, href, ...props}: any) {
                      return (
                        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                          {children}
                        </a>
                      );
                    }
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}

          {posts.length === 0 && (
            <div className="p-4 text-center">
              <p className="text-gray-500">
                No notes yet. Type something above and save it!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
