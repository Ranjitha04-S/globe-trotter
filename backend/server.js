// Basic Express server setup
const express = require('express');
const connectDB = require('./db');
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.use(express.json());

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
