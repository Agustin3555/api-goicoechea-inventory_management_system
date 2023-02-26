import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { ProductsService } from 'src/products/products.service';
import { ManufacturersService } from 'src/manufacturers/manufacturers.service';

@Module({
  providers: [OffersService, ProductsService, ManufacturersService],
  controllers: [OffersController],
})
export class OffersModule {}
