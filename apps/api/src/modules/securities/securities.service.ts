import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Security, SecurityType, SecurityStatus } from './security.entity';
import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSecurityDto {
  @ApiProperty() @IsString() ticker: string;
  @ApiProperty() @IsString() companyName: string;
  @ApiPropertyOptional() @IsOptional() @IsString() isin?: string;
  @ApiPropertyOptional({ enum: SecurityType }) @IsOptional() @IsEnum(SecurityType) type?: SecurityType;
  @ApiPropertyOptional() @IsOptional() @IsString() sector?: string;
  @ApiProperty() @IsNumber() currentPrice: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() sharesOutstanding?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isCrossListed?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() primaryExchange?: string;
}

@Injectable()
export class SecuritiesService {
  constructor(
    @InjectRepository(Security)
    private repo: Repository<Security>,
  ) {}

  findAll(search?: string, type?: SecurityType) {
    const where: any = { status: SecurityStatus.ACTIVE };
    if (type) where.type = type;
    if (search) {
      return this.repo.find({
        where: [
          { ...where, ticker: Like(`%${search.toUpperCase()}%`) },
          { ...where, companyName: Like(`%${search}%`) },
        ],
        order: { marketCap: 'DESC' },
      });
    }
    return this.repo.find({ where, order: { marketCap: 'DESC' } });
  }

  async findOne(id: string) {
    const sec = await this.repo.findOne({ where: { id } });
    if (!sec) throw new NotFoundException('Security not found');
    return sec;
  }

  async findByTicker(ticker: string) {
    const sec = await this.repo.findOne({ where: { ticker: ticker.toUpperCase() } });
    if (!sec) throw new NotFoundException(`Security ${ticker} not found`);
    return sec;
  }

  async create(dto: CreateSecurityDto) {
    const security = this.repo.create({ ...dto, ticker: dto.ticker.toUpperCase() });
    return this.repo.save(security);
  }

  async updatePrice(id: string, price: number) {
    const sec = await this.findOne(id);
    await this.repo.update(id, {
      previousClose: sec.currentPrice,
      currentPrice: price,
    });
    return this.findOne(id);
  }

  async getMarketSummary() {
    const securities = await this.repo.find({ where: { status: SecurityStatus.ACTIVE } });
    const totalMarketCap = securities.reduce((s, sec) => s + Number(sec.marketCap || 0), 0);
    const gainers = securities
      .filter(s => s.currentPrice > s.previousClose)
      .sort((a, b) => {
        const pctA = (a.currentPrice - a.previousClose) / a.previousClose;
        const pctB = (b.currentPrice - b.previousClose) / b.previousClose;
        return pctB - pctA;
      })
      .slice(0, 5);
    const losers = securities
      .filter(s => s.currentPrice < s.previousClose)
      .sort((a, b) => {
        const pctA = (a.currentPrice - a.previousClose) / a.previousClose;
        const pctB = (b.currentPrice - b.previousClose) / b.previousClose;
        return pctA - pctB;
      })
      .slice(0, 5);
    return { totalListings: securities.length, totalMarketCap, gainers, losers };
  }
}
