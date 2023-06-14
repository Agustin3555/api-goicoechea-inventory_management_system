/* eslint-disable prettier/prettier */
import { Chance } from 'chance';
import { CategoriesService } from 'src/categories/categories.service';
import { Factory } from '../dtos/factory.dto';

export const createCategories: Factory = async (app, attempts) => {
  const categoriesService = app.get(CategoriesService);

  const chance = new Chance();

  for (let i = 0; i < attempts; i++) {
    try {
      await categoriesService.create(
        {
          name: chance.word(),
          parentCategoryId:
            i === 0 ? undefined : chance.integer({ min: 1, max: i }),
        },
        1,
      );
    } catch (error) {}
  }
};
