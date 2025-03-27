# CLAUDE.md - Development Guide

## IMPORTANT Runtime Guidance
1. Never make any changes automatically; wait for explicit request
2. Always share a detailed plan before making code changes
3. Explain the reasoning behind your approach

## Commands
- `npm run dev` - Run both client and server in development mode (DO NOT execute this command, ask the user to run it instead)
- `npm run dev:client` - Run client in watch mode
- `npm run dev:server` - Run server in watch mode
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check formatting without modifying files

## Additional Runtime Guidance
- Never run `npm run dev` directly; ask the user to run it manually
- When suggesting the user run the app, remind them what to check or test
- Never make git commits automatically; wait for explicit request
- You may suggest making a commit when appropriate
- Write commit messages that summarize conceptual changes rather than listing operations
- After reading a file, inform the user you've read it without repeating its contents

## Code Style
- TypeScript for type safety, with explicit typing
- React functional components with hooks (useState, useEffect, useRef)
- Custom hooks for reusable logic (useKeydown)
- Custom hooks MUST return arrays, not objects, to avoid name conflicts (like 'error')
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
