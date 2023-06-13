import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AppGateway } from 'src/app.gateway';

@Module({
  providers: [UsersService, AppGateway],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
