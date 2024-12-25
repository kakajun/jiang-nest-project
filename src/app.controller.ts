import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { ApiBearerAuth } from '@nestjs/swagger'

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}
  @ApiBearerAuth()
  @Get('say-hello')
  getHello(): string {
    return this.appService.getHello()
  }
}
