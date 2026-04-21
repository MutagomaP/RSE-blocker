import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Trade } from '../trades/trade.entity';
import { Portfolio } from '../portfolio/portfolio.entity';
import { Security } from '../securities/security.entity';
import { Broker } from '../brokers/broker.entity';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Trade, Portfolio, Security, Broker])],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}