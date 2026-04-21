import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiModule } from './common/api.module';
import { AuthMiddleware } from './common/auth.middleware';
import { HomeModule } from './modules/home/home.module';
import { AuthModule } from './modules/auth/auth.module';
import { MarketModule } from './modules/market/market.module';
import { BrokersModule } from './modules/brokers/brokers.module';
import { PortfolioModule } from './modules/portfolio/portfolio.module';
import { OrdersModule } from './modules/orders/orders.module';
import { SecuritiesModule } from './modules/securities/securities.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ApiModule,
    HomeModule,
    AuthModule,
    MarketModule,
    BrokersModule,
    PortfolioModule,
    OrdersModule,
    SecuritiesModule,
    DashboardModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
