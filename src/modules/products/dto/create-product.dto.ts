import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, MaxLength } from "class-validator";
import { UniqueTags } from "src/common/transforms/unique-tags.transform";

export class CreateProductDto {
    @IsNotEmpty()
    @MaxLength(150)
    name: string;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    @MaxLength(20)
    sku: string;

    @IsNotEmpty()
    image: string;

    @IsOptional()
    @Transform(UniqueTags)
    tags: string[];

    @IsNotEmpty()
    isProductNew: boolean;

    @IsNotEmpty()
    price: number;

    @IsNotEmpty()
    stock: number;
}
