import { Repository, DataSource } from 'typeorm';
import { Order, OrderSide, OrderType } from './order.entity';
import { Trade } from '../trades/trade.entity';
import { Portfolio } from '../portfolio/portfolio.entity';
import { Security } from '../securities/security.entity';
import { Broker } from '../brokers/broker.entity';
export declare class PlaceOrderDto {
    securityId: string;
    side: OrderSide;
    type?: OrderType;
    quantity: number;
    limitPrice?: number;
    brokerId?: string;
    notes?: string;
}
export declare class OrdersService {
    private orderRepo;
    private tradeRepo;
    private portfolioRepo;
    private securityRepo;
    private brokerRepo;
    private dataSource;
    constructor(orderRepo: Repository<Order>, tradeRepo: Repository<Trade>, portfolioRepo: Repository<Portfolio>, securityRepo: Repository<Security>, brokerRepo: Repository<Broker>, dataSource: DataSource);
    placeOrder(investorId: string, dto: PlaceOrderDto): Promise<Order>;
    private matchOrder;
    private updatePortfolio;
    getMyOrders(investorId: string): Promise<Order[]>;
    getAllOrders(opts: {
        isAdmin: boolean;
        userId: string;
        status?: string;
        side?: string;
    }): Promise<Order[]>;
    cancelOrder(id: string, investorId: string): Promise<{
        message: string;
    }>;
    getOrderStats(): Promise<{
        total: number;
        pending: number;
        filled: number;
        cancelled: number;
    }>;
}
