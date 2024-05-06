import { Job, Queue, Worker } from 'bullmq';
import { redisConnection } from '../config/redis';
import { WebhookEvent } from '../services/dtos/webhook-event';
import { jobProcessor } from './JobProcessor';

export const eventsQueue = new Queue('events', {
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

const worker = new Worker(
  'events',
  async (job: Job<WebhookEvent<unknown>, any, string>) => {
    // console.log('Processing job:', job.attemptsMade);

    await jobProcessor.process(job);
  },
  { connection: redisConnection, autorun: true },
);

worker.on('completed', (job: Job, returnvalue: any) => {
  console.log(`Completed job ${job.data.EventName} (jobId ${job.id}) tries ${job.attemptsMade}`);
});

worker.on('failed', (job: Job<WebhookEvent<unknown>, any, string> | undefined, error: Error) => {
  console.log(
    `Failed job ${job?.data?.EventName} (jobId ${job?.id}) tries ${job?.attemptsMade} error ${error.message}`,
  );
});
