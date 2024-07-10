const router = require('express').Router();

// Protected route
router.get('/', (req, res) => {
  res.status(200).json({ message: 'You have accessed a protected route!' });
});

module.exports = router;
