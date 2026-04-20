import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Security } from '../securities/security.entity';
import { Broker } from '../brokers/broker.entity';

export enum OrderSide {
  BUY = 'buy',
  SELL = 'sell',
}

export enum OrderType {
  MARKET = 'market',
  LIMIT = 'limit',
}

export enum OrderStatus {
  PENDING = 'pending',
  PARTIALLY_FILLED = 'partially_filled',
  FILLED = 'filled',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  REJECTED = 'rejected',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn()
  investor: User;

  @Column()
  investorId: string;

  @ManyToOne(() => Broker, { nullable: true })
  @JoinColumn()
  broker: Broker;

  @Column({ nullable: true })
  brokerId: string;

  @ManyToOne(() => Security)
  @JoinColumn()
  security: Security;

  @Column()
  securityId: string;

  @Column({ type: 'enum', enum: OrderSide })
  side: OrderSide;

  @Column({ type: 'enum', enum: OrderType, default: OrderType.LIMIT })
  type: OrderType;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'int', default: 0 })
  filledQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  limitPrice: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  executedPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  commission: number;

  @Column({ nullable: true })
  expiresAt: Date;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
