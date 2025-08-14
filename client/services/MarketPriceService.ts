import { apiService } from './ApiService';
import { MarketPrice, MarketPriceFilter, PaginatedResponse, ApiResponse } from '../models/types';

export class MarketPriceService {
  private apiService = apiService;

  async getMarketPrices(filter?: MarketPriceFilter, page?: number, limit?: number): Promise<ApiResponse<PaginatedResponse<MarketPrice>>> {
    return this.apiService.getPaginated<MarketPrice>('/market-prices', page, limit, filter);
  }

  async getMarketPriceById(id: string): Promise<ApiResponse<MarketPrice>> {
    return this.apiService.get<MarketPrice>(`/market-prices/${id}`);
  }

  async getCurrentPrices(limit: number = 10): Promise<ApiResponse<MarketPrice[]>> {
    return this.apiService.get<MarketPrice[]>('/market-prices/current', { limit });
  }

  async getPricesByCommodity(commodity: string): Promise<ApiResponse<MarketPrice[]>> {
    return this.apiService.get<MarketPrice[]>(`/market-prices/commodity/${commodity}`);
  }

  async getPricesByMarket(market: string): Promise<ApiResponse<MarketPrice[]>> {
    return this.apiService.get<MarketPrice[]>(`/market-prices/market/${market}`);
  }

  async getPriceTrends(commodity: string, days: number = 30): Promise<ApiResponse<MarketPrice[]>> {
    return this.apiService.get<MarketPrice[]>(`/market-prices/trends/${commodity}`, { days });
  }

  async getMarkets(): Promise<ApiResponse<string[]>> {
    return this.apiService.get<string[]>('/market-prices/markets');
  }

  async getCommodities(): Promise<ApiResponse<string[]>> {
    return this.apiService.get<string[]>('/market-prices/commodities');
  }

  // Mock data fallback for development
  getMarketPricesMock(): MarketPrice[] {
    const now = new Date();
    return [
      {
        id: "1",
        commodity: "Tomato",
        currentPrice: 45,
        previousPrice: 42,
        unit: "kg",
        market: "KR Market",
        trend: "up",
        change: 7.1,
        date: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "2",
        commodity: "Onion",
        currentPrice: 35,
        previousPrice: 38,
        unit: "kg",
        market: "KR Market",
        trend: "down",
        change: -7.9,
        date: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "3",
        commodity: "Potato",
        currentPrice: 28,
        previousPrice: 28,
        unit: "kg",
        market: "KR Market",
        trend: "stable",
        change: 0,
        date: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "4",
        commodity: "Cabbage",
        currentPrice: 18,
        previousPrice: 15,
        unit: "kg",
        market: "Madiwala Market",
        trend: "up",
        change: 20.0,
        date: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "5",
        commodity: "Carrot",
        currentPrice: 32,
        previousPrice: 35,
        unit: "kg",
        market: "Madiwala Market",
        trend: "down",
        change: -8.6,
        date: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "6",
        commodity: "Green Beans",
        currentPrice: 55,
        previousPrice: 52,
        unit: "kg",
        market: "Russell Market",
        trend: "up",
        change: 5.8,
        date: now,
        createdAt: now,
        updatedAt: now,
      }
    ];
  }

  calculatePriceChange(current: number, previous: number): { change: number; trend: 'up' | 'down' | 'stable' } {
    if (current > previous) {
      return { change: ((current - previous) / previous) * 100, trend: 'up' };
    } else if (current < previous) {
      return { change: ((current - previous) / previous) * 100, trend: 'down' };
    } else {
      return { change: 0, trend: 'stable' };
    }
  }

  formatPrice(price: number, currency: string = '₹'): string {
    return `${currency}${price.toFixed(2)}`;
  }

  formatPriceChange(change: number): string {
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  }
}

export const marketPriceService = new MarketPriceService();
