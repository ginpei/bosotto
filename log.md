# 開発ログ

## 目次
- [2025-03-06](#2025-03-06-1) - プロジェクト初期化、計画、実装
- [2025-03-06](#2025-03-06-2) - タイムラインページの移動、開発スクリプトの改善
- [2025-03-07](#2025-03-07) - 開発スクリプトの最適化

## 2025-03-06 {#2025-03-06-1}

### プロジェクト初期化 #setup #init

#### 計画と実装
- Honoプロジェクトを`npm create hono@latest`で作成（nodejsテンプレート）
- Gitリポジトリを初期化
- 基本的なプロジェクト構造を確認

#### AI Context
- **フレームワーク選択**: Honoを選択した理由は軽量さとTypeScriptサポートの充実
- **プロジェクト構造**: 
  - `src/client/` - フロントエンド（React）
  - `src/server/` - バックエンド（Hono）
- **関連ファイル**: 
  - [`package.json`](./package.json) - 依存関係の管理
  - [`tsconfig.json`](./tsconfig.json) - TypeScript設定

### 計画 #planning

#### 機能要件
- Twitter風メモ帳アプリを作成
- 投稿内容は時系列に並ぶ
- データはクライアント側（ブラウザ）に保存

#### 技術スタック
- TypeScriptを使用（厳格な型チェック）
- React + Tailwind CSSでUI実装
- Prettierでコードフォーマット

#### AI Context
- **クライアントサイドストレージ**: サーバー側のデータベースではなくlocalStorageを使用する決定
- **TypeScript**: 型安全性を確保するため厳格な設定を採用
- **UI設計方針**: シンプルで使いやすいインターフェースを優先

### 実装 #implementation

#### 依存関係のセットアップ
- React、React DOM、Tailwind CSS、Vite、Prettierなどの依存関係をインストール
```bash
npm install react react-dom
npm install -D @vitejs/plugin-react tailwindcss postcss autoprefixer vite prettier
```

#### プロジェクト構造の整理
- プロジェクト構造を整理（client/serverディレクトリ）
- Viteの設定
- Tailwind CSSの設定
- TypeScriptの設定を更新
- 基本的なReactコンポーネントを実装
- Honoサーバーを設定
- Prettierの設定
- 初期コミット

#### AI Context
- **ディレクトリ構造**: クライアントとサーバーを明確に分離し、関心の分離を実現
- **ビルドツール**: Viteを選択した理由は高速な開発体験とHMRのサポート
- **コード規約**: Prettierを使用して一貫したコードスタイルを維持
- **関連ファイル**:
  - [`src/index.ts`](./src/index.ts) - サーバーのエントリーポイント
  - [`src/client/index.tsx`](./src/client/index.tsx) - クライアントのエントリーポイント
  - [`vite.config.ts`](./vite.config.ts) - Viteの設定

### テスト #testing

#### 機能テスト
- Vite開発サーバーを起動
- UIの表示を確認
- 投稿機能のテスト（投稿の作成と削除）
- localStorageによるデータ保存の確認

#### AI Context
- **テスト方法**: 手動テストを実施、自動テストは今後の課題
- **確認ポイント**: UI表示、データの永続化、基本的なCRUD操作

## 2025-03-06 {#2025-03-06-2}

### タイムラインページの移動 #refactor #routing

#### 計画
- タイムラインページを `/` から `/tl/` に移動
- SPAではなく、各ページごとに独立したエントリーポイントを持つ構造に変更
- ページ固有のコンポーネントと共通コンポーネントを分離

#### 実装
- 新しいディレクトリ構造を作成
  - `src/client/pages/home/` - ホームページ用
  - `src/client/pages/tl/` - タイムラインページ用
  - `src/client/shared/` - 共有コンポーネント用
- 現在の `App.tsx` の内容を `TimelinePage.tsx` に移動
- 新しいホームページコンポーネント `HomePage.tsx` を作成
- 各ページ用のエントリーポイントを作成
- Vite の設定を更新して複数のエントリーポイントをサポート
- サーバー側の設定を更新して新しいルートを処理
- `.gitignore` に `dist/` ディレクトリを追加し、ビルド成果物がリポジトリに含まれないようにした

#### 決定事項
- UI自体は変更せず、ファイル構造とルーティングのみ変更
- ページ固有のコンポーネントは各ページディレクトリ内の `components/` に配置
- 共通コンポーネントは `shared/` ディレクトリに配置

#### AI Context
- **アーキテクチャ変更**: SPAからMPAへの移行理由は、各ページの独立性を高めるため
- **コンポーネント設計**: 再利用可能なコンポーネントと特定のページに紐づくコンポーネントを明確に分離
- **ビルド最適化**: 各ページごとに独立したバンドルを生成することで、初期ロード時間を改善
- **関連ファイル**:
  - [`src/client/pages/tl/TimelinePage.tsx`](./src/client/pages/tl/TimelinePage.tsx) - タイムラインページコンポーネント
  - [`src/client/pages/home/HomePage.tsx`](./src/client/pages/home/HomePage.tsx) - ホームページコンポーネント
  - [`vite.config.ts`](./vite.config.ts) - マルチページ設定

### 開発スクリプトの改善 #devops

#### 計画
- サーバーとクライアントの開発サーバーを同時に起動できるようにする
- 既存のスクリプトを整理して使いやすくする

#### 実装
- `concurrently` パッケージをインストール
```bash
npm install -D concurrently
```
- package.jsonのスクリプトを更新
  - 既存の `dev` スクリプトを `dev:server` にリネーム
  - 新しい `dev` スクリプトを追加して、`dev:server` と `dev:client` を同時に実行するように設定

#### 決定事項
- `npm run dev` で両方のサーバーを同時に起動
- 個別に起動したい場合は `npm run dev:server` または `npm run dev:client` を使用
- 出力を見やすくするために、concurrentlyの色分け機能を使用

#### AI Context
- **開発体験の改善**: 複数のコマンドを手動で実行する必要がなくなり、開発効率が向上
- **並行処理**: concurrentlyを使用して複数のプロセスを効率的に管理
- **関連ファイル**:
  - [`package.json`](./package.json) - スクリプト設定
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\" --names \"server,client\" --prefix-colors \"blue,green\"",
    "dev:server": "tsx watch src/index.ts",
    "dev:client": "vite"
  }
}
```

## 2025-03-07 {#2025-03-07}

### 開発スクリプトの最適化 #devops #performance

#### 計画
- `dev:client` コマンドからウェブサーバー機能を削除し、ファイルビルドのみを行うように変更
- `dev:server` が既にウェブサーバーを提供しているため、重複を避ける

#### 実装
- `package.json` の `dev:client` スクリプトを変更
  - 変更前: `"dev:client": "vite"`
  - 変更後: `"dev:client": "vite build --watch"`

#### 決定事項
- `npm run dev:client` はファイルの変更を監視して自動的にビルドするが、サーバーは起動しない
- `npm run dev:server` は引き続き Hono サーバーを起動して、ビルドされたファイルを配信する
- `npm run dev` は両方を同時に実行するので、開発体験は変わらない

#### AI Context
- **リソース最適化**: 重複するウェブサーバーを排除することでリソース使用量を削減
- **ビルドプロセス**: watchモードを使用して継続的なビルドを実現しつつ、サーバー機能は分離
- **関連ファイル**:
  - [`package.json`](./package.json) - 更新されたスクリプト設定
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\" --names \"server,client\" --prefix-colors \"blue,green\"",
    "dev:server": "tsx watch src/index.ts",
    "dev:client": "vite build --watch"
  }
}
```
