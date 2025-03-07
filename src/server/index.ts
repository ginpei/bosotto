import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static';
import fs from 'fs';
import path from 'path';

const app = new Hono();

// API routes can be added here
app.get('/api/health', (c) => {
  return c.json({ status: 'ok' });
});

// Specific routes
app.get('/tl', (c) => {
  return c.redirect('/tl/');
});

app.get('/tl/', async (c) => {
  const html = fs.readFileSync(path.resolve('./dist/tl.html'), 'utf-8');
  return c.html(html);
});

// Serve static files from the dist directory
app.use('/*', serveStatic({ root: './dist' }));

// Fallback route for home
app.get('*', async (c) => {
  const html = fs.readFileSync(path.resolve('./dist/index.html'), 'utf-8');
  return c.html(html);
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
