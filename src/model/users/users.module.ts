import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { User, UserSchema } from './entities';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PermissionsGuard } from 'src/common/guards/permissions';

@Module({
  imports: [
    MongooseModule.forFeature([{ name:User.name, schema: UserSchema }])
  ],
  controllers: [UsersController],
  providers: [UsersService, RolesGuard, PermissionsGuard],
  exports: [UsersService]
})
export class UsersModule {}
  