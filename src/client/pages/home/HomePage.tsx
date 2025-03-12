import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto px-2 py-4 max-w-3xl">
      <div className="bg-white">
        <div className="flex items-center p-2 bg-gray-100 border-b border-gray-300">
          <h1 className="text-lg">Notepad</h1>
        </div>
        <div className="p-4 bg-white">
          <p className="mb-4">Welcome to Notepad!</p>
          <p className="mb-4">
            This is a simple application that allows you to create and manage notes with Markdown support.
            Your notes are stored locally in your browser.
          </p>
          <a
            href="/tl/"
            className="inline-block px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            Open Notes
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
