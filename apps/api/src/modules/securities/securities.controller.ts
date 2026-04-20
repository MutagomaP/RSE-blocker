import { Controller, Get, Post, Patch, Param, Body, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SecuritiesService, CreateSecurityDto } from './securities.service';
import { JwtAuthGuard, RolesGuard, Roles } from '../auth/guards';
import { UserRole } from '../users/user.entity';
import { SecurityType } from './security.entity';

@ApiTags('securities')
@Controller('securities')
export class SecuritiesController {
  constructor(private securitiesService: SecuritiesService) {}

  @Get()
  @ApiOperation({ summary: 'List all active securities' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'type', enum: SecurityType, required: false })
  findAll(@Query('search') search?: string, @Query('type') type?: SecurityType) {
    return this.securitiesService.findAll(search, type);
  }

  @Get('market-summary')
  @ApiOperation({ summary: 'Get RSE market summary and top movers' })
  getMarketSummary() {
    return this.securitiesService.getMarketSummary();
  }

  @Get('ticker/:ticker')
  @ApiOperation({ summary: 'Get security by ticker symbol' })
  findByTicker(@Param('ticker') ticker: string) {
    return this.securitiesService.findByTicker(ticker);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get security by ID' })
  findOne(@Param('id') id: string) {
    return this.securitiesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List a new security (admin only)' })
  create(@Body() dto: CreateSecurityDto) {
    return this.securitiesService.create(dto);
  }

  @Patch(':id/price')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update security price (admin only)' })
  updatePrice(@Param('id') id: string, @Body('price') price: number) {
    return this.securitiesService.updatePrice(id, price);
  }
}
