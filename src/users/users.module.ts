import { Module } from '@nestjs/common';
import { UsersPrivateController } from './users.controller';
import { UsersService } from './users.service';
import { AppGateway } from 'src/app.gateway';

@Module({
  providers: [UsersService, AppGateway],
  exports: [UsersService],
  controllers: [UsersPrivateController],
})
export class UsersModule {}
