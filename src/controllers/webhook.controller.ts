import { Request, Response } from "express";
import { CustomerModel } from "../models/customer";
import { eventsQueue } from "../queue/queue";
import { webhookService } from "../services/event.service";
import crypto from 'crypto';
import { redisConnection } from "../config/redis";

export class WebhookController {
  public static async handleEvent(req: Request, res: Response) {
    // console.log(JSON.stringify(req.body), ',');

    // todo validate the event
    // todo create types for the event
    const {EventTime, ...rest} = req.body;
    const hash = crypto.createHash('sha256').update(JSON.stringify(rest)).digest('hex');
    const redisKey = `event_hash:${hash}`;
    const exists = await redisConnection.exists(redisKey);
    // console.log('>>exists', exists)
    if (exists) {
      // console.log('hash dup', hash);
      res.status(201).json({status: 'duplicate'});
      return;
    }
    await webhookService.handle(req.body);
    await redisConnection.set(redisKey, 1, 'EX', 60 * 5);
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