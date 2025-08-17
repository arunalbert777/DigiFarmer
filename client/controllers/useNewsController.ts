import { useState, useEffect, useCallback } from 'react';
import { newsService } from '../services/NewsService';
import { NewsArticle, NewsFilter, PaginatedResponse } from '../models/types';

export interface UseNewsControllerReturn {
  // State
  news: NewsArticle[];
  latestNews: NewsArticle[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  totalCount: number;
  
  // Actions
  loadNews: (filter?: NewsFilter, page?: number) => Promise<void>;
  loadLatestNews: (limit?: number) => Promise<void>;
  searchNews: (query: string) => Promise<void>;
  getNewsByCategory: (category: string) => Promise<void>;
  incrementViews: (id: string) => Promise<void>;
  refreshNews: () => Promise<void>;
  
  // Computed
  urgentNews: NewsArticle[];
  categorizedNews: Record<string, NewsArticle[]>;
}

export const useNewsController = (): UseNewsControllerReturn => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [latestNews, setLatestNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilter, setCurrentFilter] = useState<NewsFilter | undefined>();

  const loadNews = useCallback(async (filter?: NewsFilter, page: number = 1) => {
    setLoading(true);
    setError(null);

    // Use mock data by default for development
    const mockNews = newsService.getNewsMock();
    setNews(mockNews);
    setHasMore(false);
    setTotalCount(mockNews.length);
    setCurrentPage(page);
    setCurrentFilter(filter);
    setLoading(false);

    // Commented out API call for now - uncomment when backend is ready
    /*
    try {
      const response = await newsService.getNews(filter, page, 10);

      if (response.success && response.data) {
        const newNews = page === 1 ? response.data.data : [...news, ...response.data.data];
        setNews(newNews);
        setHasMore(response.data.hasMore);
        setTotalCount(response.data.total);
        setCurrentPage(page);
        setCurrentFilter(filter);
      } else {
        // Fallback to mock data
        const mockNews = newsService.getNewsMock();
        setNews(mockNews);
        setHasMore(false);
        setTotalCount(mockNews.length);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load news');
      // Fallback to mock data on error
      const mockNews = newsService.getNewsMock();
      setNews(mockNews);
    } finally {
      setLoading(false);
    }
    */
  }, []);

  const loadLatestNews = useCallback(async (limit: number = 5) => {
    // Use mock data by default for development
    const mockNews = newsService.getNewsMock().slice(0, limit);
    setLatestNews(mockNews);

    // Commented out API call for now - uncomment when backend is ready
    /*
    try {
      const response = await newsService.getLatestNews(limit);

      if (response.success && response.data) {
        setLatestNews(response.data);
      } else {
        // Fallback to mock data
        const mockNews = newsService.getNewsMock().slice(0, limit);
        setLatestNews(mockNews);
      }
    } catch (err) {
      // Fallback to mock data on error
      const mockNews = newsService.getNewsMock().slice(0, limit);
      setLatestNews(mockNews);
    }
    */
  }, []);

  const searchNews = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await newsService.searchNews(query, 20);
      
      if (response.success && response.data) {
        setNews(response.data);
        setHasMore(false);
      } else {
        // Fallback to filtered mock data
        const mockNews = newsService.getNewsMock().filter(article =>
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.summary.toLowerCase().includes(query.toLowerCase()) ||
          article.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
        setNews(mockNews);
        setHasMore(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search news');
    } finally {
      setLoading(false);
    }
  }, []);

  const getNewsByCategory = useCallback(async (category: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await newsService.getNewsByCategory(category, 20);
      
      if (response.success && response.data) {
        setNews(response.data);
        setHasMore(false);
      } else {
        // Fallback to filtered mock data
        const mockNews = newsService.getNewsMock().filter(article =>
          article.category.toLowerCase().includes(category.toLowerCase())
        );
        setNews(mockNews);
        setHasMore(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load category news');
    } finally {
      setLoading(false);
    }
  }, []);

  const incrementViews = useCallback(async (id: string) => {
    try {
      await newsService.incrementViews(id);
      // Update local state
      setNews(prev => prev.map(article => 
        article.id === id ? { ...article, views: article.views + 1 } : article
      ));
      setLatestNews(prev => prev.map(article => 
        article.id === id ? { ...article, views: article.views + 1 } : article
      ));
    } catch (err) {
      // Silently fail for view increments
      console.warn('Failed to increment views:', err);
    }
  }, []);

  const refreshNews = useCallback(async () => {
    await loadNews(currentFilter, 1);
  }, [loadNews, currentFilter]);

  const loadMoreNews = useCallback(async () => {
    if (hasMore && !loading) {
      await loadNews(currentFilter, currentPage + 1);
    }
  }, [loadNews, currentFilter, currentPage, hasMore, loading]);

  // Computed values
  const urgentNews = news.filter(article => article.priority === 'urgent');
  
  const categorizedNews = news.reduce((acc, article) => {
    const category = article.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(article);
    return acc;
  }, {} as Record<string, NewsArticle[]>);

  // Initial load
  useEffect(() => {
    loadNews();
    loadLatestNews();
  }, []);

  return {
    // State
    news,
    latestNews,
    loading,
    error,
    hasMore,
    totalCount,
    
    // Actions
    loadNews,
    loadLatestNews,
    searchNews,
    getNewsByCategory,
    incrementViews,
    refreshNews,
    
    // Computed
    urgentNews,
    categorizedNews,
  };
};
