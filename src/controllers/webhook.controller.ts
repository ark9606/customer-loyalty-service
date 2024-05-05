import { Request, Response } from 'express';
import { webhookService } from '../services/event.service';

export class WebhookController {
  public static async handleEvent(req: Request, res: Response) {
    // console.log(JSON.stringify(req.body), ',');

    // todo validate the event
    // todo create types for the event
    await webhookService.handle(req.body);
    res.status(201).json({ status: 'success' });
  }
}
