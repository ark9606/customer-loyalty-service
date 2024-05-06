import { ICustomerRepository } from '../../src/common/db/CustomerRepository';
import { CustomerDTO } from '../../src/models/customer';

export class CustomerRepositoryMock implements ICustomerRepository {
  async findById(id: string): Promise<CustomerDTO | null> {
    return null;
  }

  async create(dto: { customerId: string; createdAt: Date }): Promise<void> {}
}
