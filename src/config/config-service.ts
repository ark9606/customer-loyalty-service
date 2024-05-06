import dotenv from 'dotenv';

dotenv.config();

export class ConfigService {
  public static get mongoURI(): string {
    const uri = process.env.MONGODB_URI;
    if (!uri || !uri.length) {
      return ConfigService.throwError('MONGODB_URI');
    }
    return uri;
  }

  public static get redisConfig(): { host: string; port: number } {
    const host = process.env.REDIS_HOST;
    if (!host || !host.length) {
      return ConfigService.throwError('REDIS_HOST');
    }
    const port = parseInt(process.env.REDIS_PORT || '6379');
    if (!Number.isSafeInteger(port)) {
      return ConfigService.throwError('REDIS_PORT');
    }
    return {
      host,
      port,
    };
  }

  public static get port(): number {
    const port = parseInt(process.env.PORT || '3000');
    if (!Number.isSafeInteger(port)) {
      return ConfigService.throwError('PORT');
    }
    return port;
  }

  private static throwError(envVariable: string): never {
    throw new Error(`Invalid env variable "${envVariable}"`);
  }
}
