import { useState, useEffect, useCallback } from 'react';
import { marketplaceService } from '../services/MarketplaceService';
import { Product, CreateProductData, ProductFilter, ProductSort, PaginatedResponse } from '../models/types';

export interface UseMarketplaceControllerReturn {
  // State
  products: Product[];
  featuredProducts: Product[];
  myProducts: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  totalCount: number;
  
  // Actions
  loadProducts: (filter?: ProductFilter, sort?: ProductSort, page?: number) => Promise<void>;
  loadFeaturedProducts: (limit?: number) => Promise<void>;
  loadMyProducts: (farmerId: string, page?: number) => Promise<void>;
  searchProducts: (query: string) => Promise<void>;
  getProductsByCategory: (category: string) => Promise<void>;
  getProductById: (id: string) => Promise<void>;
  createProduct: (productData: CreateProductData) => Promise<boolean>;
  updateProduct: (id: string, productData: Partial<CreateProductData>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  incrementViews: (id: string) => Promise<void>;
  toggleLike: (id: string) => Promise<void>;
  uploadImages: (files: File[]) => Promise<string[]>;
  refreshProducts: () => Promise<void>;
  clearError: () => void;
  
  // Computed
  categorizedProducts: Record<string, Product[]>;
  availableCategories: string[];
  availableUnits: string[];
}

export const useMarketplaceController = (): UseMarketplaceControllerReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilter, setCurrentFilter] = useState<ProductFilter | undefined>();
  const [currentSort, setCurrentSort] = useState<ProductSort | undefined>();

  const loadProducts = useCallback(async (filter?: ProductFilter, sort?: ProductSort, page: number = 1) => {
    setLoading(true);
    setError(null);

    // Use mock data by default for development
    const mockProducts = marketplaceService.getProductsMock();
    
    // Apply filtering
    let filteredProducts = mockProducts;
    if (filter) {
      filteredProducts = mockProducts.filter(product => {
        if (filter.category && product.category !== filter.category) return false;
        if (filter.location && !product.location.toLowerCase().includes(filter.location.toLowerCase())) return false;
        if (filter.is_organic !== undefined && product.is_organic !== filter.is_organic) return false;
        if (filter.minPrice && product.price < filter.minPrice) return false;
        if (filter.maxPrice && product.price > filter.maxPrice) return false;
        if (filter.quality_grade && product.quality_grade !== filter.quality_grade) return false;
        if (filter.status && product.status !== filter.status) return false;
        if (filter.farmerId && product.farmerId !== filter.farmerId) return false;
        if (filter.search && !product.title.toLowerCase().includes(filter.search.toLowerCase()) &&
            !product.description.toLowerCase().includes(filter.search.toLowerCase())) return false;
        if (filter.tags && filter.tags.length > 0 && 
            !filter.tags.some(tag => product.tags.includes(tag))) return false;
        return true;
      });
    }

    // Apply sorting
    if (sort) {
      filteredProducts.sort((a, b) => {
        const aValue = a[sort.field];
        const bValue = b[sort.field];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sort.direction === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sort.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        if (aValue instanceof Date && bValue instanceof Date) {
          return sort.direction === 'asc' 
            ? aValue.getTime() - bValue.getTime()
            : bValue.getTime() - aValue.getTime();
        }
        
        return 0;
      });
    }

    setProducts(filteredProducts);
    setHasMore(false);
    setTotalCount(filteredProducts.length);
    setCurrentPage(page);
    setCurrentFilter(filter);
    setCurrentSort(sort);
    setLoading(false);

    // Commented out API call for now - uncomment when backend is ready
    /*
    try {
      const response = await marketplaceService.getProducts(filter, sort, page, 12);

      if (response.success && response.data) {
        const newProducts = page === 1 ? response.data.data : [...products, ...response.data.data];
        setProducts(newProducts);
        setHasMore(response.data.hasMore);
        setTotalCount(response.data.total);
        setCurrentPage(page);
        setCurrentFilter(filter);
        setCurrentSort(sort);
      } else {
        // Fallback to mock data
        const mockProducts = marketplaceService.getProductsMock();
        setProducts(mockProducts);
        setHasMore(false);
        setTotalCount(mockProducts.length);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
      // Fallback to mock data on error
      const mockProducts = marketplaceService.getProductsMock();
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
    */
  }, []);

  const loadFeaturedProducts = useCallback(async (limit: number = 6) => {
    // Use mock data by default for development
    const mockProducts = marketplaceService.getProductsMock().filter(p => p.featured).slice(0, limit);
    setFeaturedProducts(mockProducts);

    // Commented out API call for now
    /*
    try {
      const response = await marketplaceService.getFeaturedProducts(limit);
      if (response.success && response.data) {
        setFeaturedProducts(response.data);
      } else {
        const mockProducts = marketplaceService.getProductsMock().filter(p => p.featured).slice(0, limit);
        setFeaturedProducts(mockProducts);
      }
    } catch (err) {
      const mockProducts = marketplaceService.getProductsMock().filter(p => p.featured).slice(0, limit);
      setFeaturedProducts(mockProducts);
    }
    */
  }, []);

  const loadMyProducts = useCallback(async (farmerId: string, page: number = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await marketplaceService.getMyProducts(farmerId, page, 12);
      
      if (response.success && response.data) {
        const newProducts = page === 1 ? response.data.data : [...myProducts, ...response.data.data];
        setMyProducts(newProducts);
        setHasMore(response.data.hasMore);
      } else {
        // Fallback to filtered mock data
        const mockProducts = marketplaceService.getProductsMock().filter(p => p.farmerId === farmerId);
        setMyProducts(mockProducts);
        setHasMore(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load your products');
      // Fallback to filtered mock data
      const mockProducts = marketplaceService.getProductsMock().filter(p => p.farmerId === farmerId);
      setMyProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  }, [myProducts]);

  const searchProducts = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await marketplaceService.searchProducts(query, 20);
      
      if (response.success && response.data) {
        setProducts(response.data);
        setHasMore(false);
      } else {
        // Fallback to filtered mock data
        const mockProducts = marketplaceService.getProductsMock().filter(product =>
          product.title.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          product.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
        setProducts(mockProducts);
        setHasMore(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search products');
    } finally {
      setLoading(false);
    }
  }, []);

  const getProductsByCategory = useCallback(async (category: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await marketplaceService.getProductsByCategory(category, 20);
      
      if (response.success && response.data) {
        setProducts(response.data);
        setHasMore(false);
      } else {
        // Fallback to filtered mock data
        const mockProducts = marketplaceService.getProductsMock().filter(product =>
          product.category.toLowerCase().includes(category.toLowerCase())
        );
        setProducts(mockProducts);
        setHasMore(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load category products');
    } finally {
      setLoading(false);
    }
  }, []);

  const getProductById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await marketplaceService.getProductById(id);
      
      if (response.success && response.data) {
        setCurrentProduct(response.data);
      } else {
        // Fallback to mock data
        const mockProduct = marketplaceService.getProductsMock().find(p => p.id === id);
        setCurrentProduct(mockProduct || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load product details');
      // Fallback to mock data
      const mockProduct = marketplaceService.getProductsMock().find(p => p.id === id);
      setCurrentProduct(mockProduct || null);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (productData: CreateProductData): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await marketplaceService.createProduct(productData);
      
      if (response.success && response.data) {
        // Add new product to local state
        setProducts(prev => [response.data!, ...prev]);
        setMyProducts(prev => [response.data!, ...prev]);
        return true;
      } else {
        setError(response.error || 'Failed to create product');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProduct = useCallback(async (id: string, productData: Partial<CreateProductData>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await marketplaceService.updateProduct(id, productData);
      
      if (response.success && response.data) {
        // Update product in local state
        const updateProductInState = (prev: Product[]) => 
          prev.map(product => product.id === id ? response.data! : product);
        
        setProducts(updateProductInState);
        setMyProducts(updateProductInState);
        setFeaturedProducts(updateProductInState);
        
        if (currentProduct?.id === id) {
          setCurrentProduct(response.data);
        }
        
        return true;
      } else {
        setError(response.error || 'Failed to update product');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentProduct]);

  const deleteProduct = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await marketplaceService.deleteProduct(id);
      
      if (response.success) {
        // Remove product from local state
        const removeProductFromState = (prev: Product[]) => prev.filter(product => product.id !== id);
        
        setProducts(removeProductFromState);
        setMyProducts(removeProductFromState);
        setFeaturedProducts(removeProductFromState);
        
        if (currentProduct?.id === id) {
          setCurrentProduct(null);
        }
        
        return true;
      } else {
        setError(response.error || 'Failed to delete product');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentProduct]);

  const incrementViews = useCallback(async (id: string) => {
    try {
      await marketplaceService.incrementViews(id);
      // Update local state
      const updateViews = (prev: Product[]) => prev.map(product => 
        product.id === id ? { ...product, views: product.views + 1 } : product
      );
      
      setProducts(updateViews);
      setMyProducts(updateViews);
      setFeaturedProducts(updateViews);
      
      if (currentProduct?.id === id) {
        setCurrentProduct(prev => prev ? { ...prev, views: prev.views + 1 } : null);
      }
    } catch (err) {
      // Silently fail for view increments
      console.warn('Failed to increment views:', err);
    }
  }, [currentProduct]);

  const toggleLike = useCallback(async (id: string) => {
    try {
      const response = await marketplaceService.toggleLike(id);
      
      if (response.success && response.data) {
        // Update local state
        const updateLikes = (prev: Product[]) => prev.map(product => 
          product.id === id ? { ...product, likes: response.data!.totalLikes } : product
        );
        
        setProducts(updateLikes);
        setMyProducts(updateLikes);
        setFeaturedProducts(updateLikes);
        
        if (currentProduct?.id === id) {
          setCurrentProduct(prev => prev ? { ...prev, likes: response.data!.totalLikes } : null);
        }
      }
    } catch (err) {
      console.warn('Failed to toggle like:', err);
    }
  }, [currentProduct]);

  const uploadImages = useCallback(async (files: File[]): Promise<string[]> => {
    try {
      const response = await marketplaceService.uploadProductImages(files);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to upload images');
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to upload images');
    }
  }, []);

  const refreshProducts = useCallback(async () => {
    await loadProducts(currentFilter, currentSort, 1);
  }, [loadProducts, currentFilter, currentSort]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Computed values
  const categorizedProducts = products.reduce((acc, product) => {
    const category = product.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  const availableCategories = marketplaceService.getProductCategories();
  const availableUnits = marketplaceService.getProductUnits();

  // Initial load
  useEffect(() => {
    loadProducts();
    loadFeaturedProducts();
  }, []);

  return {
    // State
    products,
    featuredProducts,
    myProducts,
    currentProduct,
    loading,
    error,
    hasMore,
    totalCount,
    
    // Actions
    loadProducts,
    loadFeaturedProducts,
    loadMyProducts,
    searchProducts,
    getProductsByCategory,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    incrementViews,
    toggleLike,
    uploadImages,
    refreshProducts,
    clearError,
    
    // Computed
    categorizedProducts,
    availableCategories,
    availableUnits,
  };
};
