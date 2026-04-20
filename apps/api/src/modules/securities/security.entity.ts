import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SecurityType {
  EQUITY = 'equity',
  BOND = 'bond',
  ETF = 'etf',
  PREFERENCE_SHARE = 'preference_share',
}

export enum SecurityStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  DELISTED = 'delisted',
}

@Entity('securities')
export class Security {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  ticker: string;

  @Column()
  companyName: string;

  @Column({ nullable: true })
  isin: string;

  @Column({
    type: 'enum',
    enum: SecurityType,
    default: SecurityType.EQUITY,
  })
  type: SecurityType;

  @Column({
    type: 'enum',
    enum: SecurityStatus,
    default: SecurityStatus.ACTIVE,
  })
  status: SecurityStatus;

  @Column({ nullable: true })
  sector: string;

  @Column({ type: 'decimal', precision: 15, scale: 4 })
  currentPrice: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  openPrice: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  highPrice: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  lowPrice: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  previousClose: number;

  @Column({ type: 'bigint', default: 0 })
  volume: number;

  @Column({ type: 'bigint', nullable: true })
  sharesOutstanding: number;

  @Column({ type: 'decimal', precision: 20, scale: 2, nullable: true })
  marketCap: number;

  @Column({ type: 'decimal', precision: 8, scale: 4, nullable: true })
  dividendYield: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ default: 'RWF' })
  currency: string;

  @Column({ default: false })
  isCrossListed: boolean;

  @Column({ nullable: true })
  primaryExchange: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
