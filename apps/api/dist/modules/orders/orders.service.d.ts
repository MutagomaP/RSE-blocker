import { Repository, DataSource } from 'typeorm';
import { Order, OrderSide, OrderType } from './order.entity';
import { Trade } from '../trades/trade.entity';
import { Portfolio } from '../portfolio/portfolio.entity';
import { Security } from '../securities/security.entity';
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
    private dataSource;
    constructor(orderRepo: Repository<Order>, tradeRepo: Repository<Trade>, portfolioRepo: Repository<Portfolio>, securityRepo: Repository<Security>, dataSource: DataSource);
    placeOrder(investorId: string, dto: PlaceOrderDto): Promise<Order>;
    private matchOrder;
    private updatePortfolio;
    getMyOrders(investorId: string): Promise<Order[]>;
    cancelOrder(id: string, investorId: string): Promise<{
        message: string;
    }>;
    getAllOrders(brokerId?: string): Promise<Order[]>;
}
