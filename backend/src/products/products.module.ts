import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";
import { Product } from "./product.entity";
import { OrderItem } from "../orders/order-item.entity";
import { OrdersModule } from "../orders/orders.module";

@Module({
  imports: [TypeOrmModule.forFeature([Product, OrderItem]), OrdersModule],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
