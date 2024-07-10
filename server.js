const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

const authRoute = require('./routes/auth');
const protectedRoute = require('./routes/protected');
const verifyToken = require('./middleware/auth');

app.use('/api/auth', authRoute);
app.use('/api/protected', verifyToken, protectedRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
