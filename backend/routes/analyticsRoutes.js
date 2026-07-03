import express from 'express';
import { getDashboardStats } from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all analytics routes
router.use(protect);

router.get('/dashboard', getDashboardStats);

export default router;
