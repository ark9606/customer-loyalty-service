import { Request, Response } from 'express';
import { webhookService } from '../services/event.service';

export class PointsController {
  public static async getPointsForCustomer(req: Request, res: Response) {
    console.log(JSON.stringify(req.body));

    // todo validate the event
    // todo create types for the event
    await webhookService.handle(req.body);
    res.status(201).json({ status: 'success' });
  }

  public static async consumePoints(req: Request, res: Response) {
    console.log(JSON.stringify(req.body));
    res.status(201).json({ status: 'success' });
  }
}
