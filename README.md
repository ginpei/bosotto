# Twitter-style Notepad

A simple Twitter-style notepad application that allows users to create, view, and delete short posts. The application stores data locally in the browser using localStorage.

## Features

- Create short posts/notes
- View posts in chronological order
- Delete posts
- Markdown support
- Local storage for data persistence
- Progressive Web App (PWA) support for installation and offline use

## Getting Started

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev

# Open the application in your browser
open http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## PWA Support

This application supports Progressive Web App (PWA) features, allowing users to:

- Install the app on their device
- Use the app offline
- Get faster load times with caching

For detailed instructions on setting up and testing PWA functionality, see [public/README-PWA.md](public/README-PWA.md).

## Project Structure

- `src/client/` - Frontend React code
- `src/server/` - Backend Hono server
- `public/` - Static assets and PWA files

## Available Scripts

- `npm run dev`: Start both client and server in development mode
- `npm run dev:server`: Start only the server
- `npm run dev:client`: Build client files in watch mode
- `npm run build`: Build the client for production
- `npm run preview`: Preview the production build
- `npm run format`: Format code with Prettier
- `npm run format:check`: Check code formatting

## Technologies Used

- React 19
- TypeScript
- Tailwind CSS
- Hono (server)
- Vite (build tool)
