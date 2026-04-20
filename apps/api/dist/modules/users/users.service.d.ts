import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UpdateProfileDto {
    firstName?: string;
    lastName?: string;
    phone?: string;
    nationalId?: string;
    csdAccountNumber?: string;
}
export declare class UsersService {
    private repo;
    constructor(repo: Repository<User>);
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User>;
    updateProfile(id: string, dto: UpdateProfileDto): Promise<User>;
    suspendUser(id: string): Promise<{
        message: string;
    }>;
    activateUser(id: string): Promise<{
        message: string;
    }>;
}
