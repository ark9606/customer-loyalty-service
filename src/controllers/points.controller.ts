import { NextFunction, Request, Response } from 'express';
import { pointsService } from '../services/points.service';

export class PointsController {
  public static async getPointsForCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const points = await pointsService.getPointsForCustomer(req.params.id);
      res.send({ totalAvailablePoints: points }).status(200);
    } catch (e) {
      next(e);
    }
  }

  public static async consumePoints(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedPoints = await pointsService.consumePoints(req.body.points, req.params.id);
      res.send({ totalAvailablePoints: updatedPoints }).status(201);
    } catch (e) {
      next(e);
    }
  }
}
