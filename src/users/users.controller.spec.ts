import { Test, TestingModule } from '@nestjs/testing';
import { UsersPrivateController } from './users.controller';

describe('UsersController', () => {
  let controller: UsersPrivateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersPrivateController],
    }).compile();

    controller = module.get<UsersPrivateController>(UsersPrivateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
