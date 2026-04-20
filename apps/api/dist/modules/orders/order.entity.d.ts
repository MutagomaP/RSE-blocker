import { User } from '../users/user.entity';
import { Security } from '../securities/security.entity';
import { Broker } from '../brokers/broker.entity';
export declare enum OrderSide {
    BUY = "buy",
    SELL = "sell"
}
export declare enum OrderType {
    MARKET = "market",
    LIMIT = "limit"
}
export declare enum OrderStatus {
    PENDING = "pending",
    PARTIALLY_FILLED = "partially_filled",
    FILLED = "filled",
    CANCELLED = "cancelled",
    EXPIRED = "expired",
    REJECTED = "rejected"
}
export declare class Order {
    id: string;
    investor: User;
    investorId: string;
    broker: Broker;
    brokerId: string;
    security: Security;
    securityId: string;
    side: OrderSide;
    type: OrderType;
    status: OrderStatus;
    quantity: number;
    filledQuantity: number;
    limitPrice: number;
    executedPrice: number;
    commission: number;
    expiresAt: Date;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}
