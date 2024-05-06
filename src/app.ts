import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import WebhookRouter from './routes/webhook.router';
import PointsRouter from './routes/points.router';
import mongoose from 'mongoose';
import { errorHandler } from './middlewares/error-handler';
import { ConfigService } from './config/config-service';
import Database from './common/db';

dotenv.config();

export const app: Express = express();
const port = ConfigService.port;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.send('Customer loyalty service');
});

app.use('/webhook', WebhookRouter);
app.use('/', PointsRouter);

app.use(errorHandler);

if (ConfigService.NODE_ENV !== 'test') {
  Database.getInstance()
}
