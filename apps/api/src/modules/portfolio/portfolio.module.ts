import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Portfolio } from './portfolio.entity';
import { Security } from '../securities/security.entity';
import { Injectable, Controller, Get, UseGuards, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Portfolio)
    private portfolioRepo: Repository<Portfolio>,
    @InjectRepository(Security)
    private securityRepo: Repository<Security>,
  ) {}

  async getPortfolio(investorId: string) {
    const holdings = await this.portfolioRepo.find({
      where: { investorId },
      relations: ['security'],
    });

    let totalValue = 0;
    let totalCost = 0;

    const enriched = holdings.map(h => {
      const currentValue = h.quantity * Number(h.security.currentPrice);
      const unrealizedPnl = currentValue - Number(h.totalCost);
      const unrealizedPnlPercent = Number(h.totalCost) > 0
        ? (unrealizedPnl / Number(h.totalCost)) * 100
        : 0;
      totalValue += currentValue;
      totalCost += Number(h.totalCost);
      return { ...h, currentValue, unrealizedPnl, unrealizedPnlPercent };
    });

    return {
      holdings: enriched,
      summary: {
        totalValue,
        totalCost,
        totalUnrealizedPnl: totalValue - totalCost,
        totalUnrealizedPnlPercent: totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0,
        holdingsCount: holdings.length,
      },
    };
  }
}

@ApiTags('portfolio')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('portfolio')
export class PortfolioController {
  constructor(private portfolioService: PortfolioService) {}

  @Get()
  @ApiOperation({ summary: 'Get my investment portfolio with P&L' })
  getPortfolio(@Request() req) {
    return this.portfolioService.getPortfolio(req.user.id);
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([Portfolio, Security])],
  providers: [PortfolioService],
  controllers: [PortfolioController],
  exports: [PortfolioService],
})
export class PortfolioModule {}
