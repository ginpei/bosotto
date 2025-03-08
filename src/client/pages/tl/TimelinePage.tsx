import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './components/markdown-styles.css';

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

const TimelinePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Load posts from localStorage on component mount
  useEffect(() => {
    const savedPosts = localStorage.getItem('posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  }, []);

  // Save posts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('posts', JSON.stringify(posts));
  }, [posts]);

  const handleAddPost = () => {
    if (!newPostContent.trim()) return;

    const newPost: Post = {
      id: Date.now().toString(),
      content: newPostContent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
  };

  const handleDeletePost = (id: string) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Twitter-style Notepad</h1>

      {/* Post form */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        {/* Input area */}
        <div className="w-full">
          <textarea
            className="w-full p-2 border rounded-lg mb-2"
            rows={5}
            placeholder="What are you doing now? (Markdown supported)"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.currentTarget.value)}
          />
        </div>
        
        {/* Post button and checkbox */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="show-preview"
              checked={showPreview}
              onChange={(e) => setShowPreview(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="show-preview" className="text-sm">Show Preview</label>
          </div>
          
          <div className="text-xs text-gray-500 mx-2">
            Markdown supported: **bold**, *italic*, [links](url), `code`, etc.
          </div>
          
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-full font-bold"
            onClick={handleAddPost}
          >
            Post
          </button>
        </div>
        
        {/* Preview (below the post button) */}
        {showPreview && (
          <div className="w-full p-2 border rounded-lg prose max-w-none overflow-auto">
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

      {/* Posts list */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="p-4 bg-white rounded-lg shadow">
            <div className="flex justify-between">
              <p className="text-gray-500 text-sm">
                {new Date(post.createdAt).toLocaleString()}
              </p>
              <button
                className="text-red-500"
                onClick={() => handleDeletePost(post.id)}
              >
                Delete
              </button>
            </div>
            <div className="mt-2 prose max-w-none">
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
          <p className="text-center text-gray-500 py-8">
            There are no posts yet. Let's make your first post!
          </p>
        )}
      </div>
    </div>
  );
};

export default TimelinePage;
