import express from 'express';

const router = express.Router();

// GET /api/users/profile - Get user profile
router.get('/profile', (req, res) => {
  // Would require auth middleware
  res.json({ profile: {} });
});

export default router;