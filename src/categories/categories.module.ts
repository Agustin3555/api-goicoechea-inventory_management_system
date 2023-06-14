import { Module } from '@nestjs/common';
import {
  CategoriesPrivateController,
  CategoriesPublicController,
} from './categories.controller';
import { CategoriesService } from './categories.service';
import { AppGateway } from 'src/app.gateway';

@Module({
  controllers: [CategoriesPublicController, CategoriesPrivateController],
  providers: [CategoriesService, AppGateway],
})
export class CategoriesModule {}
