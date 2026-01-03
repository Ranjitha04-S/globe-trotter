
import mongoose from 'mongoose';


const tripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  destination: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  budget: { type: Number, required: true },
  description: { type: String },
  images: [{ type: String }],
  status: { 
    type: String, 
    enum: ['planning', 'confirmed', 'completed', 'draft'], 
    default: 'planning' 
  },
  stops: { type: Number, default: 1 },
  travelers: { type: Number, default: 1 }
}, { timestamps: true });

const Trip = mongoose.model('Trip', tripSchema);
export default Trip;
