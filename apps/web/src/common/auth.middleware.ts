import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ApiService } from './api.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private apiService: ApiService) {}

  async use(req: Request & { user?: any; token?: string }, res: Response, next: NextFunction) {
    const token = req.cookies?.['rse_token'];
    if (token) {
      try {
        const user = await this.apiService.getMe(token);
        req.user = user;
        req.token = token;
        res.locals.user = user;
        res.locals.token = token;
        res.locals.isLoggedIn = true;
      } catch {
        res.clearCookie('rse_token');
        res.locals.isLoggedIn = false;
      }
    } else {
      res.locals.isLoggedIn = false;
    }
    next();
  }
}
