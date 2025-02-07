import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from "@nestjs/common";
import { CustomersService } from "./customers.service";
import { Customer } from "./customer.entity";

@Controller("customers")
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  findAll(): Promise<Customer[]> {
    return this.customersService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: number): Promise<Customer> {
    return this.customersService.findOne(id);
  }

  @Post()
  create(@Body() customer: Customer): Promise<Customer> {
    return this.customersService.create(customer);
  }

  @Put(":id")
  update(
    @Param("id") id: number,
    @Body() customer: Customer,
  ): Promise<Customer> {
    return this.customersService.update(id, customer);
  }

  @Delete(":id")
  remove(@Param("id") id: number): Promise<void> {
    return this.customersService.remove(id);
  }
}
