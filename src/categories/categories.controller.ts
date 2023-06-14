import {
  Body,
  Request,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards';
import { CreateCategoryDto } from './dtos/controllers/createCategory.dto';
import { AppGateway } from 'src/app.gateway';
import { SECTIONS } from 'src/tools';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesPublicController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll() {
    const response = await this.categoriesService.findAll();

    return response;
  }
}

@Controller('private/categories')
export class CategoriesPrivateController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly gateway: AppGateway,
  ) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post()
  async create(@Body() body: CreateCategoryDto, @Req() req: Request) {
    const currentUserId = req['user'].id;

    const response = await this.categoriesService.create(body, currentUserId);

    this.gateway.sendUpdatedSection(SECTIONS.categories);
    return response;
  }
}
