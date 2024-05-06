import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import WebhookRouter from './routes/webhook.router';
import PointsRouter from './routes/points.router';
import mongoose from 'mongoose';
import { errorHandler } from './middlewares/error-handler';
import { ConfigService } from './config/config-service';

dotenv.config();

const app: Express = express();
const port = ConfigService.port;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.send('Customer loyalty service');
});

app.use('/webhook', WebhookRouter);
app.use('/', PointsRouter);

app.use(errorHandler);

mongoose.connect(ConfigService.mongoURI);

app.listen(port, () => {
  console.log(`Customer loyalty service is running at http://localhost:${port}`);
});
