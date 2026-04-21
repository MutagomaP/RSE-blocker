import { ConfigService } from '@nestjs/config';
export declare class ApiService {
    private config;
    private client;
    constructor(config: ConfigService);
    private withAuth;
    register(data: any): Promise<any>;
    login(data: any): Promise<any>;
    getMe(token: string): Promise<any>;
    getMarketOverview(): Promise<any>;
    getPriceHistory(securityId: string): Promise<any>;
    getSecurities(search?: string, type?: string): Promise<any>;
    getSecurity(id: string): Promise<any>;
    getBrokers(status?: string): Promise<any>;
    getBroker(id: string): Promise<any>;
    placeOrder(token: string, data: any): Promise<any>;
    getMyOrders(token: string): Promise<any>;
    cancelOrder(token: string, id: string): Promise<any>;
    getPortfolio(token: string): Promise<any>;
    getMyTrades(token: string): Promise<any>;
    getMyBrokerProfile(token: string): Promise<any>;
    updateProfile(token: string, data: any): Promise<any>;
    getAllOrders(token: string, status?: string, side?: string): Promise<any>;
    getAllTrades(token: string): Promise<any>;
    getOrderStats(token: string): Promise<any>;
}
