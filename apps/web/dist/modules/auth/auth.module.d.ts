import { Response } from 'express';
import { ApiService } from '../../common/api.service';
export declare class AuthController {
    private apiService;
    constructor(apiService: ApiService);
    loginPage(redirect?: string, error?: string): {
        title: string;
        redirect: string;
        error: string;
        page: string;
    };
    loginAction(body: {
        email: string;
        password: string;
        redirect?: string;
    }, res: Response): Promise<void>;
    registerPage(error?: string): {
        title: string;
        error: string;
        page: string;
    };
    registerAction(body: any, res: Response): Promise<void>;
    logout(res: Response): void;
}
export declare class AuthModule {
}
