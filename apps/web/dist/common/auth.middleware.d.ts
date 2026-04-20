import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ApiService } from './api.service';
export declare class AuthMiddleware implements NestMiddleware {
    private apiService;
    constructor(apiService: ApiService);
    use(req: Request & {
        user?: any;
        token?: string;
    }, res: Response, next: NextFunction): Promise<void>;
}
