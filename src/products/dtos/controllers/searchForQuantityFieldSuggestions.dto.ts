/* eslint-disable prettier/prettier */
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { QuantityFieldTypeValueDto } from '../quantityFieldTypeValue.dto';

export class SearchForQuantityFieldSuggestionsDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(QuantityFieldTypeValueDto)
  valueType?: QuantityFieldTypeValueDto;
}
