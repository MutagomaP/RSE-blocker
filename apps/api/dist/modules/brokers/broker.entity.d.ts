import { User } from '../users/user.entity';
export declare enum BrokerStatus {
    PENDING = "pending",
    LICENSED = "licensed",
    SUSPENDED = "suspended",
    REVOKED = "revoked"
}
export declare class Broker {
    id: string;
    user: User;
    userId: string;
    firmName: string;
    licenseNumber: string;
    licenseExpiryDate: Date;
    status: BrokerStatus;
    description: string;
    website: string;
    officeAddress: string;
    district: string;
    commissionRate: number;
    totalClients: number;
    totalTrades: number;
    totalVolumeTraded: number;
    rating: number;
    specializations: string[];
    createdAt: Date;
    updatedAt: Date;
}
