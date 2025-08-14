import { Heart, MapPin, Clock, Eye, Phone, Mail, Star } from 'lucide-react';
import { Product } from '../models/types';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
  onToggleLike?: (productId: string) => void;
  onContact?: (product: Product) => void;
  showFarmerInfo?: boolean;
  className?: string;
}

export function ProductCard({ 
  product, 
  onViewDetails, 
  onToggleLike, 
  onContact,
  showFarmerInfo = true,
  className = "" 
}: ProductCardProps) {
  const formatPrice = (price: number, unit: string) => {
    return `₹${price.toLocaleString()}/${unit}`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short'
    }).format(date);
  };

  const isExpiringSoon = () => {
    if (!product.expiry_date) return false;
    const daysUntilExpiry = Math.ceil((product.expiry_date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  };

  const isExpired = () => {
    if (!product.expiry_date) return false;
    return product.expiry_date < new Date();
  };

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 ${className}`}>
      <CardHeader className="p-0">
        <div className="relative">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-48 object-cover rounded-t-lg"
            onClick={() => onViewDetails?.(product)}
          />
          
          {/* Status badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.featured && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                Featured
              </Badge>
            )}
            {product.is_organic && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Organic
              </Badge>
            )}
            {product.quality_grade && (
              <Badge variant="outline" className="bg-white/90">
                Grade {product.quality_grade}
              </Badge>
            )}
          </div>

          {/* Like button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 bg-white/90 hover:bg-white"
            onClick={() => onToggleLike?.(product.id)}
          >
            <Heart className="h-4 w-4" />
            <span className="text-xs ml-1">{product.likes}</span>
          </Button>

          {/* Expiry warning */}
          {isExpiringSoon() && (
            <div className="absolute bottom-2 left-2">
              <Badge variant="destructive" className="bg-orange-100 text-orange-800">
                <Clock className="h-3 w-3 mr-1" />
                Expires {formatDate(product.expiry_date!)}
              </Badge>
            </div>
          )}

          {isExpired() && (
            <div className="absolute inset-0 bg-black/50 rounded-t-lg flex items-center justify-center">
              <Badge variant="destructive">Expired</Badge>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Product title and price */}
          <div className="flex justify-between items-start">
            <h3 
              className="font-semibold text-lg leading-tight cursor-pointer hover:text-primary"
              onClick={() => onViewDetails?.(product)}
            >
              {product.title}
            </h3>
            <div className="text-right ml-2">
              <div className="font-bold text-primary text-lg">
                {formatPrice(product.price, product.unit)}
              </div>
              {product.negotiable && (
                <span className="text-xs text-muted-foreground">Negotiable</span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>

          {/* Quantity and minimum order */}
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Available: {product.quantity} {product.unit}</span>
            {product.minOrder && (
              <span>Min order: {product.minOrder} {product.unit}</span>
            )}
          </div>

          {/* Location and views */}
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{product.location}</span>
            </div>
            <div className="flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              <span>{product.views}</span>
            </div>
          </div>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {product.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{product.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Farmer info */}
          {showFarmerInfo && (
            <div className="flex items-center space-x-2 pt-2 border-t">
              <Avatar className="h-8 w-8">
                <AvatarImage src={product.farmerAvatar} />
                <AvatarFallback>
                  {product.farmerName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">{product.farmerName}</p>
                <p className="text-xs text-muted-foreground">Farmer</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => onViewDetails?.(product)}
        >
          View Details
        </Button>
        <Button 
          className="flex-1"
          onClick={() => onContact?.(product)}
        >
          <Phone className="h-4 w-4 mr-1" />
          Contact
        </Button>
      </CardFooter>
    </Card>
  );
}
