/* eslint-disable prettier/prettier */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtPayloadUser } from '../dtos/jwtPayload.dto';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly allowedRoles: Role[]) {}

  canActivate(context: ExecutionContext): boolean {
    const { role } = context.switchToHttp().getRequest().user as JwtPayloadUser;

    const isAllowed = this.allowedRoles.includes(role);

    if (isAllowed) return true;
    throw new UnauthorizedException();
  }
}
