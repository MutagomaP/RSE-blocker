import { Repository } from 'typeorm';
import { Security, SecurityType } from './security.entity';
export declare class CreateSecurityDto {
    ticker: string;
    companyName: string;
    isin?: string;
    type?: SecurityType;
    sector?: string;
    currentPrice: number;
    sharesOutstanding?: number;
    description?: string;
    isCrossListed?: boolean;
    primaryExchange?: string;
}
export declare class SecuritiesService {
    private repo;
    constructor(repo: Repository<Security>);
    findAll(search?: string, type?: SecurityType): Promise<Security[]>;
    findOne(id: string): Promise<Security>;
    findByTicker(ticker: string): Promise<Security>;
    create(dto: CreateSecurityDto): Promise<Security>;
    updatePrice(id: string, price: number): Promise<Security>;
    getMarketSummary(): Promise<{
        totalListings: number;
        totalMarketCap: number;
        gainers: Security[];
        losers: Security[];
    }>;
}
