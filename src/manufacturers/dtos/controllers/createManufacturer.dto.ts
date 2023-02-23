/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateManufacturerDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
