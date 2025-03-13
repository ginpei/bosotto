import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static';
import fs from 'fs';
import path from 'path';

const app = new Hono();
let buildReady = false;
let checkInterval: NodeJS.Timeout | null = null;

// Required build files to check
const requiredFiles = [
  './dist/src/client/pages/home/index.html',
  './dist/src/client/pages/tl/tl.html',
  './dist/manifest.json',
  './dist/sw.js',
];

// Function to check if all required build files exist
function checkBuildFiles(): boolean {
  try {
    for (const file of requiredFiles) {
      if (!fs.existsSync(path.resolve(file))) {
        return false;
      }
    }
    return true;
  } catch (error) {
    return false;
  }
}

// Function to get the "build in progress" HTML
function getBuildInProgressHtml(): string {
  return fs.readFileSync(path.resolve('./src/server/build-in-progress.html'), 'utf-8');
}

// Check build status initially
buildReady = checkBuildFiles();
console.log(buildReady 
  ? '🟢 Build files found! Starting in normal mode' 
  : '🟠 Build files not found yet. Starting in build-in-progress mode');

// Set up polling to check for build files if they don't exist yet
if (!buildReady) {
  console.log('🔍 Waiting for client build to complete...');
  checkInterval = setInterval(() => {
    const newBuildReady = checkBuildFiles();
    if (newBuildReady && !buildReady) {
      buildReady = true;
      console.log('🎉 Build completed! Server is now operating in normal mode');
      if (checkInterval) {
        clearInterval(checkInterval);
        checkInterval = null;
      }
    }
  }, 1000); // Check every second
}

// API routes can be added here
app.get('/api/health', (c) => {
  return c.json({ status: 'ok' });
});

// Serve service worker at the root to ensure proper scope
app.get('/sw.js', async (c) => {
  if (!buildReady) {
    return c.text('// Service worker not available during build');
  }
  
  try {
    const sw = fs.readFileSync(path.resolve('./dist/sw.js'), 'utf-8');
    return c.text(sw, 200, {
      'Content-Type': 'application/javascript',
      'Service-Worker-Allowed': '/'
    });
  } catch (error) {
    console.error('Error serving service worker:', error);
    return c.text('// Error loading service worker', 500);
  }
});

// Serve manifest.json
app.get('/manifest.json', async (c) => {
  if (!buildReady) {
    return c.json({ error: 'Manifest not available during build' });
  }
  
  try {
    const manifest = fs.readFileSync(path.resolve('./dist/manifest.json'), 'utf-8');
    return c.text(manifest, 200, {
      'Content-Type': 'application/manifest+json'
    });
  } catch (error) {
    console.error('Error serving manifest:', error);
    return c.json({ error: 'Error loading manifest' }, 500);
  }
});

// Specific routes
app.get('/tl', (c) => {
  return c.redirect('/tl/');
});

app.get('/tl/', async (c) => {
  if (!buildReady) {
    return c.html(getBuildInProgressHtml());
  }
  
  const html = fs.readFileSync(path.resolve('./dist/src/client/pages/tl/tl.html'), 'utf-8');
  return c.html(html);
});

// Conditionally serve static files from the dist directory if build is ready
app.use('/*', async (c, next) => {
  if (buildReady) {
    return serveStatic({ root: './dist' })(c, next);
  }
  return next();
});

// Fallback route for home
app.get('*', async (c) => {
  if (!buildReady) {
    return c.html(getBuildInProgressHtml());
  }
  
  const html = fs.readFileSync(path.resolve('./dist/src/client/pages/home/index.html'), 'utf-8');
  return c.html(html);
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`🚀 Server is running on http://localhost:${info.port}`);
    if (!buildReady) {
      console.log('⏳ Showing "Build in Progress" page until client build completes');
    }
  }
);

// Clean up interval on process exit
process.on('SIGINT', () => {
  if (checkInterval) {
    clearInterval(checkInterval);
  }
  process.exit(0);
});
