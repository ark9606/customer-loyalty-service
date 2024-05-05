import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import WebhookRouter from './routes/webhook.router';
import PointsRouter from './routes/points.router';
import mongoose from 'mongoose';
import { errorHandler } from './middlewares/error-handler';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.send('Customer loyalty service');
});

app.use('/webhook', WebhookRouter);
app.use('/', PointsRouter);

app.use(errorHandler);

// todo fix validation
mongoose.connect(MONGODB_URI!);

app.listen(port, () => {
  console.log(`Customer loyalty service is running at http://localhost:${port}`);
});
