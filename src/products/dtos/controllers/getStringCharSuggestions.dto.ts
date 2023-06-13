/* eslint-disable prettier/prettier */
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum StringCharFields {
  KEY = 'KEY',
  VALUE = 'VALUE',
}

export class GetStringCharSuggestionsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsEnum(StringCharFields)
  field: StringCharFields;
}
