import { Module, MiddlewareConsumer, NestModule, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiService } from './common/api.service';
import { AuthMiddleware } from './common/auth.middleware';
import { HomeModule } from './modules/home/home.module';
import { AuthModule } from './modules/auth/auth.module';
import { MarketModule } from './modules/market/market.module';
import { BrokersModule } from './modules/brokers/brokers.module';
import { PortfolioModule } from './modules/portfolio/portfolio.module';
import { OrdersModule } from './modules/orders/orders.module';
import { SecuritiesModule } from './modules/securities/securities.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HomeModule,
    AuthModule,
    MarketModule,
    BrokersModule,
    PortfolioModule,
    OrdersModule,
    SecuritiesModule,
    DashboardModule,
  ],
  providers: [ApiService],
  exports: [ApiService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
