import { useState, useEffect } from 'react';
import { useMarketplaceController } from '../controllers/useMarketplaceController';
import { useLanguage } from '../contexts/LanguageContext';
import { ProductFilter, ProductSort, Product } from '../models/types';
import { ProductCard } from '../components/ProductCard';
import { AddProductForm } from '../components/AddProductForm';
import { ProductFilters } from '../components/ProductFilters';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { 
  Plus, 
  Search, 
  SortAsc, 
  SortDesc, 
  Grid, 
  List, 
  MapPin, 
  TrendingUp,
  Users,
  Package
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

type ViewMode = 'grid' | 'list';

export function Marketplace() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const {
    products,
    featuredProducts,
    loading,
    error,
    loadProducts,
    loadFeaturedProducts,
    searchProducts,
    getProductsByCategory,
    createProduct,
    incrementViews,
    toggleLike,
    availableCategories,
    availableUnits,
    clearError
  } = useMarketplaceController();

  const [showAddForm, setShowAddForm] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ProductFilter>({});
  const [sort, setSort] = useState<ProductSort>({ field: 'createdAt', direction: 'desc' });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      clearError();
    }
  }, [error, toast, clearError]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchProducts(searchQuery.trim());
    } else {
      loadProducts(filters, sort);
    }
  };

  const handleFiltersChange = (newFilters: ProductFilter) => {
    setFilters(newFilters);
    loadProducts(newFilters, sort);
  };

  const handleSortChange = (field: string) => {
    const newSort: ProductSort = {
      field: field as ProductSort['field'],
      direction: sort.field === field && sort.direction === 'desc' ? 'asc' : 'desc'
    };
    setSort(newSort);
    loadProducts(filters, newSort);
  };

  const handleProductView = (product: Product) => {
    incrementViews(product.id);
    // In a real app, this would navigate to product detail page
    toast({
      title: product.title,
      description: `Price: ₹${product.price}/${product.unit} | Location: ${product.location}`,
    });
  };

  const handleProductContact = (product: Product) => {
    if (product.contact_phone) {
      const message = `Hi ${product.farmerName}, I'm interested in your ${product.title}. Is it still available?`;
      const whatsappUrl = `https://wa.me/${product.contact_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } else if (product.contact_email) {
      const subject = `Inquiry about ${product.title}`;
      const body = `Hi ${product.farmerName},\n\nI'm interested in your ${product.title}. Could you please provide more details?\n\nThank you!`;
      window.open(`mailto:${product.contact_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
    } else {
      toast({
        title: "Contact Information",
        description: `Contact ${product.farmerName} for this product`,
      });
    }
  };

  if (showAddForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <AddProductForm
            onSubmit={createProduct}
            onCancel={() => setShowAddForm(false)}
            loading={loading}
            availableCategories={availableCategories}
            availableUnits={availableUnits}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('marketplace.title')}
            </h1>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              {t('marketplace.subtitle')}
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-2">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{products.length}</div>
                <div className="text-sm text-gray-600">Products</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-2">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-gray-900">50+</div>
                <div className="text-sm text-gray-600">Farmers</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-2">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-gray-900">10+</div>
                <div className="text-sm text-gray-600">Locations</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-2">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-gray-900">100%</div>
                <div className="text-sm text-gray-600">Direct</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
              <Badge variant="secondary">Premium Selection</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={handleProductView}
                  onToggleLike={toggleLike}
                  onContact={handleProductContact}
                />
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ProductFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              availableCategories={availableCategories}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Search and Controls */}
            <Card className="mb-6">
              <CardHeader className="pb-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 flex gap-2">
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button onClick={handleSearch}>
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex gap-2">
                    <Select 
                      value={sort.field} 
                      onValueChange={handleSortChange}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="createdAt">Latest</SelectItem>
                        <SelectItem value="price">Price</SelectItem>
                        <SelectItem value="title">Name</SelectItem>
                        <SelectItem value="views">Popular</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSortChange(sort.field)}
                    >
                      {sort.direction === 'desc' ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
                    </Button>

                    <div className="flex border rounded-md">
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                      >
                        <Grid className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button onClick={() => setShowAddForm(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Sell Product
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading products...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <Alert className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Products Grid */}
            {!loading && products.length > 0 && (
              <div className={
                viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  : "space-y-4"
              }>
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={handleProductView}
                    onToggleLike={toggleLike}
                    onContact={handleProductContact}
                    className={viewMode === 'list' ? 'flex-row' : ''}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && products.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-4">
                    {Object.keys(filters).length > 0 
                      ? "Try adjusting your filters or search terms"
                      : "Be the first to list a product in the marketplace!"
                    }
                  </p>
                  <Button onClick={() => setShowAddForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your Product
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
