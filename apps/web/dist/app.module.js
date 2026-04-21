"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const api_module_1 = require("./common/api.module");
const auth_middleware_1 = require("./common/auth.middleware");
const home_module_1 = require("./modules/home/home.module");
const auth_module_1 = require("./modules/auth/auth.module");
const market_module_1 = require("./modules/market/market.module");
const brokers_module_1 = require("./modules/brokers/brokers.module");
const portfolio_module_1 = require("./modules/portfolio/portfolio.module");
const orders_module_1 = require("./modules/orders/orders.module");
const securities_module_1 = require("./modules/securities/securities.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(auth_middleware_1.AuthMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            api_module_1.ApiModule,
            home_module_1.HomeModule,
            auth_module_1.AuthModule,
            market_module_1.MarketModule,
            brokers_module_1.BrokersModule,
            portfolio_module_1.PortfolioModule,
            orders_module_1.OrdersModule,
            securities_module_1.SecuritiesModule,
            dashboard_module_1.DashboardModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map