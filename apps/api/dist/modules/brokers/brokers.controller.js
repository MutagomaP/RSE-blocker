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
exports.BrokersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const brokers_service_1 = require("./brokers.service");
const guards_1 = require("../auth/guards");
const user_entity_1 = require("../users/user.entity");
const broker_entity_1 = require("./broker.entity");
let BrokersController = class BrokersController {
    constructor(brokersService) {
        this.brokersService = brokersService;
    }
    findAll(status) {
        return this.brokersService.findAll(status);
    }
    getMyProfile(req) {
        return this.brokersService.findByUserId(req.user.id);
    }
    findOne(id) {
        return this.brokersService.findOne(id);
    }
    create(req, dto) {
        return this.brokersService.create(req.user.id, dto);
    }
    update(req, dto) {
        return this.brokersService.findByUserId(req.user.id).then(b => this.brokersService.update(b.id, dto));
    }
    approve(id) {
        return this.brokersService.approve(id);
    }
    suspend(id) {
        return this.brokersService.suspend(id);
    }
};
exports.BrokersController = BrokersController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all licensed brokers' }),
    (0, swagger_1.ApiQuery)({ name: 'status', enum: broker_entity_1.BrokerStatus, required: false }),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BrokersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-profile'),
    (0, guards_1.Roles)(user_entity_1.UserRole.BROKER),
    (0, swagger_1.ApiOperation)({ summary: 'Get my broker profile' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BrokersController.prototype, "getMyProfile", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get broker by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BrokersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, guards_1.Roles)(user_entity_1.UserRole.BROKER),
    (0, swagger_1.ApiOperation)({ summary: 'Create broker profile' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, brokers_service_1.CreateBrokerProfileDto]),
    __metadata("design:returntype", void 0)
], BrokersController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)('my-profile'),
    (0, guards_1.Roles)(user_entity_1.UserRole.BROKER),
    (0, swagger_1.ApiOperation)({ summary: 'Update my broker profile' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], BrokersController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, guards_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Approve broker license (admin only)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BrokersController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/suspend'),
    (0, guards_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Suspend broker (admin only)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BrokersController.prototype, "suspend", null);
exports.BrokersController = BrokersController = __decorate([
    (0, swagger_1.ApiTags)('brokers'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, common_1.Controller)('brokers'),
    __metadata("design:paramtypes", [brokers_service_1.BrokersService])
], BrokersController);
//# sourceMappingURL=brokers.controller.js.map