import { Request, Response } from "express";
import { CustomerModel } from "../models/customer";

export class WebhookController {
  public static async handleEvent(req: Request, res: Response) {
    // console.log('>> Got a webhook event:');
    console.log(JSON.stringify(req.body), ',');
    if (req.body.EventName === 'CustomerCreated') {
      const newCustomer = new CustomerModel({
        customerId: req.body.Payload.CustomerId,
        createdAt: new Date(req.body.EventTime),
      });
      const savedCustomer = await newCustomer.save();
      res.status(201).json(savedCustomer);
    } else {
      res.status(200).send('Webhook event received');
    }
  }
}