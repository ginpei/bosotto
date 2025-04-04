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
- [2025-03-07](#2025-03-07-7) - N Key Shortcut for Post Form Focus
- [2025-03-07](#2025-03-07-8) - Keyboard Event Handler Refactoring
- [2025-03-12](#2025-03-12-1) - Notepad-Style UI Redesign
- [2025-03-12](#2025-03-12-2) - Progressive Web App (PWA) Support
- [2025-03-19](#2025-03-19-1) - Fix Data Persistence Issue

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

## 2025-03-07 {#2025-03-07-7}

### N Key Shortcut for Post Form Focus #enhancement #ux

#### Planning
- Add keyboard shortcut to quickly focus on the post form
- Use the 'N' key as the shortcut (similar to Twitter's 'n' for new tweet)
- Add a hint in the UI to inform users about this functionality

#### Implementation
- Modified `src/client/pages/tl/TimelinePage.tsx` to:
  - Add a `useRef` for the textarea element
  - Add a global keyboard event listener using `useEffect`
  - Detect 'N' key press when no other input is focused
  - Focus the textarea when the shortcut is triggered
  - Add a hint text about the 'N' key shortcut

#### Decisions
- Used `useRef` to get a reference to the textarea DOM element
- Added case-insensitive detection with `e.key.toLowerCase() === 'n'`
- Added a check to prevent the shortcut from triggering when other inputs are focused
- Updated the existing hint text to include information about the new shortcut
- Used a clean event listener setup/cleanup pattern with `useEffect`

#### AI Context
- **User Experience**: Improved navigation by allowing quick access to the post form
- **Accessibility**: Enhanced keyboard navigation for users who prefer not to use the mouse
- **Implementation Pattern**: Used React best practices with hooks and refs
- **Related Files**:
  - [`src/client/pages/tl/TimelinePage.tsx`](./src/client/pages/tl/TimelinePage.tsx) - Updated with 'N' key shortcut functionality

## 2025-03-07 {#2025-03-07-8}

### Keyboard Event Handler Refactoring #refactor #enhancement

#### Planning
- Refactor keyboard event handling into a reusable custom hook
- Create a shared hook that can be used across the application
- Improve code organization and maintainability

#### Implementation
- Created a new directory for shared hooks:
  - Created `src/client/shared/hooks/` directory
- Created a reusable keyboard event hook:
  - Created `src/client/shared/hooks/useKeydown.ts`
  - Implemented a flexible hook that can attach to any element
  - Added support for both direct elements and React refs
- Modified `TimelinePage.tsx` to use the new hook:
  - Replaced the inline `useEffect` with the custom hook
  - Used `useCallback` to memoize the event handler function

#### Decisions
- Named the hook `useKeydown` for simplicity and clarity
- Made the hook flexible by allowing it to attach to any element, not just document
- Added support for React refs to make it easier to use with React components
- Used TypeScript to ensure type safety
- Used `useCallback` in the component to prevent unnecessary re-renders
- Placed the hook in the shared directory to make it available for reuse across the application

#### AI Context
- **Code Organization**: Improved code structure by extracting reusable logic into a custom hook
- **Reusability**: Created a hook that can be used in multiple components
- **Type Safety**: Used TypeScript to ensure proper typing of the hook parameters and return values
- **Performance**: Used `useCallback` to optimize performance by preventing unnecessary re-renders
- **Related Files**:
  - [`src/client/shared/hooks/useKeydown.ts`](./src/client/shared/hooks/useKeydown.ts) - New custom hook
  - [`src/client/pages/tl/TimelinePage.tsx`](./src/client/pages/tl/TimelinePage.tsx) - Updated to use the custom hook

## 2025-03-12 {#2025-03-12-1}

### Notepad-Style UI Redesign #ui #redesign

#### Planning
- Update the application layout to look more like a traditional notepad than Twitter
- Maintain all existing functionality while changing the visual appearance
- Create a simpler, more utilitarian interface
- Focus more on the text content rather than presentation

#### Implementation
- Updated `TimelinePage.tsx`:
  - Changed the title from "Twitter-style Notepad" to "Notepad"
  - Simplified the header area with a light gray background
  - Made the textarea look more like a notepad editor
  - Changed the "Post" button to "Save Note"
  - Made the controls more compact and simplified
  - Removed borders around posts and made them flow continuously
  - Made timestamps and delete buttons smaller and less prominent
  - Adjusted spacing to be more compact
- Updated `styles.css`:
  - Changed the background color to a lighter gray
  - Reduced font sizes for headings
  - Changed link color to a more traditional blue
  - Added a subtle shadow to buttons
  - Removed borders from inputs and textareas
  - Added a shadow to the container for a more notepad-like appearance
- Updated `markdown-styles.css`:
  - Simplified the styling for markdown elements
  - Made headings smaller and less prominent
  - Used dotted borders for headings instead of solid
  - Reduced spacing between elements
  - Simplified code blocks and blockquotes
- Updated `HomePage.tsx`:
  - Changed the title to "Notepad"
  - Simplified the layout to match the TimelinePage
  - Changed the button text from "View Timeline" to "Open Notes"

#### Decisions
- Kept the current font (not changed to monospace) as requested
- Maintained all existing functionality while changing only the visual appearance
- Used a simpler color scheme with lighter grays and traditional blue for links
- Removed or simplified borders and shadows for a cleaner look
- Made the interface more compact with less spacing between elements
- Changed terminology from "Post" to "Note" throughout the interface
- Kept the markdown functionality but made it less prominent

#### AI Context
- **UI Design**: Changed from a Twitter-inspired design to a more traditional notepad look
- **User Experience**: Maintained all functionality while simplifying the visual appearance
- **Design Principles**: Focused on simplicity, utility, and content over presentation
- **Related Files**:
  - [`src/client/pages/tl/TimelinePage.tsx`](./src/client/pages/tl/TimelinePage.tsx) - Updated timeline page layout
  - [`src/styles.css`](./src/styles.css) - Updated global styles
  - [`src/client/pages/tl/components/markdown-styles.css`](./src/client/pages/tl/components/markdown-styles.css) - Updated markdown styles
  - [`src/client/pages/home/HomePage.tsx`](./src/client/pages/home/HomePage.tsx) - Updated home page layout

## 2025-03-12 {#2025-03-12-2}

### Progressive Web App (PWA) Support #feature #enhancement

#### Planning
- Add Progressive Web App (PWA) support to allow users to install the app on their devices
- Implement offline functionality using service workers
- Create a web app manifest with app metadata
- Add necessary icons for various devices
- Update HTML files with required meta tags and links
- Configure the server to properly serve PWA assets

#### Implementation
- Installed necessary packages:
```bash
npm install vite-plugin-pwa -D
```
- Created PWA assets:
  - Created `public/manifest.json` with app metadata
  - Created `public/sw.js` service worker for offline functionality
  - Added placeholder files for required icons
  - Created `public/README-PWA.md` with instructions for completing the PWA setup
- Updated HTML files:
  - Added meta tags for PWA support to `src/client/pages/home/index.html`
  - Added meta tags for PWA support to `src/client/pages/tl/tl.html`
  - Added service worker registration scripts to both HTML files
- Updated Vite configuration:
  - Added VitePWA plugin to `vite.config.ts`
  - Configured manifest details in the plugin options
- Updated server code:
  - Added routes to serve the manifest and service worker files
  - Added proper headers for PWA assets
  - Updated build detection to include PWA assets
- Updated documentation:
  - Added PWA information to the main README.md
  - Created detailed PWA setup instructions in public/README-PWA.md

#### Decisions
- Used the vite-plugin-pwa package for seamless integration with Vite
- Implemented a custom service worker instead of relying solely on the plugin's generated one
- Created placeholder files for icons with instructions for generating proper icons
- Added explicit routes in the server for serving PWA assets with proper headers
- Used a "maskable" purpose for icons to support adaptive icons on Android
- Set the display mode to "standalone" for a more app-like experience
- Added comprehensive documentation for testing and troubleshooting PWA functionality

#### Required User Tasks for PWA Completion

To fully enable PWA functionality, the following tasks need to be completed:

1. **Icon Preparation**:
   - ✅ Create `icon-192x192.png` (192x192 pixels) for Android devices
   - ✅ Create `icon-512x512.png` (512x512 pixels) for Android devices
   - ✅ Create `apple-touch-icon.png` (180x180 pixels) for iOS devices
   - ✅ Create `favicon.ico` for browser tabs (16x16, 32x32, and 48x48 pixels)
   - Note: Icons should have the app's logo/symbol with the blue background (#3b82f6)

2. **Testing PWA Installation**:
   - Build the project with `npm run build`
   - Start the server with `npm run dev:server`
   - Open Chrome and navigate to `http://localhost:3000`
   - Open Chrome DevTools (F12) and go to the "Application" tab
   - Verify the manifest is loaded correctly under "Manifest"
   - Verify the service worker is registered under "Service Workers"
   - Test installation by clicking the install icon in the address bar
   - Test offline functionality by checking "Offline" in the Network tab and reloading

3. **Troubleshooting**:
   - If icons don't appear, verify they are in the correct location and format
   - If service worker doesn't register, check browser console for errors
   - If installation prompt doesn't appear, ensure all PWA criteria are met
   - Clear browser cache if changes don't take effect

4. **Optional Enhancements**:
   - Add more icon sizes for better device compatibility
   - Customize the splash screen for iOS devices
   - Implement push notifications (requires additional backend setup)
   - Add more advanced caching strategies in the service worker

#### AI Context
- **User Experience**: Enhanced the application by allowing installation on devices and offline usage
- **Performance**: Improved performance through caching strategies in the service worker
- **Accessibility**: Made the application more accessible by supporting installation across different devices
- **Documentation**: Provided detailed instructions for completing the PWA setup and testing functionality
- **Related Files**:
  - [`public/manifest.json`](./public/manifest.json) - Web app manifest
  - [`public/sw.js`](./public/sw.js) - Service worker implementation
  - [`vite.config.ts`](./vite.config.ts) - Updated with PWA plugin
  - [`src/client/pages/home/index.html`](./src/client/pages/home/index.html) - Updated with PWA meta tags
  - [`src/client/pages/tl/tl.html`](./src/client/pages/tl/tl.html) - Updated with PWA meta tags
  - [`src/server/index.ts`](./src/server/index.ts) - Updated to serve PWA assets
  - [`public/README-PWA.md`](./public/README-PWA.md) - PWA setup instructions
  - [`README.md`](./README.md) - Updated with PWA information

## 2025-03-19 {#2025-03-19-1}

### Fix Data Persistence Issue #bugfix #localStorage

#### Issue Description
- Notes were being reset when the page was reloaded or reopened
- The issue was traced to the automatic saving behavior in `useEffect` overwriting localStorage data
- Debugging logs revealed that an empty array `[]` was being saved to localStorage during component initialization

#### Solution Implementation
- Removed the automatic saving logic from the `useEffect` hook that was triggered on every post state change
- Created a dedicated `savePosts` function to explicitly handle saving posts to localStorage
- Modified the event handlers to call this function only when users explicitly add or delete notes
- Maintained the existing loading functionality for retrieving posts on component mount

#### Benefits
- More predictable data persistence behavior
- Fewer unnecessary localStorage write operations
- Better user control over data saving
- Eliminated the bug where posts were being reset

#### Related Files
- [`src/client/pages/home/HomePage.tsx`](./src/client/pages/home/HomePage.tsx) - Updated saving logic
