import { Job } from 'bullmq';
import { CustomerModel } from '../models/customer';
import { EVENT_NAME, WebhookEvent } from '../services/types';

class JobProcessor {
  public async process(job: Job<WebhookEvent>) {
    // console.log('>> start handle');

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
        default:
          // throw new Error('No processors for job');
          // console.log('default', event.EventName);
          // todo make correct check for never
          const _check: never = '' as never;
          return _check;
      }
    } catch (e) {
      // console.log('>> error', e);
      throw e;
    }

    // console.log(`Handled job (${job.id}, ${job.data.EventName}) tries ${job.attemptsMade}`);
  }

  async createCustomer(event: WebhookEvent) {
    // console.log('>> start CustomerCreated');
    const newCustomer = new CustomerModel({
      customerId: event.Payload.CustomerId,
      createdAt: new Date(event.EventTime)
    });
    const savedCustomer = await newCustomer.save();
    // console.log('>> done create');
  }

  async deleteCustomer(event: WebhookEvent) {
    // console.log('>> start CustomerDeleted');
    const existingCustomer = await CustomerModel.findOne({
      customerId: event.Payload.CustomerId
    });
    if (!existingCustomer) {
      // return to queue
      throw new Error("Customer doesn't exist");
    }
    await existingCustomer.deleteOne();
    // console.log('>> done delete');
  }
}

export const jobProcessor = new JobProcessor();
