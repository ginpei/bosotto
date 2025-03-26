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
import { usePosts } from '../../shared/persistence/persistenceHooks';
import { Post } from '../../shared/persistence/entryTypes';

// Define a type for the code component props
interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

const HomePage: React.FC = () => {
  const [
    posts, 
    isLoading, 
    error, 
    addPost, 
    updatePost, 
    deletePost
  ] = usePosts();
  
  const [newPostContent, setNewPostContent] = useState('');
  const [showPreview, setShowPreview] = useState(true);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [showEditPreview, setShowEditPreview] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingEditPostId, setPendingEditPostId] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [visiblePostIds, setVisiblePostIds] = useState<string[]>([]);
  const [pendingDeletePostId, setPendingDeletePostId] = useState<string | null>(null);
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);
  const postsContainerRef = useRef<HTMLDivElement>(null);
  const postRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Function to focus and select text in edit textarea
  const focusAndSelectEditTextarea = useCallback(() => {
    // Use a slightly longer timeout to ensure the component is fully rendered
    setTimeout(() => {
      if (editTextareaRef.current) {
        editTextareaRef.current.focus();
        editTextareaRef.current.select();
      }
    }, 10);
  }, []);

  useEffect(() => {
    if (error) {
      console.error('Error loading posts:', error);
    }
  }, [error]);

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

    // '?' key to show help dialog (only when not in text input)
    if (e.key === '?' && !isInInputField) {
      e.preventDefault();
      setShowHelpDialog(true);
    }

    // Up/Down arrow keys to navigate between posts
    // Allow navigation when document.body or postsContainerRef has focus (not input fields)
    const target = e.target as HTMLElement;
    const isBodyOrPostsContainer = target === document.body || 
                                   target === postsContainerRef.current ||
                                   postsContainerRef.current?.contains(target);
    
    if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && 
        (isBodyOrPostsContainer || !isInInputField) && 
        !showHelpDialog && !showConfirmDialog && !showDeleteConfirmDialog) {
      e.preventDefault();
      const nonEditingPosts = posts.filter(post => post.id !== editingPostId);
      
      // If there are no posts to navigate to, keep the current selection
      if (nonEditingPosts.length === 0) return;
      
      // Get the currently visible posts
      const visibleNonEditingPosts = nonEditingPosts.filter(post => 
        visiblePostIds.includes(post.id)
      );
      
      // Case 1: No post is selected yet
      if (selectedPostId === null) {
        if (visibleNonEditingPosts.length > 0) {
          // Always select first (top) visible post regardless of key
          const postToSelect = visibleNonEditingPosts[0]; // First visible
          
          setSelectedPostId(postToSelect.id);
          
          // Scroll into view
          setTimeout(() => {
            const selectedElement = document.querySelector(`[data-post-id="${postToSelect.id}"]`);
            if (selectedElement) {
              selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          }, 10);
          
          return;
        } else {
          // No visible posts, fall back to selecting first/last post
          const postIdToSelect = e.key === 'ArrowUp' 
            ? nonEditingPosts[0].id
            : nonEditingPosts[nonEditingPosts.length - 1].id;
            
          setSelectedPostId(postIdToSelect);
          
          // Scroll into view
          setTimeout(() => {
            const selectedElement = document.querySelector(`[data-post-id="${postIdToSelect}"]`);
            if (selectedElement) {
              selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          }, 10);
          
          return;
        }
      }
      
      // Case 2: A post is selected but not visible
      const isSelectedPostVisible = visiblePostIds.includes(selectedPostId);
      if (!isSelectedPostVisible) {
        if (visibleNonEditingPosts.length > 0) {
          // Always select first (top) visible post regardless of key
          const postToSelect = visibleNonEditingPosts[0]; // First visible
          
          setSelectedPostId(postToSelect.id);
          
          // Scroll into view
          setTimeout(() => {
            const selectedElement = document.querySelector(`[data-post-id="${postToSelect.id}"]`);
            if (selectedElement) {
              selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          }, 10);
          
          return;
        } else {
          // If no posts are visible and we have a selection, keep the selection
          return;
        }
      }
      
      // Case 3: A post is selected and visible - use normal navigation
      
      // Normal post navigation when a post is already selected and visible
      // Find the current index
      const currentIndex = nonEditingPosts.findIndex(post => post.id === selectedPostId);
      if (currentIndex === -1) {
        // Selected post not found (might have been deleted), select first post
        setSelectedPostId(nonEditingPosts[0].id);
        return;
      }
      
      // Calculate the next index based on direction
      let nextIndex;
      if (e.key === 'ArrowUp') {
        // If already at the first post and pressing up, stay at the first post
        nextIndex = currentIndex > 0 ? currentIndex - 1 : currentIndex;
      } else {
        // If already at the last post and pressing down, stay at the last post
        nextIndex = currentIndex < nonEditingPosts.length - 1 ? currentIndex + 1 : currentIndex;
      }
      
      // Set the selected post ID
      const newSelectedId = nonEditingPosts[nextIndex].id;
      setSelectedPostId(newSelectedId);
      
      // Scroll the selected post into view after a short delay to allow rendering
      setTimeout(() => {
        const selectedElement = document.querySelector(`[data-post-id="${newSelectedId}"]`);
        if (selectedElement) {
          selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 10);
    }

    // Escape to cancel editing or blur new post textarea or deselect post
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
      // Deselect post if one is selected
      else if (selectedPostId !== null && !showHelpDialog && !showConfirmDialog) {
        e.preventDefault();
        setSelectedPostId(null);
      }
      // Dialog components will handle their own Esc key events
    }
  }, [editingPostId, handleEditCancel, textareaRef, posts, selectedPostId, showHelpDialog, showConfirmDialog, showDeleteConfirmDialog, visiblePostIds]);

  useKeydown(handleKeyPress);
  
  // Focus on textarea whenever editingPostId changes to a new value
  useEffect(() => {
    if (editingPostId) {
      focusAndSelectEditTextarea();
    }
  }, [editingPostId, focusAndSelectEditTextarea]);

  // Store the observer for use in component
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  // Setup Intersection Observer to track visible posts
  useEffect(() => {
    // Create a new IntersectionObserver
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Use a single state update to avoid multiple re-renders
        setVisiblePostIds(prev => {
          let updated = [...prev];
          let hasChanges = false;
          
          // Process all entries
          entries.forEach(entry => {
            const postId = entry.target.getAttribute('data-post-id');
            if (!postId) return;
            
            if (entry.isIntersecting) {
              // Add to visible list if not already included
              if (!updated.includes(postId)) {
                updated.push(postId);
                hasChanges = true;
              }
            } else {
              // Remove from visible list
              const index = updated.indexOf(postId);
              if (index !== -1) {
                updated.splice(index, 1);
                hasChanges = true;
              }
            }
          });
          
          // Only return a new array if there were changes
          return hasChanges ? updated : prev;
        });
      },
      {
        root: null, // Use viewport as root
        rootMargin: '0px',
        threshold: 0.1 // Even a small part visible counts
      }
    );
    
    // Clean up observer on unmount
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []); // Empty dependency array - only run once
  
  // Function to register a post element with the observer
  const registerPostRef = useCallback((postId: string, element: HTMLDivElement | null) => {
    if (!element) return;
    
    // Wait for observer to be initialized
    if (!observerRef.current) {
      // If observer not ready, retry after a short delay
      setTimeout(() => registerPostRef(postId, element), 0);
      return;
    }
    
    // Start observing this element
    observerRef.current.observe(element);
    
    // Return cleanup function for when component unmounts
    return () => {
      if (observerRef.current) {
        try {
          observerRef.current.unobserve(element);
        } catch (e) {
          // Ignore errors if element no longer exists
        }
      }
    };
  }, []);

  // Add global click handler to deselect post when clicking outside post items
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Get the target element
      const target = e.target as HTMLElement;
      
      // Find the closest post item (if any)
      const clickedPostItem = target.closest('[data-post-item="true"]');
      
      // If the click wasn't on a post item and not in a dialog, deselect
      if (!clickedPostItem && !target.closest('dialog')) {
        setSelectedPostId(null);
      }
    };
    
    document.addEventListener('click', handleGlobalClick);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  const handleAddPost = () => {
    if (!newPostContent.trim()) return;
    addPost(newPostContent);
    setNewPostContent('');
  };

  const handleDeleteClick = (id: string) => {
    // Set the post to be deleted and show confirmation dialog
    setPendingDeletePostId(id);
    setShowDeleteConfirmDialog(true);
  };
  
  const handleConfirmDelete = () => {
    // Only proceed if we have a valid post ID
    if (!pendingDeletePostId) return;
    
    // Actually delete the post
    deletePost(pendingDeletePostId);
    
    // If the deleted post was being edited, clear the edit state
    if (editingPostId === pendingDeletePostId) {
      setEditingPostId(null);
      setEditContent('');
      setShowEditPreview(false);
    }

    // If the deleted post was selected, deselect it
    if (selectedPostId === pendingDeletePostId) {
      setSelectedPostId(null);
    }
    
    // Close dialog and clear pending delete
    setShowDeleteConfirmDialog(false);
    setPendingDeletePostId(null);
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
    
    // Focus and select text after the component renders
    focusAndSelectEditTextarea();
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
        
        // Focus and select text after the component renders
        focusAndSelectEditTextarea();
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
    
    updatePost(editingPostId, editContent);
    
    // Clear edit state
    setEditingPostId(null);
    setEditContent('');
    setShowEditPreview(false);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-2 py-4 max-w-3xl">
        <div className="text-center p-6">
          <p>Loading your notes...</p>
        </div>
      </div>
    );
  }

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
        confirmLabel={pendingEditPostId ? "Switch & Discard" : "Discard Changes"}
        cancelLabel={pendingEditPostId ? "Continue Editing" : "Keep Editing"}
      />
      <ConfirmDialog
        isOpen={showDeleteConfirmDialog}
        onClose={() => setShowDeleteConfirmDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Note"
        message="Are you sure you want to delete this note? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
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
        <div 
          className="bg-white border-t border-gray-300" 
          ref={postsContainerRef}
          onClick={(e) => {
            // Only deselect if clicking directly on the container, not on a post
            if (e.target === e.currentTarget) {
              setSelectedPostId(null);
            }
          }}
        >
          {posts.map((post, index) => (
            <div 
              key={post.id}
              ref={(element) => registerPostRef(post.id, element)}
              data-post-item="true"
              data-post-id={post.id}
              className={`p-3 transition-colors hover:bg-gray-50 group ${
                selectedPostId === post.id 
                  ? 'bg-gray-50 border-l-2 border-gray-400' 
                  : ''
              }`}
              onClick={() => {
                setSelectedPostId(post.id);
                // Also scroll this element into view when clicked
                setTimeout(() => {
                  const selectedElement = document.querySelector(`[data-post-id="${post.id}"]`);
                  if (selectedElement) {
                    selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                  }
                }, 10);
              }}
            >
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <p>
                  {new Date(post.createdAt).toLocaleString()}
                  {post.updatedAt !== post.createdAt && 
                    <span className="italic ml-1">(edited)</span>
                  }
                </p>
                
                {editingPostId !== post.id ? (
                  <div className={`flex gap-2 transition-opacity ${
                    selectedPostId === post.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}>
                    <button
                      className="text-gray-500 hover:text-blue-600"
                      onClick={() => handleEditStart(post)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-gray-500 hover:text-red-600"
                      onClick={() => handleDeleteClick(post.id)}
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
                    ref={editTextareaRef}
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
