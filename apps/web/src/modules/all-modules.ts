import { Module, Controller, Get, Render, Param, Query, Req, Res, UseGuards, Post, Body } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiService } from '../common/api.service';
import { WebAuthGuard } from '../common/web-auth.guard';

// ─── MARKET ──────────────────────────────────────────────────────────────────
@Controller('market')
export class MarketController {
  constructor(private apiService: ApiService) {}

  @Get()
  async index(@Res() res: Response) {
    try {
      const [market, securities] = await Promise.all([
        this.apiService.getMarketOverview(),
        this.apiService.getSecurities(),
      ]);
      return res.render('market/index', { title: 'Market — RSE', market, securities, page: 'market' });
    } catch {
      return res.render('market/index', { title: 'Market — RSE', market: null, securities: [], page: 'market' });
    }
  }
}

@Module({ controllers: [MarketController] })
export class MarketModule {}

// ─── SECURITIES ──────────────────────────────────────────────────────────────
@Controller('securities')
export class SecuritiesController {
  constructor(private apiService: ApiService) {}

  @Get()
  async index(@Query('search') search: string, @Query('type') type: string, @Res() res: Response) {
    const securities = await this.apiService.getSecurities(search, type).catch(() => []);
    return res.render('securities/index', { title: 'Listed Securities — RSE', securities, search, type, page: 'securities' });
  }

  @Get(':id')
  async detail(@Param('id') id: string, @Res() res: Response) {
    try {
      const [security, history] = await Promise.all([
        this.apiService.getSecurity(id),
        this.apiService.getPriceHistory(id),
      ]);
      return res.render('securities/detail', { title: `${security.ticker} — RSE`, security, history: JSON.stringify(history), page: 'securities' });
    } catch {
      return res.redirect('/securities?error=not_found');
    }
  }
}

@Module({ controllers: [SecuritiesController] })
export class SecuritiesModule {}

// ─── BROKERS ─────────────────────────────────────────────────────────────────
@Controller('brokers')
export class BrokersController {
  constructor(private apiService: ApiService) {}

  @Get()
  async index(@Res() res: Response) {
    const brokers = await this.apiService.getBrokers('licensed').catch(() => []);
    return res.render('brokers/index', { title: 'Licensed Brokers — RSE', brokers, page: 'brokers' });
  }

  @Get(':id')
  async detail(@Param('id') id: string, @Res() res: Response) {
    try {
      const broker = await this.apiService.getBroker(id);
      return res.render('brokers/detail', { title: `${broker.firmName} — RSE`, broker, page: 'brokers' });
    } catch {
      return res.redirect('/brokers');
    }
  }
}

@Module({ controllers: [BrokersController] })
export class BrokersModule {}

// ─── PORTFOLIO ───────────────────────────────────────────────────────────────
@Controller('portfolio')
export class PortfolioController {
  constructor(private apiService: ApiService) {}

  @Get()
  @UseGuards(WebAuthGuard)
  async index(@Req() req: any, @Res() res: Response) {
    try {
      const [portfolio, trades] = await Promise.all([
        this.apiService.getPortfolio(req.token),
        this.apiService.getMyTrades(req.token),
      ]);
      return res.render('portfolio/index', { title: 'My Portfolio — RSE', portfolio, trades, page: 'portfolio' });
    } catch {
      return res.render('portfolio/index', { title: 'My Portfolio — RSE', portfolio: null, trades: [], page: 'portfolio' });
    }
  }
}

@Module({ controllers: [PortfolioController] })
export class PortfolioModule {}

// ─── ORDERS ──────────────────────────────────────────────────────────────────
@Controller('orders')
export class OrdersController {
  constructor(private apiService: ApiService) {}

  @Get()
  @UseGuards(WebAuthGuard)
  async index(@Req() req: any, @Res() res: Response) {
    const [orders, securities] = await Promise.all([
      this.apiService.getMyOrders(req.token).catch(() => []),
      this.apiService.getSecurities().catch(() => []),
    ]);
    return res.render('orders/index', { title: 'Orders — RSE', orders, securities: JSON.stringify(securities), page: 'orders' });
  }

  @Post()
  @UseGuards(WebAuthGuard)
  async placeOrder(@Req() req: any, @Body() body: any, @Res() res: Response) {
    try {
      await this.apiService.placeOrder(req.token, body);
      return res.redirect('/orders?success=Order placed successfully');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to place order';
      return res.redirect(`/orders?error=${encodeURIComponent(msg)}`);
    }
  }

  @Post(':id/cancel')
  @UseGuards(WebAuthGuard)
  async cancelOrder(@Param('id') id: string, @Req() req: any, @Res() res: Response) {
    try {
      await this.apiService.cancelOrder(req.token, id);
      return res.redirect('/orders?success=Order cancelled');
    } catch {
      return res.redirect('/orders?error=Failed to cancel order');
    }
  }
}

@Module({ controllers: [OrdersController] })
export class OrdersModule {}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
@Controller('dashboard')
export class DashboardController {
  constructor(private apiService: ApiService) {}

  @Get()
  @UseGuards(WebAuthGuard)
  async index(@Req() req: any, @Res() res: Response) {
    try {
      const [portfolio, orders, market] = await Promise.all([
        this.apiService.getPortfolio(req.token),
        this.apiService.getMyOrders(req.token),
        this.apiService.getMarketOverview(),
      ]);
      return res.render('dashboard/index', {
        title: 'Dashboard — RSE',
        portfolio,
        orders: orders.slice(0, 5),
        market,
        page: 'dashboard',
      });
    } catch {
      return res.render('dashboard/index', {
        title: 'Dashboard — RSE',
        portfolio: null, orders: [], market: null,
        page: 'dashboard',
      });
    }
  }
}

@Module({ controllers: [DashboardController] })
export class DashboardModule {}
