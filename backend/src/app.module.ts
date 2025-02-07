import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CustomersModule } from "./customers/customers.module";
import { ProductsModule } from "./products/products.module";
import { OrdersModule } from "./orders/orders.module";
import { Customer } from "./customers/customer.entity";
import { Product } from "./products/product.entity";
import { Order } from "./orders/order.entity";
import { OrderItem } from "./orders/order-item.entity";
import { CnpjModule } from "./cnpj/cnpj.module";
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as "mysql",
      host: process.env.DB_HOST || "localhost",
      port: parseInt("process.env.DB_PORT", 10) || 3306,
      username: process.env.DB_USERNAME || "root",
      password: process.env.DB_PASSWORD || "password",
      database: process.env.DB_DATABASE || "customer_db",
      entities: [Customer, Product, Order, OrderItem],
      synchronize: true,
    }),
    CustomersModule,
    ProductsModule,
    OrdersModule,
    CnpjModule,
  ],
})
export class AppModule {}
