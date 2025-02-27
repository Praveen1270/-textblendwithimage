const express = require('express');
const router = express.Router();

// Define your routes
router.get('/', (req, res) => {
  res.status(200).json({ message: 'API is working' });
});

// Handle 404 errors for undefined routes
router.use('*', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = router;
