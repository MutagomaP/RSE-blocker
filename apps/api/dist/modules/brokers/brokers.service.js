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
exports.BrokersService = exports.CreateBrokerProfileDto = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const broker_entity_1 = require("./broker.entity");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateBrokerProfileDto {
}
exports.CreateBrokerProfileDto = CreateBrokerProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBrokerProfileDto.prototype, "firmName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBrokerProfileDto.prototype, "licenseNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBrokerProfileDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBrokerProfileDto.prototype, "website", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBrokerProfileDto.prototype, "officeAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBrokerProfileDto.prototype, "district", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateBrokerProfileDto.prototype, "commissionRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateBrokerProfileDto.prototype, "specializations", void 0);
let BrokersService = class BrokersService {
    constructor(repo) {
        this.repo = repo;
    }
    findAll(status) {
        const where = status ? { status } : {};
        return this.repo.find({
            where,
            relations: ['user'],
            order: { totalTrades: 'DESC' },
        });
    }
    async findOne(id) {
        const broker = await this.repo.findOne({ where: { id }, relations: ['user'] });
        if (!broker)
            throw new common_1.NotFoundException('Broker not found');
        return broker;
    }
    async findByUserId(userId) {
        return this.repo.findOne({ where: { userId }, relations: ['user'] });
    }
    async create(userId, dto) {
        const broker = this.repo.create({ ...dto, userId, status: broker_entity_1.BrokerStatus.PENDING });
        return this.repo.save(broker);
    }
    async update(id, dto) {
        await this.repo.update(id, dto);
        return this.findOne(id);
    }
    async approve(id) {
        const result = await this.repo.update(id, { status: broker_entity_1.BrokerStatus.LICENSED });
        if (!result.affected)
            throw new common_1.NotFoundException('Broker not found');
        return { message: 'Broker approved' };
    }
    async suspend(id) {
        const result = await this.repo.update(id, { status: broker_entity_1.BrokerStatus.SUSPENDED });
        if (!result.affected)
            throw new common_1.NotFoundException('Broker not found');
        return { message: 'Broker suspended' };
    }
};
exports.BrokersService = BrokersService;
exports.BrokersService = BrokersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(broker_entity_1.Broker)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BrokersService);
//# sourceMappingURL=brokers.service.js.map