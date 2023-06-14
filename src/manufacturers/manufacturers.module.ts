import { Module } from '@nestjs/common';
import { ManufacturersService } from './manufacturers.service';
import {
  ManufacturersPrivateController,
  ManufacturersPublicController,
} from './manufacturers.controller';
import { AppGateway } from 'src/app.gateway';

@Module({
  providers: [ManufacturersService, AppGateway],
  controllers: [ManufacturersPublicController, ManufacturersPrivateController],
})
export class ManufacturersModule {}
