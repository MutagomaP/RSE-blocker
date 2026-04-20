import { Module } from '@nestjs/common';
import { HomeController } from './home.controller';
import { ApiService } from '../../common/api.service';

@Module({
  controllers: [HomeController],
  providers: [ApiService],
})
export class HomeModule {}
