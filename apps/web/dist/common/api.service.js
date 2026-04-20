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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
let ApiService = class ApiService {
    constructor(config) {
        this.config = config;
        this.client = axios_1.default.create({
            baseURL: config.get('API_URL', 'http://localhost:3000/api/v1'),
            timeout: 10000,
        });
    }
    withAuth(token) {
        return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    }
    async register(data) { const res = await this.client.post('/auth/register', data); return res.data; }
    async login(data) { const res = await this.client.post('/auth/login', data); return res.data; }
    async getMe(token) { const res = await this.client.get('/auth/me', this.withAuth(token)); return res.data; }
    async getMarketOverview() { const res = await this.client.get('/market'); return res.data; }
    async getPriceHistory(securityId) { const res = await this.client.get(`/market/price-history/${securityId}`); return res.data; }
    async getSecurities(search, type) {
        const params = new URLSearchParams();
        if (search)
            params.set('search', search);
        if (type)
            params.set('type', type);
        const res = await this.client.get(`/securities?${params}`);
        return res.data;
    }
    async getSecurity(id) { const res = await this.client.get(`/securities/${id}`); return res.data; }
    async getBrokers(status) { const res = await this.client.get(`/brokers${status ? '?status=' + status : ''}`); return res.data; }
    async getBroker(id) { const res = await this.client.get(`/brokers/${id}`); return res.data; }
    async placeOrder(token, data) { const res = await this.client.post('/orders', data, this.withAuth(token)); return res.data; }
    async getMyOrders(token) { const res = await this.client.get('/orders/my-orders', this.withAuth(token)); return res.data; }
    async cancelOrder(token, id) { const res = await this.client.delete(`/orders/${id}`, this.withAuth(token)); return res.data; }
    async getPortfolio(token) { const res = await this.client.get('/portfolio', this.withAuth(token)); return res.data; }
    async getMyTrades(token) { const res = await this.client.get('/trades/my-trades', this.withAuth(token)); return res.data; }
    async getMyBrokerProfile(token) { const res = await this.client.get('/brokers/my-profile', this.withAuth(token)); return res.data; }
    async updateProfile(token, data) { const res = await this.client.patch('/users/profile', data, this.withAuth(token)); return res.data; }
};
exports.ApiService = ApiService;
exports.ApiService = ApiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ApiService);
//# sourceMappingURL=api.service.js.map