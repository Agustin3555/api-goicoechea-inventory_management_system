import {
  Body,
  Request,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards';
import { IdParamDto } from 'src/tools/dtos/idParam.dto';
import { CreateManufacturerDto } from './dtos/controllers/createManufacturer.dto';
import { UpdateManufacturerDto } from './dtos/controllers/updateManufacturer.dto';
import { ManufacturersService } from './manufacturers.service';
import { AppGateway } from 'src/app.gateway';
import { SECTIONS } from 'src/tools';

@Controller('manufacturers')
export class ManufacturersPublicController {
  constructor(private readonly manufacturersService: ManufacturersService) {}

  @Get()
  async findAll() {
    const response = await this.manufacturersService.findAll();

    return response;
  }

  @Get('by/name/:name')
  async findByName(@Param('name') name: string) {
    const response = await this.manufacturersService.findByName(name);

    return response;
  }
}

@Controller('private/manufacturers')
export class ManufacturersPrivateController {
  constructor(
    private readonly manufacturersService: ManufacturersService,
    private readonly gateway: AppGateway,
  ) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post()
  async create(@Body() body: CreateManufacturerDto, @Req() req: Request) {
    const currentUserId = req['user'].id;

    const response = await this.manufacturersService.create(
      body,
      currentUserId,
    );

    this.gateway.sendUpdatedSection(SECTIONS.manufacturers);
    return response;
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Put(':id')
  async update(
    @Param() param: IdParamDto,
    @Body() body: UpdateManufacturerDto,
  ) {
    const response = await this.manufacturersService.update(param.id, body);

    this.gateway.sendUpdatedSection(SECTIONS.manufacturers);
    return response;
  }
}
