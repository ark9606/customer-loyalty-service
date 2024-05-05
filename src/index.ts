import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import WebhookRouter from './routes/webhook.router';
import PointsRouter from './routes/webhook.router';
import mongoose from 'mongoose';

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

app.use((err: Error, req: Request, res: Response): void => {
  console.error(err);
  res.status(500).send({ errors: [{ message: 'Something went wrong' }] });
});

// todo fix validation
mongoose.connect(MONGODB_URI!);

app.listen(port, () => {
  console.log(`Customer loyalty service is running at http://localhost:${port}`);
});
