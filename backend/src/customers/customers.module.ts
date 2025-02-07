import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomersService } from "./customers.service";
import { CustomersController } from "./customers.controller";
import { Customer } from "./customer.entity";
import { CnpjService } from "../cnpj/cnpj.service";
@Module({
  imports: [TypeOrmModule.forFeature([Customer])],
  providers: [CustomersService, CnpjService],
  controllers: [CustomersController],
})
export class CustomersModule {}
