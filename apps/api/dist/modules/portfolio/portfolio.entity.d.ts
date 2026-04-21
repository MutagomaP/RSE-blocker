import { User } from '../users/user.entity';
import { Security } from '../securities/security.entity';
export declare class Portfolio {
    id: string;
    investor: User;
    investorId: string;
    security: Security;
    securityId: string;
    quantity: number;
    averageCost: number;
    totalCost: number;
    currentValue: number;
    unrealizedPnl: number;
    unrealizedPnlPercent: number;
    updatedAt: Date;
}
