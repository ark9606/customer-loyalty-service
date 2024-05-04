import { Request, Response } from "express";
import { CustomerModel } from "../models/customer";
import { eventsQueue } from "../queue/queue";
import { webhookService } from "../services/event.service";

export class WebhookController {
  public static async handleEvent(req: Request, res: Response) {
    // console.log(JSON.stringify(req.body), ',');

    // todo validate the event
    // todo create types for the event
    await webhookService.handle(req.body);
    res.status(201).json({status: 'success'});

    // if (req.body.EventName === 'CustomerCreated') {
    //   // const newCustomer = new CustomerModel({
    //   //   customerId: req.body.Payload.CustomerId,
    //   //   createdAt: new Date(req.body.EventTime),
    //   // });
    //   // const savedCustomer = await newCustomer.save();

    //   const result = await eventsQueue.add('CustomerCreated', req.body);
    //   // console.log('Job added to queue:', result);
    //   // res.status(201).json(savedCustomer);
    //   res.status(201).json({status: 'success'});
    // } else {
    //   res.status(200).send('Webhook event received');
    // }
  }
}