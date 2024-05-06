import { Job, Queue, Worker } from 'bullmq';
import { redisConnection } from '../config/redis';
import { EVENT_NAME, EventName, WebhookEvent } from '../services/dtos/webhook-event';
import { customerCreatedEventHandler } from './event-handlers/customer-crated.event-handler';
import { EventHandler } from './event-handlers/event-handler';
import { customerDeletedEventHandler } from './event-handlers/customer-deleted.event-handler';
import { orderCanceledEventHandler } from './event-handlers/order-canceled.event-handler';
import { orderReturnedEventHandler } from './event-handlers/order-returned.event-handler';
import { orderPlacedEventHandler } from './event-handlers/order-placed.event-handler';

const QUEUE_NAME = 'events';

export const eventsQueue = new Queue(QUEUE_NAME, {
  connection: redisConnection,
  defaultJobOptions: {
    // configured retry mechanism to handle incorrect order of events
    attempts: 10,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  },
});

const worker = new Worker(QUEUE_NAME, async (job: Job<WebhookEvent<object>, any, string>) => {
    const handler = getEventHandler(job.data.EventName);

    await handler.handle(job.data);
  },
  { connection: redisConnection, autorun: true },
);

worker.on('completed', (job: Job, returnvalue: any) => {
  console.log(`Completed job ${job.data.EventName} (jobId ${job.id}) tries ${job.attemptsMade}`);
});

worker.on('failed', (job: Job<WebhookEvent<object>, any, string> | undefined, error: Error) => {
  console.log(
    `Failed job ${job?.data?.EventName} (jobId ${job?.id}) tries ${job?.attemptsMade} error ${error.message}`,
  );
});

function getEventHandler(eventName: EventName): EventHandler<object> {
  switch (eventName) {
    case EVENT_NAME.CustomerCreated:
      return customerCreatedEventHandler;

    case EVENT_NAME.CustomerDeleted:
      return customerDeletedEventHandler;

    case EVENT_NAME.OrderPlaced:
      return orderPlacedEventHandler;

    case EVENT_NAME.OrderCanceled:
      return orderCanceledEventHandler;

    case EVENT_NAME.OrderReturned:
      return orderReturnedEventHandler;

    default:
      const _check: never = eventName;
      return _check;
  }
}
