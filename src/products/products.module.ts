import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ManufacturersService } from 'src/manufacturers/manufacturers.service';

@Module({
  providers: [ProductsService, ManufacturersService],
  controllers: [ProductsController],
})
export class ProductsModule {}
