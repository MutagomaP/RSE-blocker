import { Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SeedService } from './seed.service';

@ApiTags('seed')
@Controller('seed')
export class SeedController {
  constructor(private seedService: SeedService) {}

  @Post()
  @ApiOperation({ summary: 'Seed the database with initial data (call once)' })
  async seed() {
    return this.seedService.seedDatabase();
  }
}

