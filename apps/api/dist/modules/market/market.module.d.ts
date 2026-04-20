import { Security } from '../securities/security.entity';
import { Trade } from '../trades/trade.entity';
import { Repository } from 'typeorm';
import { SecurityStatus } from '../securities/security.entity';
export declare class MarketService {
    private securityRepo;
    private tradeRepo;
    constructor(securityRepo: Repository<Security>, tradeRepo: Repository<Trade>);
    getMarketOverview(): Promise<{
        indices: {
            RSI: {
                value: number;
                change: string;
                currency: string;
            };
            ALSI: {
                value: number;
                change: string;
                currency: string;
            };
            EAE20: {
                value: number;
                change: string;
                currency: string;
            };
        };
        breadth: {
            advancers: number;
            decliners: number;
            unchanged: number;
            total: number;
        };
        totalMarketCap: number;
        totalVolume: number;
        gainers: {
            change: number;
            changePct: number;
            id: string;
            ticker: string;
            companyName: string;
            isin: string;
            type: import("../securities/security.entity").SecurityType;
            status: SecurityStatus;
            sector: string;
            currentPrice: number;
            openPrice: number;
            highPrice: number;
            lowPrice: number;
            previousClose: number;
            volume: number;
            sharesOutstanding: number;
            marketCap: number;
            dividendYield: number;
            description: string;
            logoUrl: string;
            currency: string;
            isCrossListed: boolean;
            primaryExchange: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        losers: {
            change: number;
            changePct: number;
            id: string;
            ticker: string;
            companyName: string;
            isin: string;
            type: import("../securities/security.entity").SecurityType;
            status: SecurityStatus;
            sector: string;
            currentPrice: number;
            openPrice: number;
            highPrice: number;
            lowPrice: number;
            previousClose: number;
            volume: number;
            sharesOutstanding: number;
            marketCap: number;
            dividendYield: number;
            description: string;
            logoUrl: string;
            currency: string;
            isCrossListed: boolean;
            primaryExchange: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        recentTrades: Trade[];
        tradingHours: {
            open: string;
            close: string;
            timezone: string;
            currency: string;
        };
        settlementCycle: string;
    }>;
    getPriceHistory(securityId: string): Promise<{
        date: string;
        close: number;
        volume: number;
    }[]>;
}
export declare class MarketController {
    private marketService;
    constructor(marketService: MarketService);
    getOverview(): Promise<{
        indices: {
            RSI: {
                value: number;
                change: string;
                currency: string;
            };
            ALSI: {
                value: number;
                change: string;
                currency: string;
            };
            EAE20: {
                value: number;
                change: string;
                currency: string;
            };
        };
        breadth: {
            advancers: number;
            decliners: number;
            unchanged: number;
            total: number;
        };
        totalMarketCap: number;
        totalVolume: number;
        gainers: {
            change: number;
            changePct: number;
            id: string;
            ticker: string;
            companyName: string;
            isin: string;
            type: import("../securities/security.entity").SecurityType;
            status: SecurityStatus;
            sector: string;
            currentPrice: number;
            openPrice: number;
            highPrice: number;
            lowPrice: number;
            previousClose: number;
            volume: number;
            sharesOutstanding: number;
            marketCap: number;
            dividendYield: number;
            description: string;
            logoUrl: string;
            currency: string;
            isCrossListed: boolean;
            primaryExchange: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        losers: {
            change: number;
            changePct: number;
            id: string;
            ticker: string;
            companyName: string;
            isin: string;
            type: import("../securities/security.entity").SecurityType;
            status: SecurityStatus;
            sector: string;
            currentPrice: number;
            openPrice: number;
            highPrice: number;
            lowPrice: number;
            previousClose: number;
            volume: number;
            sharesOutstanding: number;
            marketCap: number;
            dividendYield: number;
            description: string;
            logoUrl: string;
            currency: string;
            isCrossListed: boolean;
            primaryExchange: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        recentTrades: Trade[];
        tradingHours: {
            open: string;
            close: string;
            timezone: string;
            currency: string;
        };
        settlementCycle: string;
    }>;
    getPriceHistory(securityId: string): Promise<{
        date: string;
        close: number;
        volume: number;
    }[]>;
}
export declare class MarketModule {
}
