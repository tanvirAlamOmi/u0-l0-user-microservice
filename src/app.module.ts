import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './model/users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAccessAuthGuard } from './common/guards/auth/jwt';

@Module({
  imports: [
    // Third party module
    ConfigModule.forRoot({
      // cache:true,
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb+srv://tanviralamomi:eraromi1995@cluster0.tteetb4.mongodb.net'),
    
    // App module
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAccessAuthGuard,
    }
  ],
})
export class AppModule {}
