import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiService } from '../../common/api.service';

@Controller()
export class HomeController {
  constructor(private apiService: ApiService) {}

  @Get()
  async index(@Res() res: Response) {
    try {
      const [market, securities, brokers] = await Promise.all([
        this.apiService.getMarketOverview(),
        this.apiService.getSecurities(),
        this.apiService.getBrokers('licensed'),
      ]);
      return res.render('home/index', {
        title: 'RSE — Rwanda Stock Exchange Platform',
        market,
        securities: securities.slice(0, 8),
        brokers: brokers.slice(0, 6),
        page: 'home',
      });
    } catch {
      return res.render('home/index', {
        title: 'RSE — Rwanda Stock Exchange Platform',
        market: null, securities: [], brokers: [], page: 'home',
      });
    }
  }

  @Get('about')
  about(@Res() res: Response) {
    return res.render('home/about', { title: 'About RSE', page: 'about' });
  }

  @Get('how-it-works')
  howItWorks(@Res() res: Response) {
    return res.render('home/how-it-works', { title: 'How It Works — RSE', page: 'how-it-works' });
  }
}
