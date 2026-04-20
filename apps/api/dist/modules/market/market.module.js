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
exports.MarketModule = exports.MarketController = exports.MarketService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const security_entity_1 = require("../securities/security.entity");
const trade_entity_1 = require("../trades/trade.entity");
const common_2 = require("@nestjs/common");
const typeorm_2 = require("@nestjs/typeorm");
const typeorm_3 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const security_entity_2 = require("../securities/security.entity");
let MarketService = class MarketService {
    constructor(securityRepo, tradeRepo) {
        this.securityRepo = securityRepo;
        this.tradeRepo = tradeRepo;
    }
    async getMarketOverview() {
        const securities = await this.securityRepo.find({ where: { status: security_entity_2.SecurityStatus.ACTIVE } });
        const totalMarketCap = securities.reduce((s, sec) => s + Number(sec.marketCap || 0), 0);
        const totalVolume = securities.reduce((s, sec) => s + Number(sec.volume || 0), 0);
        const advancers = securities.filter(s => Number(s.currentPrice) > Number(s.previousClose)).length;
        const decliners = securities.filter(s => Number(s.currentPrice) < Number(s.previousClose)).length;
        const unchanged = securities.length - advancers - decliners;
        const gainers = securities
            .filter(s => s.previousClose && Number(s.previousClose) > 0)
            .map(s => ({
            ...s,
            change: Number(s.currentPrice) - Number(s.previousClose),
            changePct: ((Number(s.currentPrice) - Number(s.previousClose)) / Number(s.previousClose)) * 100,
        }))
            .sort((a, b) => b.changePct - a.changePct)
            .slice(0, 5);
        const losers = [...gainers].sort((a, b) => a.changePct - b.changePct).slice(0, 5);
        const recentTrades = await this.tradeRepo.find({
            relations: ['security'],
            order: { executedAt: 'DESC' },
            take: 10,
        });
        const rsiChange = securities.length > 0
            ? securities.reduce((s, sec) => {
                if (!sec.previousClose || Number(sec.previousClose) === 0)
                    return s;
                return s + ((Number(sec.currentPrice) - Number(sec.previousClose)) / Number(sec.previousClose)) * 100;
            }, 0) / securities.length
            : 0;
        return {
            indices: {
                RSI: { value: 147.92, change: rsiChange.toFixed(2), currency: 'RWF' },
                ALSI: { value: 182.26, change: (rsiChange * 0.9).toFixed(2), currency: 'RWF' },
                EAE20: { value: 99.55, change: (rsiChange * 0.5).toFixed(2), currency: 'RWF' },
            },
            breadth: { advancers, decliners, unchanged, total: securities.length },
            totalMarketCap,
            totalVolume,
            gainers: gainers.slice(0, 5),
            losers: losers.slice(0, 5),
            recentTrades,
            tradingHours: { open: '09:00', close: '12:00', timezone: 'Africa/Kigali', currency: 'RWF' },
            settlementCycle: 'T+2',
        };
    }
    async getPriceHistory(securityId) {
        const security = await this.securityRepo.findOne({ where: { id: securityId } });
        if (!security)
            return [];
        const base = Number(security.currentPrice);
        return Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
            close: +(base * (0.9 + Math.random() * 0.2)).toFixed(4),
            volume: Math.floor(Math.random() * 50000),
        }));
    }
};
exports.MarketService = MarketService;
exports.MarketService = MarketService = __decorate([
    (0, common_2.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(security_entity_1.Security)),
    __param(1, (0, typeorm_2.InjectRepository)(trade_entity_1.Trade)),
    __metadata("design:paramtypes", [typeorm_3.Repository,
        typeorm_3.Repository])
], MarketService);
let MarketController = class MarketController {
    constructor(marketService) {
        this.marketService = marketService;
    }
    getOverview() {
        return this.marketService.getMarketOverview();
    }
    getPriceHistory(securityId) {
        return this.marketService.getPriceHistory(securityId);
    }
};
exports.MarketController = MarketController;
__decorate([
    (0, common_2.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get RSE market overview — indices, breadth, top movers' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MarketController.prototype, "getOverview", null);
__decorate([
    (0, common_2.Get)('price-history/:securityId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get 30-day price history for a security' }),
    __param(0, Param('securityId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MarketController.prototype, "getPriceHistory", null);
exports.MarketController = MarketController = __decorate([
    (0, swagger_1.ApiTags)('market'),
    (0, common_2.Controller)('market'),
    __metadata("design:paramtypes", [MarketService])
], MarketController);
function Param(s) {
    const { Param: P } = require('@nestjs/common');
    return P(s);
}
let MarketModule = class MarketModule {
};
exports.MarketModule = MarketModule;
exports.MarketModule = MarketModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([security_entity_1.Security, trade_entity_1.Trade])],
        providers: [MarketService],
        controllers: [MarketController],
        exports: [MarketService],
    })
], MarketModule);
//# sourceMappingURL=market.module.js.map