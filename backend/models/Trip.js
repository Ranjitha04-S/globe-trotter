
import mongoose from 'mongoose';


const tripSchema = new mongoose.Schema({
  name: { type: String, required: true },
  destination: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  budget: { type: Number, required: true },
  description: { type: String },
  images: [{ type: String }], // for future image support
}, { timestamps: true });

const Trip = mongoose.model('Trip', tripSchema);
export default Trip;
