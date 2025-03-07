import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">ホーム</h1>
      <div className="p-4 bg-white rounded-lg shadow">
        <p className="mb-4">Twitter風メモ帳へようこそ！</p>
        <a
          href="/tl/"
          className="inline-block px-4 py-2 bg-blue-500 text-white rounded-full font-bold"
        >
          タイムラインを見る
        </a>
      </div>
    </div>
  );
};

export default HomePage;
