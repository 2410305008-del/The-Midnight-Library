import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['story-fiction', 'comics-graphic', 'anime-manga', 'wisdom-mind', 'magazines-gk', 'academic'],
      default: 'story-fiction'
    },
    genre: { type: String, default: 'General Literature' },
    price: { type: Number, required: true, min: 0 },
    digitalPrice: { type: Number, required: true, min: 0 },
    edition: { type: String, default: 'Archival Hardcover' },
    availableEditions: [{ type: String }],
    coverImage: { type: String, required: true },
    excerpt: { type: String, default: '' },
    synopsis: { type: String, default: '' },
    rating: { type: Number, default: 4.8, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 100 },
    isbn: { type: String, default: '978-0000000000' },
    stock: { type: Number, default: 20 },
    isAvailableForBorrow: { type: Boolean, default: true },
    isSpotlight: { type: Boolean, default: false },
    folioNumber: { type: String, default: 'Folio No. 0000' }
  },
  { timestamps: true }
);

export const Book = mongoose.models.Book || mongoose.model('Book', bookSchema);
export default Book;
