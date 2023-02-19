/* eslint-disable prettier/prettier */
import { Role } from '@prisma/client';

export interface PotectedUserDto {
  id: number;
  name: string;
  lastName: string;
  email: string;
  role: Role;
}
