import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum BrokerStatus {
  PENDING = 'pending',
  LICENSED = 'licensed',
  SUSPENDED = 'suspended',
  REVOKED = 'revoked',
}

@Entity('brokers')
export class Broker {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

  @Column()
  firmName: string;

  @Column({ unique: true })
  licenseNumber: string;

  @Column({ nullable: true })
  licenseExpiryDate: Date;

  @Column({
    type: 'enum',
    enum: BrokerStatus,
    default: BrokerStatus.PENDING,
  })
  status: BrokerStatus;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  officeAddress: string;

  @Column({ nullable: true })
  district: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 1.0 })
  commissionRate: number;

  @Column({ type: 'int', default: 0 })
  totalClients: number;

  @Column({ type: 'int', default: 0 })
  totalTrades: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalVolumeTraded: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  rating: number;

  @Column({ type: 'text', array: true, default: [] })
  specializations: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
