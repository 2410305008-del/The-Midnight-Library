import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  bookId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  price: { type: Number, required: true },
  edition: { type: String, default: 'Hardbound' },
  qty: { type: Number, required: true, min: 1 },
  image: { type: String }
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: 'United States' }
    },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    voucherCode: { type: String, default: '' },
    shippingFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['card', 'upi', 'cod', 'wallet'], default: 'card' },
    paymentStatus: { type: String, enum: ['paid', 'pending', 'failed'], default: 'paid' },
    orderStatus: {
      type: String,
      enum: ['Confirmed', 'In Curation', 'Dispatched', 'Out for Delivery', 'Delivered'],
      default: 'Confirmed'
    },
    trackingNumber: { type: String, required: true },
    estimatedDelivery: { type: String, default: 'Within 2 business days via White Glove Courier' }
  },
  { timestamps: true }
);

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
