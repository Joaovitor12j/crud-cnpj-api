import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order } from "./order.entity";
import { OrderItem } from "./order-item.entity";
import { Customer } from "../customers/customer.entity";
import { Product } from "../products/product.entity";

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
  ) {}

  findAll(): Promise<Order[]> {
    return this.ordersRepository.find({
      relations: ["customer", "items", "items.product"],
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ["customer", "items", "items.product"],
    });
    if (!order) {
      throw new NotFoundException(`Não foi encontrado pedido com o ID: ${id}`);
    }
    return order;
  }

  async create(order: {
    customerId: number;
    items: { productId: number; quantity: number }[];
  }): Promise<Order> {
    const customer = await this.ordersRepository.manager.findOne(Customer, {
      where: { id: order.customerId },
    });

    if (!customer) {
      throw new NotFoundException(
        `Cliente com ID ${order.customerId} não encontrado.`,
      );
    }

    const orderItems = await Promise.all(
      order.items.map(async (item) => {
        const product = await this.ordersRepository.manager.findOne(Product, {
          where: { id: item.productId },
        });
        if (!product) {
          throw new NotFoundException(
            `Produto com ID ${item.productId} não encontrado.`,
          );
        }

        return this.orderItemsRepository.create({
          product,
          quantity: item.quantity,
        });
      }),
    );

    const newOrder = this.ordersRepository.create({
      customer,
      items: orderItems,
    });

    return this.ordersRepository.save(newOrder);
  }

  async update(id: number, order: Partial<Order>): Promise<Order> {
    await this.ordersRepository.update(id, order);
    const updatedOrder = await this.ordersRepository.findOne({
      where: { id },
      relations: ["customer", "items", "items.product"],
    });
    if (!updatedOrder) {
      throw new NotFoundException(`Não foi encontrado pedido com o ID: ${id}`);
    }
    return updatedOrder;
  }

  async remove(id: number): Promise<void> {
    await this.orderItemsRepository.delete({ order: { id } });
    await this.ordersRepository.delete(id);
  }
}
