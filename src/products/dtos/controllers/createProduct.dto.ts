/* eslint-disable prettier/prettier */
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  manufacturer?: number | string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  minStock?: number;

  @ValidateNested({ each: true })
  @Type(() => BooleanProductFieldDto)
  booleanFields?: BooleanProductFieldDto[];

  @ValidateNested({ each: true })
  @Type(() => StringProductField)
  stringFields?: StringProductField[];

  @ValidateNested({ each: true })
  @Type(() => QuantityProductField)
  quantityFields?: QuantityProductField[];

  @ValidateNested({ each: true })
  @Type(() => FractionProductField)
  fractionFields?: FractionProductField[];
}

export class BooleanProductFieldDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsBoolean()
  value: boolean;
}

export class StringProductField {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  value: string;
}

export class QuantityProductField {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  value: number;

  @IsNotEmpty()
  @IsString()
  metricUnit: string;
}

export class FractionProductField {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  numeratorValue: number;

  @IsNotEmpty()
  @IsInt()
  denominatorValue: number;

  @IsNotEmpty()
  @IsString()
  metricUnit: string;
}
