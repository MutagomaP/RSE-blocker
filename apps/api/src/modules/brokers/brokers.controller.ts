import { Controller, Get, Post, Patch, Param, Body, UseGuards, Request, Query, HttpCode, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { BrokersService, CreateBrokerProfileDto } from './brokers.service';
import { JwtAuthGuard, RolesGuard, Roles } from '../auth/guards';
import { UserRole } from '../users/user.entity';
import { BrokerStatus } from './broker.entity';

@ApiTags('brokers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('brokers')
export class BrokersController {
  constructor(private brokersService: BrokersService) {}

  @Get()
  @ApiOperation({ summary: 'List all licensed brokers' })
  @ApiQuery({ name: 'status', enum: BrokerStatus, required: false })
  findAll(@Query('status') status?: BrokerStatus) {
    return this.brokersService.findAll(status);
  }

  @Get('my-profile')
  @Roles(UserRole.BROKER)
  @ApiOperation({ summary: 'Get my broker profile' })
  getMyProfile(@Request() req) {
    return this.brokersService.findByUserId(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get broker by ID' })
  findOne(@Param('id') id: string) {
    return this.brokersService.findOne(id);
  }

  @Post()
  @Roles(UserRole.BROKER)
  @ApiOperation({ summary: 'Create broker profile' })
  create(@Request() req, @Body() dto: CreateBrokerProfileDto) {
    return this.brokersService.create(req.user.id, dto);
  }

  @Patch('my-profile')
  @Roles(UserRole.BROKER)
  @ApiOperation({ summary: 'Update my broker profile' })
  update(@Request() req, @Body() dto: Partial<CreateBrokerProfileDto>) {
    return this.brokersService.findByUserId(req.user.id).then(b =>
      this.brokersService.update(b.id, dto)
    );
  }

  @Post(':id/approve')
  @HttpCode(200)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Approve broker license (admin only)' })
  approve(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.brokersService.approve(id);
  }

  @Post(':id/suspend')
  @HttpCode(200)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Suspend broker (admin only)' })
  suspend(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.brokersService.suspend(id);
  }
}
