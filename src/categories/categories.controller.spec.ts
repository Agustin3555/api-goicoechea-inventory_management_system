import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesPublicController } from './categories.controller';

describe('CategoriesController', () => {
  let controller: CategoriesPublicController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesPublicController],
    }).compile();

    controller = module.get<CategoriesPublicController>(
      CategoriesPublicController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
