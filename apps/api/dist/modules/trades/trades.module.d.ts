import { Trade } from './trade.entity';
import { Repository } from 'typeorm';
export declare class TradesService {
    private repo;
    constructor(repo: Repository<Trade>);
    getMyTrades(userId: string): Promise<Trade[]>;
    getAllTrades(limit?: number): Promise<Trade[]>;
    getTrade(id: string): Promise<Trade>;
}
export declare class TradesController {
    private tradesService;
    constructor(tradesService: TradesService);
    getMyTrades(req: any): Promise<Trade[]>;
    getAllTrades(limit?: number): Promise<Trade[]>;
    getTrade(id: string): Promise<Trade>;
}
export declare class TradesModule {
}
