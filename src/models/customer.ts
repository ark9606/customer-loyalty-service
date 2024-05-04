import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  customerId: { type: String, required: true },
  createdAt: { type: Date, required: true }
});

export const CustomerModel = mongoose.model('Customer', customerSchema);
