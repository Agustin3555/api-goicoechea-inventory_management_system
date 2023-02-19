/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client';
import { createManufacturers, createUsers } from './factories';

const prisma = new PrismaClient();

const main = async () => {
  const userCount = 10;
  const manufacturerCount = 10;

  console.log('planting 🌱');

  await prisma.user.createMany(await createUsers(userCount));
  await prisma.manufacturer.createMany(
    await createManufacturers(manufacturerCount),
  );

  console.log('filled   🌳');
};

main()
  .catch((e) => {
    console.log('oops     🍂\n');

    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log();
  });
