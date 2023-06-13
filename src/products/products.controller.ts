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
  GetBooleanCharSuggestionsDto,
  GetFractionCharSuggestionsDto,
  GetQuantityCharSuggestionsDto,
  GetStringCharSuggestionsDto,
} from './dtos';
import { CreateProductDto } from './dtos/controllers/createProduct.dto';
import { ProductsService } from './products.service';
import { AppGateway } from 'src/app.gateway';
import { SECTIONS } from 'src/tools';

@Controller('products')
export class ProductsPublicController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll() {
    const response = this.productsService.findAll();

    return response;
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get(':id')
  async findOne(@Param() param: IdParamDto) {
    const { id } = param;
    const response = this.productsService.getOneFullData(id);

    return response;
  }

  // TODO: cambiar por metodos GET

  @UsePipes(new ValidationPipe())
  @Post('boolean-chars/suggestions')
  async getForBooleanCharSuggestions(
    @Body() body: GetBooleanCharSuggestionsDto,
  ) {
    const response = this.productsService.getBooleanCharSuggestions(body);

    return response;
  }

  @UsePipes(new ValidationPipe())
  @Post('quantity-chars/suggestions')
  async getQuantityCharSuggestions(
    @Body() body: GetQuantityCharSuggestionsDto,
  ) {
    const response = this.productsService.getQuantityCharSuggestions(body);

    return response;
  }

  @UsePipes(new ValidationPipe())
  @Post('fraction-chars/suggestions')
  async getFractionCharSuggestions(
    @Body() body: GetFractionCharSuggestionsDto,
  ) {
    const response = this.productsService.getFractionCharSuggestions(body);

    return response;
  }

  @UsePipes(new ValidationPipe())
  @Post('string-chars/suggestions')
  async getStringCharSuggestions(@Body() body: GetStringCharSuggestionsDto) {
    const response = this.productsService.getStringCharSuggestions(body);

    return response;
  }
}

@Controller('private/products')
export class ProductsPrivateController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly gateway: AppGateway,
  ) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get(':id')
  async findOne(@Param() param: IdParamDto) {
    const { id } = param;
    const response = this.productsService.getOneFullData(id);

    return response;
  }

  @UseGuards(JwtAuthGuard, new RoleGuard([Role.ADMIN]))
  @UsePipes(new ValidationPipe())
  @Post()
  async create(@Body() body: CreateProductDto) {
    const response = this.productsService.create(body);

    this.gateway.sendUpdatedSection(SECTIONS.manufacturers);
    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Get('by/name/:name')
  async findByName(@Param('name') name: string) {
    const response = this.productsService.findByName(name);

    return response;
  }
}
