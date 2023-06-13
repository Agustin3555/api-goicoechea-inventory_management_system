/* eslint-disable prettier/prettier */
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum QuantityCharFields {
  KEY = 'KEY',
  VALUE = 'VALUE',
  METRIC_UNIT = 'METRIC_UNIT',
}

export class GetQuantityCharSuggestionsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsEnum(QuantityCharFields)
  field: QuantityCharFields;
}
