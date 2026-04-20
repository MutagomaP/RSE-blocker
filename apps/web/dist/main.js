"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const path_1 = require("path");
const cookieParser = require("cookie-parser");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(cookieParser());
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'public'));
    app.setBaseViewsDir((0, path_1.join)(__dirname, '..', 'views'));
    app.setViewEngine('hbs');
    const { engine } = require('express-handlebars');
    app.engine('hbs', engine({
        extname: '.hbs',
        defaultLayout: 'main',
        layoutsDir: (0, path_1.join)(__dirname, '..', 'views/layouts'),
        partialsDir: (0, path_1.join)(__dirname, '..', 'views/partials'),
        helpers: {
            eq: (a, b) => a === b,
            gt: (a, b) => a > b,
            lt: (a, b) => a < b,
            formatCurrency: (n, currency = 'RWF') => `${currency} ${Number(n).toLocaleString('en-RW', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            formatDate: (d) => new Date(d).toLocaleDateString('en-RW', { day: '2-digit', month: 'short', year: 'numeric' }),
            formatPct: (n) => `${Number(n).toFixed(2)}%`,
            positive: (n) => Number(n) >= 0,
            abs: (n) => Math.abs(Number(n)).toFixed(2),
            truncate: (str, len = 60) => str && str.length > len ? str.slice(0, len) + '…' : str,
            json: (obj) => JSON.stringify(obj),
            upper: (s) => s?.toUpperCase(),
            badgeClass: (status) => {
                const map = {
                    active: 'badge-success', licensed: 'badge-success',
                    pending: 'badge-warning', suspended: 'badge-danger',
                    filled: 'badge-success', cancelled: 'badge-secondary',
                    buy: 'badge-success', sell: 'badge-danger',
                };
                return map[status?.toLowerCase()] || 'badge-secondary';
            },
        },
    }));
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`RSE Web running on: http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map