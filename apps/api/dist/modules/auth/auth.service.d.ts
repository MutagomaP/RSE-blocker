import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User, UserStatus } from '../users/user.entity';
import { RegisterDto, LoginDto } from './auth.dto';
export declare class AuthService {
    private usersRepository;
    private jwtService;
    constructor(usersRepository: Repository<User>, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
            nationalId: string;
            role: import("../users/user.entity").UserRole;
            status: UserStatus;
            avatarUrl: string;
            csdAccountNumber: string;
            createdAt: Date;
            updatedAt: Date;
        };
        accessToken: string;
    }>;
    login(dto: LoginDto): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
            nationalId: string;
            role: import("../users/user.entity").UserRole;
            status: UserStatus;
            avatarUrl: string;
            csdAccountNumber: string;
            createdAt: Date;
            updatedAt: Date;
        };
        accessToken: string;
    }>;
    validateUser(id: string): Promise<User>;
    private signToken;
}
