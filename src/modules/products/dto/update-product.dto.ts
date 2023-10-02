import { Transform } from "class-transformer";
import { IsEmpty, IsOptional, MaxLength } from "class-validator";
import { UniqueTags } from "../../../common/transforms/unique-tags.transform";
import { ProductStock } from "src/schemas";

export class UpdateProductDto {
    @IsOptional()
    @MaxLength(150)
    name: string;

    @IsOptional()
    description: string;

    @IsOptional()
    @MaxLength(20)
    sku: string;

    @IsOptional()
    image: string;

    @IsOptional()
    @Transform(UniqueTags)
    tags: string[];

    @IsOptional()
    isProductNew: boolean;

    @IsOptional()
    price: number;

    @IsOptional()
    stock: number;

    @IsEmpty()
    productsStock: ProductStock[]
}
