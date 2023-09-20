import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { Public } from './common/decorators/metadatas/auth';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService
  ) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
