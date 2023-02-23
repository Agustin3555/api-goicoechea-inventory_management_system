import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard, RoleGuard } from 'src/auth/guards';
import { IdParamDto } from 'src/tools/dtos/idParam.dto';
import {
  SearchForFractionFieldSuggestionsDto,
  SearchForQuantityFieldSuggestionsDto,
  SearchForStringFieldSuggestionsDto,
} from './dtos/controllers';
import { CreateProductDto } from './dtos/controllers/createProduct.dto';
import { FindFieldsByNameDto } from './dtos/controllers/findFieldsByName.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll() {
    return await this.productsService.findAll();
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get(':id')
  async findOne(@Param() param: IdParamDto) {
    return await this.productsService.findOne(param.id);
  }

  @Get('by/name/:name')
  async findByName(@Param('name') name: string) {
    return await this.productsService.findByName(name);
  }

  @UseGuards(JwtAuthGuard, new RoleGuard([Role.ADMIN]))
  @UsePipes(new ValidationPipe())
  @Post()
  async create(@Body() body: CreateProductDto) {
    return await this.productsService.create(body);
  }

  @UsePipes(new ValidationPipe())
  @Get('fields/by/name')
  async findFieldsByName(@Body() body: FindFieldsByNameDto) {
    return await this.productsService.findFieldsByName(body);
  }

  @UsePipes(new ValidationPipe())
  @Get('fields/string/suggestions')
  async searchForStringFieldSuggestions(
    @Body() body: SearchForStringFieldSuggestionsDto,
  ) {
    return await this.productsService.searchForStringFieldSuggestions(body);
  }

  @UsePipes(new ValidationPipe())
  @Get('fields/quantity/suggestions')
  async searchForQuantityFieldSuggestions(
    @Body() body: SearchForQuantityFieldSuggestionsDto,
  ) {
    return await this.productsService.searchForQuantityFieldSuggestions(body);
  }

  @UsePipes(new ValidationPipe())
  @Get('fields/fraction/suggestions')
  async searchForFractionFieldSuggestions(
    @Body() body: SearchForFractionFieldSuggestionsDto,
  ) {
    return await this.productsService.searchForFractionFieldSuggestions(body);
  }
}
