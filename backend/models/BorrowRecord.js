import mongoose from 'mongoose';

const borrowRecordSchema = new mongoose.Schema(
  {
    bookId: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    coverImage: { type: String, required: true },
    borrowerName: { type: String, default: 'Eleanor Vance (Scholar)' },
    borrowDate: { type: Date, default: Date.now },
    dueDate: {
      type: Date,
      default: () => new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) // 21 days loan
    },
    status: {
      type: String,
      enum: ['Active Loan', 'Returned', 'Overdue'],
      default: 'Active Loan'
    },
    readingProgress: { type: Number, default: 0, min: 0, max: 100 },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

export const BorrowRecord = mongoose.models.BorrowRecord || mongoose.model('BorrowRecord', borrowRecordSchema);
export default BorrowRecord;
