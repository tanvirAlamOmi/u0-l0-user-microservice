import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class DuplicateExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.BAD_REQUEST;

    if (exception.code === 11000) {
      response.status(status).json({
        statusCode: status,
        message: 'Duplicate entry',
        error: 'Bad Request',
      });
    }
  }
}
