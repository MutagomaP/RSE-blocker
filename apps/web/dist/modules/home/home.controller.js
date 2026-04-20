"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeController = void 0;
const common_1 = require("@nestjs/common");
const api_service_1 = require("../../common/api.service");
let HomeController = class HomeController {
    constructor(apiService) {
        this.apiService = apiService;
    }
    async index(res) {
        try {
            const [market, securities, brokers] = await Promise.all([
                this.apiService.getMarketOverview(),
                this.apiService.getSecurities(),
                this.apiService.getBrokers('licensed'),
            ]);
            return res.render('home/index', {
                title: 'RSE — Rwanda Stock Exchange Platform',
                market, securities: securities.slice(0, 8), brokers: brokers.slice(0, 6), page: 'home',
            });
        }
        catch {
            return res.render('home/index', {
                title: 'RSE — Rwanda Stock Exchange Platform',
                market: null, securities: [], brokers: [], page: 'home',
            });
        }
    }
    about(res) {
        return res.render('home/about', { title: 'About RSE', page: 'about' });
    }
    howItWorks(res) {
        return res.render('home/how-it-works', { title: 'How It Works', page: 'how-it-works' });
    }
};
exports.HomeController = HomeController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HomeController.prototype, "index", null);
__decorate([
    (0, common_1.Get)('about'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HomeController.prototype, "about", null);
__decorate([
    (0, common_1.Get)('how-it-works'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HomeController.prototype, "howItWorks", null);
exports.HomeController = HomeController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [api_service_1.ApiService])
], HomeController);
//# sourceMappingURL=home.controller.js.map