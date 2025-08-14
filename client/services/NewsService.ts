import { apiService } from './ApiService';
import { NewsArticle, NewsFilter, PaginatedResponse, ApiResponse } from '../models/types';

export class NewsService {
  private apiService = apiService;

  async getNews(filter?: NewsFilter, page?: number, limit?: number): Promise<ApiResponse<PaginatedResponse<NewsArticle>>> {
    return this.apiService.getPaginated<NewsArticle>('/news', page, limit, filter);
  }

  async getNewsById(id: string): Promise<ApiResponse<NewsArticle>> {
    return this.apiService.get<NewsArticle>(`/news/${id}`);
  }

  async getLatestNews(limit: number = 5): Promise<ApiResponse<NewsArticle[]>> {
    return this.apiService.get<NewsArticle[]>('/news/latest', { limit });
  }

  async searchNews(query: string, limit?: number): Promise<ApiResponse<NewsArticle[]>> {
    return this.apiService.get<NewsArticle[]>('/news/search', { q: query, limit });
  }

  async getNewsByCategory(category: string, limit?: number): Promise<ApiResponse<NewsArticle[]>> {
    return this.apiService.get<NewsArticle[]>(`/news/category/${category}`, { limit });
  }

  async getUrgentAlerts(): Promise<ApiResponse<NewsArticle[]>> {
    return this.apiService.get<NewsArticle[]>('/news/urgent');
  }

  async incrementViews(id: string): Promise<ApiResponse<void>> {
    return this.apiService.post<void>(`/news/${id}/view`, {});
  }

  // Mock data fallback for development
  getNewsMock(): NewsArticle[] {
    return [
      {
        id: "1",
        title: "Karnataka Government Announces ₹500 Crore Package for Bengaluru Farmers",
        summary: "New financial assistance scheme to support sustainable farming practices and crop insurance.",
        content: "The Karnataka state government has announced a comprehensive ₹500 crore package...",
        category: "Government Policy",
        author: "Rajesh Kumar",
        authorAvatar: "/api/placeholder/40/40",
        publishedAt: new Date("2024-01-15T10:30:00Z"),
        readTime: 5,
        views: 2340,
        comments: 45,
        image: "/api/placeholder/600/300",
        tags: ["government", "funding", "support", "bengaluru"],
        priority: "high",
        location: "Bengaluru",
        createdAt: new Date("2024-01-15T10:30:00Z"),
        updatedAt: new Date("2024-01-15T10:30:00Z"),
      },
      {
        id: "2",
        title: "Weather Alert: Heavy Rains Expected in Bengaluru Rural This Week",
        summary: "Meteorological department issues warning for 3-day heavy rainfall period.",
        content: "The Indian Meteorological Department has issued a weather alert...",
        category: "Weather Alert",
        author: "Dr. Priya Sharma",
        authorAvatar: "/api/placeholder/40/40",
        publishedAt: new Date("2024-01-14T15:45:00Z"),
        readTime: 3,
        views: 1890,
        comments: 28,
        image: "/api/placeholder/600/300",
        tags: ["weather", "rainfall", "alert", "protection"],
        priority: "urgent",
        location: "Bengaluru Rural",
        createdAt: new Date("2024-01-14T15:45:00Z"),
        updatedAt: new Date("2024-01-14T15:45:00Z"),
      },
      {
        id: "3",
        title: "New Wholesale Market Opens in Electronic City for Vegetable Farmers",
        summary: "Modern facilities with cold storage and direct farmer-to-buyer connections now available.",
        content: "A state-of-the-art wholesale market has opened in Electronic City...",
        category: "Market News",
        author: "Arun Kumar",
        authorAvatar: "/api/placeholder/40/40",
        publishedAt: new Date("2024-01-12T14:20:00Z"),
        readTime: 4,
        views: 1560,
        comments: 32,
        image: "/api/placeholder/600/300",
        tags: ["market", "infrastructure", "vegetables", "electronic-city"],
        priority: "medium",
        location: "Electronic City",
        createdAt: new Date("2024-01-12T14:20:00Z"),
        updatedAt: new Date("2024-01-12T14:20:00Z"),
      }
    ];
  }
}

export const newsService = new NewsService();
