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
exports.TradesModule = exports.TradesController = exports.TradesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const trade_entity_1 = require("./trade.entity");
const common_2 = require("@nestjs/common");
const typeorm_2 = require("@nestjs/typeorm");
const typeorm_3 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const guards_1 = require("../auth/guards");
const user_entity_1 = require("../users/user.entity");
let TradesService = class TradesService {
    constructor(repo) {
        this.repo = repo;
    }
    getMyTrades(userId) {
        return this.repo.find({
            where: [{ buyerId: userId }, { sellerId: userId }],
            relations: ['security', 'buyerBroker', 'sellerBroker'],
            order: { executedAt: 'DESC' },
        });
    }
    getAllTrades(limit = 50) {
        return this.repo.find({
            relations: ['security', 'buyer', 'seller'],
            order: { executedAt: 'DESC' },
            take: limit,
        });
    }
    getTrade(id) {
        return this.repo.findOne({
            where: { id },
            relations: ['security', 'buyer', 'seller', 'buyerBroker', 'sellerBroker'],
        });
    }
};
exports.TradesService = TradesService;
exports.TradesService = TradesService = __decorate([
    (0, common_2.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(trade_entity_1.Trade)),
    __metadata("design:paramtypes", [typeorm_3.Repository])
], TradesService);
let TradesController = class TradesController {
    constructor(tradesService) {
        this.tradesService = tradesService;
    }
    getMyTrades(req) {
        return this.tradesService.getMyTrades(req.user.id);
    }
    getAllTrades(limit) {
        return this.tradesService.getAllTrades(limit);
    }
    getTrade(id) {
        return this.tradesService.getTrade(id);
    }
};
exports.TradesController = TradesController;
__decorate([
    (0, common_2.Get)('my-trades'),
    (0, swagger_1.ApiOperation)({ summary: 'Get my trade history' }),
    __param(0, (0, common_2.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "getMyTrades", null);
__decorate([
    (0, common_2.Get)(),
    (0, common_2.UseGuards)(guards_1.RolesGuard),
    (0, guards_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.BROKER),
    (0, swagger_1.ApiOperation)({ summary: 'Get all trades (admin/broker)' }),
    __param(0, (0, common_2.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "getAllTrades", null);
__decorate([
    (0, common_2.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get trade by ID' }),
    __param(0, (0, common_2.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "getTrade", null);
exports.TradesController = TradesController = __decorate([
    (0, swagger_1.ApiTags)('trades'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_2.UseGuards)(guards_1.JwtAuthGuard),
    (0, common_2.Controller)('trades'),
    __metadata("design:paramtypes", [TradesService])
], TradesController);
let TradesModule = class TradesModule {
};
exports.TradesModule = TradesModule;
exports.TradesModule = TradesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([trade_entity_1.Trade])],
        providers: [TradesService],
        controllers: [TradesController],
        exports: [TradesService],
    })
], TradesModule);
//# sourceMappingURL=trades.module.js.map