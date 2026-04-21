import { UsersService, UpdateProfileDto } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<import("./user.entity").User[]>;
    getProfile(req: any): Promise<import("./user.entity").User>;
    updateProfile(req: any, dto: UpdateProfileDto): Promise<import("./user.entity").User>;
    findOne(id: string): Promise<import("./user.entity").User>;
    suspend(id: string): Promise<{
        message: string;
    }>;
    activate(id: string): Promise<{
        message: string;
    }>;
}
