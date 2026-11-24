import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultBooks } from '../data/defaultBooks';
import api from '../services/api';

const BookstoreContext = createContext();

export const BookstoreProvider = ({ children }) => {
  // Navigation View
  const [activeView, setActiveView] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');

  // Books
  const [books, setBooks] = useState(defaultBooks);
  const [spotlightBook, setSpotlightBook] = useState(defaultBooks[0]);
  const [loadingBooks, setLoadingBooks] = useState(false);

  // Reading Bag (Cart)
  const [bagItems, setBagItems] = useState([
    {
      title: "The Midnight Library",
      author: "Matt Haig",
      price: 24.00,
      edition: "Hardbound",
      qty: 1,
      image: "/covers/book_cover_for_the_midnight_library_by_matt_haig_warm_atmospheric_glowing.png"
    },
    {
      title: "Atomic Habits",
      author: "James Clear",
      price: 21.50,
      edition: "Hardbound",
      qty: 1,
      image: "/covers/book_cover_for_atomic_habits_by_james_clear_clean_modern_minimalist_self.png"
    },
    {
      title: "Frieren: Beyond Journey's End",
      author: "Kanehito Yamada",
      price: 15.00,
      edition: "Tankobon",
      qty: 1,
      image: "/covers/manga_tankobon_book_cover_for_frieren_beyond_journey_s_end_elegant_fantasy.png"
    }
  ]);
  const [voucherApplied, setVoucherApplied] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');

  // E-Library Borrowed Books
  const [borrowedBooks, setBorrowedBooks] = useState([
    {
      _id: 'loan-001',
      bookId: 'book-001',
      title: 'The Midnight Library',
      author: 'Matt Haig',
      coverImage: '/covers/book_cover_for_the_midnight_library_by_matt_haig_warm_atmospheric_glowing.png',
      borrowDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000).toISOString(),
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
      borrowDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Active Loan',
      readingProgress: 24,
      daysLeft: 19
    }
  ]);

  // Orders
  const [orders, setOrders] = useState([]);

  // Auth User
  const [currentUser, setCurrentUser] = useState({
    name: 'Eleanor Vance',
    email: 'scholar@pagehaven.org',
    membershipTier: 'Patron Scholar (Archival Pass)',
    readingStreaks: 14,
    booksReadCount: 18,
    isLoggedIn: true
  });

  // Modals & Drawers
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [activeModalBook, setActiveModalBook] = useState(null);

  // Toast
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3200);
  };

  // Fetch initial books from API
  useEffect(() => {
    const fetchBooks = async () => {
      setLoadingBooks(true);
      const res = await api.getBooks();
      if (res && res.success && res.data?.length > 0) {
        setBooks(res.data);
        const spot = res.data.find(b => b.isSpotlight) || res.data[0];
        setSpotlightBook(spot);
      }
      setLoadingBooks(false);
    };

    fetchBooks();
  }, []);

  // Fetch initial borrowed books & orders
  useEffect(() => {
    const fetchUserData = async () => {
      const loanRes = await api.getBorrowedBooks();
      if (loanRes && loanRes.success && loanRes.data?.length > 0) {
        setBorrowedBooks(loanRes.data);
      }
      const ordRes = await api.getMyOrders();
      if (ordRes && ordRes.success && ordRes.data?.length > 0) {
        setOrders(ordRes.data);
      }
    };
    fetchUserData();
  }, []);

  // Reading Bag functions
  const addToBag = (book, edition = "Hardbound") => {
    const title = book.title;
    const author = book.author;
    const price = edition === "Digital" ? (book.digitalPrice || 12.00) : (book.price || 24.00);
    const image = book.coverImage || "/covers/book_cover_for_the_midnight_library_by_matt_haig_warm_atmospheric_glowing.png";

    setBagItems(prev => {
      const idx = prev.findIndex(item => item.title === title && item.edition === edition);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx].qty += 1;
        return copy;
      }
      return [...prev, { title, author, price: parseFloat(price), edition, qty: 1, image }];
    });

    showToast(`Secured "${title}" in your reading bag`);
    setIsBagOpen(true);
  };

  const updateBagQty = (index, delta) => {
    setBagItems(prev => {
      const copy = [...prev];
      if (copy[index]) {
        copy[index].qty += delta;
        if (copy[index].qty <= 0) {
          copy.splice(index, 1);
        }
      }
      return copy;
    });
  };

  const removeBagItem = (index) => {
    setBagItems(prev => {
      const copy = [...prev];
      const item = copy[index];
      if (item) {
        copy.splice(index, 1);
        showToast(`Removed "${item.title}" from your bag`);
      }
      return copy;
    });
  };

  const applyVoucher = (code) => {
    const clean = (code || '').trim().toUpperCase();
    if (clean === 'PAGE25') {
      setVoucherApplied(true);
      setVoucherCode('PAGE25');
      showToast('Voucher PAGE25 applied: 25% archival savings unlocked!');
      return true;
    } else {
      showToast("Invalid keycode. Try 'PAGE25'", 'error');
      return false;
    }
  };

  // E-Library Borrow functions
  const borrowBook = async (book) => {
    const existing = borrowedBooks.find(b => b.bookId === book._id);
    if (existing) {
      showToast(`"${book.title}" is already checked out in your Digital Library.`);
      setActiveView('my-library');
      return;
    }

    const res = await api.borrowBook(book._id);
    const newRecord = {
      _id: `loan-${Date.now()}`,
      bookId: book._id,
      title: book.title,
      author: book.author,
      coverImage: book.coverImage,
      borrowDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Active Loan',
      readingProgress: 5,
      daysLeft: 21
    };
    setBorrowedBooks(prev => [newRecord, ...prev]);
    showToast(`"${book.title}" borrowed for 21 days from E-Library!`);
    if (activeModalBook) setActiveModalBook(null);
  };

  const returnBorrowedBook = async (bookId, title) => {
    await api.returnBook(bookId);
    setBorrowedBooks(prev => prev.filter(b => b.bookId !== bookId));
    showToast(`"${title}" returned to PageHaven stacks.`);
  };

  const updateProgress = async (bookId, newProgress) => {
    await api.updateReadingProgress(bookId, newProgress);
    setBorrowedBooks(prev =>
      prev.map(b => (b.bookId === bookId ? { ...b, readingProgress: newProgress } : b))
    );
  };

  // Calculate totals
  const bagSubtotal = bagItems.reduce((acc, it) => acc + (it.price * it.qty), 0);
  const bagItemCount = bagItems.reduce((acc, it) => acc + it.qty, 0);
  const bagDiscount = voucherApplied ? bagSubtotal * 0.25 : 0;
  const bagShipping = bagSubtotal >= 50 || bagSubtotal === 0 ? 0 : 5.00;
  const bagTotal = Math.max(0, bagSubtotal - bagDiscount + bagShipping);

  return (
    <BookstoreContext.Provider
      value={{
        activeView,
        setActiveView,
        searchQuery,
        setSearchQuery,
        books,
        spotlightBook,
        loadingBooks,
        bagItems,
        addToBag,
        updateBagQty,
        removeBagItem,
        voucherApplied,
        voucherCode,
        applyVoucher,
        borrowedBooks,
        borrowBook,
        returnBorrowedBook,
        updateProgress,
        orders,
        setOrders,
        currentUser,
        setCurrentUser,
        isBagOpen,
        setIsBagOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        activeModalBook,
        setActiveModalBook,
        toast,
        showToast,
        bagSubtotal,
        bagItemCount,
        bagDiscount,
        bagShipping,
        bagTotal
      }}
    >
      {children}
    </BookstoreContext.Provider>
  );
};

export const useBookstore = () => {
  const context = useContext(BookstoreContext);
  if (!context) {
    throw new Error('useBookstore must be used within a BookstoreProvider');
  }
  return context;
};

export default BookstoreContext;
