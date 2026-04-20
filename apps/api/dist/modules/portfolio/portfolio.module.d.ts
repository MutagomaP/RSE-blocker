import { Portfolio } from './portfolio.entity';
import { Security } from '../securities/security.entity';
import { Repository } from 'typeorm';
export declare class PortfolioService {
    private portfolioRepo;
    private securityRepo;
    constructor(portfolioRepo: Repository<Portfolio>, securityRepo: Repository<Security>);
    getPortfolio(investorId: string): Promise<{
        holdings: {
            currentValue: number;
            unrealizedPnl: number;
            unrealizedPnlPercent: number;
            id: string;
            investor: import("../users/user.entity").User;
            investorId: string;
            security: Security;
            securityId: string;
            quantity: number;
            averageCost: number;
            totalCost: number;
            updatedAt: Date;
        }[];
        summary: {
            totalValue: number;
            totalCost: number;
            totalUnrealizedPnl: number;
            totalUnrealizedPnlPercent: number;
            holdingsCount: number;
        };
    }>;
}
export declare class PortfolioController {
    private portfolioService;
    constructor(portfolioService: PortfolioService);
    getPortfolio(req: any): Promise<{
        holdings: {
            currentValue: number;
            unrealizedPnl: number;
            unrealizedPnlPercent: number;
            id: string;
            investor: import("../users/user.entity").User;
            investorId: string;
            security: Security;
            securityId: string;
            quantity: number;
            averageCost: number;
            totalCost: number;
            updatedAt: Date;
        }[];
        summary: {
            totalValue: number;
            totalCost: number;
            totalUnrealizedPnl: number;
            totalUnrealizedPnlPercent: number;
            holdingsCount: number;
        };
    }>;
}
export declare class PortfolioModule {
}
