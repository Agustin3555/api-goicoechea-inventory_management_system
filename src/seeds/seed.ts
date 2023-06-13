/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { createManufacturers, createProducts, createUsers } from './factories';

const seed = async () => {
  console.log('planting 🌱\n');

  const app = await NestFactory.createApplicationContext(AppModule);

  await createUsers(app, 10);
  await createManufacturers(app, 10);
  await createProducts(app, 100);

  console.log('\nfilled   🌳\n');
};

seed().catch((e) => {
  console.log('\noops     🍂\n');

  console.error(e);
  process.exit(1);
});
