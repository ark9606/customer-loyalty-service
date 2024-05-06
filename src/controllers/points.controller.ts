import { NextFunction, Request, Response } from 'express';
import { pointsService } from '../services/points.service';
import BadRequestError from '../common/errors/bad-request.error';

export class PointsController {
  public static async getPointsForCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      PointsController.validateCustomerId(req.params.id);

      const points = await pointsService.getPointsForCustomer(req.params.id);
      res.send({ totalAvailablePoints: points }).status(200);
    } catch (e) {
      next(e);
    }
  }

  public static async consumePoints(req: Request, res: Response, next: NextFunction) {
    try {
      PointsController.validateCustomerId(req.params.id);
      if (!('points' in req.body) || typeof req.body.points !== 'number') {
        throw new BadRequestError({message: 'Given invalid points value'});
      }

      const updatedPoints = await pointsService.consumePoints(req.body.points, req.params.id);
      res.send({ totalAvailablePoints: updatedPoints }).status(201);
    } catch (e) {
      next(e);
    }
  }

  private static validateCustomerId(input: unknown) {
    if (typeof input !== 'string' || !input.length) {
      throw new BadRequestError({message: 'Given invalid customer id'});
    }
  }
}
