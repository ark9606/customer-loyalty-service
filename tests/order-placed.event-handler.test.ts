import { CustomerRepositoryMock } from './mocks/customer-repository.mock';
import { PointsRepositoryMock } from './mocks/points-repository.mock';
import { OrderPlacedEventHandler } from '../src/events/event-handlers/order-placed.event-handler';
import BadRequestError from '../src/common/errors/bad-request.error';

describe('OrderPlacedEventHandler', () => {
  const customerRepository = new CustomerRepositoryMock();
  const pointsRepository = new PointsRepositoryMock();
  const handler = new OrderPlacedEventHandler(pointsRepository, customerRepository);

  describe('handle', () => {
    it("shouldn't save order when customer doesn't exist", async () => {
      pointsRepository.save = jest.fn();

      await expect(
        handler.handle({
          EventTime: '2023-11-16T12:24:45+01:00',
          EventName: 'OrderPlaced',
          EntityName: 'Order',
          Sequence: 10,
          Payload: {
            OrderId: 'c5df8e6f-eee3-4b07-897e-81832b664fc6',
            CustomerId: '814e496d-c6d1-49d5-b30b-359b4f83fa48',
            TotalOrderAmount: 5304,
          },
        }),
      ).rejects.toThrow(BadRequestError);
    });

    it('should save order when customer exists', async () => {
      pointsRepository.save = jest.fn();
      customerRepository.findById = jest.fn(async () => ({
        customerId: 'id',
        createdAt: new Date(),
      }));

      await handler.handle({
        EventTime: '2023-11-16T12:24:45+01:00',
        EventName: 'OrderPlaced',
        EntityName: 'Order',
        Sequence: 10,
        Payload: {
          OrderId: 'c5df8e6f-eee3-4b07-897e-81832b664fc6',
          CustomerId: '814e496d-c6d1-49d5-b30b-359b4f83fa48',
          TotalOrderAmount: 5304,
        },
      });

      expect(pointsRepository.save).toHaveBeenCalled();
    });
  });
});
