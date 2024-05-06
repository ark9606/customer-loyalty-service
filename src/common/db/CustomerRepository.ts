import { CustomerDTO, CustomerModel } from '../../models/customer';

export interface ICustomerRepository {
  create(dto: { customerId: string; createdAt: Date }): Promise<void>;

  findById(id: string): Promise<CustomerDTO | null>;
}

export class CustomerRepository implements ICustomerRepository {
  async create(dto: { customerId: string; createdAt: Date }): Promise<void> {
    const newCustomer = new CustomerModel({
      customerId: dto.customerId,
      createdAt: dto.createdAt,
    });

    await newCustomer.save();
  }

  async findById(id: string): Promise<CustomerDTO | null> {
    const existingCustomer = await CustomerModel.findOne({
      customerId: id,
    });

    return existingCustomer || null;
  }
}
