// Basic Express server setup
const express = require('express');
const connectDB = require('./db');
const tripRoutes = require('./routes/trip');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();


app.use(cors());
app.use(express.json());
app.use('/api/trips', tripRoutes);

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Sample API route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API route working!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
