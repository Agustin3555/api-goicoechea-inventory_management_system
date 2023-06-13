import { Module } from '@nestjs/common';
import { ManufacturersService } from './manufacturers.service';
import { ManufacturersController } from './manufacturers.controller';
import { AppGateway } from 'src/app.gateway';

@Module({
  providers: [ManufacturersService, AppGateway],
  controllers: [ManufacturersController],
})
export class ManufacturersModule {}
