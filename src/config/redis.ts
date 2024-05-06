import { ConfigService } from './config-service';
import IORedis from 'ioredis';

export const redisConnection = new IORedis({
  host: ConfigService.redisConfig.host,
  port: ConfigService.redisConfig.port,
  maxRetriesPerRequest: null,
});

// Create a new connection in every instance
// export const eventsQueue = new Queue('events', { connection});

// const myWorker = new Worker('events', async (job)=>{
//   console.log('Processing job:', job.data);
//   // todo process the job
//   // todo save the job to the database
// }, { connection, autorun: true});

// myWorker.on('completed', (job: Job, returnvalue: any) => {
//   // Do something with the return value.
//   console.log('Job completed:', job.data);
// });
