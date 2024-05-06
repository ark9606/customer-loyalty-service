import dotenv from 'dotenv';

dotenv.config();

export class ConfigService {
  public static get mongoURI(): string {
    const uri = process.env.MONGODB_URI;
    if (!uri || !uri.length) {
      throw new Error(`Invalid env variable MONGODB_URI`);
    }
    return uri;
  }

  public static get redisConfig(): { host: string; port: number } {
    const host = process.env.REDIS_HOST;
    if (!host || !host.length) {
      throw new Error(`Invalid env variable REDIS_HOST`);
    }
    const port = parseInt(process.env.REDIS_PORT || '6379');
    if (!Number.isSafeInteger(port)) {
      throw new Error(`Invalid env variable REDIS_PORT`);
    }
    return {
      host,
      port,
    };
  }

  public static get port(): number {
    const port = parseInt(process.env.PORT || '3000');
    if (!Number.isSafeInteger(port)) {
      throw new Error(`Invalid env variable PORT`);
    }
    return port;
  }
}
