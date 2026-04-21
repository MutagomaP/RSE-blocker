import { Response } from 'express';
import { ApiService } from '../../common/api.service';
export declare class HomeController {
    private apiService;
    constructor(apiService: ApiService);
    index(res: Response): Promise<void>;
    about(res: Response): void;
    howItWorks(res: Response): void;
}
