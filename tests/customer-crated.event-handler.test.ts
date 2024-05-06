import { CustomerCreatedEventHandler } from '../src/events/event-handlers/customer-crated.event-handler';
import { CustomerRepositoryMock } from './mocks/customer-repository.mock';

describe('CustomerCreatedEventHandler', () => {
  const repository = new CustomerRepositoryMock();
  const handler = new CustomerCreatedEventHandler(repository);

  describe('handle', () => {
    it('should save new customer', async () => {
      repository.create = jest.fn();

      await handler.handle({
        EventTime: '2023-11-13T21:03:10Z',
        EventName: 'CustomerCreated',
        EntityName: 'Customer',
        Sequence: 1,
        Payload: {
          CustomerId: '814e496d-c6d1-49d5-b30b-359b4f83fa48',
        },
      });

      expect(repository.create).toHaveBeenCalled();
    });
  });
});
