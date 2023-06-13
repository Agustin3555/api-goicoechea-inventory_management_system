import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard, RoleGuard } from 'src/auth/guards';
import { IdParamDto } from 'src/tools/dtos/idParam.dto';
import { CreateUserDto } from './dtos/controllers/createUser.dto';
import { UsersService } from './users.service';
import { SECTIONS } from 'src/tools';
import { AppGateway } from 'src/app.gateway';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly gateway: AppGateway,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: Request) {
    const { id } = req['user'];
    const response = await this.usersService.findOne(id);

    return response;
  }

  // @UseGuards(JwtAuthGuard)
  // @Put('me')
  // async updateMe(@Req() req: Request) {
  //   const { id } = req['user'];
  //   const response = await this.usersService.update(id);

  //   this.gateway.sendUpdatedSection(SECTIONS.users);
  //   return response;
  // }

  @UseGuards(JwtAuthGuard, new RoleGuard([Role.ADMIN]))
  @Get()
  async findAll() {
    const response = await this.usersService.findAll();

    return response;
  }

  @UseGuards(JwtAuthGuard, new RoleGuard([Role.ADMIN]))
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get(':id')
  async findOne(@Param() param: IdParamDto) {
    const { id } = param;
    const response = await this.usersService.findOne(id);

    return response;
  }

  @UseGuards(JwtAuthGuard, new RoleGuard([Role.ADMIN]))
  @Get('by/name/:name')
  async findByName(@Param('name') name: string) {
    const response = await this.usersService.findByName(name);

    return response;
  }

  @UseGuards(JwtAuthGuard, new RoleGuard([Role.ADMIN]))
  @UsePipes(new ValidationPipe())
  @Post()
  async create(@Body() body: CreateUserDto) {
    const response = await this.usersService.create(body);

    this.gateway.sendUpdatedSection(SECTIONS.users);
    return response;
  }

  // @UseGuards(JwtAuthGuard, new RoleGuard([Role.ADMIN]))
  // @UsePipes(new ValidationPipe({ transform: true }))
  // @Put(':id')
  // async update(@Param() param: IdParamDto) {
  //   const { id } = param;
  //   const response = await this.usersService.update(id);

  //   this.gateway.sendUpdatedSection(SECTIONS.users);
  //   return response;
  // }

  @UseGuards(JwtAuthGuard, new RoleGuard([Role.ADMIN]))
  @UsePipes(new ValidationPipe({ transform: true }))
  @Delete(':id')
  async remove(@Param() param: IdParamDto) {
    const { id } = param;
    const response = await this.usersService.remove(id);

    this.gateway.sendUpdatedSection(SECTIONS.users);
    return response;
  }
}
