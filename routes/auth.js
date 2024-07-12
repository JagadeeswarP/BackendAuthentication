const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Validate email format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid @gmail.com email address.' });
  }

  const user = new User({ username, email, password: bcrypt.hashSync(password, 10) });
  try {
    const savedUser = await user.save();
    const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ user: savedUser, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify
router.post('/verify', async (req, res) => {
  const token = req.body.token;

  if (!token) return res.status(400).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    if (!user) return res.status(400).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
});

module.exports = router;
