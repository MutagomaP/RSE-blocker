import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class WebAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();
    if (!req.user) {
      res.redirect('/auth/login?redirect=' + encodeURIComponent(req.path));
      return false;
    }
    return true;
  }
}
