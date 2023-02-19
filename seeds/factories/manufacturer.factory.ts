/* eslint-disable prettier/prettier */
import { Prisma } from '@prisma/client';
import { Chance } from 'chance';

export const createManufacturers = async (count: number) => {
  const chance = new Chance();
  const manufacturers: Prisma.ManufacturerCreateInput[] = [];

  for (let i = 0; i < count; i++) {
    manufacturers.push({
      name: chance.company(),
    });
  }

  return { data: manufacturers };
};
