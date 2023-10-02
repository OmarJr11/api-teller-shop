import { Injectable, InternalServerErrorException, NotAcceptableException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../../schemas/product.schema';
import { Model } from 'mongoose';
import { FilterOptions, PaginationOptions } from 'src/common/interfaces/pagination-options.interface';
import { PaginationResponse } from 'src/common/interfaces/pagination-response.interface';
import { ProductStock } from 'src/schemas';

@Injectable()
export class ProductsService {
  
  constructor(
    @InjectModel(Product.name) private productsModel: Model<Product>,
  ) {}

  /**
   * Create Product
   * @param {CreateProductDto}  data - Create Product DTo
   * @return {Promise<Product>}
   */
  async create(data: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productsModel(data);
    if(data.price <= 0 && data.stock <= 0) {
      throw new NotAcceptableException({
        code: false, 
        message: 'The price and stock must be greater than 0'
      })
    } else {
      createdProduct.productsStock.push({
        price: data.price, 
        stock: data.stock,
      });
    }
    const product = await createdProduct.save().catch((e) => {
      throw new InternalServerErrorException({
        code: false, 
        message: e
      })
    });
    return await this.findOne(product.id);
  }

  /**
   * Search Products with filter
   * @param {string}  search - word to search
   * @param {PaginationOptions}  options - Pagination options
   * @return {Promise<any>}
   */
  async search(search: string, options: PaginationOptions): Promise<any> {
    const page = options.page ? options.page : 1;
    const limit = options.limit ? options.limit : 10;
    const order = options.order ? options.order : 'desc';
    const orderBy = options.orderBy ? options.orderBy : 'creationDate';
    const stock = options.stock ? options.stock : 1;
    const minPrice = options.minPrice ? options.minPrice : 0;
    const maxPrice = options.maxPrice;
    const isNew = options.isNew;
    
    let filter: FilterOptions = {
      price: { $gte: minPrice },
      stock: { $gte: stock },
    };

    if(maxPrice) {
      filter.price = { ...filter.price, $lte: maxPrice}
    }

    if(isNew !== undefined) {
      filter = {...filter, isProductNew: isNew}
    }

    let sort = new Object(); 
    sort[`${orderBy}`] = order;
    
    const result = await this.productsModel.find(
      { 
        status: true, 
        name: { $regex: '.*'+search+'.*', $options: 'i'},
        ...filter
      }, 
      null,
      { limit: limit, skip: limit * (page - 1), sort: sort}
    ).exec();

    const count = await this.productsModel.find(      { 
      status: true, 
      name: { $regex: '.*'+search+'.*', $options: 'i'},
      ...filter
    }).count();
    const pages = count%limit;
    return { 
      items: result,
      totalItems: count,
      pages: pages === 0 ? 1 : pages, 
      actual: Number(page),
      next: Number(page+1),
      previous: Number(page+1)
    }
  }

  /**
   * Find all
   * @return {Promise<Product[]>}
   */
  async findAll(): Promise<Product[]> {
    return await this.productsModel.find(
      { 
        status: true, 
      }, 
      null,
      { limit: 10 }
    ).exec();
  }

  /**
   * Find one by id
   * @param {string} id - product id
   * @returns {Promise<Product>}
   */
  async findOne(id: string): Promise<Product> {
    return await this.productsModel.findById(id, null, { status: true }).catch((e) => {
      throw new InternalServerErrorException({
        code: false, 
        message: e,
      })
    });
  }

  /**
   * Update product by id
   * @param {string} id - product id
   * @param {UpdateProductDto} data - data to update product
   * @returns {Promise<Product>}
   */
  async update(id: string, data: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    if (
      product.price !== data.price || 
      product.stock !== data.stock
    ) {
      data.productsStock = [];
      for(let productStock of product.productsStock) {
        data.productsStock.push(productStock)
      }
      data.productsStock.unshift({ price: data.price, stock: data.stock});
    }
    return await this.productsModel.findByIdAndUpdate(id, data, {new: true} ).catch((e) => {
      throw new InternalServerErrorException({
        code: false, 
        message: e,
      })
    });
  }

  /**
   * Delete product by id
   * @param {string} id - product id
   * @returns {Promise<boolean>}
   */
  async remove(id: string): Promise<boolean> {
    await this.productsModel.findByIdAndUpdate(id, { status: false }, {new: true}).catch((e) => {
      throw new InternalServerErrorException({
        code: false, 
        message: e,
      })
    });
    return true
  }
}
