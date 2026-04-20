export declare enum SecurityType {
    EQUITY = "equity",
    BOND = "bond",
    ETF = "etf",
    PREFERENCE_SHARE = "preference_share"
}
export declare enum SecurityStatus {
    ACTIVE = "active",
    SUSPENDED = "suspended",
    DELISTED = "delisted"
}
export declare class Security {
    id: string;
    ticker: string;
    companyName: string;
    isin: string;
    type: SecurityType;
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
}
