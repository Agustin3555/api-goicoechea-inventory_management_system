import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { hash } from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { exclude } from 'src/tools/exclude';
import { PotectedUserDto } from './dtos/protectedUser.dto';

const prisma = new PrismaService();

const getProtectedUser = (rawUser) =>
  exclude(rawUser, ['password']) as PotectedUserDto;

const checkId = async (id: number) =>
  (await prisma.user.findUnique({
    where: {
      id,
    },
  })) !== null;

@Injectable()
export class UsersService {
  async findAll() {
    const users = await prisma.user.findMany();

    return users.map((user) => getProtectedUser(user));
  }

  async findOne(id: number) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) throw new NotFoundException();

    return getProtectedUser(user);
  }

  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findByName(name: string) {
    const users = await prisma.user.findMany({
      where: {
        name: {
          contains: name.toLowerCase(),
        },
      },
    });

    return users.map((user) => getProtectedUser(user));
  }

  async create(userParams: Prisma.UserCreateInput) {
    if (
      await prisma.user.findUnique({
        where: {
          email: userParams.email,
        },
      })
    )
      throw new ConflictException('Email already exists');

    const { password, ...remainingParams } = userParams;

    const user = await prisma.user.create({
      data: {
        ...remainingParams,
        password: await hash(password, 10),
      },
    });

    return getProtectedUser(user);
  }

  async remove(id: number) {
    if (!(await checkId(id))) throw new NotFoundException();

    await prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
