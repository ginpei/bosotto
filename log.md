# Development Log

## Table of Contents
- [2025-03-06](#2025-03-06-1) - Project Initialization, Planning, Implementation
- [2025-03-06](#2025-03-06-2) - Timeline Page Migration, Development Script Improvements
- [2025-03-07](#2025-03-07-1) - Development Script Optimization
- [2025-03-07](#2025-03-07-2) - AI Agent Documentation
- [2025-03-07](#2025-03-07-3) - Markdown Support for Posts
- [2025-03-07](#2025-03-07-4) - HTML Files Reorganization
- [2025-03-07](#2025-03-07-5) - Server Build Detection Improvement
- [2025-03-07](#2025-03-07-6) - Ctrl+Enter Post Submission

## 2025-03-06 {#2025-03-06-1}

### Project Initialization #setup #init

#### Planning and Implementation
- Created Hono project using `npm create hono@latest` (nodejs template)
- Initialized Git repository
- Confirmed basic project structure

#### AI Context
- **Framework Selection**: Chose Hono for its lightweight nature and excellent TypeScript support
- **Project Structure**: 
  - `src/client/` - Frontend (React)
  - `src/server/` - Backend (Hono)
- **Related Files**: 
  - [`package.json`](./package.json) - Dependency management
  - [`tsconfig.json`](./tsconfig.json) - TypeScript configuration

### Planning #planning

#### Functional Requirements
- Create a Twitter-like notepad application
- Posts are arranged in chronological order
- Data is stored on the client side (browser)

#### Technology Stack
- Using TypeScript (strict type checking)
- React + Tailwind CSS for UI implementation
- Prettier for code formatting

#### AI Context
- **Client-side Storage**: Decision to use localStorage instead of a server-side database
- **TypeScript**: Adopted strict settings to ensure type safety
- **UI Design Approach**: Prioritizing a simple and user-friendly interface

### Implementation #implementation

#### Setting Up Dependencies
- Installed React, React DOM, Tailwind CSS, Vite, Prettier, and other dependencies
```bash
npm install react react-dom
npm install -D @vitejs/plugin-react tailwindcss postcss autoprefixer vite prettier
```

#### Organizing Project Structure
- Organized project structure (client/server directories)
- Configured Vite
- Set up Tailwind CSS
- Updated TypeScript configuration
- Implemented basic React components
- Configured Hono server
- Set up Prettier
- Made initial commit

#### AI Context
- **Directory Structure**: Clearly separated client and server to achieve separation of concerns
- **Build Tool**: Selected Vite for its fast development experience and HMR support
- **Code Conventions**: Using Prettier to maintain consistent code style
- **Related Files**:
  - [`src/index.ts`](./src/index.ts) - Server entry point
  - [`src/client/index.tsx`](./src/client/index.tsx) - Client entry point
  - [`vite.config.ts`](./vite.config.ts) - Vite configuration

### Testing #testing

#### Functional Testing
- Started Vite development server
- Verified UI display
- Tested posting functionality (creating and deleting posts)
- Confirmed data persistence using localStorage

#### AI Context
- **Testing Method**: Conducted manual testing, automated testing is a future task
- **Verification Points**: UI display, data persistence, basic CRUD operations

## 2025-03-06 {#2025-03-06-2}

### Timeline Page Migration #refactor #routing

#### Planning
- Moved timeline page from `/` to `/tl/`
- Changed structure from SPA to having independent entry points for each page
- Separated page-specific components from common components

#### Implementation
- Created new directory structure
  - `src/client/pages/home/` - For home page
  - `src/client/pages/tl/` - For timeline page
  - `src/client/shared/` - For shared components
- Moved content from current `App.tsx` to `TimelinePage.tsx`
- Created new home page component `HomePage.tsx`
- Created entry points for each page
- Updated Vite configuration to support multiple entry points
- Updated server-side configuration to handle new routes
- Added `dist/` directory to `.gitignore` to prevent build artifacts from being included in the repository

#### Decisions
- Kept UI unchanged, only modified file structure and routing
- Placed page-specific components in `components/` within each page directory
- Placed common components in the `shared/` directory

#### AI Context
- **Architecture Change**: Reason for migrating from SPA to MPA was to increase independence of each page
- **Component Design**: Clearly separated reusable components from page-specific components
- **Build Optimization**: Generating independent bundles for each page to improve initial load time
- **Related Files**:
  - [`src/client/pages/tl/TimelinePage.tsx`](./src/client/pages/tl/TimelinePage.tsx) - Timeline page component
  - [`src/client/pages/home/HomePage.tsx`](./src/client/pages/home/HomePage.tsx) - Home page component
  - [`vite.config.ts`](./vite.config.ts) - Multi-page configuration

### Development Script Improvements #devops

#### Planning
- Enable simultaneous launching of server and client development servers
- Organize existing scripts to make them more user-friendly

#### Implementation
- Installed `concurrently` package
```bash
npm install -D concurrently
```
- Updated scripts in package.json
  - Renamed existing `dev` script to `dev:server`
  - Added new `dev` script to run `dev:server` and `dev:client` simultaneously

#### Decisions
- Use `npm run dev` to start both servers simultaneously
- Use `npm run dev:server` or `npm run dev:client` to start them individually
- Used concurrently's color-coding feature to make output more readable

#### AI Context
- **Development Experience Improvement**: Eliminated the need to manually run multiple commands, improving development efficiency
- **Parallel Processing**: Using concurrently to efficiently manage multiple processes
- **Related Files**:
  - [`package.json`](./package.json) - Script configuration
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\" --names \"server,client\" --prefix-colors \"blue,green\"",
    "dev:server": "tsx watch src/index.ts",
    "dev:client": "vite"
  }
}
```

## 2025-03-07 {#2025-03-07-1}

### Development Script Optimization #devops #performance

#### Planning
- Modified `dev:client` command to only build files, removing web server functionality
- Avoided duplication since `dev:server` already provides a web server

#### Implementation
- Changed `dev:client` script in `package.json`
  - Before: `"dev:client": "vite"`
  - After: `"dev:client": "vite build --watch"`

#### Decisions
- `npm run dev:client` now watches for file changes and automatically builds them, but doesn't start a server
- `npm run dev:server` continues to run the Hono server and serve the built files
- `npm run dev` runs both simultaneously, so the development experience remains unchanged

#### AI Context
- **Resource Optimization**: Reduced resource usage by eliminating duplicate web servers
- **Build Process**: Achieved continuous building using watch mode while keeping server functionality separate
- **Related Files**:
  - [`package.json`](./package.json) - Updated script configuration
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\" --names \"server,client\" --prefix-colors \"blue,green\"",
    "dev:server": "tsx watch src/index.ts",
    "dev:client": "vite build --watch"
  }
}
```

## 2025-03-07 {#2025-03-07-2}

### AI Agent Documentation #documentation #ai

#### Planning
- Create documentation specifically for AI agents working with the project
- Organize instructions, project context, and contribution guidelines
- Store documentation in a dedicated directory for easy access and maintenance

#### Implementation
- Created `.ai/` directory to store AI agent documentation
- Created the following documentation files:
  - `.ai/instructions.md` - Communication style and task handling instructions
  - `.ai/project-context.md` - Project overview and architecture
  - `.ai/guidelines.md` - Contribution guidelines and development practices
  - `.ai/README.md` - Documentation overview and usage instructions

#### Decisions
- Used Markdown format for all documentation for readability and compatibility
- Organized documentation into separate files by purpose
- Included detailed information about Zundamon communication style
- Provided comprehensive project context to reduce the need for AI agents to scan all files
- Added clear contribution guidelines to maintain code quality and consistency

#### AI Context
- **Documentation Purpose**: Created to improve efficiency of AI agent interactions and ensure consistent communication style
- **Knowledge Persistence**: Documented project understanding to avoid redundant analysis in future interactions
- **Communication Standards**: Established clear guidelines for Zundamon-style responses and language usage
- **Related Files**:
  - [`.ai/instructions.md`](./.ai/instructions.md) - AI agent instructions
  - [`.ai/project-context.md`](./.ai/project-context.md) - Project structure documentation
  - [`.ai/guidelines.md`](./.ai/guidelines.md) - Contribution guidelines
  - [`.ai/README.md`](./.ai/README.md) - Documentation overview

## 2025-03-07 {#2025-03-07-3}

### Markdown Support for Posts #feature #enhancement

#### Planning
- Add markdown support for posts in the timeline
- Implement a preview feature to see rendered markdown while typing
- Ensure proper styling for markdown elements
- Make links clickable and support code syntax highlighting
- Design preview toggle as a checkbox instead of buttons
- Position preview below the post button

#### Implementation
- Installed necessary packages
```bash
npm install react-markdown remark-gfm rehype-sanitize react-syntax-highlighter @types/react-syntax-highlighter
```
- Modified `TimelinePage.tsx` to render posts as markdown
- Added a checkbox to toggle preview visibility
- Created custom CSS styles for markdown elements
- Added custom components for links and code blocks
- Implemented syntax highlighting for code blocks
- Positioned preview area below the post button

#### Decisions
- Used `react-markdown` for its simplicity and good React integration
- Added `remark-gfm` plugin to support GitHub Flavored Markdown (tables, autolinks, etc.)
- Used `rehype-sanitize` to prevent XSS attacks
- Created a dedicated CSS file for markdown styling
- Made all posts use markdown rendering (no backward compatibility needed)
- Added a helpful hint about markdown syntax below the post form
- Used a checkbox labeled "プレビューを表示" for toggling preview visibility
- Set preview to be hidden by default

#### AI Context
- **User Experience**: Added preview functionality to help users see how their markdown will render
- **Security**: Implemented sanitization to prevent security issues with user-generated content
- **Styling**: Created comprehensive styles for all markdown elements to ensure consistent appearance
- **UI Improvements**: Redesigned preview toggle to use a checkbox and positioned preview below the post button for better usability
- **Related Files**:
  - [`src/client/pages/tl/TimelinePage.tsx`](./src/client/pages/tl/TimelinePage.tsx) - Updated to support markdown
  - [`src/client/pages/tl/components/markdown-styles.css`](./src/client/pages/tl/components/markdown-styles.css) - Styles for markdown elements

## 2025-03-07 {#2025-03-07-4}

### HTML Files Reorganization #refactor #structure

#### Planning
- Move HTML files from the root directory to their respective page directories under `src/client/pages/`
- Update build configuration to reference the new file locations
- Update server code to reference the new build output locations
- Ensure server code continues to work with the new structure

#### Implementation
- Moved HTML files to their respective page directories:
  - Moved `index.html` to `src/client/pages/home/index.html`
  - Moved `tl.html` to `src/client/pages/tl/tl.html`
- Updated Vite configuration in `vite.config.ts` to point to the new file locations
- Updated server code in `src/server/index.ts` to reference the new build output locations
- Removed the original HTML files from the root directory

#### Decisions
- Kept the HTML file content unchanged, only modified their location
- Placed HTML files in their respective page directories to better organize the project structure
- Updated server code to reference the new build output locations

#### AI Context
- **Project Organization**: Improved project structure by moving HTML files to their respective page directories
- **Build Process**: Updated Vite configuration to build from the new source locations
- **Server Configuration**: Updated server code to reference the new build output locations
- **Related Files**:
  - [`src/client/pages/home/index.html`](./src/client/pages/home/index.html) - Home page HTML template
  - [`src/client/pages/tl/tl.html`](./src/client/pages/tl/tl.html) - Timeline page HTML template
  - [`vite.config.ts`](./vite.config.ts) - Updated build configuration
  - [`src/server/index.ts`](./src/server/index.ts) - Updated server code

## 2025-03-07 {#2025-03-07-5}

### Server Build Detection Improvement #bugfix #enhancement
#### Planning
- Fix issue where server is accessible before client build completes, causing ENOENT errors
- Implement a mechanism to check if required build files exist before serving them
- Show a "Build in Progress" page while waiting for the client build to complete
- Add clear console messages about the build status

#### Implementation
- Created a separate HTML file for the "Build in Progress" page:
  - Created `src/server/build-in-progress.html` with the loading UI
- Modified `src/server/index.ts` to:
  - Add a function to check if required build files exist
  - Read the "Build in Progress" HTML from the separate file
  - Set up a polling mechanism to detect when the build is complete
  - Add clear console messages about the build status
  - Conditionally serve static files only when the build is ready
  - Add error handling for file reading operations
  - Clean up resources on process exit

#### Decisions
- Used a polling approach (checking every second) to detect when build files are created
- Created a user-friendly "Build in Progress" page with auto-refresh functionality
- Added clear console messages with emoji indicators for better visibility
- Simplified error handling by allowing normal errors to propagate when file reading fails
- Added cleanup code to ensure resources are properly released on server shutdown

#### AI Context
- **User Experience**: Improved development experience by showing a helpful message instead of an error page
- **Error Prevention**: Eliminated ENOENT errors by checking for file existence before attempting to read them
- **Development Workflow**: Enhanced the development workflow by making the server aware of the client build status
- **Code Organization**: Separated HTML content from server logic for better maintainability
- **Related Files**:
  - [`src/server/index.ts`](./src/server/index.ts) - Updated server code with build detection logic
  - [`src/server/build-in-progress.html`](./src/server/build-in-progress.html) - HTML template for the "Build in Progress" page
  
## 2025-03-07 {#2025-03-07-6}

### Ctrl+Enter Post Submission #enhancement #ux

#### Planning
- Add ability to submit posts using Ctrl+Enter keyboard shortcut
- Add a hint in the UI to inform users about this functionality
- Keep the existing "Post" button for mouse users

#### Implementation
- Modified `src/client/pages/tl/TimelinePage.tsx` to:
  - Add an `onKeyDown` event handler to the textarea
  - Detect Ctrl+Enter key combination and trigger post submission
  - Add a hint text about the Ctrl+Enter shortcut

#### Decisions
- Used a simple key detection approach with `e.key === 'Enter' && e.ctrlKey`
- Added a hint text below the markdown syntax information
- Kept the UI clean by adding the hint to existing help text

#### AI Context
- **User Experience**: Improved posting workflow by adding keyboard shortcut support
- **Accessibility**: Provided alternative input method for users who prefer keyboard navigation
- **Related Files**:
  - [`src/client/pages/tl/TimelinePage.tsx`](./src/client/pages/tl/TimelinePage.tsx) - Updated with Ctrl+Enter functionality
