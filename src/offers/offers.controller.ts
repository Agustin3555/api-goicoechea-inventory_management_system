import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard, RoleGuard } from 'src/auth/guards';
import {
  CreateAssortedProductOfferDto,
  CreateProductOfferDto,
} from './dtos/controllers';
import { OffersService } from './offers.service';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get()
  async findAll() {
    //   return await this;
  }

  // @UseGuards(JwtAuthGuard, new RoleGuard([Role.ADMIN]))
  // @UsePipes(new ValidationPipe())
  // @Post('/product-offers')
  // async createProductOffer(@Body() body: CreateProductOfferDto) {
  //   return await this.offersService.createProductOffer(body);
  // }

  // @UseGuards(JwtAuthGuard, new RoleGuard([Role.ADMIN]))
  // @UsePipes(new ValidationPipe())
  // @Post('/assorted-product-offers')
  // async createAssortedProductOffer(
  //   @Body() body: CreateAssortedProductOfferDto,
  // ) {
  //   return await this.offersService.createAssortedProductOffer(body);
  // }
}
