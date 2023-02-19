import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PotectedUserDto } from 'src/users/dtos/protectedUser.dto';
import { JwtPayloadUser } from './dtos/jwtPayload.dto';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<PotectedUserDto | null> {
    const user = await this.usersService.findByEmail(email);

    if (user && (await compare(password, user.password))) {
      const { password, ...userWithoutPassword } = user;

      return userWithoutPassword;
    }

    return null;
  }

  async login(user: PotectedUserDto) {
    const { id, email, role } = user;

    const payload: JwtPayloadUser = { id, email, role };

    return { access_token: this.jwtService.sign(payload) };
  }
}
