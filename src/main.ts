import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter, DuplicateExceptionFilter } from 'src/common/exception/index';
import { LoggingInterceptor } from 'src/common/interceptors/index'
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { broker, groupId, clientId } from '../kafka-config.json';


async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: clientId,
        brokers: [broker],
      },
      consumer: {
        groupId: groupId
      },
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
  
  // app.useGlobalFilters(
  //   new AllExceptionsFilter(),
  //   new DuplicateExceptionFilter()
  // );
  app.useGlobalInterceptors(new LoggingInterceptor());
  await app.listen();
}
bootstrap();

