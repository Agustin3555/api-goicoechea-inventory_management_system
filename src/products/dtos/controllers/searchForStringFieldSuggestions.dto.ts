/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';

export class SearchForStringFieldSuggestionsDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
