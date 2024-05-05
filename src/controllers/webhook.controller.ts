import { NextFunction, Request, Response } from 'express';
import { eventService } from '../services/event.service';

export class WebhookController {
  public static async handleEvent(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log(JSON.stringify(req.body), ',');

      // todo validate the event
      // todo create types for the event
      await eventService.handle(req.body);
      res.status(201).json({ status: 'success' });
    } catch(e) {
      next(e);
    }

  }
}
