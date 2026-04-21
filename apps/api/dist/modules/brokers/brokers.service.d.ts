import { Repository } from 'typeorm';
import { Broker, BrokerStatus } from './broker.entity';
export declare class CreateBrokerProfileDto {
    firmName: string;
    licenseNumber: string;
    description?: string;
    website?: string;
    officeAddress?: string;
    district?: string;
    commissionRate?: number;
    specializations?: string[];
}
export declare class BrokersService {
    private repo;
    constructor(repo: Repository<Broker>);
    findAll(status?: BrokerStatus): Promise<Broker[]>;
    findOne(id: string): Promise<Broker>;
    findByUserId(userId: string): Promise<Broker>;
    create(userId: string, dto: CreateBrokerProfileDto): Promise<Broker>;
    update(id: string, dto: Partial<CreateBrokerProfileDto>): Promise<Broker>;
    approve(id: string): Promise<{
        message: string;
    }>;
    suspend(id: string): Promise<{
        message: string;
    }>;
}
