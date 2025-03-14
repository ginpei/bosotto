# CLAUDE.md - Development Guide

## Commands
- `npm run dev` - Run both client and server in development mode
- `npm run dev:client` - Run client in watch mode
- `npm run dev:server` - Run server in watch mode
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check formatting without modifying files

## Code Style
- TypeScript for type safety, with explicit typing
- React functional components with hooks (useState, useEffect, useRef)
- Custom hooks for reusable logic (useKeydown)
- PascalCase for components, camelCase for functions/variables
- 2-space indentation, semicolons, single quotes (Prettier configured)
- Handler functions prefixed with "handle" (handleSubmit)
- Boolean states prefixed with "is" or "show" (isLoading)
- Component props defined with TypeScript interfaces
- Error handling via try/catch and early returns for invalid inputs

## Project Structure
- `/src/client` - React frontend code with pages and components
- `/src/server` - Backend server code
- `/src/client/shared` - Reusable hooks and components
- Organize code by feature/route where possible