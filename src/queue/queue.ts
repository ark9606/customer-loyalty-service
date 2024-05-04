import { Job, Queue, Worker } from 'bullmq'
import { redisConnection } from '../config/redis';
import { WebhookEvent } from '../services/types';
import { jobProcessor } from './JobProcessor';

export const eventsQueue = new Queue('events', {
  connection: redisConnection,
  defaultJobOptions: {
    // configured retry mechanism to handle incorrect order of events
    attempts: 10,
    backoff: {
      type: 'exponential',
      delay: 1000,
    }
  }
});

const myWorker = new Worker('events', async (job: Job<WebhookEvent, any, string>)=>{
  // console.log('Processing job:', job.attemptsMade);
  
  await jobProcessor.process(job);

}, { connection: redisConnection, autorun: true});

myWorker.on('completed', (job: Job, returnvalue: any) => {
  // console.log('Job completed:', job.id);
  console.log(`Handled job id ${job.id} (${job.data.EventName}) tries ${job.attemptsMade}`);

});

myWorker.on('failed', (job: Job<WebhookEvent, any, string> | undefined, error: Error) => {
  console.log(`Failed job id ${job?.id} (${job?.data?.EventName}) tries ${job?.attemptsMade} error ${error.message}`);

  // Do something with the return value.
  // console.log('failed', error);
});



