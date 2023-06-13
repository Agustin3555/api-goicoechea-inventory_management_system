import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ManufacturersService } from 'src/manufacturers/manufacturers.service';
import { AppGateway } from 'src/app.gateway';
import {
  ProductsPrivateController,
  ProductsPublicController,
} from './products.controller';

@Module({
  providers: [ProductsService, ManufacturersService, AppGateway],
  controllers: [ProductsPublicController, ProductsPrivateController],
})
export class ProductsModule {}
