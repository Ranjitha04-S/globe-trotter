import express from "express";
import dotenv from "dotenv";
import cors from "cors";


import path from "path";
import connectDB from "./config/db.js";
import authRoutes from "./models/authRoutes.js";
import tripRoutes from "./routes/trip.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Serve uploads folder statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/trips', tripRoutes);

app.use("/api/auth", authRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
