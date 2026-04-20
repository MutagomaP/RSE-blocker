import { Response } from 'express';
import { ApiService } from '../common/api.service';
export declare class MarketController {
    private apiService;
    constructor(apiService: ApiService);
    index(res: Response): Promise<void>;
}
export declare class MarketModule {
}
export declare class SecuritiesController {
    private apiService;
    constructor(apiService: ApiService);
    index(search: string, type: string, res: Response): Promise<void>;
    detail(id: string, res: Response): Promise<void>;
}
export declare class SecuritiesModule {
}
export declare class BrokersController {
    private apiService;
    constructor(apiService: ApiService);
    index(res: Response): Promise<void>;
    detail(id: string, res: Response): Promise<void>;
}
export declare class BrokersModule {
}
export declare class PortfolioController {
    private apiService;
    constructor(apiService: ApiService);
    index(req: any, res: Response): Promise<void>;
}
export declare class PortfolioModule {
}
export declare class OrdersController {
    private apiService;
    constructor(apiService: ApiService);
    index(req: any, res: Response): Promise<void>;
    placeOrder(req: any, body: any, res: Response): Promise<void>;
    cancelOrder(id: string, req: any, res: Response): Promise<void>;
}
export declare class OrdersModule {
}
export declare class DashboardController {
    private apiService;
    constructor(apiService: ApiService);
    index(req: any, res: Response): Promise<void>;
}
export declare class DashboardModule {
}
