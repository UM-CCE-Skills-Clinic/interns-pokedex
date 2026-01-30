import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from './config/index.js';
import routes from './routes/index.js';

// ES Modules don't have __dirname by default
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Express app
const app = express();
const { port: PORT, nodeEnv } = config;

// ============================================
// MIDDLEWARE
// ============================================

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, images) from public folder
app.use(express.static(join(__dirname, '../public')));

// ============================================
// VIEW ENGINE
// ============================================

// Use EJS as the template engine
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', join(__dirname, 'views'));

// ============================================
// ROUTES
// ============================================

// Mount all routes
app.use('/', routes);

// ============================================
// ERROR HANDLERS
// ============================================

// 404 - Not Found
app.use((req, res) => {
  res.status(404).render('error', {
    message: 'Page not found',
    error: 'The page you are looking for does not exist.'
  });
});

// 500 - Server Error
app.use((err, _req, res, _next) => {
  res.status(500).render('error', {
    message: 'Something went wrong',
    error: err.message
  });
});

// ============================================
// START SERVER
// ============================================

// Only start the server if not in test mode
if (nodeEnv !== 'test') {
  app.listen(PORT, () => {
    console.log(`Pokedex server running at http://localhost:${PORT}`);
  });
}

// Export for testing
export default app;
