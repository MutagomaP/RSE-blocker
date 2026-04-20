import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Security } from './security.entity';
import { SecuritiesService } from './securities.service';
import { SecuritiesController } from './securities.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Security])],
  providers: [SecuritiesService],
  controllers: [SecuritiesController],
  exports: [SecuritiesService],
})
export class SecuritiesModule {}
