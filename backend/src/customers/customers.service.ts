import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Customer } from "./customer.entity";

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) {}

  findAll(): Promise<Customer[]> {
    return this.customersRepository.find();
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.customersRepository.findOneBy({ id });
    if (!customer) {
      throw new NotFoundException(`Cliente ${id} n�o encontrado`);
    }
    return customer;
  }

  async create(customer: Customer): Promise<Customer> {
    const cleanedCnpj = this.cleanCnpj(customer.cnpj);
    const existingCustomer = await this.customersRepository.findOneBy({
      cnpj: cleanedCnpj,
    });
    if (existingCustomer) {
      throw new BadRequestException(
        `J� existe um cliente com o CNPJ: ${cleanedCnpj}`,
      );
    }

    const newCustomer = this.customersRepository.create({
      cnpj: cleanedCnpj,
      email: customer.email,
      companyName: customer.companyName,
    });

    return this.customersRepository.save(newCustomer);
  }

  async update(id: number, customer: Customer): Promise<Customer> {
    await this.customersRepository.update(id, customer);
    const updatedCustomer = await this.customersRepository.findOneBy({ id });
    if (!updatedCustomer) {
      throw new NotFoundException(`Cliente ID ${id} n�o encontrado`);
    }
    return updatedCustomer;
  }

  async remove(id: number): Promise<void> {
    await this.customersRepository.delete(id);
  }

  private cleanCnpj(cnpj: string): string {
    return cnpj.replace(/\D/g, "");
  }
}
