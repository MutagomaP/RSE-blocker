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
exports.SecuritiesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const securities_service_1 = require("./securities.service");
const guards_1 = require("../auth/guards");
const user_entity_1 = require("../users/user.entity");
const security_entity_1 = require("./security.entity");
let SecuritiesController = class SecuritiesController {
    constructor(securitiesService) {
        this.securitiesService = securitiesService;
    }
    findAll(search, type) {
        return this.securitiesService.findAll(search, type);
    }
    getMarketSummary() {
        return this.securitiesService.getMarketSummary();
    }
    findByTicker(ticker) {
        return this.securitiesService.findByTicker(ticker);
    }
    findOne(id) {
        return this.securitiesService.findOne(id);
    }
    create(dto) {
        return this.securitiesService.create(dto);
    }
    updatePrice(id, price) {
        return this.securitiesService.updatePrice(id, price);
    }
};
exports.SecuritiesController = SecuritiesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all active securities' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'type', enum: security_entity_1.SecurityType, required: false }),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SecuritiesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('market-summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get RSE market summary and top movers' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SecuritiesController.prototype, "getMarketSummary", null);
__decorate([
    (0, common_1.Get)('ticker/:ticker'),
    (0, swagger_1.ApiOperation)({ summary: 'Get security by ticker symbol' }),
    __param(0, (0, common_1.Param)('ticker')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SecuritiesController.prototype, "findByTicker", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get security by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SecuritiesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, guards_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'List a new security (admin only)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [securities_service_1.CreateSecurityDto]),
    __metadata("design:returntype", void 0)
], SecuritiesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/price'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, guards_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update security price (admin only)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('price')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], SecuritiesController.prototype, "updatePrice", null);
exports.SecuritiesController = SecuritiesController = __decorate([
    (0, swagger_1.ApiTags)('securities'),
    (0, common_1.Controller)('securities'),
    __metadata("design:paramtypes", [securities_service_1.SecuritiesService])
], SecuritiesController);
//# sourceMappingURL=securities.controller.js.map