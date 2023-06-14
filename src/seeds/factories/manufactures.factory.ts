/* eslint-disable prettier/prettier */
import { Chance } from 'chance';
import { ManufacturersService } from 'src/manufacturers/manufacturers.service';
import { Factory } from '../dtos/factory.dto';

export const createManufacturers: Factory = async (app, attempts) => {
  const manufacturesService = app.get(ManufacturersService);

  const chance = new Chance();

  for (let i = 0; i < attempts; i++) {
    try {
      await manufacturesService.create(
        {
          name: chance.company(),
        },
        1,
      );
    } catch (error) {}
  }
};
