import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './components/markdown-styles.css';
import useKeydown from '../../shared/hooks/useKeydown';
import HelpDialog from './components/HelpDialog';
import ConfirmDialog from './components/ConfirmDialog';

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
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [showEditPreview, setShowEditPreview] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingEditPostId, setPendingEditPostId] = useState<string | null>(null);
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

  // Handle edit cancellation
  const handleEditCancel = useCallback(() => {
    const currentPost = posts.find(p => p.id === editingPostId);
    // Check if there are unsaved changes
    if (currentPost && currentPost.content !== editContent) {
      // Show confirmation dialog for unsaved changes
      setShowConfirmDialog(true);
      setPendingEditPostId(null); // We're not switching to another post
    } else {
      // No changes, just cancel editing
      setEditingPostId(null);
      setEditContent('');
      setShowEditPreview(false);
    }
  }, [editingPostId, editContent, posts]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    // Determine active element and context
    const activeElement = document.activeElement;
    const isInInputField = ['INPUT', 'TEXTAREA'].includes(
      (activeElement?.tagName || '').toUpperCase()
    );
    
    // Check if focus is in a specific form
    const isInNewPostForm = textareaRef.current && 
      (activeElement === textareaRef.current || 
       activeElement?.closest('.new-post-form'));
       
    const isInEditForm = editingPostId && 
      activeElement?.closest(`.edit-form-${editingPostId}`);
      
    // Note: Dialog components will handle and stop propagation of their own 
    // keyboard events, so we don't need to check for dialog state here

    // 'n' key to focus on textarea (only when not in an input)
    if (e.key.toLowerCase() === 'n' && !isInInputField) {
      e.preventDefault();
      textareaRef.current?.focus();
    }

    // Ctrl+P/Cmd+P to toggle preview based on current focus
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
      e.preventDefault();
      
      if (isInEditForm) {
        // Toggle preview in edit form
        setShowEditPreview(prev => !prev);
      } else if (isInNewPostForm) {
        // Toggle preview in new post form
        setShowPreview(prev => !prev);
      }
      // Do nothing if focus is elsewhere
    }

    // '?' key to show help dialog
    if (e.key === '?') {
      e.preventDefault();
      setShowHelpDialog(true);
    }

    // Escape to cancel editing or blur new post textarea
    if (e.key === 'Escape') {
      // Handle edit form first
      if (editingPostId && isInEditForm) {
        e.preventDefault();
        handleEditCancel();
      }
      // Handle new post form - blur the textarea
      else if (isInNewPostForm) {
        e.preventDefault();
        textareaRef.current?.blur();
      }
      // Dialog components will handle their own Esc key events
    }
  }, [editingPostId, handleEditCancel, textareaRef]);

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
    
    // If the deleted post was being edited, clear the edit state
    if (editingPostId === id) {
      setEditingPostId(null);
      setEditContent('');
      setShowEditPreview(false);
    }
  };
  
  const handleEditStart = (post: Post) => {
    // If already editing another post
    if (editingPostId && editingPostId !== post.id) {
      // Get the post currently being edited to check for changes
      const currentEditPost = posts.find(p => p.id === editingPostId);
      
      // Check if there are unsaved changes
      const hasUnsavedChanges = currentEditPost && currentEditPost.content !== editContent;
      
      if (hasUnsavedChanges) {
        // Only show confirmation if there are unsaved changes
        setPendingEditPostId(post.id);
        setShowConfirmDialog(true);
        return;
      }
      // Otherwise, just switch to editing the new post without confirmation
    }
    
    // Start editing immediately
    setEditingPostId(post.id);
    setEditContent(post.content);
    setShowEditPreview(showPreview); // Inherit the current preview state
  };
  
  const handleConfirmEditSwitch = () => {
    if (pendingEditPostId) {
      // Switching to a new post
      const postToEdit = posts.find(p => p.id === pendingEditPostId);
      if (postToEdit) {
        setEditingPostId(pendingEditPostId);
        setEditContent(postToEdit.content);
        setShowEditPreview(showPreview);
        setPendingEditPostId(null);
      }
    } else {
      // Confirming to discard changes
      setEditingPostId(null);
      setEditContent('');
      setShowEditPreview(false);
    }
  };
  
  const handleEditSave = () => {
    if (!editingPostId || !editContent.trim()) return;
    
    const updatedPosts = posts.map(post => {
      if (post.id === editingPostId) {
        return {
          ...post,
          content: editContent,
          updatedAt: new Date().toISOString()
        };
      }
      return post;
    });
    
    setPosts(updatedPosts);
    savePosts(updatedPosts);
    
    // Clear edit state
    setEditingPostId(null);
    setEditContent('');
    setShowEditPreview(false);
  };

  return (
    <div className="container mx-auto px-2 py-4 max-w-3xl">
      <HelpDialog
        isOpen={showHelpDialog}
        onClose={() => setShowHelpDialog(false)}
      />
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmEditSwitch}
        title="Unsaved Changes"
        message={pendingEditPostId 
          ? "You have unsaved changes to the note you're currently editing. These changes will be lost if you switch. Continue anyway?"
          : "You have unsaved changes. Discard changes and exit edit mode?"
        }
      />
      <div className="bg-white">
        <div className="flex items-center p-2 bg-gray-100 border-b border-gray-300">
          <h1 className="text-lg">Notepad</h1>
        </div>

        {/* Post form */}
        <div className="p-3 bg-white new-post-form">
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
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <p>
                  {new Date(post.createdAt).toLocaleString()}
                  {post.updatedAt !== post.createdAt && 
                    <span className="italic ml-1">(edited)</span>
                  }
                </p>
                
                {editingPostId !== post.id ? (
                  <div className="flex gap-2">
                    <button
                      className="text-gray-500 hover:text-blue-600"
                      onClick={() => handleEditStart(post)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-gray-500 hover:text-red-600"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      className="text-gray-500 hover:text-green-600"
                      onClick={handleEditSave}
                    >
                      Save
                    </button>
                    <button
                      className="text-gray-500 hover:text-gray-700"
                      onClick={handleEditCancel}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              
              {editingPostId !== post.id ? (
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
              ) : (
                <div className={`edit-mode edit-form-${post.id}`}>
                  {/* Edit textarea */}
                  <textarea
                    className="w-full p-2 bg-white mb-2 outline-none resize-vertical font-mono border border-gray-200"
                    rows={5}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey) {
                        e.preventDefault();
                        handleEditSave();
                      } else if (e.key === 'Escape') {
                        e.preventDefault();
                        handleEditCancel();
                      }
                    }}
                  />
                  
                  {/* Edit controls */}
                  <div className="flex items-center mb-2 text-sm">
                    <input
                      type="checkbox"
                      id={`show-edit-preview-${post.id}`}
                      checked={showEditPreview}
                      onChange={(e) => setShowEditPreview(e.target.checked)}
                      className="mr-1"
                    />
                    <label htmlFor={`show-edit-preview-${post.id}`} className="text-sm">Preview</label>
                  </div>
                  
                  {/* Edit preview */}
                  {showEditPreview && (
                    <div className="w-full p-2 border border-gray-200 prose max-w-none overflow-auto">
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
                        {editContent}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              )}
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
