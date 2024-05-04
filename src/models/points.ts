import mongoose from 'mongoose';

const pointsSchema = new mongoose.Schema({
  customerId: { type: String, required: true },
  orderId: { type: String, required: true },
  orderPlacedAt: { type: Date, required: true },
  orderAmount: { type: Number, required: true },
  pointsAvailable: { type: Number, required: true }
});

export const PointsModel = mongoose.model('Points', pointsSchema);
