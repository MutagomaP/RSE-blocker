import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());

  // Serve static assets
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Set up Handlebars template engine
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  const { engine } = require('express-handlebars');
  app.engine(
    'hbs',
    engine({
      extname: '.hbs',
      defaultLayout: 'main',
      layoutsDir: join(__dirname, '..', 'views/layouts'),
      partialsDir: join(__dirname, '..', 'views/partials'),
      helpers: {
        eq: (a: any, b: any) => a === b,
        gt: (a: number, b: number) => a > b,
        lt: (a: number, b: number) => a < b,
        formatCurrency: (n: number, currency = 'RWF') =>
          `${currency} ${Number(n).toLocaleString('en-RW', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        formatDate: (d: string) => new Date(d).toLocaleDateString('en-RW', { day: '2-digit', month: 'short', year: 'numeric' }),
        formatPct: (n: number) => `${Number(n).toFixed(2)}%`,
        positive: (n: number) => Number(n) >= 0,
        abs: (n: number) => Math.abs(Number(n)).toFixed(2),
        truncate: (str: string, len = 60) => str && str.length > len ? str.slice(0, len) + '…' : str,
        json: (obj: any) => JSON.stringify(obj),
        upper: (s: string) => s?.toUpperCase(),
        badgeClass: (status: string) => {
          const map: Record<string, string> = {
            active: 'badge-success', licensed: 'badge-success',
            pending: 'badge-warning', suspended: 'badge-danger',
            filled: 'badge-success', cancelled: 'badge-secondary',
            buy: 'badge-success', sell: 'badge-danger',
          };
          return map[status?.toLowerCase()] || 'badge-secondary';
        },
      },
    }),
  );

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`RSE Web running on: http://localhost:${port}`);
}
bootstrap();
