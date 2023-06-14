import { Test, TestingModule } from '@nestjs/testing';
import { ManufacturersPublicController } from './manufacturers.controller';

describe('ManufacturersController', () => {
  let controller: ManufacturersPublicController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManufacturersPublicController],
    }).compile();

    controller = module.get<ManufacturersPublicController>(
      ManufacturersPublicController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
