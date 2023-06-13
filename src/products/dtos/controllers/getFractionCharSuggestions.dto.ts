/* eslint-disable prettier/prettier */
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum FractionCharFields {
  KEY = 'KEY',
  NUMERATOR_VALUE = 'NUMERATOR_VALUE',
  DENOMINATOR_VALUE = 'DENOMINATOR_VALUE',
  METRIC_UNIT = 'METRIC_UNIT',
}

export class GetFractionCharSuggestionsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsEnum(FractionCharFields)
  field: FractionCharFields;
}
