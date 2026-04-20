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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Security = exports.SecurityStatus = exports.SecurityType = void 0;
const typeorm_1 = require("typeorm");
var SecurityType;
(function (SecurityType) {
    SecurityType["EQUITY"] = "equity";
    SecurityType["BOND"] = "bond";
    SecurityType["ETF"] = "etf";
    SecurityType["PREFERENCE_SHARE"] = "preference_share";
})(SecurityType || (exports.SecurityType = SecurityType = {}));
var SecurityStatus;
(function (SecurityStatus) {
    SecurityStatus["ACTIVE"] = "active";
    SecurityStatus["SUSPENDED"] = "suspended";
    SecurityStatus["DELISTED"] = "delisted";
})(SecurityStatus || (exports.SecurityStatus = SecurityStatus = {}));
let Security = class Security {
};
exports.Security = Security;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Security.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Security.prototype, "ticker", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Security.prototype, "companyName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Security.prototype, "isin", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: SecurityType,
        default: SecurityType.EQUITY,
    }),
    __metadata("design:type", String)
], Security.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: SecurityStatus,
        default: SecurityStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], Security.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Security.prototype, "sector", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 4 }),
    __metadata("design:type", Number)
], Security.prototype, "currentPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 4, nullable: true }),
    __metadata("design:type", Number)
], Security.prototype, "openPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 4, nullable: true }),
    __metadata("design:type", Number)
], Security.prototype, "highPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 4, nullable: true }),
    __metadata("design:type", Number)
], Security.prototype, "lowPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 4, nullable: true }),
    __metadata("design:type", Number)
], Security.prototype, "previousClose", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', default: 0 }),
    __metadata("design:type", Number)
], Security.prototype, "volume", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], Security.prototype, "sharesOutstanding", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 20, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Security.prototype, "marketCap", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 8, scale: 4, nullable: true }),
    __metadata("design:type", Number)
], Security.prototype, "dividendYield", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Security.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Security.prototype, "logoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'RWF' }),
    __metadata("design:type", String)
], Security.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Security.prototype, "isCrossListed", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Security.prototype, "primaryExchange", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Security.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Security.prototype, "updatedAt", void 0);
exports.Security = Security = __decorate([
    (0, typeorm_1.Entity)('securities')
], Security);
//# sourceMappingURL=security.entity.js.map