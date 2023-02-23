/* eslint-disable prettier/prettier */
import { Transform, TransformFnParams } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class IdParamDto {
  @IsInt()
  @IsPositive()
  @Transform(({ value }: TransformFnParams) => parseInt(value))
  id: number;
}
