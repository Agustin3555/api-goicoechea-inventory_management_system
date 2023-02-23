/* eslint-disable prettier/prettier */
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { FieldTypeDto } from '../fieldType.dto';

export class FindFieldsByNameDto {
  @IsNotEmpty()
  @IsEnum(FieldTypeDto)
  type?: FieldTypeDto;

  @IsNotEmpty()
  @IsString()
  name: string;
}
