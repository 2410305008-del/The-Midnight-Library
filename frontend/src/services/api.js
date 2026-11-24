const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  // Books
  async getBooks(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/books?${query}`);
      return await res.json();
    } catch (err) {
      console.warn('API Error (getBooks), falling back:', err.message);
      return { success: false, error: err.message };
    }
  },

  async getSpotlightBook() {
    try {
      const res = await fetch(`${API_BASE}/books/spotlight`);
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async getBookById(id) {
    try {
      const res = await fetch(`${API_BASE}/books/${id}`);
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // Auth
  async login(email, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: 'Server connection failed' };
    }
  },

  async register(name, email, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: 'Server connection failed' };
    }
  },

  async getMe(token) {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // Orders
  async createOrder(orderData) {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: 'Order submission failed' };
    }
  },

  async getMyOrders() {
    try {
      const res = await fetch(`${API_BASE}/orders/my-orders`);
      return await res.json();
    } catch (err) {
      return { success: false, data: [] };
    }
  },

  async trackParcel(trackingId) {
    try {
      const res = await fetch(`${API_BASE}/orders/track/${encodeURIComponent(trackingId)}`);
      return await res.json();
    } catch (err) {
      return { success: false, message: 'Tracking lookup failed' };
    }
  },

  // E-Library
  async getBorrowedBooks() {
    try {
      const res = await fetch(`${API_BASE}/library/borrowed`);
      return await res.json();
    } catch (err) {
      return { success: false, data: [] };
    }
  },

  async borrowBook(bookId) {
    try {
      const res = await fetch(`${API_BASE}/library/borrow/${bookId}`, {
        method: 'POST',
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: 'Borrowing request failed' };
    }
  },

  async returnBook(bookId) {
    try {
      const res = await fetch(`${API_BASE}/library/return/${bookId}`, {
        method: 'POST',
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: 'Return request failed' };
    }
  },

  async updateReadingProgress(bookId, progress) {
    try {
      const res = await fetch(`${API_BASE}/library/progress/${bookId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress }),
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // ReadGenius AI
  async askConcierge(query) {
    try {
      const res = await fetch(`${API_BASE}/concierge/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: 'Concierge is currently resting in the archives' };
    }
  },

  // Returns
  async scheduleReturn(returnData) {
    try {
      const res = await fetch(`${API_BASE}/returns/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(returnData),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: 'Return scheduling failed' };
    }
  },
};

export default api;
