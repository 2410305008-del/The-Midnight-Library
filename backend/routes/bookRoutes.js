import express from 'express';
import { Book } from '../models/Book.js';
import { initialBooks } from '../data/initialBooks.js';
import mongoose from 'mongoose';

const router = express.Router();

// Helper to determine if MongoDB is active and connected
const isMongoConnected = () => mongoose.connection.readyState === 1;

// GET /api/books - Get books with optional filters
router.get('/', async (req, res) => {
  try {
    const { category, search, spotlight, sort } = req.query;

    if (isMongoConnected()) {
      let query = {};
      if (category && category !== 'all') {
        query.category = category;
      }
      if (spotlight === 'true') {
        query.isSpotlight = true;
      }
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } },
          { genre: { $regex: search, $options: 'i' } },
          { synopsis: { $regex: search, $options: 'i' } }
        ];
      }

      let books = await Book.find(query);
      if (books && books.length > 0) {
        if (sort === 'price-low') books.sort((a, b) => a.price - b.price);
        if (sort === 'price-high') books.sort((a, b) => b.price - a.price);
        if (sort === 'rating') books.sort((a, b) => b.rating - a.rating);
        return res.json({ success: true, count: books.length, data: books, source: 'mongodb' });
      }
    }

    // In-memory fallback
    let filtered = [...initialBooks];
    if (category && category !== 'all') {
      filtered = filtered.filter(b => b.category === category);
    }
    if (spotlight === 'true') {
      filtered = filtered.filter(b => b.isSpotlight === true);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        b =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.genre.toLowerCase().includes(q) ||
          b.synopsis.toLowerCase().includes(q)
      );
    }

    if (sort === 'price-low') filtered.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') filtered.sort((a, b) => b.price - a.price);
    if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);

    return res.json({ success: true, count: filtered.length, data: filtered, source: 'in-memory' });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ success: false, message: 'Server error fetching books', error: error.message });
  }
});

// GET /api/books/spotlight - Get illuminated masterpiece
router.get('/spotlight', async (req, res) => {
  try {
    if (isMongoConnected()) {
      const book = await Book.findOne({ isSpotlight: true });
      if (book) return res.json({ success: true, data: book });
    }
    const spotlightBook = initialBooks.find(b => b.isSpotlight) || initialBooks[0];
    return res.json({ success: true, data: spotlightBook });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/books/:id - Get single book
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected()) {
      try {
        const book = await Book.findById(id);
        if (book) return res.json({ success: true, data: book });
      } catch (err) {
        // ID might not be ObjectId
      }
    }
    const book = initialBooks.find(b => b._id === id || b.isbn === id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    return res.json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
