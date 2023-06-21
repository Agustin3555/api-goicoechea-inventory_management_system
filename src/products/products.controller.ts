import {
  Body,
  Request,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Put,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard, RoleGuard } from 'src/auth/guards';
import { IdParamDto } from 'src/tools/dtos/idParam.dto';
import {
  EditProductDto,
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
    const response = await this.productsService.findAll();

    return response;
  }

  @Get(':name')
  async findByName(@Param('name') name: string) {
    const response = await this.productsService.findByName(name);

    return response;
  }

  // @UsePipes(new ValidationPipe({ transform: true }))
  // @Get(':id')
  // async findOne(@Param() param: IdParamDto) {
  //   const { id } = param;
  //   const response = await this.productsService.getOneFullDataPublic(id);

  //   return response;
  // }

  // TODO: cambiar por metodos GET

  @UsePipes(new ValidationPipe())
  @Post('boolean-chars/suggestions')
  async getForBooleanCharSuggestions(
    @Body() body: GetBooleanCharSuggestionsDto,
  ) {
    const response = await this.productsService.getBooleanCharSuggestions(body);

    return response;
  }

  @UsePipes(new ValidationPipe())
  @Post('quantity-chars/suggestions')
  async getQuantityCharSuggestions(
    @Body() body: GetQuantityCharSuggestionsDto,
  ) {
    const response = await this.productsService.getQuantityCharSuggestions(
      body,
    );

    return response;
  }

  @UsePipes(new ValidationPipe())
  @Post('fraction-chars/suggestions')
  async getFractionCharSuggestions(
    @Body() body: GetFractionCharSuggestionsDto,
  ) {
    const response = await this.productsService.getFractionCharSuggestions(
      body,
    );

    return response;
  }

  @UsePipes(new ValidationPipe())
  @Post('string-chars/suggestions')
  async getStringCharSuggestions(@Body() body: GetStringCharSuggestionsDto) {
    const response = await this.productsService.getStringCharSuggestions(body);

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
    const response = await this.productsService.getOneFullDataPrivate(id);

    return response;
  }

  @UseGuards(JwtAuthGuard, new RoleGuard([Role.ADMIN]))
  @UsePipes(new ValidationPipe())
  @Post()
  async create(@Body() body: CreateProductDto, @Req() req: Request) {
    const currentUserId = req['user'].id;

    const response = await this.productsService.create(body, currentUserId);

    this.gateway.sendUpdatedSection(SECTIONS.products);
    return response;
  }

  @UseGuards(JwtAuthGuard, new RoleGuard([Role.ADMIN]))
  @UsePipes(new ValidationPipe({ transform: true }))
  @Put(':id')
  async edit(
    @Body() body: EditProductDto,
    @Req() req: Request,
    @Param() param: IdParamDto,
  ) {
    const currentUserId = req['user'].id;
    const { id } = param;

    const response = await this.productsService.edit(id, body, currentUserId);

    this.gateway.sendUpdatedSection(SECTIONS.products);
    return response;
  }
}
