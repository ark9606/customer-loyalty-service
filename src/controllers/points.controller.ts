import { NextFunction, Request, Response } from 'express';
import { pointsService } from '../services/points.service';

export class PointsController {
  public static async getPointsForCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log(JSON.stringify(req.body));

      // todo validate the body
      const points = await pointsService.getPointsForCustomer(req.params.id);
      res.send({ totalAvailablePoints: points }).status(200);
    } catch (e) {
      next(e);
    }
  }

  public static async consumePoints(req: Request, res: Response, next: NextFunction) {
    // todo validate the body
    try {
      const updatedPoints = await pointsService.consumePoints(req.body.points, req.params.id);
      res.send({ totalAvailablePoints: updatedPoints }).status(201);
    } catch (e) {
      next(e);
    }
  }
}
