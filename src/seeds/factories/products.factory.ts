/* eslint-disable prettier/prettier */
import { Chance } from 'chance';
import { ProductsService } from 'src/products/products.service';
import { Factory } from '../dtos/factory.dto';

export const createProducts: Factory = async (app, attempts) => {
  const productsService = app.get(ProductsService);

  const chance = new Chance();

  for (let i = 0; i < attempts; i++) {
    try {
      await productsService.create({
        name: chance.capitalize(chance.word()),
        manufacturer: chance.integer({ min: 1, max: 10 }),
        description: chance.paragraph({
          sentences: chance.integer({ min: 3, max: 5 }),
        }),
        unitPrice: chance.floating({ min: 50, max: 500000, fixed: 1 }),
        stock: chance.integer({ min: 8, max: 64 }),
        minStock: chance.integer({ min: 2, max: 12 }),
        booleanFields: Array.from(
          { length: chance.integer({ min: 0, max: 4 }) },
          () => ({
            name: chance.capitalize(chance.word()),
            value: chance.bool(),
          }),
        ),
        stringFields: Array.from(
          { length: chance.integer({ min: 0, max: 4 }) },
          () => ({
            name: chance.capitalize(chance.word()),
            value: chance.capitalize(chance.word()),
          }),
        ),
        quantityFields: Array.from(
          { length: chance.integer({ min: 0, max: 4 }) },
          () => ({
            name: chance.capitalize(chance.word()),
            value: chance.floating({ min: 0.1, max: 64, fixed: 2 }),
            metricUnit: chance.pickone(['mm', 'cm', 'm', `"`, 'dias', 'meses']),
          }),
        ),
        fractionFields: Array.from(
          { length: chance.integer({ min: 0, max: 4 }) },
          () => ({
            name: chance.capitalize(chance.word()),
            numeratorValue: chance.integer({ min: 0.1, max: 64 }),
            denominatorValue: chance.integer({ min: 0.1, max: 64 }),
            metricUnit: chance.pickone(["'", `"`]),
          }),
        ),
      });
    } catch (error) {}
  }
};
