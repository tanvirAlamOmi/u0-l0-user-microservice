import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/model/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenjwtStrategy, RefreshTokenjwtStrategy } from './strategies/jwt';

@Module({
  imports: [
    UsersModule, 
    PassportModule, 
    JwtModule.register({})
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenjwtStrategy, RefreshTokenjwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
