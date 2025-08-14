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

  // Generate daily updated news with current dates
  getNewsMock(): NewsArticle[] {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    // Get current day index for varied content
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);

    const newsTemplates = [
      {
        title: "Karnataka Government Announces New Agricultural Support Initiative",
        summary: "Latest government scheme to support farmers with digital technology and crop insurance.",
        content: "The Karnataka state government has announced a new initiative supporting farmers with modern agricultural technology...",
        category: "Government Policy",
        author: "Rajesh Kumar",
        priority: "high",
        location: "Bengaluru",
        tags: ["government", "technology", "support", "bengaluru"]
      },
      {
        title: "Weather Update: Monsoon Forecast for Bengaluru Agricultural Areas",
        summary: "Meteorological department releases weekly weather forecast for local farmers.",
        content: "The Indian Meteorological Department has issued the latest weather forecast...",
        category: "Weather Alert",
        author: "Dr. Priya Sharma",
        priority: "urgent",
        location: "Bengaluru Rural",
        tags: ["weather", "monsoon", "forecast", "planning"]
      },
      {
        title: "Success Story: Local Farmer Adopts Smart Irrigation Technology",
        summary: "Bengaluru area farmer increases water efficiency by 50% using IoT sensors.",
        content: "A progressive farmer near Bengaluru has achieved remarkable water savings...",
        category: "Success Story",
        author: "Meena Krishnan",
        priority: "medium",
        location: "Kolar District",
        tags: ["technology", "irrigation", "success", "water-saving"]
      },
      {
        title: "New Organic Farming Workshop Series Launches in Bengaluru",
        summary: "Free training sessions on organic farming methods start this week for local farmers.",
        content: "Agricultural University Bengaluru is launching a comprehensive workshop series...",
        category: "Education",
        author: "Prof. Ravi Kumar",
        priority: "medium",
        location: "Bengaluru",
        tags: ["education", "organic", "workshop", "training"]
      },
      {
        title: "Digital Marketplace Connects Bengaluru Farmers Directly to Buyers",
        summary: "New online platform eliminates middlemen, increases farmer profits by 30%.",
        content: "A revolutionary digital marketplace has launched in Bengaluru...",
        category: "Market News",
        author: "Arun Kumar",
        priority: "high",
        location: "Electronic City",
        tags: ["digital", "marketplace", "profits", "technology"]
      },
      {
        title: "Drone Technology Pilot Program Shows Promising Results",
        summary: "AI-powered drones help farmers monitor crop health and optimize pesticide usage.",
        content: "The latest drone technology pilot program in Bengaluru has shown remarkable results...",
        category: "Technology",
        author: "Dr. Suresh Reddy",
        priority: "medium",
        location: "Bengaluru",
        tags: ["drones", "ai", "crop-monitoring", "precision-agriculture"]
      }
    ];

    // Rotate news based on day of year to provide variety
    const selectedIndices = [
      dayOfYear % newsTemplates.length,
      (dayOfYear + 1) % newsTemplates.length,
      (dayOfYear + 2) % newsTemplates.length,
      (dayOfYear + 3) % newsTemplates.length
    ];

    return selectedIndices.map((templateIndex, index) => {
      const template = newsTemplates[templateIndex];
      const publishDate = index === 0 ? today :
                         index === 1 ? yesterday :
                         index === 2 ? twoDaysAgo : threeDaysAgo;

      return {
        id: (index + 1).toString(),
        title: template.title,
        summary: template.summary,
        content: template.content,
        category: template.category,
        author: template.author,
        authorAvatar: "/api/placeholder/40/40",
        publishedAt: publishDate,
        readTime: 3 + (index * 2),
        views: 1500 + (dayOfYear * 50) + (index * 200),
        comments: 25 + (index * 15),
        image: "/api/placeholder/600/300",
        tags: template.tags,
        priority: template.priority as "low" | "medium" | "high" | "urgent",
        location: template.location,
        createdAt: publishDate,
        updatedAt: publishDate,
      } as NewsArticle;
    });
  }
}

export const newsService = new NewsService();
