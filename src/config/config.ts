import dotenv from "dotenv";

dotenv.config();

export class Config {
  public static get mongoURI(): string {
    return process.env.MONGO_URI || 'mongodb://localhost:27017/yourdb';
  }

  public static get redisConfig(): {host: string, port: number} {
    return {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    }
  }

  public static get redisPort(): number {
    return parseInt(process.env.REDIS_PORT || '6379');
  }
  public static get port(): number {
    return parseInt(process.env.PORT || '3000');
  }
}