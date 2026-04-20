import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Security } from '../securities/security.entity';

@Entity('portfolios')
@Unique(['investorId', 'securityId'])
export class Portfolio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn()
  investor: User;

  @Column()
  investorId: string;

  @ManyToOne(() => Security)
  @JoinColumn()
  security: Security;

  @Column()
  securityId: string;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  averageCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  currentValue: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  unrealizedPnl: number;

  @Column({ type: 'decimal', precision: 8, scale: 4, nullable: true })
  unrealizedPnlPercent: number;

  @UpdateDateColumn()
  updatedAt: Date;
}
