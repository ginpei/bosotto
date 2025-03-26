import { BaseEntity, Entity, EntityType, Post } from './entryTypes';

// Structure of our persistence store
export interface PersistenceStore {
  version: number;
  posts: Post[];
  // Future entity collections will be added here
}

// Current version of the persistence schema
export const CURRENT_VERSION = 1;

// Default empty state
export const DEFAULT_STORE: PersistenceStore = {
  version: CURRENT_VERSION,
  posts: [],
};

// Storage key for our persistence data
const STORAGE_KEY = 'bosotto:data';

// Legacy storage key (pre-versioning)
const LEGACY_POSTS_KEY = 'posts';

/**
 * Initialize the persistence store, running migrations if needed
 */
export function initializeStore(): PersistenceStore {
  try {
    // Try to load from new storage format
    const storedData = localStorage.getItem(STORAGE_KEY);
    
    if (storedData) {
      const parsedData: PersistenceStore = JSON.parse(storedData);
      
      // Check if we need to run migrations
      if (parsedData.version < CURRENT_VERSION) {
        return migrateStore(parsedData);
      }
      
      return parsedData;
    }
    
    // Check for legacy data
    const legacyPosts = localStorage.getItem(LEGACY_POSTS_KEY);
    if (legacyPosts) {
      return migrateLegacyData(legacyPosts);
    }
    
    // No existing data, return default store
    return { ...DEFAULT_STORE };
  } catch (error) {
    console.error('Error initializing persistence store:', error);
    // Return a fresh store on error
    return { ...DEFAULT_STORE };
  }
}

/**
 * Save the entire persistence store to localStorage
 */
export function saveStore(store: PersistenceStore): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (error) {
    console.error('Error saving persistence store:', error);
  }
}

/**
 * Migrate from legacy data format
 */
function migrateLegacyData(legacyData: string): PersistenceStore {
  try {
    // Parse the legacy posts
    const oldPosts = JSON.parse(legacyData);
    
    // Create new store with proper version
    const newStore: PersistenceStore = {
      ...DEFAULT_STORE,
      posts: oldPosts.map((post: any) => ({
        ...post,
        type: 'post', // Add the type discriminator
      })),
    };
    
    // Save the migrated store
    saveStore(newStore);
    
    // Optionally backup the old data
    localStorage.setItem('posts_backup', legacyData);
    
    return newStore;
  } catch (error) {
    console.error('Error migrating legacy data:', error);
    return { ...DEFAULT_STORE };
  }
}

/**
 * Run migrations on the persistence store to bring it up to the current version
 * In the future, this will contain version-specific migrations
 */
function migrateStore(oldStore: PersistenceStore): PersistenceStore {
  // For now, we just return the store with updated version
  // In the future, this will run specific migrations based on version
  const newStore = {
    ...oldStore,
    version: CURRENT_VERSION,
  };
  
  // Save the migrated store
  saveStore(newStore);
  
  return newStore;
}

/**
 * Get all entities of a specific type
 */
export function getEntities<T extends Entity>(store: PersistenceStore, type: EntityType): T[] {
  // For now, we only have posts
  if (type === 'post') {
    return store.posts as T[];
  }
  
  // Future entity types will be handled here
  return [];
}

/**
 * Update the store with new entities of a specific type
 */
export function updateEntities<T extends Entity>(store: PersistenceStore, type: EntityType, entities: T[]): PersistenceStore {
  // Create a new store to maintain immutability
  const newStore = { ...store };
  
  // Update the appropriate collection
  if (type === 'post') {
    newStore.posts = entities as Post[];
  }
  
  // Future entity types will be handled here
  
  // Save the updated store
  saveStore(newStore);
  
  return newStore;
}

/**
 * Add a new entity to the store
 */
export function addEntity<T extends Entity>(store: PersistenceStore, entity: T): PersistenceStore {
  // Create a new store to maintain immutability
  const newStore = { ...store };
  
  // Add to the appropriate collection based on type
  if (entity.type === 'post') {
    newStore.posts = [entity as Post, ...newStore.posts];
  }
  
  // Future entity types will be handled here
  
  // Save the updated store
  saveStore(newStore);
  
  return newStore;
}

/**
 * Update an existing entity in the store
 */
export function updateEntity<T extends Entity>(store: PersistenceStore, entity: T): PersistenceStore {
  // Create a new store to maintain immutability
  const newStore = { ...store };
  
  // Update in the appropriate collection based on type
  if (entity.type === 'post') {
    newStore.posts = newStore.posts.map(post => 
      post.id === entity.id ? (entity as Post) : post
    );
  }
  
  // Future entity types will be handled here
  
  // Save the updated store
  saveStore(newStore);
  
  return newStore;
}

/**
 * Delete an entity from the store
 */
export function deleteEntity(store: PersistenceStore, type: EntityType, id: string): PersistenceStore {
  // Create a new store to maintain immutability
  const newStore = { ...store };
  
  // Remove from the appropriate collection based on type
  if (type === 'post') {
    newStore.posts = newStore.posts.filter(post => post.id !== id);
  }
  
  // Future entity types will be handled here
  
  // Save the updated store
  saveStore(newStore);
  
  return newStore;
}