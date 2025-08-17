import { apiService } from './ApiService';
import { Product, CreateProductData, ProductFilter, ProductSort, PaginatedResponse, ApiResponse } from '../models/types';

export class MarketplaceService {
  private apiService = apiService;

  async getProducts(filter?: ProductFilter, sort?: ProductSort, page?: number, limit?: number): Promise<ApiResponse<PaginatedResponse<Product>>> {
    const params = {
      ...filter,
      sortField: sort?.field,
      sortDirection: sort?.direction,
    };
    return this.apiService.getPaginated<Product>('/marketplace/products', page, limit, params);
  }

  async getProductById(id: string): Promise<ApiResponse<Product>> {
    return this.apiService.get<Product>(`/marketplace/products/${id}`);
  }

  async createProduct(productData: CreateProductData): Promise<ApiResponse<Product>> {
    return this.apiService.post<Product>('/marketplace/products', productData);
  }

  async updateProduct(id: string, productData: Partial<CreateProductData>): Promise<ApiResponse<Product>> {
    return this.apiService.put<Product>(`/marketplace/products/${id}`, productData);
  }

  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    return this.apiService.delete<void>(`/marketplace/products/${id}`);
  }

  async getMyProducts(farmerId: string, page?: number, limit?: number): Promise<ApiResponse<PaginatedResponse<Product>>> {
    return this.apiService.getPaginated<Product>(`/marketplace/farmers/${farmerId}/products`, page, limit);
  }

  async getFeaturedProducts(limit?: number): Promise<ApiResponse<Product[]>> {
    return this.apiService.get<Product[]>('/marketplace/products/featured', { limit });
  }

  async searchProducts(query: string, limit?: number): Promise<ApiResponse<Product[]>> {
    return this.apiService.get<Product[]>('/marketplace/products/search', { q: query, limit });
  }

  async getProductsByCategory(category: string, limit?: number): Promise<ApiResponse<Product[]>> {
    return this.apiService.get<Product[]>(`/marketplace/products/category/${category}`, { limit });
  }

  async incrementViews(id: string): Promise<ApiResponse<void>> {
    return this.apiService.post<void>(`/marketplace/products/${id}/view`, {});
  }

  async toggleLike(id: string): Promise<ApiResponse<{ liked: boolean; totalLikes: number }>> {
    return this.apiService.post<{ liked: boolean; totalLikes: number }>(`/marketplace/products/${id}/like`, {});
  }

  async uploadProductImages(files: File[]): Promise<ApiResponse<string[]>> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`image_${index}`, file);
    });
    return this.apiService.post<string[]>('/marketplace/upload', formData);
  }

  // Generate mock products for development
  getProductsMock(): Product[] {
    const today = new Date();
    const mockFarmers = [
      { id: '1', name: 'Rajesh Kumar', avatar: '/api/placeholder/40/40', location: 'Bengaluru Rural' },
      { id: '2', name: 'Priya Sharma', avatar: '/api/placeholder/40/40', location: 'Kolar District' },
      { id: '3', name: 'Suresh Reddy', avatar: '/api/placeholder/40/40', location: 'Electronic City' },
      { id: '4', name: 'Meena Krishnan', avatar: '/api/placeholder/40/40', location: 'Whitefield' },
      { id: '5', name: 'Ravi Kumar', avatar: '/api/placeholder/40/40', location: 'Hebbal' },
    ];

    const categories = ['Fruits', 'Vegetables', 'Grains', 'Pulses', 'Spices', 'Dairy', 'Organic'] as const;
    const units = ['kg', 'piece', 'dozen', 'liter', 'bag', 'quintal'] as const;
    
    const productTemplates = [
      {
        title: 'Fresh Organic Tomatoes',
        description: 'Premium quality organic tomatoes grown without pesticides. Perfect for cooking and salads.',
        category: 'Vegetables' as const,
        price: 45,
        unit: 'kg' as const,
        quantity: 500,
        minOrder: 5,
        is_organic: true,
        quality_grade: 'A' as const,
        tags: ['organic', 'fresh', 'premium', 'pesticide-free'],
        contact_phone: '+91 9876543210'
      },
      {
        title: 'Karnataka Mangoes - Alphonso',
        description: 'Sweet and juicy Alphonso mangoes directly from Karnataka farms. Limited season availability.',
        category: 'Fruits' as const,
        price: 120,
        unit: 'kg' as const,
        quantity: 200,
        minOrder: 2,
        is_organic: false,
        quality_grade: 'A' as const,
        tags: ['alphonso', 'seasonal', 'sweet', 'premium'],
        contact_phone: '+91 9876543211'
      },
      {
        title: 'Fresh Farm Milk',
        description: 'Pure cow milk delivered fresh every morning. Rich in nutrients and completely natural.',
        category: 'Dairy' as const,
        price: 35,
        unit: 'liter' as const,
        quantity: 100,
        minOrder: 2,
        is_organic: true,
        quality_grade: 'A' as const,
        tags: ['fresh', 'pure', 'cow-milk', 'daily'],
        contact_phone: '+91 9876543212'
      },
      {
        title: 'Basmati Rice - Premium',
        description: 'Long grain basmati rice with excellent aroma and taste. Aged for perfect texture.',
        category: 'Grains' as const,
        price: 80,
        unit: 'kg' as const,
        quantity: 1000,
        minOrder: 25,
        is_organic: false,
        quality_grade: 'A' as const,
        tags: ['basmati', 'premium', 'aromatic', 'aged'],
        contact_phone: '+91 9876543213'
      },
      {
        title: 'Organic Spinach Bunch',
        description: 'Fresh green organic spinach leaves. Rich in iron and vitamins. Perfect for healthy meals.',
        category: 'Vegetables' as const,
        price: 15,
        unit: 'piece' as const,
        quantity: 50,
        minOrder: 5,
        is_organic: true,
        quality_grade: 'A' as const,
        tags: ['organic', 'leafy', 'iron-rich', 'healthy'],
        contact_phone: '+91 9876543214'
      },
      {
        title: 'Red Chili Powder',
        description: 'Pure red chili powder made from sun-dried chilies. No artificial colors or preservatives.',
        category: 'Spices' as const,
        price: 150,
        unit: 'kg' as const,
        quantity: 20,
        minOrder: 1,
        is_organic: false,
        quality_grade: 'A' as const,
        tags: ['spicy', 'pure', 'traditional', 'sun-dried'],
        contact_phone: '+91 9876543215'
      },
      {
        title: 'Fresh Coconuts',
        description: 'Fresh tender coconuts with sweet water. Perfect for drinking and cooking.',
        category: 'Fruits' as const,
        price: 25,
        unit: 'piece' as const,
        quantity: 100,
        minOrder: 6,
        is_organic: false,
        quality_grade: 'A' as const,
        tags: ['tender', 'fresh', 'sweet-water', 'natural'],
        contact_phone: '+91 9876543216'
      },
      {
        title: 'Black Gram (Urad Dal)',
        description: 'Premium quality black gram dal. Rich in protein and perfect for South Indian dishes.',
        category: 'Pulses' as const,
        price: 90,
        unit: 'kg' as const,
        quantity: 300,
        minOrder: 5,
        is_organic: false,
        quality_grade: 'A' as const,
        tags: ['protein-rich', 'premium', 'urad-dal', 'south-indian'],
        contact_phone: '+91 9876543217'
      }
    ];

    return productTemplates.map((template, index) => {
      const farmer = mockFarmers[index % mockFarmers.length];
      const createdDate = new Date(today);
      createdDate.setDate(createdDate.getDate() - (index * 2));
      
      const harvestDate = new Date(createdDate);
      harvestDate.setDate(harvestDate.getDate() - Math.floor(Math.random() * 7));
      
      const expiryDate = new Date(createdDate);
      if (template.category === 'Dairy') {
        expiryDate.setDate(expiryDate.getDate() + 3);
      } else if (template.category === 'Vegetables' || template.category === 'Fruits') {
        expiryDate.setDate(expiryDate.getDate() + 7);
      } else {
        expiryDate.setMonth(expiryDate.getMonth() + 6);
      }

      return {
        id: (index + 1).toString(),
        farmerId: farmer.id,
        farmerName: farmer.name,
        farmerAvatar: farmer.avatar,
        title: template.title,
        description: template.description,
        category: template.category,
        price: template.price,
        unit: template.unit,
        quantity: template.quantity,
        minOrder: template.minOrder,
        images: [
          '/api/placeholder/400/300',
          '/api/placeholder/400/301',
          '/api/placeholder/400/302'
        ],
        location: farmer.location,
        harvest_date: harvestDate,
        expiry_date: expiryDate,
        is_organic: template.is_organic,
        quality_grade: template.quality_grade,
        tags: template.tags,
        status: 'available' as const,
        views: Math.floor(Math.random() * 100) + 50,
        likes: Math.floor(Math.random() * 20) + 5,
        contact_phone: template.contact_phone,
        contact_email: `${farmer.name.toLowerCase().replace(' ', '.')}@farmer.com`,
        negotiable: Math.random() > 0.5,
        featured: index < 3,
        createdAt: createdDate,
        updatedAt: createdDate,
      } as Product;
    });
  }

  getProductCategories(): string[] {
    return ['Fruits', 'Vegetables', 'Grains', 'Pulses', 'Spices', 'Dairy', 'Organic', 'Seeds', 'Equipment', 'Other'];
  }

  getProductUnits(): string[] {
    return ['kg', 'gram', 'ton', 'piece', 'dozen', 'liter', 'bag', 'quintal'];
  }
}

export const marketplaceService = new MarketplaceService();
