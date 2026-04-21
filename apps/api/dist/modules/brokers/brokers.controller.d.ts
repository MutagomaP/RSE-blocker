import { BrokersService, CreateBrokerProfileDto } from './brokers.service';
import { BrokerStatus } from './broker.entity';
export declare class BrokersController {
    private brokersService;
    constructor(brokersService: BrokersService);
    findAll(status?: BrokerStatus): Promise<import("./broker.entity").Broker[]>;
    getMyProfile(req: any): Promise<import("./broker.entity").Broker>;
    findOne(id: string): Promise<import("./broker.entity").Broker>;
    create(req: any, dto: CreateBrokerProfileDto): Promise<import("./broker.entity").Broker>;
    update(req: any, dto: Partial<CreateBrokerProfileDto>): Promise<import("./broker.entity").Broker>;
    approve(id: string): Promise<{
        message: string;
    }>;
    suspend(id: string): Promise<{
        message: string;
    }>;
}
