import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import path from 'path';

@Catch(NotFoundException)

export class NotFoundExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        response.sendFile(path.join(__dirname, "index.html"));
    }
}