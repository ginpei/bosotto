import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Post } from '../../../shared/persistence/entryTypes';

// Define a type for the code component props
interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

interface PostItemProps {
  // Post data
  post: Post;
  
  // State values from parent
  selectedPostId: string | null;
  editingPostId: string | null;
  editContent: string;
  showEditPreview: boolean;
  
  // Refs
  editTextareaRef: React.RefObject<HTMLTextAreaElement>;
  isScrollingRef: React.MutableRefObject<boolean>;
  postsContainerRef: React.RefObject<HTMLDivElement>;
  
  // Function refs
  handleEditStartRef: React.MutableRefObject<(post: Post) => void>;
  handleDeleteClickRef: React.MutableRefObject<(id: string) => void>;
  
  // Functions
  registerPostRef: (id: string, element: HTMLDivElement | null) => void;
  setSelectedPostId: (id: string) => void;
  setEditContent: (content: string) => void;
  setShowEditPreview: (show: boolean) => void;
  handleEditSave: () => void;
  handleEditCancel: () => void;
}

const PostItem: React.FC<PostItemProps> = ({
  post,
  selectedPostId,
  editingPostId,
  editContent,
  showEditPreview,
  editTextareaRef,
  isScrollingRef,
  postsContainerRef,
  handleEditStartRef,
  handleDeleteClickRef,
  registerPostRef,
  setSelectedPostId,
  setEditContent,
  setShowEditPreview,
  handleEditSave,
  handleEditCancel
}) => {
  return (
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
        
        // Cancel any ongoing scrolling animations
        if (isScrollingRef.current && postsContainerRef.current) {
          const originalOverflow = postsContainerRef.current.style.overflow;
          postsContainerRef.current.style.overflow = 'hidden';
          postsContainerRef.current.getBoundingClientRect();
          postsContainerRef.current.style.overflow = originalOverflow;
        }
        
        isScrollingRef.current = true;
        
        setTimeout(() => {
          const selectedElement = document.querySelector(`[data-post-id="${post.id}"]`);
          if (selectedElement) {
            selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Clear the scrolling flag after scrolling completes
            setTimeout(() => {
              isScrollingRef.current = false;
            }, 300); // Smooth scrolling takes ~300ms
          } else {
            isScrollingRef.current = false;
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
              onClick={(e) => {
                e.stopPropagation(); // Prevent post selection
                handleEditStartRef.current(post);
              }}
            >
              Edit
            </button>
            <button
              className="text-gray-500 hover:text-red-600"
              onClick={(e) => {
                e.stopPropagation(); // Prevent post selection
                handleDeleteClickRef.current(post.id);
              }}
            >
              Delete
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              className="text-gray-500 hover:text-green-600"
              onClick={(e) => {
                e.stopPropagation(); // Prevent post selection
                handleEditSave();
              }}
            >
              Save
            </button>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={(e) => {
                e.stopPropagation(); // Prevent post selection
                handleEditCancel();
              }}
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
            onClick={(e) => e.stopPropagation()} // Prevent post selection when clicking in textarea
            onChange={(e) => setEditContent(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                handleEditSave();
              } else if (e.key === 'Escape') {
                e.preventDefault();
                handleEditCancel();
                e.stopPropagation(); // Prevent global handler from also processing Escape
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
              onClick={(e) => e.stopPropagation()} // Prevent post selection
            />
            <label 
              htmlFor={`show-edit-preview-${post.id}`} 
              className="text-sm"
              onClick={(e) => e.stopPropagation()} // Prevent post selection
            >
              Preview
            </label>
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
  );
};

export default PostItem;
