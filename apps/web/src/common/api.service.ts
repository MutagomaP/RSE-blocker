import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class ApiService {
  private client: AxiosInstance;

  constructor(private config: ConfigService) {
    this.client = axios.create({
      baseURL: config.get('API_URL', 'http://localhost:3000/api/v1'),
      timeout: 10000,
    });
  }

  private withAuth(token?: string) {
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  }

  async register(data: any) { const res = await this.client.post('/auth/register', data); return res.data; }
  async login(data: any) { const res = await this.client.post('/auth/login', data); return res.data; }
  async getMe(token: string) { const res = await this.client.get('/auth/me', this.withAuth(token)); return res.data; }
  async getMarketOverview() { const res = await this.client.get('/market'); return res.data; }
  async getPriceHistory(securityId: string) { const res = await this.client.get(`/market/price-history/${securityId}`); return res.data; }
  async getSecurities(search?: string, type?: string) {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (type) params.set('type', type);
    const res = await this.client.get(`/securities?${params}`);
    return res.data;
  }
  async getSecurity(id: string) { const res = await this.client.get(`/securities/${id}`); return res.data; }
  async getBrokers(status?: string) { const res = await this.client.get(`/brokers${status ? '?status=' + status : ''}`); return res.data; }
  async getBroker(id: string) { const res = await this.client.get(`/brokers/${id}`); return res.data; }
  async placeOrder(token: string, data: any) { const res = await this.client.post('/orders', data, this.withAuth(token)); return res.data; }
  async getMyOrders(token: string) { const res = await this.client.get('/orders/my-orders', this.withAuth(token)); return res.data; }
  async cancelOrder(token: string, id: string) { const res = await this.client.delete(`/orders/${id}`, this.withAuth(token)); return res.data; }
  async getPortfolio(token: string) { const res = await this.client.get('/portfolio', this.withAuth(token)); return res.data; }
  async getMyTrades(token: string) { const res = await this.client.get('/trades/my-trades', this.withAuth(token)); return res.data; }
  async getMyBrokerProfile(token: string) { const res = await this.client.get('/brokers/my-profile', this.withAuth(token)); return res.data; }
  async updateProfile(token: string, data: any) { const res = await this.client.patch('/users/profile', data, this.withAuth(token)); return res.data; }
}
