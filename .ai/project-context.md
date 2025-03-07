# Project Context: Twitter-style Notepad

This document provides an overview of the project structure and architecture to help AI agents quickly understand the codebase.

## Project Overview

This is a Twitter-style notepad application that allows users to:
- Create short posts/notes
- View posts in chronological order
- Delete posts
- Store data locally in the browser

The application has a simple architecture with a client-server setup, though all data is stored client-side using localStorage.

## Technology Stack

- **Frontend**:
  - React 19
  - TypeScript
  - Tailwind CSS
  - Vite (build tool)

- **Backend**:
  - Hono (lightweight web framework)
  - Node.js
  - TypeScript

- **Development Tools**:
  - Prettier (code formatting)
  - Concurrently (running multiple processes)
  - TSX (TypeScript execution)

## Directory Structure

```
/
├── .ai/                    # AI agent documentation
├── src/                    # Source code
│   ├── client/             # Frontend code
│   │   ├── pages/          # Page components
│   │   │   ├── home/       # Home page
│   │   │   └── tl/         # Timeline page
│   │   └── shared/         # Shared components
│   ├── server/             # Backend code
│   └── index.ts            # Server entry point
├── dist/                   # Build output (not in repository)
├── vite-plugins/           # Custom Vite plugins
├── index.html              # Home page HTML template
├── tl.html                 # Timeline page HTML template
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies and scripts
└── log.md                  # Development log
```

## Key Components

### Frontend

1. **HomePage (`src/client/pages/home/HomePage.tsx`)**:
   - Simple welcome page with a link to the timeline

2. **TimelinePage (`src/client/pages/tl/TimelinePage.tsx`)**:
   - Main application interface
   - Displays a form to create new posts
   - Shows a list of existing posts
   - Allows deleting posts
   - Manages localStorage for data persistence

### Backend

1. **Server (`src/server/index.ts`)**:
   - Hono server setup
   - API routes (currently just a health check endpoint)
   - Static file serving
   - Route handling for the home and timeline pages

## Data Flow

1. User creates a post in the UI
2. Post is stored in React state and saved to localStorage
3. UI is updated to display the new post
4. On page reload, posts are loaded from localStorage

## Development Environment

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

- `npm run dev`: Start both client and server in development mode
- `npm run dev:server`: Start only the server
- `npm run dev:client`: Build client files in watch mode
- `npm run build`: Build the client for production
- `npm run preview`: Preview the production build
- `npm run format`: Format code with Prettier
- `npm run format:check`: Check code formatting

## Architecture Decisions

1. **Multi-Page Application**: The application uses multiple entry points instead of a single-page application approach, with separate bundles for each page.

2. **Client-Side Storage**: All data is stored in the browser's localStorage instead of a server-side database for simplicity.

3. **Server-Client Separation**: Clear separation between client and server code for maintainability.

4. **Development Workflow**: Optimized development workflow using concurrently to run both client and server processes.
