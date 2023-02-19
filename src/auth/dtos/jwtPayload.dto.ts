/* eslint-disable prettier/prettier */
import { Role } from '@prisma/client';

export interface JwtPayloadUser {
  id: number;
  email: string;
  role: Role;
}
