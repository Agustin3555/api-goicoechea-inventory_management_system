/* eslint-disable prettier/prettier */
import { Transform, TransformFnParams } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class IdParamDto {
  @IsInt()
  @Min(1)
  @Transform(({ value }: TransformFnParams) => parseInt(value))
  id: number;
}
