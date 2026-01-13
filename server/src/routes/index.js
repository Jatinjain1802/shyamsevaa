const express = require('express');
const router = express.Router();

// Import other route files here, e.g.:
// const userRoutes = require('./userRoutes');
// router.use('/users', userRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

module.exports = router;
