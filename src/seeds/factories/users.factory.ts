/* eslint-disable prettier/prettier */
import { Role } from '@prisma/client';
import { Chance } from 'chance';
import { UsersService } from 'src/users/users.service';
import { Factory } from '../dtos/factory.dto';

export const createUsers: Factory = async (app, count) => {
  const usersService = app.get(UsersService);

  await usersService.create({
    name: 'Agustín',
    email: 'Agustin3555@hotmail.com',
    password: 'Agapanthus12',
    role: Role.ADMIN,
  });

  const chance = new Chance();

  for (let i = 0; i < count; i++) {
    await usersService.create({
      name: chance.name(),
      lastName: chance.last(),
      email: chance.email(),
      password: `pass${i + 1}`,
    });
  }
};
