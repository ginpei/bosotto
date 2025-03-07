# 開発ログ

## 2025-03-06

### プロジェクト初期化

- Honoプロジェクトを`npm create hono@latest`で作成（nodejsテンプレート）
- Gitリポジトリを初期化
- 基本的なプロジェクト構造を確認

### 計画

- Twitter風メモ帳アプリを作成
- 投稿内容は時系列に並ぶ
- データはクライアント側（ブラウザ）に保存
- TypeScriptを使用（厳格な型チェック）
- React + Tailwind CSSでUI実装
- Prettierでコードフォーマット

### 実装

- React、React DOM、Tailwind CSS、Vite、Prettierなどの依存関係をインストール
- プロジェクト構造を整理（client/serverディレクトリ）
- Viteの設定
- Tailwind CSSの設定
- TypeScriptの設定を更新
- 基本的なReactコンポーネントを実装
- Honoサーバーを設定
- Prettierの設定
- 初期コミット

### テスト

- Vite開発サーバーを起動
- UIの表示を確認
- 投稿機能のテスト（投稿の作成と削除）
- localStorageによるデータ保存の確認
