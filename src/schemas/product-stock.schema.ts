import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductStockDocument = HydratedDocument<ProductStock>;

@Schema()
export class ProductStock {
  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  stock: number;

  @Prop({
    required: false,
    default: new Date()
  })
  creationDate?: string;
}

export const ProductStockSchema = SchemaFactory.createForClass(ProductStock);