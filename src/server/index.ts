import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static';

const app = new Hono();

// Serve static files from the dist directory
app.use('/*', serveStatic({ root: './dist' }));

// API routes can be added here
app.get('/api/health', (c) => {
  return c.json({ status: 'ok' });
});

// Fallback route for SPA
app.get('*', (c) => {
  return c.redirect('/');
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
