const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1); // Exit the application if the database connection fails
});

const authRoute = require('./routes/auth');
const protectedRoute = require('./routes/protected');
const verifyToken = require('./middleware/auth');

app.use('/api/auth', authRoute);
app.use('/api/protected', verifyToken, protectedRoute);

app.get("/health", (req, res)=>{
  res.send(`<h1>Working Fine, I'm OK!</h1>`)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
