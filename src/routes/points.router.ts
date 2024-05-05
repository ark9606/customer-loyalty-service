import express from 'express';
import { PointsController } from '../controllers/points.controller';

const router = express.Router();

router.get('/:id/points', PointsController.getPointsForCustomer);

router.post('/:id/consume', PointsController.consumePoints);

export default router;
