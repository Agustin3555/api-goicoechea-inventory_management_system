/* eslint-disable prettier/prettier */
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum BooleanCharFields {
  KEY = 'KEY',
}

export class GetBooleanCharSuggestionsDto {
  @IsNotEmpty()
  @IsEnum(BooleanCharFields)
  field: BooleanCharFields;
}
