import express from 'express';
import { BorrowRecord } from '../models/BorrowRecord.js';
import { initialBooks } from '../data/initialBooks.js';
import mongoose from 'mongoose';

const router = express.Router();
const isMongoConnected = () => mongoose.connection.readyState === 1;

// In-memory loans store
let memoryLoans = [
  {
    _id: 'loan-001',
    bookId: 'book-001',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    coverImage: '/covers/book_cover_for_the_midnight_library_by_matt_haig_warm_atmospheric_glowing.png',
    borrowerName: 'Eleanor Vance (Scholar)',
    borrowDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
    status: 'Active Loan',
    readingProgress: 68,
    daysLeft: 16
  },
  {
    _id: 'loan-002',
    bookId: 'book-004',
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    coverImage: '/covers/book_cover_for_klara_and_the_sun_by_kazuo_ishiguro_warm_golden_sunbeams.png',
    borrowerName: 'Eleanor Vance (Scholar)',
    borrowDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000),
    status: 'Active Loan',
    readingProgress: 24,
    daysLeft: 19
  }
];

// GET /api/library/borrowed - Get user's borrowed books
router.get('/borrowed', async (req, res) => {
  try {
    if (isMongoConnected()) {
      const loans = await BorrowRecord.find({ status: 'Active Loan' });
      if (loans && loans.length > 0) {
        return res.json({ success: true, count: loans.length, data: loans });
      }
    }
    return res.json({ success: true, count: memoryLoans.length, data: memoryLoans });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/library/borrow/:bookId - Borrow book from E-Library
router.post('/borrow/:bookId', async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = initialBooks.find(b => b._id === bookId);

    if (!book) {
      return res.status(404).json({ success: false, message: 'Folio not cataloged in library.' });
    }

    const existing = memoryLoans.find(l => l.bookId === bookId && l.status === 'Active Loan');
    if (existing) {
      return res.json({
        success: true,
        message: `You already have "${book.title}" on active loan in your digital study.`,
        data: existing
      });
    }

    const newLoan = {
      _id: `loan-${Date.now()}`,
      bookId: book._id,
      title: book.title,
      author: book.author,
      coverImage: book.coverImage,
      borrowerName: 'Eleanor Vance (Scholar)',
      borrowDate: new Date(),
      dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      status: 'Active Loan',
      readingProgress: 5,
      daysLeft: 21
    };

    if (isMongoConnected()) {
      const record = new BorrowRecord(newLoan);
      await record.save();
    }

    memoryLoans.unshift(newLoan);
    return res.status(201).json({
      success: true,
      message: `"${book.title}" checked out successfully! Enjoy 21 days of archival digital reading.`,
      data: newLoan
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/library/return/:bookId - Return borrowed book
router.post('/return/:bookId', (req, res) => {
  const { bookId } = req.params;
  const index = memoryLoans.findIndex(l => l.bookId === bookId);
  if (index !== -1) {
    const returned = memoryLoans.splice(index, 1)[0];
    return res.json({
      success: true,
      message: `"${returned.title}" returned to the PageHaven sanctuary stacks.`,
      data: returned
    });
  }
  return res.json({ success: true, message: 'Folio returned successfully.' });
});

// PUT /api/library/progress/:bookId - Update reading progress
router.put('/progress/:bookId', (req, res) => {
  const { bookId } = req.params;
  const { progress } = req.body;
  const loan = memoryLoans.find(l => l.bookId === bookId);
  if (loan) {
    loan.readingProgress = Math.min(100, Math.max(0, parseInt(progress, 10) || 0));
    return res.json({ success: true, data: loan });
  }
  return res.status(404).json({ success: false, message: 'Loan record not found' });
});

export default router;
