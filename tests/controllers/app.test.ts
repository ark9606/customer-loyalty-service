import request from "supertest";
import { app } from "../../src/app";
import { redisConnection } from "../../src/config/redis";
import { eventsQueue, worker } from "../../src/events/queue";
import * as db from './db'
import { mongooseConnection } from "./db";
import { CustomerModel } from "../../src/models/customer";

describe("Customer loyalty service", () => {
  beforeAll(async () => {
    await db.connect()
 });
//  afterEach(async () => {
//     await db.clearDatabase()
//  });
 afterAll(async () => {
    await db.closeDatabase();
    try{
      await worker.close();
    } catch(e) {
      console.error(e);
    }

    // try{
    //   await redisConnection.disconnect();
    // } catch(e) {
    //   console.error(e);
    // }

    await new Promise((resolve) => {
      redisConnection.quit();
      redisConnection.on('end', resolve);
    });
 });

  describe('Consume earned points', () => {

    it("should do smth", async () => {
      // const res = await request(app).get('/540b04da-c736-40b6-8f52-be0797a40aa8/points');
      const createCustomerResponse = await request(app).post('/webhook').send({
        "EventTime": "2024-02-13T21:03:10Z",
        "EventName": "CustomerCreated",
        "EntityName": "Customer",
        "Sequence": 1,
        "Payload": {
          "CustomerId": "814e496d-c6d1-49d5-b30b-359b4f83fa48"
        }
      });
      await new Promise((res, rej) => setTimeout(res, 2000));

      const cust = await CustomerModel.find({});
      // const cust = await (await mongooseConnection).collection('customers').find({});
      console.log(cust);
      // await new Promise((res, rej) => setTimeout(res, 4500));

      expect(createCustomerResponse.status).toBe(200);
      // app.des
    });

  })

  // afterAll(async () => {
  //   await new Promise((res, rej) => setTimeout(res, 4500));
  //   try{
  //     await mongooseConnection.connection.close()
  //   } catch(e) {
  //     console.error(e);
  //   }

  //   try{
  //     await eventsQueue.close();
  //   } catch(e) {
  //     console.error(e);
  //   }
  //   try{
  //     await worker.close();
  //   } catch(e) {
  //     console.error(e);
  //   }

  //   try{
  //     await redisConnection.disconnect();
  //   } catch(e) {
  //     console.error(e);
  //   }

  // })

});