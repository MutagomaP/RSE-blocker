import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trade } from './trade.entity';
import { Injectable, Controller, Get, Param, UseGuards, Request, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard, Roles } from '../auth/guards';
import { UserRole } from '../users/user.entity';

@Injectable()
export class TradesService {
  constructor(
    @InjectRepository(Trade)
    private repo: Repository<Trade>,
  ) {}

  getMyTrades(userId: string) {
    return this.repo.find({
      where: [{ buyerId: userId }, { sellerId: userId }],
      relations: ['security', 'buyerBroker', 'sellerBroker'],
      order: { executedAt: 'DESC' },
    });
  }

  getAllTrades(limit = 50) {
    return this.repo.find({
      relations: ['security', 'buyer', 'seller'],
      order: { executedAt: 'DESC' },
      take: limit,
    });
  }

  getTrade(id: string) {
    return this.repo.findOne({
      where: { id },
      relations: ['security', 'buyer', 'seller', 'buyerBroker', 'sellerBroker'],
    });
  }
}

@ApiTags('trades')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('trades')
export class TradesController {
  constructor(private tradesService: TradesService) {}

  @Get('my-trades')
  @ApiOperation({ summary: 'Get my trade history' })
  getMyTrades(@Request() req) {
    return this.tradesService.getMyTrades(req.user.id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BROKER)
  @ApiOperation({ summary: 'Get all trades (admin/broker)' })
  getAllTrades(@Query('limit') limit?: number) {
    return this.tradesService.getAllTrades(limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get trade by ID' })
  getTrade(@Param('id') id: string) {
    return this.tradesService.getTrade(id);
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([Trade])],
  providers: [TradesService],
  controllers: [TradesController],
  exports: [TradesService],
})
export class TradesModule {}
