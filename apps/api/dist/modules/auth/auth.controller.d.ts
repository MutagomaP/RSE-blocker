import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
            nationalId: string;
            role: import("../users/user.entity").UserRole;
            status: import("../users/user.entity").UserStatus;
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
            status: import("../users/user.entity").UserStatus;
            avatarUrl: string;
            csdAccountNumber: string;
            createdAt: Date;
            updatedAt: Date;
        };
        accessToken: string;
    }>;
    getMe(req: any): any;
}
