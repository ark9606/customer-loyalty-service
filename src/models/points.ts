import mongoose from 'mongoose';

const pointsSchema = new mongoose.Schema({
  customerId: { type: String, required: true },
  orderId: { type: String, required: true },
  sequenceNumber: { type: Number, required: true },
  orderPlacedAt: { type: Date, required: true },
  orderAmount: { type: Number, required: true },
  pointsAvailable: { type: Number, required: true }
});

export const POINTS_TO_DKK = 50;

export const PointsModel = mongoose.model('Points', pointsSchema);
