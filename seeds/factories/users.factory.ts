/* eslint-disable prettier/prettier */
import { Prisma, Role } from '@prisma/client';
import { hash } from 'bcrypt';
import { Chance } from 'chance';

export const createUsers = async (count: number) => {
  const chance = new Chance();
  const users: Prisma.UserCreateInput[] = [];

  users.push({
    name: 'agustín',
    email: 'Agustin3555@hotmail.com',
    password: await hash('Agapanthus12', 10),
    role: Role.ADMIN,
  });

  for (let i = 0; i < count; i++) {
    users.push({
      name: chance.name().toLowerCase(),
      lastName: chance.last().toLowerCase(),
      email: chance.email(),
      password: await hash(`pass${i + 1}`, 10),
    });
  }

  return { data: users };
};
