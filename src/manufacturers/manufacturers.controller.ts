import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards';
import { IdParamDto } from 'src/tools/dtos/idParam.dto';
import { CreateManufacturerDto } from './dtos/controllers/createManufacturer.dto';
import { UpdateManufacturerDto } from './dtos/controllers/updateManufacturer.dto';
import { ManufacturersService } from './manufacturers.service';

@Controller('manufacturers')
export class ManufacturersController {
  constructor(private readonly manufacturersService: ManufacturersService) {}

  @Get()
  async findAll() {
    return await this.manufacturersService.findAll();
  }

  @Get('by/name/:name')
  async findByName(@Param('name') name: string) {
    return await this.manufacturersService.findByName(name);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post()
  async create(@Body() body: CreateManufacturerDto) {
    return await this.manufacturersService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Put(':id')
  async update(
    @Param() param: IdParamDto,
    @Body() body: UpdateManufacturerDto,
  ) {
    return await this.manufacturersService.update(param.id, body);
  }
}
