import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from '../orders/order.entity';
import { Security } from '../securities/security.entity';
import { User } from '../users/user.entity';
import { Broker } from '../brokers/broker.entity';

export enum TradeStatus {
  EXECUTED = 'executed',
  SETTLED = 'settled',
  FAILED = 'failed',
}

@Entity('trades')
export class Trade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  tradeReference: string;

  @ManyToOne(() => Order)
  @JoinColumn()
  buyOrder: Order;

  @Column()
  buyOrderId: string;

  @ManyToOne(() => Order)
  @JoinColumn()
  sellOrder: Order;

  @Column()
  sellOrderId: string;

  @ManyToOne(() => Security)
  @JoinColumn()
  security: Security;

  @Column()
  securityId: string;

  @ManyToOne(() => User)
  @JoinColumn()
  buyer: User;

  @Column()
  buyerId: string;

  @ManyToOne(() => User)
  @JoinColumn()
  seller: User;

  @Column()
  sellerId: string;

  @ManyToOne(() => Broker, { nullable: true })
  @JoinColumn()
  buyerBroker: Broker;

  @Column({ nullable: true })
  buyerBrokerId: string;

  @ManyToOne(() => Broker, { nullable: true })
  @JoinColumn()
  sellerBroker: Broker;

  @Column({ nullable: true })
  sellerBrokerId: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 4 })
  price: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalValue: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  buyerCommission: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  sellerCommission: number;

  @Column({
    type: 'enum',
    enum: TradeStatus,
    default: TradeStatus.EXECUTED,
  })
  status: TradeStatus;

  @Column({ nullable: true })
  settlementDate: Date;

  @CreateDateColumn()
  executedAt: Date;
}
