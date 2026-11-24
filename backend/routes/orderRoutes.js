import express from 'express';
import { Order } from '../models/Order.js';
import mongoose from 'mongoose';

const router = express.Router();
const isMongoConnected = () => mongoose.connection.readyState === 1;

// Memory orders store
const memoryOrders = [
  {
    _id: 'ord-001',
    orderNumber: 'PH-88492',
    customerName: 'Eleanor Vance',
    customerEmail: 'scholar@pagehaven.org',
    shippingAddress: {
      street: '742 Evergreen Terrace, Apt 4B',
      city: 'New Haven',
      state: 'CT',
      postalCode: '06511',
      country: 'United States'
    },
    items: [
      {
        bookId: 'book-001',
        title: 'The Midnight Library',
        author: 'Matt Haig',
        price: 24.00,
        edition: 'Archival Gilded Hardcover',
        qty: 1,
        image: '/covers/book_cover_for_the_midnight_library_by_matt_haig_warm_atmospheric_glowing.png'
      },
      {
        bookId: 'book-002',
        title: 'Atomic Habits',
        author: 'James Clear',
        price: 21.50,
        edition: 'Hardbound Study Edition',
        qty: 1,
        image: '/covers/book_cover_for_atomic_habits_by_james_clear_clean_modern_minimalist_self.png'
      }
    ],
    subtotal: 45.50,
    discount: 11.38,
    voucherCode: 'PAGE25',
    shippingFee: 0,
    totalAmount: 34.12,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    orderStatus: 'Out for Delivery',
    trackingNumber: 'PH-89412',
    estimatedDelivery: 'Tomorrow, by 2:00 PM via White Glove Courier',
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000)
  }
];

// POST /api/orders - Place a new order
router.post('/', async (req, res) => {
  try {
    const { customerName, customerEmail, shippingAddress, items, voucherCode, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your reading bag is empty.' });
    }

    const subtotal = items.reduce((acc, it) => acc + (it.price * it.qty), 0);
    let discount = 0;
    if (voucherCode && voucherCode.toUpperCase() === 'PAGE25') {
      discount = subtotal * 0.25;
    }
    const shippingFee = subtotal >= 50 ? 0 : 5.00;
    const totalAmount = subtotal - discount + shippingFee;

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `PH-${randomNum}`;
    const trackingNumber = `PH-TRK-${randomNum}`;

    const orderData = {
      orderNumber,
      customerName: customerName || 'Scholar Patron',
      customerEmail: customerEmail || 'patron@pagehaven.org',
      shippingAddress: shippingAddress || {
        street: '742 Evergreen Terrace',
        city: 'New Haven',
        state: 'CT',
        postalCode: '06511',
        country: 'United States'
      },
      items,
      subtotal,
      discount,
      voucherCode: voucherCode || '',
      shippingFee,
      totalAmount,
      paymentMethod: paymentMethod || 'card',
      paymentStatus: 'paid',
      orderStatus: 'Confirmed',
      trackingNumber,
      estimatedDelivery: 'Within 2 business days via Archival Logistics'
    };

    if (isMongoConnected()) {
      const order = new Order(orderData);
      await order.save();
      return res.status(201).json({ success: true, message: 'Order confirmed!', data: order });
    }

    memoryOrders.unshift({ _id: `ord-${Date.now()}`, ...orderData, createdAt: new Date() });
    return res.status(201).json({ success: true, message: 'Order confirmed!', data: memoryOrders[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders/my-orders - List orders
router.get('/my-orders', async (req, res) => {
  try {
    if (isMongoConnected()) {
      const orders = await Order.find().sort({ createdAt: -1 });
      if (orders && orders.length > 0) {
        return res.json({ success: true, count: orders.length, data: orders });
      }
    }
    return res.json({ success: true, count: memoryOrders.length, data: memoryOrders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders/track/:trackingId - Track parcel
router.get('/track/:trackingId', async (req, res) => {
  try {
    const { trackingId } = req.params;
    const cleanId = trackingId.trim().toUpperCase();

    let order = null;
    if (isMongoConnected()) {
      order = await Order.findOne({
        $or: [{ trackingNumber: new RegExp(cleanId, 'i') }, { orderNumber: new RegExp(cleanId, 'i') }]
      });
    }

    if (!order) {
      order = memoryOrders.find(
        o =>
          o.trackingNumber.toUpperCase().includes(cleanId) ||
          o.orderNumber.toUpperCase().includes(cleanId)
      );
    }

    if (!order) {
      return res.json({
        success: true,
        data: {
          trackingNumber: trackingId,
          orderStatus: 'In Transit',
          currentLocation: 'New Haven Archival Vault Logistics Hub',
          estimatedDelivery: 'Tomorrow, by 2:00 PM',
          stages: [
            { step: 'Sanctuary Sealed & Verified', completed: true, time: 'Yesterday, 04:30 PM' },
            { step: 'White Glove Courier Handover', completed: true, time: 'Today, 08:15 AM' },
            { step: 'Out for Doorstep Delivery', completed: true, time: 'Today, 11:45 AM' },
            { step: 'Delivered to Patron Reading Desk', completed: false, time: 'Estimated by 2:00 PM' }
          ]
        }
      });
    }

    return res.json({
      success: true,
      data: {
        trackingNumber: order.trackingNumber,
        orderNumber: order.orderNumber,
        orderStatus: order.orderStatus,
        customerName: order.customerName,
        totalAmount: order.totalAmount,
        estimatedDelivery: order.estimatedDelivery,
        stages: [
          { step: 'Sanctuary Sealed & Inspected', completed: true, time: 'Yesterday, 04:30 PM' },
          { step: 'White Glove Courier Handover', completed: true, time: 'Today, 08:15 AM' },
          { step: 'Out for Doorstep Delivery', completed: order.orderStatus === 'Out for Delivery' || order.orderStatus === 'Delivered', time: 'Today, 11:45 AM' },
          { step: 'Delivered to Patron Reading Desk', completed: order.orderStatus === 'Delivered', time: order.estimatedDelivery }
        ]
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
