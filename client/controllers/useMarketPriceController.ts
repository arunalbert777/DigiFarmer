import { useState, useEffect, useCallback } from 'react';
import { marketPriceService } from '../services/MarketPriceService';
import { MarketPrice, MarketPriceFilter } from '../models/types';

export interface UseMarketPriceControllerReturn {
  // State
  marketPrices: MarketPrice[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  
  // Actions
  loadMarketPrices: (filter?: MarketPriceFilter) => Promise<void>;
  getCurrentPrices: (limit?: number) => Promise<void>;
  getPricesByCommodity: (commodity: string) => Promise<void>;
  getPricesByMarket: (market: string) => Promise<void>;
  refreshPrices: () => Promise<void>;
  
  // Computed
  pricesByMarket: Record<string, MarketPrice[]>;
  pricesByCommodity: Record<string, MarketPrice[]>;
  trendingUp: MarketPrice[];
  trendingDown: MarketPrice[];
  availableMarkets: string[];
  availableCommodities: string[];
  
  // Utilities
  formatPrice: (price: number) => string;
  formatPriceChange: (change: number) => string;
  getPriceChangeIcon: (trend: string) => string;
  getPriceChangeColor: (trend: string) => string;
}

export const useMarketPriceController = (): UseMarketPriceControllerReturn => {
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadMarketPrices = useCallback(async (filter?: MarketPriceFilter) => {
    setLoading(true);
    setError(null);

    // Use mock data by default for development
    const mockPrices = marketPriceService.getMarketPricesMock();
    setMarketPrices(mockPrices);
    setLastUpdated(new Date());
    setLoading(false);

    // Commented out API call for now - uncomment when backend is ready
    /*
    try {
      const response = await marketPriceService.getMarketPrices(filter, 1, 50);

      if (response.success && response.data) {
        setMarketPrices(response.data.data);
        setLastUpdated(new Date());
      } else {
        // Fallback to mock data
        const mockPrices = marketPriceService.getMarketPricesMock();
        setMarketPrices(mockPrices);
        setLastUpdated(new Date());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load market prices');
      // Fallback to mock data on error
      const mockPrices = marketPriceService.getMarketPricesMock();
      setMarketPrices(mockPrices);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
    */
  }, []);

  const getCurrentPrices = useCallback(async (limit: number = 10) => {
    setLoading(true);
    setError(null);

    // Use mock data by default for development
    const mockPrices = marketPriceService.getMarketPricesMock().slice(0, limit);
    setMarketPrices(mockPrices);
    setLastUpdated(new Date());
    setLoading(false);

    // Commented out API call for now - uncomment when backend is ready
    /*
    try {
      const response = await marketPriceService.getCurrentPrices(limit);

      if (response.success && response.data) {
        setMarketPrices(response.data);
        setLastUpdated(new Date());
      } else {
        // Fallback to mock data
        const mockPrices = marketPriceService.getMarketPricesMock().slice(0, limit);
        setMarketPrices(mockPrices);
        setLastUpdated(new Date());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load current prices');
      // Fallback to mock data
      const mockPrices = marketPriceService.getMarketPricesMock().slice(0, limit);
      setMarketPrices(mockPrices);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
    */
  }, []);

  const getPricesByCommodity = useCallback(async (commodity: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await marketPriceService.getPricesByCommodity(commodity);
      
      if (response.success && response.data) {
        setMarketPrices(response.data);
      } else {
        // Fallback to filtered mock data
        const mockPrices = marketPriceService.getMarketPricesMock()
          .filter(price => price.commodity.toLowerCase().includes(commodity.toLowerCase()));
        setMarketPrices(mockPrices);
      }
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load commodity prices');
    } finally {
      setLoading(false);
    }
  }, []);

  const getPricesByMarket = useCallback(async (market: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await marketPriceService.getPricesByMarket(market);
      
      if (response.success && response.data) {
        setMarketPrices(response.data);
      } else {
        // Fallback to filtered mock data
        const mockPrices = marketPriceService.getMarketPricesMock()
          .filter(price => price.market.toLowerCase().includes(market.toLowerCase()));
        setMarketPrices(mockPrices);
      }
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load market prices');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshPrices = useCallback(async () => {
    await getCurrentPrices();
  }, [getCurrentPrices]);

  // Computed values
  const pricesByMarket = marketPrices.reduce((acc, price) => {
    if (!acc[price.market]) {
      acc[price.market] = [];
    }
    acc[price.market].push(price);
    return acc;
  }, {} as Record<string, MarketPrice[]>);

  const pricesByCommodity = marketPrices.reduce((acc, price) => {
    if (!acc[price.commodity]) {
      acc[price.commodity] = [];
    }
    acc[price.commodity].push(price);
    return acc;
  }, {} as Record<string, MarketPrice[]>);

  const trendingUp = marketPrices.filter(price => price.trend === 'up');
  const trendingDown = marketPrices.filter(price => price.trend === 'down');
  
  const availableMarkets = [...new Set(marketPrices.map(price => price.market))];
  const availableCommodities = [...new Set(marketPrices.map(price => price.commodity))];

  // Utility functions
  const formatPrice = useCallback((price: number): string => {
    return marketPriceService.formatPrice(price);
  }, []);

  const formatPriceChange = useCallback((change: number): string => {
    return marketPriceService.formatPriceChange(change);
  }, []);

  const getPriceChangeIcon = useCallback((trend: string): string => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      case 'stable': return '→';
      default: return '→';
    }
  }, []);

  const getPriceChangeColor = useCallback((trend: string): string => {
    switch (trend) {
      case 'up': return 'text-green-600 bg-green-100';
      case 'down': return 'text-red-600 bg-red-100';
      case 'stable': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }, []);

  // Auto-refresh prices every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      refreshPrices();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [refreshPrices]);

  // Initial load
  useEffect(() => {
    getCurrentPrices();
  }, []);

  return {
    // State
    marketPrices,
    loading,
    error,
    lastUpdated,
    
    // Actions
    loadMarketPrices,
    getCurrentPrices,
    getPricesByCommodity,
    getPricesByMarket,
    refreshPrices,
    
    // Computed
    pricesByMarket,
    pricesByCommodity,
    trendingUp,
    trendingDown,
    availableMarkets,
    availableCommodities,
    
    // Utilities
    formatPrice,
    formatPriceChange,
    getPriceChangeIcon,
    getPriceChangeColor,
  };
};
