import express from 'express';
import { getProblems, getProblemById, createProblem, updateProblem, deleteProblem } from '../controllers/problemController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all problem routes
router.use(protect);

router.route('/')
  .get(getProblems)
  .post(createProblem);

router.route('/:id')
  .get(getProblemById)
  .put(updateProblem)
  .delete(deleteProblem);

export default router;
