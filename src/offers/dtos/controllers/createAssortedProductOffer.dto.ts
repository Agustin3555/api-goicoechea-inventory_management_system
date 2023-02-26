/* eslint-disable prettier/prettier */
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  ValidateNested,
} from 'class-validator';

export class CreateAssortedProductOfferDto {
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Product)
  @ArrayMinSize(2)
  products: Product[];

  @IsNotEmpty()
  @IsNumber()
  newPrice: number;

  @IsNotEmpty()
  @IsDateString()
  deadline: string;
}

export class Product {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  product: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  quantity?: number;
}
