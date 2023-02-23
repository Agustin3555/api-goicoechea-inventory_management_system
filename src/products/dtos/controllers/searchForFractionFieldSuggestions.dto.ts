/* eslint-disable prettier/prettier */
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { FractionFieldTypeValueDto } from '../fractionFieldTypeValue.dto';

export class SearchForFractionFieldSuggestionsDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(FractionFieldTypeValueDto)
  valueType?: FractionFieldTypeValueDto;
}
