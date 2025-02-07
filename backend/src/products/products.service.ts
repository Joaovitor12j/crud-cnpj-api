import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "./product.entity";
import { OrderItem } from "../orders/order-item.entity";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
  ) {}

  findAll(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Produto ID: ${id} não encontrado`);
    }
    return product;
  }

  async create(product: Product): Promise<Product> {
    return this.productsRepository.save(product);
  }

  async update(id: number, product: Product): Promise<Product> {
    await this.productsRepository.update(id, product);
    const updatedProduct = await this.productsRepository.findOneBy({ id });
    if (!updatedProduct) {
      throw new NotFoundException(`Produto ID: ${id} não encontrado`);
    }
    return updatedProduct;
  }

  async remove(id: number): Promise<void> {
    const product = await this.productsRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException(`Produto ID: ${id} não encontrado`);
    }

    const orders = await this.orderItemsRepository.find({
      where: { product: { id } },
    });
    if (orders.length > 0) {
      throw new BadRequestException(
        `Produto ID: ${id} não pode ser deletado porque está vinculado a um pedido.`,
      );
    }

    await this.productsRepository.delete(id);
  }
}
