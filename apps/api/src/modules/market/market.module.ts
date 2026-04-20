import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Security } from '../securities/security.entity';
import { Trade } from '../trades/trade.entity';
import { Injectable, Controller, Get, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SecurityStatus } from '../securities/security.entity';

@Injectable()
export class MarketService {
  constructor(
    @InjectRepository(Security)
    private securityRepo: Repository<Security>,
    @InjectRepository(Trade)
    private tradeRepo: Repository<Trade>,
  ) {}

  async getMarketOverview() {
    const securities = await this.securityRepo.find({ where: { status: SecurityStatus.ACTIVE } });

    const totalMarketCap = securities.reduce((s, sec) => s + Number(sec.marketCap || 0), 0);
    const totalVolume = securities.reduce((s, sec) => s + Number(sec.volume || 0), 0);

    const advancers = securities.filter(s => Number(s.currentPrice) > Number(s.previousClose)).length;
    const decliners = securities.filter(s => Number(s.currentPrice) < Number(s.previousClose)).length;
    const unchanged = securities.length - advancers - decliners;

    const gainers = securities
      .filter(s => s.previousClose && Number(s.previousClose) > 0)
      .map(s => ({
        ...s,
        change: Number(s.currentPrice) - Number(s.previousClose),
        changePct: ((Number(s.currentPrice) - Number(s.previousClose)) / Number(s.previousClose)) * 100,
      }))
      .sort((a, b) => b.changePct - a.changePct)
      .slice(0, 5);

    const losers = [...gainers].sort((a: any, b: any) => a.changePct - b.changePct).slice(0, 5);

    const recentTrades = await this.tradeRepo.find({
      relations: ['security'],
      order: { executedAt: 'DESC' },
      take: 10,
    });

    // RSE All Share Index (simplified: average price change)
    const rsiChange = securities.length > 0
      ? securities.reduce((s, sec) => {
          if (!sec.previousClose || Number(sec.previousClose) === 0) return s;
          return s + ((Number(sec.currentPrice) - Number(sec.previousClose)) / Number(sec.previousClose)) * 100;
        }, 0) / securities.length
      : 0;

    return {
      indices: {
        RSI: { value: 147.92, change: rsiChange.toFixed(2), currency: 'RWF' },
        ALSI: { value: 182.26, change: (rsiChange * 0.9).toFixed(2), currency: 'RWF' },
        EAE20: { value: 99.55, change: (rsiChange * 0.5).toFixed(2), currency: 'RWF' },
      },
      breadth: { advancers, decliners, unchanged, total: securities.length },
      totalMarketCap,
      totalVolume,
      gainers: gainers.slice(0, 5),
      losers: losers.slice(0, 5),
      recentTrades,
      tradingHours: { open: '09:00', close: '12:00', timezone: 'Africa/Kigali', currency: 'RWF' },
      settlementCycle: 'T+2',
    };
  }

  async getPriceHistory(securityId: string) {
    // In production: fetch from time-series table. Here return mock data.
    const security = await this.securityRepo.findOne({ where: { id: securityId } });
    if (!security) return [];
    const base = Number(security.currentPrice);
    return Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
      close: +(base * (0.9 + Math.random() * 0.2)).toFixed(4),
      volume: Math.floor(Math.random() * 50000),
    }));
  }
}

@ApiTags('market')
@Controller('market')
export class MarketController {
  constructor(private marketService: MarketService) {}

  @Get()
  @ApiOperation({ summary: 'Get RSE market overview — indices, breadth, top movers' })
  getOverview() {
    return this.marketService.getMarketOverview();
  }

  @Get('price-history/:securityId')
  @ApiOperation({ summary: 'Get 30-day price history for a security' })
  getPriceHistory(@Param('securityId') securityId: string) {
    return this.marketService.getPriceHistory(securityId);
  }
}

function Param(s: string) {
  const { Param: P } = require('@nestjs/common');
  return P(s);
}

@Module({
  imports: [TypeOrmModule.forFeature([Security, Trade])],
  providers: [MarketService],
  controllers: [MarketController],
  exports: [MarketService],
})
export class MarketModule {}
