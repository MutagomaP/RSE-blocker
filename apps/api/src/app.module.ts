import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BrokersModule } from './modules/brokers/brokers.module';
import { SecuritiesModule } from './modules/securities/securities.module';
import { OrdersModule } from './modules/orders/orders.module';
import { TradesModule } from './modules/trades/trades.module';
import { PortfolioModule } from './modules/portfolio/portfolio.module';
import { MarketModule } from './modules/market/market.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get('DB_USER', 'postgres'),
        password: configService.get('DB_PASS', 'password'),
        database: configService.get('DB_NAME', 'rse_platform'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    BrokersModule,
    SecuritiesModule,
    OrdersModule,
    TradesModule,
    PortfolioModule,
    MarketModule,
  ],
})
export class AppModule {}
