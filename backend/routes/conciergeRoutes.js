import express from 'express';
import { initialBooks } from '../data/initialBooks.js';

const router = express.Router();

// Intelligent ReadGenius AI conversational responses with literary context
router.post('/chat', (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ success: false, message: 'Query is required.' });
    }

    const q = query.toLowerCase().trim();
    let reply = '';
    let suggestedBooks = [];

    if (q.includes('midnight library') || q.includes('philosoph') || q.includes('regret') || q.includes('parallel')) {
      reply =
        'For profound introspective narratives exploring parallel possibilities, regret, and meaning like <em>The Midnight Library</em>, I wholeheartedly recommend Toshikazu Kawaguchi’s <strong>Before the Coffee Gets Cold</strong> (time, grief, and forgiveness) and Kazuo Ishiguro’s <strong>Klara and the Sun</strong> (observational wisdom through artificial eyes). Both are available for immediate hardbound order and digital borrowing.';
      suggestedBooks = initialBooks.filter(b => ['book-001', 'book-003', 'book-004'].includes(b._id));
    } else if (q.includes('return') || q.includes('policy') || q.includes('doorstep') || q.includes('exchange')) {
      reply =
        'PageHaven offers an exclusive <strong>14-Day Doorstep Return Sanctuary</strong>. Our courier collects the folio straight from your reading desk with zero repackaging or printing required. You can schedule a pickup directly under our <em>Help Care Sanctuary</em> tab with your Folio ID!';
    } else if (q.includes('graphic') || q.includes('comic') || q.includes('watchmen') || q.includes('sandman') || q.includes('eisner')) {
      reply =
        'In our Comics & Graphic Salon, delve into Alan Moore’s landmark <strong>Watchmen: Deluxe Edition</strong> for dystopian political depth, Neil Gaiman’s <strong>The Sandman: Preludes & Nocturnes</strong> for gothic mythos, or Rachel Smythe’s <strong>Lore Olympus Vol 1</strong> for vibrant romantic reinterpretations.';
      suggestedBooks = initialBooks.filter(b => ['book-010', 'book-011', 'book-014'].includes(b._id));
    } else if (q.includes('manga') || q.includes('anime') || q.includes('frieren') || q.includes('shonen') || q.includes('one piece')) {
      reply =
        'Our Anime & Manga Vault highlights Kanehito Yamada’s reflective masterpiece <strong>Frieren: Beyond Journey’s End</strong>, Eiichiro Oda’s legendary <strong>One Piece: Wano Country</strong>, and Tatsuki Fujimoto’s dark supernatural work <strong>Chainsaw Man</strong>. Each is available in authentic Japanese tankobon formats!';
      suggestedBooks = initialBooks.filter(b => ['book-015', 'book-017', 'book-019'].includes(b._id));
    } else if (q.includes('habit') || q.includes('mindset') || q.includes('wisdom') || q.includes('stoic') || q.includes('focus')) {
      reply =
        'To elevate cognitive resilience and daily discipline, explore James Clear’s <strong>Atomic Habits</strong> alongside Viktor Frankl’s monumental <strong>Man’s Search for Meaning</strong> and David Goggins’ <strong>Can\'t Hurt Me</strong>. Together they create an unshakeable blueprint for mental clarity.';
      suggestedBooks = initialBooks.filter(b => ['book-002', 'book-007', 'book-008'].includes(b._id));
    } else if (q.includes('academic') || q.includes('physics') || q.includes('biology') || q.includes('law') || q.includes('textbook')) {
      reply =
        'Our Academic University Stacks offer peer-reviewed volumes including <strong>Principles of Modern Physics (Quantum Mechanics)</strong>, <strong>Campbell Biology (Global Genetics)</strong>, and <strong>Constitutional Law (Oxford Law Library)</strong>—available for university campus borrowing or archival binding purchase.';
      suggestedBooks = initialBooks.filter(b => ['book-027', 'book-028', 'book-029'].includes(b._id));
    } else if (q.includes('magazine') || q.includes('vogue') || q.includes('forbes') || q.includes('architecture')) {
      reply =
        'Our Periodicals Lounge features glossy heavy-stock artboard publications such as <strong>Vogue Haute Couture Archival</strong>, <strong>Forbes Global Finance Review 2025</strong>, and <strong>Architectural Sanctuary</strong>—delivering exquisite visual and analytical curation.';
      suggestedBooks = initialBooks.filter(b => ['book-020', 'book-021', 'book-022'].includes(b._id));
    } else {
      reply = `Thank you for consulting ReadGenius. Based on PageHaven's rare collections and archival catalog, I recommend exploring our curated masterworks. Every volume in our sanctuary is inspected to museum-grade, acid-free archival preservation standards. Would you like a personalized recommendation in fiction, graphic novels, or cognitive philosophy?`;
      suggestedBooks = initialBooks.slice(0, 3);
    }

    return res.json({
      success: true,
      data: {
        reply,
        suggestedBooks,
        timestamp: new Date()
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
