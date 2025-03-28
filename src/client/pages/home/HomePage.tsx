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
import SettingsDialog from './components/SettingsDialog';
import PostItem from './components/PostItem';
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
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
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
  const lastKeyPressTime = useRef<number>(0);
  const isScrollingRef = useRef<boolean>(false);
  const lastScrollDirectionRef = useRef<'up' | 'down' | null>(null);
  // Cache for element positions to avoid excessive DOM queries and layout calculations
  const positionCache = useRef<{
    timestamp: number;
    positions: Map<string, { top: number; bottom: number; height: number }>;
  }>({ timestamp: 0, positions: new Map() });

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
      const postIdToSelect = editingPostId;
      setEditingPostId(null);
      setEditContent('');
      setShowEditPreview(false);
      
      // Select the post after canceling edit
      if (postIdToSelect) {
        setSelectedPostId(postIdToSelect);
      }
    }
  }, [editingPostId, editContent, posts]);

  // Create refs to hold the handler functions
  const handleEditStartRef = useRef<(post: Post) => void>(() => {});
  const handleDeleteClickRef = useRef<(id: string) => void>(() => {});
  
  // Implement the delete handler
  const handleDeleteClick = useCallback((id: string) => {
    // Set the post to be deleted and show confirmation dialog
    setPendingDeletePostId(id);
    setShowDeleteConfirmDialog(true);
  }, [setPendingDeletePostId, setShowDeleteConfirmDialog]);

  // Key press handler first, which references handleEditStart
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
    
    // 'e' key to edit currently selected post (when not in input field and a post is selected)
    if (e.key.toLowerCase() === 'e' && !isInInputField && selectedPostId && !isInEditForm && !showHelpDialog && !showConfirmDialog && !showDeleteConfirmDialog) {
      e.preventDefault();
      const selectedPost = posts.find(post => post.id === selectedPostId);
      if (selectedPost) {
        handleEditStartRef.current(selectedPost);
      }
    }
    
    // 'Delete' or 'Backspace' key to delete currently selected post (when not in input field and a post is selected)
    const isDeleteKey = e.key === 'Delete' || e.key === 'Backspace';
    const isMacDelete = e.key === 'Backspace' && e.metaKey; // Common Mac deletion pattern
    
    if ((isDeleteKey || isMacDelete) && !isInInputField && selectedPostId && !isInEditForm && !showHelpDialog && !showConfirmDialog && !showDeleteConfirmDialog) {
      e.preventDefault();
      handleDeleteClickRef.current(selectedPostId);
    }

    // Up/Down arrow keys to navigate between posts
    // Allow navigation when document.body or postsContainerRef has focus (not input fields)
    const target = e.target as HTMLElement;
    const isBodyOrPostsContainer = target === document.body || 
                                   target === postsContainerRef.current ||
                                   postsContainerRef.current?.contains(target);
    
    // Skip arrow key navigation when in any input field or specifically in text areas within edit forms
    if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && 
        (isBodyOrPostsContainer || !isInInputField) && 
        !isInEditForm && !isInNewPostForm && 
        !showHelpDialog && !showConfirmDialog && !showDeleteConfirmDialog) {
      e.preventDefault();
      
      // Check if keys are being pressed rapidly and track scroll direction
      const now = Date.now();
      const timeSinceLastKeyPress = now - lastKeyPressTime.current;
      const isRapidKeyPress = timeSinceLastKeyPress < 200; // 200ms threshold
      lastKeyPressTime.current = now;
      
      
      // Track scroll direction for improved selection logic
      lastScrollDirectionRef.current = e.key === 'ArrowUp' ? 'up' : 'down';
      
      // Use auto scroll behavior for rapid keypresses and when animations are in progress
      const scrollBehavior: ScrollBehavior = (isRapidKeyPress || isScrollingRef.current) ? 'auto' : 'smooth';
      
      // Cancel any ongoing scrolling animations by briefly setting overflow to hidden
      // This prevents overlapping scroll animations from conflicting
      if (isScrollingRef.current && postsContainerRef.current) {
        const originalOverflow = postsContainerRef.current.style.overflow;
        postsContainerRef.current.style.overflow = 'hidden';
        // Force layout recalculation
        postsContainerRef.current.getBoundingClientRect();
        postsContainerRef.current.style.overflow = originalOverflow;
      }
      
      // Set the scrolling flag to prevent new animations from starting while one is in progress
      isScrollingRef.current = true;
      
      const nonEditingPosts = posts.filter(post => post.id !== editingPostId);
      
      // If there are no posts to navigate to, keep the current selection
      if (nonEditingPosts.length === 0) return;
      
      // Get the currently visible posts
      const visibleNonEditingPosts = nonEditingPosts.filter(post => 
        visiblePostIds.includes(post.id)
      );
      
      // Calculate viewport height for "close enough" check
      const viewportHeight = window.innerHeight;
      
      // Helper to get positions of elements with caching
      const getPositionInfo = (postId: string) => {
        const element = document.querySelector(`[data-post-id="${postId}"]`);
        if (!element) return null;
        
        const now = Date.now();
        const cache = positionCache.current;
        
        // Only recalculate positions if cache is older than 100ms or during scroll
        if (now - cache.timestamp > 100 || isScrollingRef.current) {
          // Refresh the entire cache if it's stale
          cache.positions.clear();
          cache.timestamp = now;
          
          // Batch query all posts at once to avoid layout thrashing
          document.querySelectorAll('[data-post-id]').forEach(el => {
            const id = el.getAttribute('data-post-id');
            if (id) {
              const rect = el.getBoundingClientRect();
              cache.positions.set(id, {
                top: rect.top,
                bottom: rect.bottom,
                height: rect.height
              });
            }
          });
        }
        
        // Use cached position if available
        const cachedPosition = cache.positions.get(postId);
        if (cachedPosition) {
          return {
            element,
            ...cachedPosition,
            id: postId
          };
        }
        
        // Fallback to direct calculation if not in cache
        const rect = element.getBoundingClientRect();
        return {
          element,
          top: rect.top,
          bottom: rect.bottom,
          height: rect.height,
          id: postId
        };
      };

      // Helper to check if an element is within one screen height
      const isWithinScreenHeight = (rect: {top: number, bottom: number} | null) => {
        if (!rect) return false;
        return rect.top > -viewportHeight && rect.bottom < viewportHeight * 2;
      };
      
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
              selectedElement.scrollIntoView({ behavior: scrollBehavior, block: 'nearest' });
              
              // Clear the scrolling flag after scrolling completes
              setTimeout(() => {
                isScrollingRef.current = false;
              }, scrollBehavior === 'smooth' ? 300 : 50);
            } else {
              isScrollingRef.current = false;
            }
          }, 10);
          
          return;
        } else {
          // No visible posts, select first post
          const postToSelect = nonEditingPosts[0];
          setSelectedPostId(postToSelect.id);
          
          // Scroll into view
          setTimeout(() => {
            const selectedElement = document.querySelector(`[data-post-id="${postToSelect.id}"]`);
            if (selectedElement) {
              selectedElement.scrollIntoView({ behavior: scrollBehavior, block: 'nearest' });
              
              // Clear the scrolling flag after scrolling completes
              setTimeout(() => {
                isScrollingRef.current = false;
              }, scrollBehavior === 'smooth' ? 300 : 50);
            } else {
              isScrollingRef.current = false;
            }
          }, 10);
          
          return;
        }
      }
      
      // Find the current index
      const currentIndex = nonEditingPosts.findIndex(post => post.id === selectedPostId);
      if (currentIndex === -1) {
        // Selected post not found (might have been deleted), select first visible post
        if (visibleNonEditingPosts.length > 0) {
          setSelectedPostId(visibleNonEditingPosts[0].id);
        } else {
          setSelectedPostId(nonEditingPosts[0].id);
        }
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
      
      // Get the next post ID
      const nextPostId = nonEditingPosts[nextIndex].id;
      
      // Get position info for the target post
      const nextPostInfo = getPositionInfo(nextPostId);
      
      // Check if the next post is visible
      const isNextPostVisible = visiblePostIds.includes(nextPostId);
      
      // Case 2: Next post is visible - select it
      if (isNextPostVisible) {
        setSelectedPostId(nextPostId);
        setTimeout(() => {
          if (nextPostInfo?.element) {
            nextPostInfo.element.scrollIntoView({ behavior: scrollBehavior, block: 'nearest' });
            
            // Clear the scrolling flag after scrolling completes
            setTimeout(() => {
              isScrollingRef.current = false;
            }, scrollBehavior === 'smooth' ? 300 : 50);
          } else {
            isScrollingRef.current = false;
          }
        }, 10);
        return;
      }
      
      // Case 3: Next post is within one screen height - select it
      if (isWithinScreenHeight(nextPostInfo)) {
        setSelectedPostId(nextPostId);
        setTimeout(() => {
          if (nextPostInfo?.element) {
            nextPostInfo.element.scrollIntoView({ behavior: scrollBehavior, block: 'nearest' });
            
            // Clear the scrolling flag after scrolling completes
            setTimeout(() => {
              isScrollingRef.current = false;
            }, scrollBehavior === 'smooth' ? 300 : 50);
          } else {
            isScrollingRef.current = false;
          }
        }, 10);
        return;
      }
      
      // Case 4: Next post is too far away - select first visible post in the direction of navigation
      if (visibleNonEditingPosts.length > 0) {
        // Direction-aware selection based on navigation direction
        let postToSelect;
        
        if (lastScrollDirectionRef.current === 'up') {
          // When scrolling up, prefer the last (bottom-most) visible post
          postToSelect = visibleNonEditingPosts[visibleNonEditingPosts.length - 1];
        } else {
          // When scrolling down, prefer the first (top-most) visible post
          postToSelect = visibleNonEditingPosts[0];
        }
        
        setSelectedPostId(postToSelect.id);
        
        setTimeout(() => {
          const selectedElement = document.querySelector(`[data-post-id="${postToSelect.id}"]`);
          if (selectedElement) {
            selectedElement.scrollIntoView({ behavior: scrollBehavior, block: 'nearest' });
            
            // Clear the scrolling flag after scrolling completes (with a delay matching animation)
            setTimeout(() => {
              isScrollingRef.current = false;
            }, scrollBehavior === 'smooth' ? 300 : 50);
          } else {
            isScrollingRef.current = false;
          }
        }, 10);
      } else {
        // If there are no visible posts but we have a next post, select it anyway
        setSelectedPostId(nextPostId);
        setTimeout(() => {
          if (nextPostInfo?.element) {
            nextPostInfo.element.scrollIntoView({ behavior: scrollBehavior, block: 'nearest' });
            
            // Clear the scrolling flag after scrolling completes
            setTimeout(() => {
              isScrollingRef.current = false;
            }, scrollBehavior === 'smooth' ? 300 : 50);
          } else {
            isScrollingRef.current = false;
          }
        }, 10);
      }
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
      else if (selectedPostId !== null && !showHelpDialog && !showConfirmDialog && !showSettingsDialog && !showDeleteConfirmDialog) {
        e.preventDefault();
        setSelectedPostId(null);
      }
      // Dialog components will handle their own Esc key events
    }
  }, [editingPostId, handleEditCancel, textareaRef, posts, selectedPostId, showHelpDialog, showConfirmDialog, showSettingsDialog, showDeleteConfirmDialog, visiblePostIds]);

  // Implement the actual edit start handler
  const handleEditStart = useCallback((post: Post) => {
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
  }, [editingPostId, editContent, posts, setPendingEditPostId, setShowConfirmDialog, setEditingPostId, setEditContent, showPreview, setShowEditPreview, focusAndSelectEditTextarea]);

  // Assign the handlers to our refs so they can be accessed from anywhere
  useEffect(() => {
    handleEditStartRef.current = handleEditStart;
    handleDeleteClickRef.current = handleDeleteClick;
  }, [handleEditStart, handleDeleteClick]);

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

  const handleAddPost = useCallback(() => {
    if (!newPostContent.trim()) return;
    addPost(newPostContent);
    setNewPostContent('');
  }, [newPostContent, addPost, setNewPostContent]);
  
  const handleConfirmDelete = useCallback(() => {
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
  }, [
    pendingDeletePostId, 
    deletePost, 
    editingPostId, 
    selectedPostId, 
    setEditingPostId, 
    setEditContent, 
    setShowEditPreview, 
    setSelectedPostId, 
    setShowDeleteConfirmDialog, 
    setPendingDeletePostId
  ]);
  
  const handleConfirmEditSwitch = useCallback(() => {
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
      const postIdToSelect = editingPostId;
      setEditingPostId(null);
      setEditContent('');
      setShowEditPreview(false);
      
      // Select the post after canceling edit with confirmation
      if (postIdToSelect) {
        setSelectedPostId(postIdToSelect);
      }
    }
  }, [
    pendingEditPostId,
    posts,
    setEditingPostId,
    setEditContent,
    showPreview,
    setShowEditPreview,
    setPendingEditPostId,
    focusAndSelectEditTextarea,
    editingPostId,
    setSelectedPostId
  ]);
  
  const handleEditSave = useCallback(() => {
    if (!editingPostId || !editContent.trim()) return;
    
    updatePost(editingPostId, editContent);
    
    // Store post ID before clearing edit state
    const postIdToSelect = editingPostId;
    
    // Clear edit state
    setEditingPostId(null);
    setEditContent('');
    setShowEditPreview(false);
    
    // Select the post after saving
    setSelectedPostId(postIdToSelect);
  }, [
    editingPostId, 
    editContent, 
    updatePost, 
    setEditingPostId, 
    setEditContent, 
    setShowEditPreview, 
    setSelectedPostId
  ]);

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
      <SettingsDialog
        isOpen={showSettingsDialog}
        onClose={() => setShowSettingsDialog(false)}
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
        <div className="flex justify-between items-center p-2 bg-gray-100 border-b border-gray-300">
          <h1 className="text-lg">Bosotto</h1>
          <button
            onClick={() => setShowSettingsDialog(true)}
            className="text-gray-500 hover:text-gray-700 p-1"
            aria-label="Settings"
            title="Settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
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
          {posts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              selectedPostId={selectedPostId}
              editingPostId={editingPostId}
              editContent={editContent}
              showEditPreview={showEditPreview}
              editTextareaRef={editTextareaRef}
              isScrollingRef={isScrollingRef}
              postsContainerRef={postsContainerRef}
              handleEditStartRef={handleEditStartRef}
              handleDeleteClickRef={handleDeleteClickRef}
              registerPostRef={registerPostRef}
              setSelectedPostId={setSelectedPostId}
              setEditContent={setEditContent}
              setShowEditPreview={setShowEditPreview}
              handleEditSave={handleEditSave}
              handleEditCancel={handleEditCancel}
            />
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
