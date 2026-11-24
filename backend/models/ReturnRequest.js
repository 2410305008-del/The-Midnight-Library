import mongoose from 'mongoose';

const returnRequestSchema = new mongoose.Schema(
  {
    returnId: { type: String, unique: true, required: true },
    folioNumber: { type: String, required: true },
    contactName: { type: String, required: true },
    contactEmail: { type: String, required: true },
    pickupAddress: { type: String, required: true },
    pickupTimeSlot: { type: String, default: 'Tomorrow, 10:00 AM - 01:00 PM' },
    reason: { type: String, default: '14-Day Archival Sanctuary Return' },
    status: {
      type: String,
      enum: ['Courier Scheduled', 'Courier En Route', 'Inspected & Refunded'],
      default: 'Courier Scheduled'
    }
  },
  { timestamps: true }
);

export const ReturnRequest = mongoose.models.ReturnRequest || mongoose.model('ReturnRequest', returnRequestSchema);
export default ReturnRequest;
