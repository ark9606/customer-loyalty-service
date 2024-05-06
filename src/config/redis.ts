import { ConfigService } from './config-service';
import IORedis from 'ioredis';

export const redisConnection = new IORedis({
  host: ConfigService.redisConfig.host,
  port: ConfigService.redisConfig.port,
  maxRetriesPerRequest: null,
});
