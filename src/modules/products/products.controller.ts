import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return {
      status: true,
      product: await this.productsService.create(createProductDto)
    }
  }

  @Get('/search')
  async search(
    @Query('search') search: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('order') order: 'asc' | 'desc',
    @Query('orderBy') orderBy: string,
    @Query('minPrice') minPrice: number,
    @Query('maxPrice') maxPrice: number,
    @Query('isNew') isNew: boolean,
  ) { 
    return {
      status: true,
      result: await this.productsService.search(search, { page, limit, order, orderBy, minPrice, maxPrice, isNew })
    }
  }

  @Get()
  async findAll() { 
    return {
      status: true,
      products: await this.productsService.findAll()
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return {
      status: true,
      product: await this.productsService.findOne(id),
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateProductDto) {
    return {
      status: true,
      product: await this.productsService.update(id, data)
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return {
      status: await this.productsService.remove(id)
    }
  }
}
