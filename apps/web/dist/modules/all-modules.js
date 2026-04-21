"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardModule = exports.DashboardController = exports.OrdersModule = exports.OrdersController = exports.PortfolioModule = exports.PortfolioController = exports.BrokersModule = exports.BrokersController = exports.SecuritiesModule = exports.SecuritiesController = exports.MarketModule = exports.MarketController = void 0;
const common_1 = require("@nestjs/common");
const api_service_1 = require("../common/api.service");
const web_auth_guard_1 = require("../common/web-auth.guard");
let MarketController = class MarketController {
    constructor(apiService) {
        this.apiService = apiService;
    }
    async index(res) {
        try {
            const [market, securities] = await Promise.all([
                this.apiService.getMarketOverview(),
                this.apiService.getSecurities(),
            ]);
            return res.render('market/index', { title: 'Market — RSE', market, securities, page: 'market' });
        }
        catch {
            return res.render('market/index', { title: 'Market — RSE', market: null, securities: [], page: 'market' });
        }
    }
};
exports.MarketController = MarketController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MarketController.prototype, "index", null);
exports.MarketController = MarketController = __decorate([
    (0, common_1.Controller)('market'),
    __metadata("design:paramtypes", [api_service_1.ApiService])
], MarketController);
let MarketModule = class MarketModule {
};
exports.MarketModule = MarketModule;
exports.MarketModule = MarketModule = __decorate([
    (0, common_1.Module)({ controllers: [MarketController] })
], MarketModule);
let SecuritiesController = class SecuritiesController {
    constructor(apiService) {
        this.apiService = apiService;
    }
    async index(search, type, res) {
        const securities = await this.apiService.getSecurities(search, type).catch(() => []);
        return res.render('securities/index', { title: 'Listed Securities — RSE', securities, search, type, page: 'securities' });
    }
    async detail(id, res) {
        try {
            const [security, history] = await Promise.all([
                this.apiService.getSecurity(id),
                this.apiService.getPriceHistory(id),
            ]);
            return res.render('securities/detail', {
                title: `${security.ticker} — RSE`,
                security,
                history: JSON.stringify(history),
                page: 'securities',
            });
        }
        catch {
            return res.redirect('/securities?error=not_found');
        }
    }
};
exports.SecuritiesController = SecuritiesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], SecuritiesController.prototype, "index", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SecuritiesController.prototype, "detail", null);
exports.SecuritiesController = SecuritiesController = __decorate([
    (0, common_1.Controller)('securities'),
    __metadata("design:paramtypes", [api_service_1.ApiService])
], SecuritiesController);
let SecuritiesModule = class SecuritiesModule {
};
exports.SecuritiesModule = SecuritiesModule;
exports.SecuritiesModule = SecuritiesModule = __decorate([
    (0, common_1.Module)({ controllers: [SecuritiesController] })
], SecuritiesModule);
let BrokersController = class BrokersController {
    constructor(apiService) {
        this.apiService = apiService;
    }
    async index(res) {
        const brokers = await this.apiService.getBrokers('licensed').catch(() => []);
        return res.render('brokers/index', { title: 'Licensed Brokers — RSE', brokers, page: 'brokers' });
    }
    async detail(id, res) {
        try {
            const broker = await this.apiService.getBroker(id);
            return res.render('brokers/detail', { title: `${broker.firmName} — RSE`, broker, page: 'brokers' });
        }
        catch {
            return res.redirect('/brokers');
        }
    }
};
exports.BrokersController = BrokersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BrokersController.prototype, "index", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BrokersController.prototype, "detail", null);
exports.BrokersController = BrokersController = __decorate([
    (0, common_1.Controller)('brokers'),
    __metadata("design:paramtypes", [api_service_1.ApiService])
], BrokersController);
let BrokersModule = class BrokersModule {
};
exports.BrokersModule = BrokersModule;
exports.BrokersModule = BrokersModule = __decorate([
    (0, common_1.Module)({ controllers: [BrokersController] })
], BrokersModule);
let PortfolioController = class PortfolioController {
    constructor(apiService) {
        this.apiService = apiService;
    }
    async index(req, res) {
        try {
            const [portfolio, trades] = await Promise.all([
                this.apiService.getPortfolio(req.token),
                this.apiService.getMyTrades(req.token),
            ]);
            return res.render('portfolio/index', { title: 'My Portfolio — RSE', portfolio, trades, page: 'portfolio' });
        }
        catch {
            return res.render('portfolio/index', { title: 'My Portfolio — RSE', portfolio: null, trades: [], page: 'portfolio' });
        }
    }
};
exports.PortfolioController = PortfolioController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(web_auth_guard_1.WebAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PortfolioController.prototype, "index", null);
exports.PortfolioController = PortfolioController = __decorate([
    (0, common_1.Controller)('portfolio'),
    __metadata("design:paramtypes", [api_service_1.ApiService])
], PortfolioController);
let PortfolioModule = class PortfolioModule {
};
exports.PortfolioModule = PortfolioModule;
exports.PortfolioModule = PortfolioModule = __decorate([
    (0, common_1.Module)({ controllers: [PortfolioController] })
], PortfolioModule);
let OrdersController = class OrdersController {
    constructor(apiService) {
        this.apiService = apiService;
    }
    async index(req, res, status, side) {
        const role = req.user?.role;
        const isAdminOrBroker = role === 'admin' || role === 'broker';
        try {
            const [myOrders, allOrders, securities] = await Promise.all([
                this.apiService.getMyOrders(req.token).catch(() => []),
                isAdminOrBroker ? this.apiService.getAllOrders(req.token, status, side).catch(() => []) : Promise.resolve([]),
                this.apiService.getSecurities().catch(() => []),
            ]);
            return res.render('orders/index', {
                title: 'Orders — RSE',
                myOrders, allOrders, isAdminOrBroker,
                isAdmin: role === 'admin',
                isBroker: role === 'broker',
                securities: JSON.stringify(securities),
                page: 'orders', status, side,
            });
        }
        catch {
            return res.render('orders/index', {
                title: 'Orders — RSE',
                myOrders: [], allOrders: [], isAdminOrBroker, securities: '[]', page: 'orders',
            });
        }
    }
    async placeOrder(req, body, res) {
        try {
            const payload = {
                securityId: body.securityId,
                side: body.side,
                type: body.type || 'market',
                quantity: Number(body.quantity),
            };
            if (body.limitPrice)
                payload.limitPrice = Number(body.limitPrice);
            if (body.brokerId)
                payload.brokerId = body.brokerId;
            if (body.notes)
                payload.notes = body.notes;
            await this.apiService.placeOrder(req.token, payload);
            return res.redirect('/orders?success=Order+placed+successfully');
        }
        catch (err) {
            const msg = err?.response?.data?.message || 'Failed to place order';
            return res.redirect(`/orders?error=${encodeURIComponent(Array.isArray(msg) ? msg.join(', ') : msg)}`);
        }
    }
    async cancelOrder(id, req, res) {
        try {
            await this.apiService.cancelOrder(req.token, id);
            return res.redirect('/orders?success=Order+cancelled');
        }
        catch {
            return res.redirect('/orders?error=Failed+to+cancel+order');
        }
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(web_auth_guard_1.WebAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('side')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "index", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(web_auth_guard_1.WebAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "placeOrder", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, common_1.UseGuards)(web_auth_guard_1.WebAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "cancelOrder", null);
exports.OrdersController = OrdersController = __decorate([
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [api_service_1.ApiService])
], OrdersController);
let OrdersModule = class OrdersModule {
};
exports.OrdersModule = OrdersModule;
exports.OrdersModule = OrdersModule = __decorate([
    (0, common_1.Module)({ controllers: [OrdersController] })
], OrdersModule);
let DashboardController = class DashboardController {
    constructor(apiService) {
        this.apiService = apiService;
    }
    async index(req, res) {
        const role = req.user?.role;
        const isAdminOrBroker = role === 'admin' || role === 'broker';
        try {
            const [portfolio, myOrders, market, allOrders, allTrades] = await Promise.all([
                this.apiService.getPortfolio(req.token).catch(() => null),
                this.apiService.getMyOrders(req.token).catch(() => []),
                this.apiService.getMarketOverview().catch(() => null),
                isAdminOrBroker ? this.apiService.getAllOrders(req.token).catch(() => []) : Promise.resolve([]),
                isAdminOrBroker ? this.apiService.getAllTrades(req.token).catch(() => []) : Promise.resolve([]),
            ]);
            return res.render('dashboard/index', {
                title: 'Dashboard — RSE',
                portfolio,
                myOrders: myOrders.slice(0, 5),
                allOrders: allOrders.slice(0, 10),
                allTrades: allTrades.slice(0, 10),
                market, isAdminOrBroker,
                isAdmin: role === 'admin',
                isBroker: role === 'broker',
                page: 'dashboard',
            });
        }
        catch {
            return res.render('dashboard/index', {
                title: 'Dashboard — RSE',
                portfolio: null, myOrders: [], allOrders: [], allTrades: [],
                market: null, isAdminOrBroker, page: 'dashboard',
            });
        }
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(web_auth_guard_1.WebAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "index", null);
exports.DashboardController = DashboardController = __decorate([
    (0, common_1.Controller)('dashboard'),
    __metadata("design:paramtypes", [api_service_1.ApiService])
], DashboardController);
let DashboardModule = class DashboardModule {
};
exports.DashboardModule = DashboardModule;
exports.DashboardModule = DashboardModule = __decorate([
    (0, common_1.Module)({ controllers: [DashboardController] })
], DashboardModule);
//# sourceMappingURL=all-modules.js.map