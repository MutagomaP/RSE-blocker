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
exports.SecuritiesService = exports.CreateSecurityDto = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const security_entity_1 = require("./security.entity");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateSecurityDto {
}
exports.CreateSecurityDto = CreateSecurityDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSecurityDto.prototype, "ticker", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSecurityDto.prototype, "companyName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSecurityDto.prototype, "isin", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: security_entity_1.SecurityType }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(security_entity_1.SecurityType),
    __metadata("design:type", String)
], CreateSecurityDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSecurityDto.prototype, "sector", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateSecurityDto.prototype, "currentPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateSecurityDto.prototype, "sharesOutstanding", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSecurityDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateSecurityDto.prototype, "isCrossListed", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSecurityDto.prototype, "primaryExchange", void 0);
let SecuritiesService = class SecuritiesService {
    constructor(repo) {
        this.repo = repo;
    }
    findAll(search, type) {
        const where = { status: security_entity_1.SecurityStatus.ACTIVE };
        if (type)
            where.type = type;
        if (search) {
            return this.repo.find({
                where: [
                    { ...where, ticker: (0, typeorm_2.Like)(`%${search.toUpperCase()}%`) },
                    { ...where, companyName: (0, typeorm_2.Like)(`%${search}%`) },
                ],
                order: { marketCap: 'DESC' },
            });
        }
        return this.repo.find({ where, order: { marketCap: 'DESC' } });
    }
    async findOne(id) {
        const sec = await this.repo.findOne({ where: { id } });
        if (!sec)
            throw new common_1.NotFoundException('Security not found');
        return sec;
    }
    async findByTicker(ticker) {
        const sec = await this.repo.findOne({ where: { ticker: ticker.toUpperCase() } });
        if (!sec)
            throw new common_1.NotFoundException(`Security ${ticker} not found`);
        return sec;
    }
    async create(dto) {
        const security = this.repo.create({ ...dto, ticker: dto.ticker.toUpperCase() });
        return this.repo.save(security);
    }
    async updatePrice(id, price) {
        const sec = await this.findOne(id);
        await this.repo.update(id, {
            previousClose: sec.currentPrice,
            currentPrice: price,
        });
        return this.findOne(id);
    }
    async getMarketSummary() {
        const securities = await this.repo.find({ where: { status: security_entity_1.SecurityStatus.ACTIVE } });
        const totalMarketCap = securities.reduce((s, sec) => s + Number(sec.marketCap || 0), 0);
        const gainers = securities
            .filter(s => s.currentPrice > s.previousClose)
            .sort((a, b) => {
            const pctA = (a.currentPrice - a.previousClose) / a.previousClose;
            const pctB = (b.currentPrice - b.previousClose) / b.previousClose;
            return pctB - pctA;
        })
            .slice(0, 5);
        const losers = securities
            .filter(s => s.currentPrice < s.previousClose)
            .sort((a, b) => {
            const pctA = (a.currentPrice - a.previousClose) / a.previousClose;
            const pctB = (b.currentPrice - b.previousClose) / b.previousClose;
            return pctA - pctB;
        })
            .slice(0, 5);
        return { totalListings: securities.length, totalMarketCap, gainers, losers };
    }
};
exports.SecuritiesService = SecuritiesService;
exports.SecuritiesService = SecuritiesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(security_entity_1.Security)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SecuritiesService);
//# sourceMappingURL=securities.service.js.map