import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderSide, OrderType, OrderStatus } from './order.entity';
import { Trade, TradeStatus } from '../trades/trade.entity';
import { Portfolio } from '../portfolio/portfolio.entity';
import { Security } from '../securities/security.entity';
import { Broker } from '../brokers/broker.entity';
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PlaceOrderDto {
  @ApiProperty() @IsUUID() securityId: string;
  @ApiProperty({ enum: OrderSide }) @IsEnum(OrderSide) side: OrderSide;
  @ApiPropertyOptional({ enum: OrderType }) @IsOptional() @IsEnum(OrderType) type?: OrderType;
  @ApiProperty() @IsNumber() @Min(1) quantity: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) limitPrice?: number;
  @ApiPropertyOptional() @IsOptional() @IsUUID() brokerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @InjectRepository(Trade)
    private tradeRepo: Repository<Trade>,
    @InjectRepository(Portfolio)
    private portfolioRepo: Repository<Portfolio>,
    @InjectRepository(Security)
    private securityRepo: Repository<Security>,
    @InjectRepository(Broker)
    private brokerRepo: Repository<Broker>,
    private dataSource: DataSource,
  ) {}

  async placeOrder(investorId: string, dto: PlaceOrderDto) {
    const security = await this.securityRepo.findOne({ where: { id: dto.securityId } });
    if (!security) throw new NotFoundException('Security not found');

    if (dto.type === OrderType.MARKET || !dto.type) {
      dto.limitPrice = Number(security.currentPrice);
      dto.type = OrderType.MARKET;
    }

    if (dto.side === OrderSide.SELL) {
      const holding = await this.portfolioRepo.findOne({
        where: { investorId, securityId: dto.securityId },
      });
      if (!holding || holding.quantity < dto.quantity) {
        throw new BadRequestException('Insufficient shares to sell');
      }
    }

    const order = this.orderRepo.create({
      investorId,
      securityId: dto.securityId,
      brokerId: dto.brokerId,
      side: dto.side,
      type: dto.type || OrderType.LIMIT,
      quantity: dto.quantity,
      limitPrice: dto.limitPrice,
      notes: dto.notes,
      status: OrderStatus.PENDING,
    });
    await this.orderRepo.save(order);

    if (order.type === OrderType.MARKET) {
      await this.matchOrder(order, security);
    }

    return this.orderRepo.findOne({
      where: { id: order.id },
      relations: ['security', 'broker', 'investor'],
    });
  }

  private async matchOrder(order: Order, security: Security) {
    const oppositeSide = order.side === OrderSide.BUY ? OrderSide.SELL : OrderSide.BUY;

    const match = await this.orderRepo.findOne({
      where: { securityId: order.securityId, side: oppositeSide, status: OrderStatus.PENDING },
      order: { createdAt: 'ASC' },
    });

    if (!match) return;

    const executedPrice = Number(match.limitPrice || security.currentPrice);
    const totalValue = executedPrice * order.quantity;
    const commission = totalValue * 0.01;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.update(Order, order.id, { status: OrderStatus.FILLED, filledQuantity: order.quantity, executedPrice, commission });
      await queryRunner.manager.update(Order, match.id, { status: OrderStatus.FILLED, filledQuantity: match.quantity, executedPrice, commission });

      const tradeRef = `RSE-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      const buyOrderId = order.side === OrderSide.BUY ? order.id : match.id;
      const sellOrderId = order.side === OrderSide.SELL ? order.id : match.id;
      const buyerId = order.side === OrderSide.BUY ? order.investorId : match.investorId;
      const sellerId = order.side === OrderSide.SELL ? order.investorId : match.investorId;

      await queryRunner.manager.save(Trade, {
        tradeReference: tradeRef,
        buyOrderId, sellOrderId, securityId: order.securityId,
        buyerId, sellerId,
        buyerBrokerId: order.side === OrderSide.BUY ? order.brokerId : match.brokerId,
        sellerBrokerId: order.side === OrderSide.SELL ? order.brokerId : match.brokerId,
        quantity: order.quantity, price: executedPrice, totalValue,
        buyerCommission: commission, sellerCommission: commission,
        status: TradeStatus.EXECUTED,
        settlementDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      });

      await this.updatePortfolio(queryRunner.manager, buyerId, order.securityId, order.quantity, executedPrice, 'buy');
      await this.updatePortfolio(queryRunner.manager, sellerId, order.securityId, order.quantity, executedPrice, 'sell');
      await queryRunner.manager.update(Security, order.securityId, { currentPrice: executedPrice, volume: () => `volume + ${order.quantity}` });
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  private async updatePortfolio(manager: any, investorId: string, securityId: string, qty: number, price: number, side: 'buy' | 'sell') {
    const existing = await manager.findOne(Portfolio, { where: { investorId, securityId } });
    if (side === 'buy') {
      if (existing) {
        const newQty = existing.quantity + qty;
        const newTotalCost = Number(existing.totalCost) + qty * price;
        await manager.update(Portfolio, existing.id, { quantity: newQty, totalCost: newTotalCost, averageCost: newTotalCost / newQty });
      } else {
        await manager.save(Portfolio, { investorId, securityId, quantity: qty, averageCost: price, totalCost: qty * price });
      }
    } else if (existing) {
      const newQty = existing.quantity - qty;
      if (newQty <= 0) await manager.delete(Portfolio, existing.id);
      else await manager.update(Portfolio, existing.id, { quantity: newQty });
    }
  }

  getMyOrders(investorId: string) {
    return this.orderRepo.find({
      where: { investorId },
      relations: ['security', 'broker', 'investor'],
      order: { createdAt: 'DESC' },
    });
  }

  async getAllOrders(opts: { isAdmin: boolean; userId: string; status?: string; side?: string }) {
    const qb = this.orderRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.security', 'security')
      .leftJoinAndSelect('order.investor', 'investor')
      .leftJoinAndSelect('order.broker', 'broker')
      .leftJoinAndSelect('broker.user', 'brokerUser')
      .orderBy('order.createdAt', 'DESC')
      .take(200);

    if (!opts.isAdmin) {
      const brokerProfile = await this.brokerRepo.findOne({ where: { userId: opts.userId } });
      if (brokerProfile) {
        qb.where('order.brokerId = :brokerId', { brokerId: brokerProfile.id });
      } else {
        return [];
      }
    }

    if (opts.status) qb.andWhere('order.status = :status', { status: opts.status });
    if (opts.side) qb.andWhere('order.side = :side', { side: opts.side });

    return qb.getMany();
  }

  async cancelOrder(id: string, investorId: string) {
    const order = await this.orderRepo.findOne({ where: { id, investorId } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== OrderStatus.PENDING)
      throw new BadRequestException('Only pending orders can be cancelled');
    await this.orderRepo.update(id, { status: OrderStatus.CANCELLED });
    return { message: 'Order cancelled' };
  }

  async getOrderStats() {
    const total = await this.orderRepo.count();
    const pending = await this.orderRepo.count({ where: { status: OrderStatus.PENDING } });
    const filled = await this.orderRepo.count({ where: { status: OrderStatus.FILLED } });
    const cancelled = await this.orderRepo.count({ where: { status: OrderStatus.CANCELLED } });
    return { total, pending, filled, cancelled };
  }
}