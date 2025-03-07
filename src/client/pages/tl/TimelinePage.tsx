import React, { useState, useEffect } from 'react';

interface Post {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const TimelinePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');

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
        <textarea
          className="w-full p-2 border rounded-lg mb-2"
          rows={3}
          placeholder="What are you doing now?"
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.currentTarget.value)}
        />
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-full font-bold"
            onClick={handleAddPost}
          >
            Post
          </button>
        </div>
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
            <p className="mt-2 whitespace-pre-wrap">{post.content}</p>
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
