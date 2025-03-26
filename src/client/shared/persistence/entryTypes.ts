// Base entity that all data types will extend
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Post entity type (current implementation)
export interface Post extends BaseEntity {
  type: 'post';
  content: string;
}

// Union type of all entity types (will expand in future)
export type Entity = Post;

// Type discriminator
export type EntityType = Entity['type'];