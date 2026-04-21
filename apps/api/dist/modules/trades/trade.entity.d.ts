import { Order } from '../orders/order.entity';
import { Security } from '../securities/security.entity';
import { User } from '../users/user.entity';
import { Broker } from '../brokers/broker.entity';
export declare enum TradeStatus {
    EXECUTED = "executed",
    SETTLED = "settled",
    FAILED = "failed"
}
export declare class Trade {
    id: string;
    tradeReference: string;
    buyOrder: Order;
    buyOrderId: string;
    sellOrder: Order;
    sellOrderId: string;
    security: Security;
    securityId: string;
    buyer: User;
    buyerId: string;
    seller: User;
    sellerId: string;
    buyerBroker: Broker;
    buyerBrokerId: string;
    sellerBroker: Broker;
    sellerBrokerId: string;
    quantity: number;
    price: number;
    totalValue: number;
    buyerCommission: number;
    sellerCommission: number;
    status: TradeStatus;
    settlementDate: Date;
    executedAt: Date;
}
