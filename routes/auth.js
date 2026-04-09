import express from 'express';

const router = express.Router();

// GET /api/auth/status - Check auth status
router.get('/status', (req, res) => {
  // This would check Supabase session
  res.json({ authenticated: false, user: null });
});

export default router;