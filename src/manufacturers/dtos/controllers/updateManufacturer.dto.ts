/* eslint-disable prettier/prettier */
import { IsOptional, IsString } from 'class-validator';

export class UpdateManufacturerDto {
  @IsOptional()
  @IsString()
  name?: string;
}
