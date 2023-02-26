/* eslint-disable prettier/prettier */
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class CreateProductOfferDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  product: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  quantity?: number;

  @IsNotEmpty()
  @IsNumber()
  newPrice: number;

  @IsNotEmpty()
  @IsDateString()
  deadline: string;
}
