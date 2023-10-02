import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ProductStock, ProductStockSchema } from './product-stock.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product {
  @Prop({
    unique: true,
    required: true,
    trim: true,
  })
  name: string;

  @Prop({
    required: true,
    trim: true,
  })
  description: string;

  @Prop({
    required: true,
    default: true,
  })
  status: boolean;

  @Prop({
    required: true,
    default: true,
  })
  isProductNew: boolean;

  @Prop({
    required: true,
    trim: true,
  })
  sku: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  stock: number;

  @Prop({
    required: true,
    default: new Date()
  })
  creationDate: string;

  @Prop({
    required: true,
    trim: true,
  })
  image: string;

  @Prop({
    default: []
  })
  tags: string[];

  @Prop([ProductStockSchema]) 
  productsStock: ProductStock[]; 
}

export const ProductSchema = SchemaFactory.createForClass(Product);