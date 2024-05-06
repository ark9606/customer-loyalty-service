import { NextFunction, Request, Response } from 'express';
import { webhookService } from '../services/webhook.service';

export class WebhookController {
  public static async handleEvent(req: Request, res: Response, next: NextFunction) {
    try {
      // todo remove after testing
      // console.log(JSON.stringify(req.body), ',');
      await webhookService.handle(req.body);
      res.status(200).json({ status: 'success' });
    } catch (e) {
      next(e);
    }
  }
}
