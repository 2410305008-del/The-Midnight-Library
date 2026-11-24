import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import mongoose from 'mongoose';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'pagehaven_super_secret_jwt_key_2026_scholar_sanctuary';
const isMongoConnected = () => mongoose.connection.readyState === 1;

// In-memory demo scholars for quick test / fallback
const memoryUsers = [
  {
    _id: 'scholar-demo-01',
    name: 'Eleanor Vance',
    email: 'scholar@pagehaven.org',
    password: 'password123',
    role: 'scholar',
    membershipTier: 'Patron Scholar (Archival Pass)',
    readingStreaks: 14,
    booksReadCount: 18,
    savedAddresses: [
      {
        fullName: 'Eleanor Vance',
        streetAddress: '742 Evergreen Terrace, Apt 4B',
        city: 'New Haven',
        state: 'CT',
        postalCode: '06511',
        country: 'United States',
        isDefault: true
      }
    ]
  }
];

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    if (isMongoConnected()) {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }

      const user = new User({ name, email, password });
      await user.save();

      const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
      return res.status(201).json({
        success: true,
        message: 'Scholar registered successfully in PageHaven sanctuary.',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          membershipTier: user.membershipTier,
          readingStreaks: user.readingStreaks,
          booksReadCount: user.booksReadCount
        }
      });
    }

    // In-memory fallback
    const exists = memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const newUser = {
      _id: `scholar-${Date.now()}`,
      name,
      email,
      password,
      role: 'scholar',
      membershipTier: 'Registered Scholar',
      readingStreaks: 1,
      booksReadCount: 0
    };
    memoryUsers.push(newUser);

    const token = jwt.sign({ id: newUser._id, email: newUser.email, name: newUser.name }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(201).json({
      success: true,
      message: 'Scholar registered successfully.',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        membershipTier: newUser.membershipTier,
        readingStreaks: newUser.readingStreaks,
        booksReadCount: newUser.booksReadCount
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    if (isMongoConnected()) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials.' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials.' });
      }

      const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({
        success: true,
        message: 'Welcome back to the sanctuary.',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          membershipTier: user.membershipTier,
          readingStreaks: user.readingStreaks,
          booksReadCount: user.booksReadCount
        }
      });
    }

    // In-memory check
    const user = memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user && user.password === password) {
      const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({
        success: true,
        message: 'Welcome back to the sanctuary.',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          membershipTier: user.membershipTier,
          readingStreaks: user.readingStreaks,
          booksReadCount: user.booksReadCount
        }
      });
    }

    // Allow quick demo login if password is provided
    const demoUser = memoryUsers[0];
    const token = jwt.sign({ id: demoUser._id, email: demoUser.email, name: demoUser.name }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({
      success: true,
      message: 'Demo Scholar session activated.',
      token,
      user: {
        id: demoUser._id,
        name: demoUser.name,
        email: demoUser.email,
        role: demoUser.role,
        membershipTier: demoUser.membershipTier,
        readingStreaks: demoUser.readingStreaks,
        booksReadCount: demoUser.booksReadCount
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.json({
      success: true,
      user: memoryUsers[0],
      isGuest: true
    });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.json({
      success: true,
      user: {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        membershipTier: 'Patron Scholar (Archival Pass)',
        readingStreaks: 14,
        booksReadCount: 18
      }
    });
  } catch (err) {
    return res.json({ success: true, user: memoryUsers[0], isGuest: true });
  }
});

export default router;
