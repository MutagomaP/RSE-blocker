import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Broker, BrokerStatus } from './broker.entity';
import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBrokerProfileDto {
  @ApiProperty() @IsString() firmName: string;
  @ApiProperty() @IsString() licenseNumber: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() website?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() officeAddress?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() district?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() commissionRate?: number;
  @ApiPropertyOptional() @IsOptional() @IsArray() specializations?: string[];
}

@Injectable()
export class BrokersService {
  constructor(
    @InjectRepository(Broker)
    private repo: Repository<Broker>,
  ) {}

  findAll(status?: BrokerStatus) {
    const where = status ? { status } : {};
    return this.repo.find({
      where,
      relations: ['user'],
      order: { totalTrades: 'DESC' },
    });
  }

  async findOne(id: string) {
    const broker = await this.repo.findOne({ where: { id }, relations: ['user'] });
    if (!broker) throw new NotFoundException('Broker not found');
    return broker;
  }

  async findByUserId(userId: string) {
    return this.repo.findOne({ where: { userId }, relations: ['user'] });
  }

  async create(userId: string, dto: CreateBrokerProfileDto) {
    const broker = this.repo.create({ ...dto, userId, status: BrokerStatus.PENDING });
    return this.repo.save(broker);
  }

  async update(id: string, dto: Partial<CreateBrokerProfileDto>) {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async approve(id: string) {
    const result = await this.repo.update(id, { status: BrokerStatus.LICENSED });
    if (!result.affected) throw new NotFoundException('Broker not found');
    return { message: 'Broker approved' };
  }

  async suspend(id: string) {
    const result = await this.repo.update(id, { status: BrokerStatus.SUSPENDED });
    if (!result.affected) throw new NotFoundException('Broker not found');
    return { message: 'Broker suspended' };
  }
}
