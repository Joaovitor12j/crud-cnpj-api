import {
    Controller, Get, Post, Body, Put, Param, Delete, UseInterceptors, UploadedFile
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { FileInterceptor } from "@nestjs/platform-express";
import { extname } from 'path';
import { diskStorage } from 'multer';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Get()
    findAll(): Promise<Product[]> {
        return this.productsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Product> {
        return this.productsService.findOne(id);
    }

    @Post()
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './products-images',
                filename: (req, file, callback) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname);
                    callback(null, `${uniqueSuffix}${ext}`);
                },
            }),
        }),
    )
    async create(@UploadedFile() file: Express.Multer.File, @Body() body): Promise<Product> {

        const newProduct: Partial<Product> = {
            description: body.description,
            salesValue: parseFloat(body.salesValue),
            stock: parseInt(body.stock, 10),
            images: file ? `/products-images/${file.filename}` : undefined,
        };

        return this.productsService.create(<Product>newProduct);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() product: Product): Promise<Product> {
        return this.productsService.update(id, product);
    }

    @Delete(':id')
    remove(@Param('id') id: number): Promise<void> {
        return this.productsService.remove(id);
    }
}