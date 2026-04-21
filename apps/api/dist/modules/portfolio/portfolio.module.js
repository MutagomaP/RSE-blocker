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
exports.PortfolioModule = exports.PortfolioController = exports.PortfolioService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const portfolio_entity_1 = require("./portfolio.entity");
const security_entity_1 = require("../securities/security.entity");
const common_2 = require("@nestjs/common");
const typeorm_2 = require("@nestjs/typeorm");
const typeorm_3 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const guards_1 = require("../auth/guards");
let PortfolioService = class PortfolioService {
    constructor(portfolioRepo, securityRepo) {
        this.portfolioRepo = portfolioRepo;
        this.securityRepo = securityRepo;
    }
    async getPortfolio(investorId) {
        const holdings = await this.portfolioRepo.find({
            where: { investorId },
            relations: ['security'],
        });
        let totalValue = 0;
        let totalCost = 0;
        const enriched = holdings.map(h => {
            const currentValue = h.quantity * Number(h.security.currentPrice);
            const unrealizedPnl = currentValue - Number(h.totalCost);
            const unrealizedPnlPercent = Number(h.totalCost) > 0
                ? (unrealizedPnl / Number(h.totalCost)) * 100
                : 0;
            totalValue += currentValue;
            totalCost += Number(h.totalCost);
            return { ...h, currentValue, unrealizedPnl, unrealizedPnlPercent };
        });
        return {
            holdings: enriched,
            summary: {
                totalValue,
                totalCost,
                totalUnrealizedPnl: totalValue - totalCost,
                totalUnrealizedPnlPercent: totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0,
                holdingsCount: holdings.length,
            },
        };
    }
};
exports.PortfolioService = PortfolioService;
exports.PortfolioService = PortfolioService = __decorate([
    (0, common_2.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(portfolio_entity_1.Portfolio)),
    __param(1, (0, typeorm_2.InjectRepository)(security_entity_1.Security)),
    __metadata("design:paramtypes", [typeorm_3.Repository,
        typeorm_3.Repository])
], PortfolioService);
let PortfolioController = class PortfolioController {
    constructor(portfolioService) {
        this.portfolioService = portfolioService;
    }
    getPortfolio(req) {
        return this.portfolioService.getPortfolio(req.user.id);
    }
};
exports.PortfolioController = PortfolioController;
__decorate([
    (0, common_2.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get my investment portfolio with P&L' }),
    __param(0, (0, common_2.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PortfolioController.prototype, "getPortfolio", null);
exports.PortfolioController = PortfolioController = __decorate([
    (0, swagger_1.ApiTags)('portfolio'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_2.UseGuards)(guards_1.JwtAuthGuard),
    (0, common_2.Controller)('portfolio'),
    __metadata("design:paramtypes", [PortfolioService])
], PortfolioController);
let PortfolioModule = class PortfolioModule {
};
exports.PortfolioModule = PortfolioModule;
exports.PortfolioModule = PortfolioModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([portfolio_entity_1.Portfolio, security_entity_1.Security])],
        providers: [PortfolioService],
        controllers: [PortfolioController],
        exports: [PortfolioService],
    })
], PortfolioModule);
//# sourceMappingURL=portfolio.module.js.map