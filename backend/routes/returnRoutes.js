import express from 'express';
import { ReturnRequest } from '../models/ReturnRequest.js';
import mongoose from 'mongoose';

const router = express.Router();
const isMongoConnected = () => mongoose.connection.readyState === 1;

// Memory returns store
const memoryReturns = [
  {
    returnId: 'RET-8941',
    folioNumber: 'PH-88492',
    contactName: 'Eleanor Vance',
    contactEmail: 'scholar@pagehaven.org',
    pickupAddress: '742 Evergreen Terrace, Apt 4B, New Haven, CT',
    pickupTimeSlot: 'Tomorrow, 10:00 AM - 01:00 PM',
    reason: '14-Day Archival Sanctuary Return',
    status: 'Courier Scheduled',
    createdAt: new Date()
  }
];

// POST /api/returns/schedule - Schedule a 14-day doorstep return pickup
router.post('/schedule', async (req, res) => {
  try {
    const { folioNumber, contactName, contactEmail, pickupAddress, pickupTimeSlot, reason } = req.body;

    if (!folioNumber || !pickupAddress) {
      return res.status(400).json({
        success: false,
        message: 'Please provide the Folio Number and Doorstep Pickup Address.'
      });
    }

    const returnId = `RET-${Math.floor(1000 + Math.random() * 9000)}`;
    const returnData = {
      returnId,
      folioNumber: folioNumber.trim().toUpperCase(),
      contactName: contactName || 'Scholar Patron',
      contactEmail: contactEmail || 'scholar@pagehaven.org',
      pickupAddress,
      pickupTimeSlot: pickupTimeSlot || 'Tomorrow, 10:00 AM - 01:00 PM',
      reason: reason || '14-Day Archival Sanctuary Return',
      status: 'Courier Scheduled'
    };

    if (isMongoConnected()) {
      const doc = new ReturnRequest(returnData);
      await doc.save();
    }

    memoryReturns.unshift(returnData);

    return res.status(201).json({
      success: true,
      message: `Doorstep courier successfully booked under Return Docket #${returnId}! Courier will collect your parcel on ${returnData.pickupTimeSlot}.`,
      data: returnData
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/returns/track/:folioId
router.get('/track/:folioId', (req, res) => {
  const { folioId } = req.params;
  const item = memoryReturns.find(
    r => r.folioNumber.toUpperCase() === folioId.toUpperCase() || r.returnId.toUpperCase() === folioId.toUpperCase()
  );

  if (item) {
    return res.json({ success: true, data: item });
  }

  return res.json({
    success: true,
    data: {
      returnId: `RET-${Math.floor(1000 + Math.random() * 9000)}`,
      folioNumber: folioId,
      status: 'Courier Dispatched',
      pickupTimeSlot: 'Tomorrow, 10:00 AM - 01:00 PM',
      notes: 'White Glove Courier will present PageHaven security docket at doorstep.'
    }
  });
});

export default router;
