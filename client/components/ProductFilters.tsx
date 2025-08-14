import { useState } from 'react';
import { ProductFilter } from '../models/types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { X, Filter, RotateCcw } from 'lucide-react';

interface ProductFiltersProps {
  filters: ProductFilter;
  onFiltersChange: (filters: ProductFilter) => void;
  availableCategories: string[];
  className?: string;
}

export function ProductFilters({ 
  filters, 
  onFiltersChange, 
  availableCategories,
  className = "" 
}: ProductFiltersProps) {
  const [localFilters, setLocalFilters] = useState<ProductFilter>(filters);
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof ProductFilter, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
  };

  const clearFilters = () => {
    const emptyFilters: ProductFilter = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const hasActiveFilters = Object.keys(filters).some(key => 
    filters[key as keyof ProductFilter] !== undefined && 
    filters[key as keyof ProductFilter] !== ''
  );

  const getActiveFilterCount = () => {
    return Object.keys(filters).filter(key => {
      const value = filters[key as keyof ProductFilter];
      return value !== undefined && value !== '' && value !== null;
    }).length;
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFilterCount()}
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="md:hidden"
            >
              {isExpanded ? 'Hide' : 'Show'}
            </Button>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-red-600 hover:text-red-700"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className={`space-y-4 ${!isExpanded ? 'hidden md:block' : ''}`}>
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search Products</Label>
          <Input
            id="search"
            placeholder="Search by title, description, or tags"
            value={localFilters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select 
            value={localFilters.category || ''} 
            onValueChange={(value) => updateFilter('category', value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All categories</SelectItem>
              {availableCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label>Price Range (₹)</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={localFilters.minPrice || ''}
              onChange={(e) => updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
            />
            <Input
              type="number"
              placeholder="Max"
              value={localFilters.maxPrice || ''}
              onChange={(e) => updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="Search by location"
            value={localFilters.location || ''}
            onChange={(e) => updateFilter('location', e.target.value)}
          />
        </div>

        {/* Quality Grade */}
        <div className="space-y-2">
          <Label htmlFor="quality_grade">Quality Grade</Label>
          <Select 
            value={localFilters.quality_grade || ''} 
            onValueChange={(value) => updateFilter('quality_grade', value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any grade</SelectItem>
              <SelectItem value="A">Grade A</SelectItem>
              <SelectItem value="B">Grade B</SelectItem>
              <SelectItem value="C">Grade C</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Organic Filter */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_organic"
            checked={localFilters.is_organic === true}
            onCheckedChange={(checked) => 
              updateFilter('is_organic', checked ? true : undefined)
            }
          />
          <Label htmlFor="is_organic">Organic Products Only</Label>
        </div>

        {/* Apply Filters Button */}
        <div className="flex gap-2 pt-4">
          <Button 
            onClick={applyFilters} 
            className="flex-1"
          >
            Apply Filters
          </Button>
          {hasActiveFilters && (
            <Button 
              variant="outline"
              onClick={clearFilters}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="pt-4 border-t">
            <Label className="text-sm font-medium">Active Filters:</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {filters.category && (
                <Badge variant="secondary" className="cursor-pointer">
                  Category: {filters.category}
                  <X 
                    className="h-3 w-3 ml-1" 
                    onClick={() => updateFilter('category', undefined)}
                  />
                </Badge>
              )}
              {filters.is_organic && (
                <Badge variant="secondary" className="cursor-pointer">
                  Organic
                  <X 
                    className="h-3 w-3 ml-1" 
                    onClick={() => updateFilter('is_organic', undefined)}
                  />
                </Badge>
              )}
              {filters.quality_grade && (
                <Badge variant="secondary" className="cursor-pointer">
                  Grade {filters.quality_grade}
                  <X 
                    className="h-3 w-3 ml-1" 
                    onClick={() => updateFilter('quality_grade', undefined)}
                  />
                </Badge>
              )}
              {filters.location && (
                <Badge variant="secondary" className="cursor-pointer">
                  {filters.location}
                  <X 
                    className="h-3 w-3 ml-1" 
                    onClick={() => updateFilter('location', undefined)}
                  />
                </Badge>
              )}
              {(filters.minPrice || filters.maxPrice) && (
                <Badge variant="secondary" className="cursor-pointer">
                  ₹{filters.minPrice || 0} - ₹{filters.maxPrice || '∞'}
                  <X 
                    className="h-3 w-3 ml-1" 
                    onClick={() => {
                      updateFilter('minPrice', undefined);
                      updateFilter('maxPrice', undefined);
                    }}
                  />
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
