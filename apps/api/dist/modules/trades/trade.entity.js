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
exports.Trade = exports.TradeStatus = void 0;
const typeorm_1 = require("typeorm");
const order_entity_1 = require("../orders/order.entity");
const security_entity_1 = require("../securities/security.entity");
const user_entity_1 = require("../users/user.entity");
const broker_entity_1 = require("../brokers/broker.entity");
var TradeStatus;
(function (TradeStatus) {
    TradeStatus["EXECUTED"] = "executed";
    TradeStatus["SETTLED"] = "settled";
    TradeStatus["FAILED"] = "failed";
})(TradeStatus || (exports.TradeStatus = TradeStatus = {}));
let Trade = class Trade {
};
exports.Trade = Trade;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Trade.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Trade.prototype, "tradeReference", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_entity_1.Order),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", order_entity_1.Order)
], Trade.prototype, "buyOrder", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Trade.prototype, "buyOrderId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_entity_1.Order),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", order_entity_1.Order)
], Trade.prototype, "sellOrder", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Trade.prototype, "sellOrderId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => security_entity_1.Security),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", security_entity_1.Security)
], Trade.prototype, "security", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Trade.prototype, "securityId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.User)
], Trade.prototype, "buyer", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Trade.prototype, "buyerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.User)
], Trade.prototype, "seller", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Trade.prototype, "sellerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => broker_entity_1.Broker, { nullable: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", broker_entity_1.Broker)
], Trade.prototype, "buyerBroker", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Trade.prototype, "buyerBrokerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => broker_entity_1.Broker, { nullable: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", broker_entity_1.Broker)
], Trade.prototype, "sellerBroker", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Trade.prototype, "sellerBrokerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Trade.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 4 }),
    __metadata("design:type", Number)
], Trade.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], Trade.prototype, "totalValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Trade.prototype, "buyerCommission", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Trade.prototype, "sellerCommission", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TradeStatus,
        default: TradeStatus.EXECUTED,
    }),
    __metadata("design:type", String)
], Trade.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Trade.prototype, "settlementDate", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Trade.prototype, "executedAt", void 0);
exports.Trade = Trade = __decorate([
    (0, typeorm_1.Entity)('trades')
], Trade);
//# sourceMappingURL=trade.entity.js.map