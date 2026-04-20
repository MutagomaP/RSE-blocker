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
exports.OrdersService = exports.PlaceOrderDto = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./order.entity");
const trade_entity_1 = require("../trades/trade.entity");
const portfolio_entity_1 = require("../portfolio/portfolio.entity");
const security_entity_1 = require("../securities/security.entity");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class PlaceOrderDto {
}
exports.PlaceOrderDto = PlaceOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], PlaceOrderDto.prototype, "securityId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: order_entity_1.OrderSide }),
    (0, class_validator_1.IsEnum)(order_entity_1.OrderSide),
    __metadata("design:type", String)
], PlaceOrderDto.prototype, "side", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: order_entity_1.OrderType }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(order_entity_1.OrderType),
    __metadata("design:type", String)
], PlaceOrderDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], PlaceOrderDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PlaceOrderDto.prototype, "limitPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], PlaceOrderDto.prototype, "brokerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PlaceOrderDto.prototype, "notes", void 0);
let OrdersService = class OrdersService {
    constructor(orderRepo, tradeRepo, portfolioRepo, securityRepo, dataSource) {
        this.orderRepo = orderRepo;
        this.tradeRepo = tradeRepo;
        this.portfolioRepo = portfolioRepo;
        this.securityRepo = securityRepo;
        this.dataSource = dataSource;
    }
    async placeOrder(investorId, dto) {
        const security = await this.securityRepo.findOne({ where: { id: dto.securityId } });
        if (!security)
            throw new common_1.NotFoundException('Security not found');
        if (dto.type === order_entity_1.OrderType.MARKET || !dto.type) {
            dto.limitPrice = Number(security.currentPrice);
            dto.type = order_entity_1.OrderType.MARKET;
        }
        if (dto.side === order_entity_1.OrderSide.SELL) {
            const holding = await this.portfolioRepo.findOne({
                where: { investorId, securityId: dto.securityId },
            });
            if (!holding || holding.quantity < dto.quantity) {
                throw new common_1.BadRequestException('Insufficient shares to sell');
            }
        }
        const order = this.orderRepo.create({
            investorId,
            securityId: dto.securityId,
            brokerId: dto.brokerId,
            side: dto.side,
            type: dto.type || order_entity_1.OrderType.LIMIT,
            quantity: dto.quantity,
            limitPrice: dto.limitPrice,
            notes: dto.notes,
            status: order_entity_1.OrderStatus.PENDING,
        });
        await this.orderRepo.save(order);
        if (order.type === order_entity_1.OrderType.MARKET) {
            await this.matchOrder(order, security);
        }
        return this.orderRepo.findOne({ where: { id: order.id }, relations: ['security', 'broker'] });
    }
    async matchOrder(order, security) {
        const oppositeSide = order.side === order_entity_1.OrderSide.BUY ? order_entity_1.OrderSide.SELL : order_entity_1.OrderSide.BUY;
        const match = await this.orderRepo.findOne({
            where: {
                securityId: order.securityId,
                side: oppositeSide,
                status: order_entity_1.OrderStatus.PENDING,
                type: order_entity_1.OrderType.LIMIT,
            },
            order: { createdAt: 'ASC' },
        });
        if (!match) {
            return;
        }
        const executedPrice = Number(match.limitPrice || security.currentPrice);
        const totalValue = executedPrice * order.quantity;
        const commission = totalValue * 0.01;
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.update(order_entity_1.Order, order.id, {
                status: order_entity_1.OrderStatus.FILLED,
                filledQuantity: order.quantity,
                executedPrice,
                commission,
            });
            await queryRunner.manager.update(order_entity_1.Order, match.id, {
                status: order_entity_1.OrderStatus.FILLED,
                filledQuantity: match.quantity,
                executedPrice,
                commission,
            });
            const tradeRef = `RSE-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
            const buyOrderId = order.side === order_entity_1.OrderSide.BUY ? order.id : match.id;
            const sellOrderId = order.side === order_entity_1.OrderSide.SELL ? order.id : match.id;
            const buyerId = order.side === order_entity_1.OrderSide.BUY ? order.investorId : match.investorId;
            const sellerId = order.side === order_entity_1.OrderSide.SELL ? order.investorId : match.investorId;
            await queryRunner.manager.save(trade_entity_1.Trade, {
                tradeReference: tradeRef,
                buyOrderId,
                sellOrderId,
                securityId: order.securityId,
                buyerId,
                sellerId,
                buyerBrokerId: order.side === order_entity_1.OrderSide.BUY ? order.brokerId : match.brokerId,
                sellerBrokerId: order.side === order_entity_1.OrderSide.SELL ? order.brokerId : match.brokerId,
                quantity: order.quantity,
                price: executedPrice,
                totalValue,
                buyerCommission: commission,
                sellerCommission: commission,
                status: trade_entity_1.TradeStatus.EXECUTED,
                settlementDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            });
            await this.updatePortfolio(queryRunner.manager, buyerId, order.securityId, order.quantity, executedPrice, 'buy');
            await this.updatePortfolio(queryRunner.manager, sellerId, order.securityId, order.quantity, executedPrice, 'sell');
            await queryRunner.manager.update(security_entity_1.Security, order.securityId, {
                currentPrice: executedPrice,
                volume: () => `volume + ${order.quantity}`,
            });
            await queryRunner.commitTransaction();
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async updatePortfolio(manager, investorId, securityId, qty, price, side) {
        const existing = await manager.findOne(portfolio_entity_1.Portfolio, { where: { investorId, securityId } });
        if (side === 'buy') {
            if (existing) {
                const newQty = existing.quantity + qty;
                const newTotalCost = Number(existing.totalCost) + qty * price;
                await manager.update(portfolio_entity_1.Portfolio, existing.id, {
                    quantity: newQty,
                    totalCost: newTotalCost,
                    averageCost: newTotalCost / newQty,
                });
            }
            else {
                await manager.save(portfolio_entity_1.Portfolio, {
                    investorId, securityId,
                    quantity: qty,
                    averageCost: price,
                    totalCost: qty * price,
                });
            }
        }
        else if (existing) {
            const newQty = existing.quantity - qty;
            if (newQty <= 0) {
                await manager.delete(portfolio_entity_1.Portfolio, existing.id);
            }
            else {
                await manager.update(portfolio_entity_1.Portfolio, existing.id, { quantity: newQty });
            }
        }
    }
    getMyOrders(investorId) {
        return this.orderRepo.find({
            where: { investorId },
            relations: ['security', 'broker'],
            order: { createdAt: 'DESC' },
        });
    }
    async cancelOrder(id, investorId) {
        const order = await this.orderRepo.findOne({ where: { id, investorId } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.status !== order_entity_1.OrderStatus.PENDING)
            throw new common_1.BadRequestException('Only pending orders can be cancelled');
        await this.orderRepo.update(id, { status: order_entity_1.OrderStatus.CANCELLED });
        return { message: 'Order cancelled' };
    }
    getAllOrders(brokerId) {
        const where = brokerId ? { brokerId } : {};
        return this.orderRepo.find({
            where,
            relations: ['security', 'investor', 'broker'],
            order: { createdAt: 'DESC' },
            take: 100,
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(trade_entity_1.Trade)),
    __param(2, (0, typeorm_1.InjectRepository)(portfolio_entity_1.Portfolio)),
    __param(3, (0, typeorm_1.InjectRepository)(security_entity_1.Security)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], OrdersService);
//# sourceMappingURL=orders.service.js.map