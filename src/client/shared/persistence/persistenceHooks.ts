import { useState, useEffect, useCallback } from 'react';
import { BaseEntity, Entity, EntityType, Post } from './entryTypes';
import { 
  PersistenceStore, 
  CURRENT_VERSION,
  DEFAULT_STORE,
  initializeStore, 
  getEntities,
  addEntity,
  updateEntity,
  deleteEntity,
  updateEntities
} from './persistenceStore';

/**
 * Hook for accessing and managing the entire persistence store
 * @returns [store, isLoading, error, updateStore]
 */
export function usePersistenceStore(): [PersistenceStore, boolean, Error | null, (newStore: PersistenceStore) => void] {
  const [store, setStore] = useState<PersistenceStore>(DEFAULT_STORE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Initialize the store on component mount
  useEffect(() => {
    try {
      const initializedStore = initializeStore();
      setStore(initializedStore);
      setIsLoading(false);
    } catch (err) {
      console.error('Error initializing persistence store:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setIsLoading(false);
    }
  }, []);

  // Generic method for updating the store
  const updateStore = useCallback((newStore: PersistenceStore) => {
    setStore(newStore);
  }, []);

  return [store, isLoading, error, updateStore];
}

/**
 * Hook for managing posts specifically
 * @returns [posts, isLoading, error, addPost, updatePost, deletePost]
 */
export function usePosts(): [
  Post[], 
  boolean, 
  Error | null, 
  (content: string) => Post,
  (id: string, content: string) => Post | null,
  (id: string) => void
] {
  const [store, isLoading, error, updateStore] = usePersistenceStore();
  
  // Get all posts
  const posts = getEntities<Post>(store, 'post');
  
  // Add a new post
  const addPost = useCallback((content: string) => {
    const now = new Date().toISOString();
    const newPost: Post = {
      id: Date.now().toString(),
      type: 'post',
      content,
      createdAt: now,
      updatedAt: now,
    };
    
    const newStore = addEntity(store, newPost);
    updateStore(newStore);
    return newPost;
  }, [store, updateStore]);
  
  // Update an existing post
  const updatePost = useCallback((id: string, content: string) => {
    const existingPost = posts.find(post => post.id === id);
    if (!existingPost) return null;
    
    const updatedPost: Post = {
      ...existingPost,
      content,
      updatedAt: new Date().toISOString(),
    };
    
    const newStore = updateEntity(store, updatedPost);
    updateStore(newStore);
    return updatedPost;
  }, [store, updateStore, posts]);
  
  // Delete a post
  const deletePost = useCallback((id: string) => {
    const newStore = deleteEntity(store, 'post', id);
    updateStore(newStore);
  }, [store, updateStore]);
  
  return [posts, isLoading, error, addPost, updatePost, deletePost];
}