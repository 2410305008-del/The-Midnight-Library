import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import { getDbStatus } from './config/mongo.js';
import { Book } from './models/Book.js';
import { initialBooks } from './data/initialBooks.js';

import bookRoutes from './routes/bookRoutes.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import libraryRoutes from './routes/libraryRoutes.js';
import conciergeRoutes from './routes/conciergeRoutes.js';
import returnRoutes from './routes/returnRoutes.js';

// Load environment variables from backend or root .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static files for book covers (served directly from frontend/public/covers if needed)
app.use('/covers', express.static(path.join(__dirname, '../frontend/public/covers')));

// API Routes
app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/concierge', conciergeRoutes);
app.use('/api/returns', returnRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    sanctuary: 'PageHaven Bookstore & Curated E-Library API',
    timestamp: new Date(),
    mongo: getDbStatus()
  });
});

// Root welcome endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to PageHaven Bookstore & Curated E-Library API',
    endpoints: {
      books: '/api/books',
      auth: '/api/auth',
      orders: '/api/orders',
      library: '/api/library',
      concierge: '/api/concierge/chat',
      returns: '/api/returns',
      health: '/api/health'
    }
  });
});

// Seed helper
const seedDatabaseIfEmpty = async () => {
  try {
    const count = await Book.countDocuments();
    if (count === 0) {
      console.log('🌱 Database is empty. Seeding PageHaven curated masterworks...');
      await Book.insertMany(initialBooks);
      console.log(`✔ Successfully seeded ${initialBooks.length} master folios and volumes!`);
    } else {
      console.log(`ℹ Found ${count} books already cataloged in MongoDB.`);
    }
  } catch (err) {
    console.warn(`Could not seed MongoDB: ${err.message}`);
  }
};

// Start Server immediately, then connect to MongoDB asynchronously
const server = app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  📚 PageHaven Bookstore & E-Library Backend Server  `);
  console.log(`  🌐 API running on: http://localhost:${PORT}        `);
  console.log(`  📖 Health check:   http://localhost:${PORT}/api/health`);
  console.log(`======================================================\n`);
});

// Connect to MongoDB asynchronously
connectDB().then((conn) => {
  if (conn) {
    seedDatabaseIfEmpty();
  }
});

export default app;
