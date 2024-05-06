import { Job } from 'bullmq';
import { CustomerModel } from '../models/customer';
import { EVENT_NAME, WebhookEvent } from '../services/dtos/webhook-event';
import { POINTS_TO_DKK, PointsModel } from '../models/points';
import BadRequestError from '../common/errors/bad-request.error';

// todo fix WebhookEvent<any>
class JobProcessor {
  public async process(job: Job<WebhookEvent<any>>) {
    try {
      switch (job.data.EventName) {
        case EVENT_NAME.CustomerCreated: {
          await this.createCustomer(job.data);
          break;
        }
        case EVENT_NAME.CustomerDeleted: {
          await this.deleteCustomer(job.data);
          break;
        }
        case EVENT_NAME.OrderPlaced: {
          await this.placeOrder(job.data);
          break;
        }
        case EVENT_NAME.OrderReturned: {
          await this.returnOrder(job.data);
          break;
        }
        case EVENT_NAME.OrderCanceled: {
          await this.cancelOrder(job.data);
          break;
        }
        default:
          // exhaustive check for EventName
          const _check: never = job.data.EventName;
      }
    } catch (e) {
      // console.log('>> error', e);
      throw e;
    }

    // console.log(`Handled job (${job.id}, ${job.data.EventName}) tries ${job.attemptsMade}`);
  }

  async placeOrder(event: WebhookEvent<any>) {
    const existingCustomer = await CustomerModel.findOne({
      customerId: event.Payload.CustomerId,
    });
    if (!existingCustomer) {
      // return to queue
      throw new BadRequestError({ message: "Order can't be placed before user created" });
    }
    const newPoints = new PointsModel({
      customerId: event.Payload.CustomerId,
      orderId: event.Payload.OrderId,
      sequenceNumber: event.Sequence,
      orderPlacedAt: new Date(event.EventTime),
      orderAmount: event.Payload.TotalOrderAmount,
      pointsAvailable: +(event.Payload.TotalOrderAmount / POINTS_TO_DKK).toFixed(2),
    });
    await newPoints.save();
    console.log('Order placed id', event.Payload.OrderId);
  }

  async returnOrder(event: WebhookEvent<any>) {
    const existingPoints = await PointsModel.findOne({
      orderId: event.Payload.OrderId,
      sequenceNumber: { $lt: event.Sequence },
    });
    if (!existingPoints) {
      // return to queue
      throw new BadRequestError({ message: "Order can't be returned (sequence conflict)" });
    }
    // when record is deleted, points are cleared out
    await existingPoints.deleteOne();
    console.log('Order returned id', event.Payload.OrderId);
  }

  async cancelOrder(event: WebhookEvent<any>) {
    const existingPoints = await PointsModel.findOne({
      orderId: event.Payload.OrderId,
      sequenceNumber: { $lt: event.Sequence },
    });
    if (!existingPoints) {
      // return to queue
      throw new BadRequestError({ message: "Order can't be canceled (sequence conflict)" });
    }
    existingPoints.sequenceNumber = event.Sequence;
    await existingPoints.save();
    console.log('Order canceled id', event.Payload.OrderId);
  }

  async createCustomer(event: WebhookEvent<any>) {
    // const newCustomer = new CustomerModel({
    //   customerId: event.Payload.CustomerId,
    //   createdAt: new Date(event.EventTime),
    // });
    // const savedCustomer = await newCustomer.save();
    // console.log('Customer created id', savedCustomer.customerId);
  }

  async deleteCustomer(event: WebhookEvent<any>) {
    const existingCustomer = await CustomerModel.findOne({
      customerId: event.Payload.CustomerId,
      sequenceNumber: { $lt: event.Sequence },
    });
    if (!existingCustomer) {
      // return to queue
      throw new BadRequestError({ message: "Customer doesn't exist" });
    }
    await existingCustomer.deleteOne();
    await PointsModel.deleteMany({ customerId: event.Payload.CustomerId });
    console.log('Customer deleted id', event.Payload.CustomerId);
  }
}

export const jobProcessor = new JobProcessor();
