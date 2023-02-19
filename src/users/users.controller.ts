import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard, RoleGuard } from 'src/auth/guards';
import { CreateUserDto } from './dtos/controllers/createUser.dto';
import { IdParamDto } from './dtos/controllers/idParam.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: Request) {
    const user = req['user'];

    return await this.usersService.findOne(user.id);
  }

  @UseGuards(JwtAuthGuard, new RoleGuard([Role.ADMIN]))
  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard, new RoleGuard([Role.ADMIN]))
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get(':id')
  async findOne(@Param() param: IdParamDto) {
    return await this.usersService.findOne(param.id);
  }

  @UseGuards(JwtAuthGuard, new RoleGuard([Role.ADMIN]))
  @Get('by/name/:name')
  async findByName(@Param('name') name: string) {
    return await this.usersService.findByName(name);
  }

  @UseGuards(JwtAuthGuard, new RoleGuard([Role.ADMIN]))
  @UsePipes(new ValidationPipe())
  @Post()
  async create(@Body() body: CreateUserDto) {
    return await this.usersService.create(body);
  }

  // TODO: controlador para que el admin pueda editar los usuarios

  // TODO: controlador para que el usuario actual pueda editar su propio perfil

  @UseGuards(JwtAuthGuard, new RoleGuard([Role.ADMIN]))
  @UsePipes(new ValidationPipe({ transform: true }))
  @Delete(':id')
  async remove(@Param() param: IdParamDto) {
    await this.usersService.remove(param.id);
  }
}
