import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Get()
    findAll(): Promise<Order[]> {
        return this.ordersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Order> {
        return this.ordersService.findOne(id);
    }

    @Post()
    create(@Body() orderData: { customerId: number; items: { productId: number; quantity: number }[] }): Promise<Order> {
        return this.ordersService.create(orderData);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() order: Partial<Order>): Promise<Order> {
        return this.ordersService.update(id, order);
    }

    @Delete(':id')
    remove(@Param('id') id: number): Promise<void> {
        return this.ordersService.remove(id);
    }
}
