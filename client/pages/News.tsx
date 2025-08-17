import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "../contexts/LanguageContext";
import {
  Newspaper,
  Clock,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Search,
  Calendar,
  ExternalLink,
  Share2,
  Bookmark,
  Cloud,
  Droplets,
  Thermometer,
  Wind,
  Eye,
  MessageCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  authorAvatar: string;
  publishedAt: string;
  readTime: number;
  views: number;
  comments: number;
  image?: string;
  tags: string[];
  priority: "low" | "medium" | "high" | "urgent";
  location: string;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  condition: string;
  forecast: {
    day: string;
    temp: number;
    condition: string;
    rainfall: number;
  }[];
}

const mockNews: NewsArticle[] = [
  {
    id: "1",
    title: "Karnataka Government Announces ₹500 Crore Package for Bengaluru Farmers",
    summary: "New financial assistance scheme to support sustainable farming practices and crop insurance for farmers in Bengaluru district.",
    content: "The Karnataka state government has announced a comprehensive ₹500 crore package specifically for farmers in the Bengaluru district...",
    category: "Government Policy",
    author: "Rajesh Kumar",
    authorAvatar: "/api/placeholder/40/40",
    publishedAt: "2024-01-15T10:30:00Z",
    readTime: 5,
    views: 2340,
    comments: 45,
    image: "/api/placeholder/600/300",
    tags: ["government", "funding", "support", "bengaluru"],
    priority: "high",
    location: "Bengaluru"
  },
  {
    id: "2",
    title: "Weather Alert: Heavy Rains Expected in Bengaluru Rural This Week",
    summary: "Meteorological department issues warning for 3-day heavy rainfall period. Farmers advised to take protective measures.",
    content: "The Indian Meteorological Department has issued a weather alert for Bengaluru rural areas...",
    category: "Weather Alert",
    author: "Dr. Priya Sharma",
    authorAvatar: "/api/placeholder/40/40",
    publishedAt: "2024-01-14T15:45:00Z",
    readTime: 3,
    views: 1890,
    comments: 28,
    image: "/api/placeholder/600/300",
    tags: ["weather", "rainfall", "alert", "protection"],
    priority: "urgent",
    location: "Bengaluru Rural"
  },
  {
    id: "3",
    title: "Success Story: Organic Farmer in Kolar District Achieves 40% Yield Increase",
    summary: "Local farmer Suresh Gowda shares his journey from conventional to organic farming, inspiring other farmers in the region.",
    content: "Suresh Gowda, a progressive farmer from Kolar district near Bengaluru, has achieved remarkable success...",
    category: "Success Story",
    author: "Meena Krishnan",
    authorAvatar: "/api/placeholder/40/40",
    publishedAt: "2024-01-13T09:15:00Z",
    readTime: 7,
    views: 3450,
    comments: 67,
    image: "/api/placeholder/600/300",
    tags: ["organic", "success", "yield", "inspiration"],
    priority: "medium",
    location: "Kolar District"
  },
  {
    id: "4",
    title: "New Wholesale Market Opens in Electronic City for Vegetable Farmers",
    summary: "Modern facilities with cold storage and direct farmer-to-buyer connections now available for Bengaluru area farmers.",
    content: "A state-of-the-art wholesale market has opened in Electronic City, providing Bengaluru area farmers...",
    category: "Market News",
    author: "Arun Kumar",
    authorAvatar: "/api/placeholder/40/40",
    publishedAt: "2024-01-12T14:20:00Z",
    readTime: 4,
    views: 1560,
    comments: 32,
    image: "/api/placeholder/600/300",
    tags: ["market", "infrastructure", "vegetables", "electronic-city"],
    priority: "medium",
    location: "Electronic City"
  },
  {
    id: "5",
    title: "Integrated Pest Management Workshop Scheduled for Bengaluru Farmers",
    summary: "University of Agricultural Sciences to conduct free IPM training for local farmers next week.",
    content: "The University of Agricultural Sciences, Bengaluru will be conducting a comprehensive workshop...",
    category: "Education",
    author: "Prof. Ravi Kumar",
    authorAvatar: "/api/placeholder/40/40",
    publishedAt: "2024-01-11T11:30:00Z",
    readTime: 3,
    views: 890,
    comments: 15,
    tags: ["education", "ipm", "workshop", "training"],
    priority: "low",
    location: "Bengaluru"
  },
  {
    id: "6",
    title: "Drone Technology Pilot Program Launched for Bengaluru Area Farmers",
    summary: "Government initiative to provide precision agriculture services using drone technology for crop monitoring and spraying.",
    content: "The Karnataka government has launched an innovative drone technology pilot program...",
    category: "Technology",
    author: "Dr. Suresh Reddy",
    authorAvatar: "/api/placeholder/40/40",
    publishedAt: "2024-01-10T16:45:00Z",
    readTime: 6,
    views: 2100,
    comments: 38,
    image: "/api/placeholder/600/300",
    tags: ["technology", "drones", "precision-agriculture", "innovation"],
    priority: "high",
    location: "Bengaluru"
  }
];

const mockWeather: WeatherData = {
  temperature: 24,
  humidity: 75,
  rainfall: 2.5,
  windSpeed: 8,
  condition: "Partly Cloudy",
  forecast: [
    { day: "Today", temp: 24, condition: "Partly Cloudy", rainfall: 2.5 },
    { day: "Tomorrow", temp: 22, condition: "Light Rain", rainfall: 8.2 },
    { day: "Wed", temp: 20, condition: "Heavy Rain", rainfall: 15.4 },
    { day: "Thu", temp: 23, condition: "Cloudy", rainfall: 1.1 },
    { day: "Fri", temp: 26, condition: "Sunny", rainfall: 0 }
  ]
};

export default function News() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All News", count: mockNews.length },
    { id: "government", name: "Government", count: mockNews.filter(n => n.category.includes("Government")).length },
    { id: "weather", name: "Weather", count: mockNews.filter(n => n.category.includes("Weather")).length },
    { id: "market", name: "Market", count: mockNews.filter(n => n.category.includes("Market")).length },
    { id: "technology", name: "Technology", count: mockNews.filter(n => n.category.includes("Technology")).length },
    { id: "education", name: "Education", count: mockNews.filter(n => n.category.includes("Education")).length }
  ];

  const filteredNews = mockNews.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || 
                           article.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800 border-red-200";
      case "high": return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-leaf-50 via-white to-earth-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <Newspaper className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            {t('news.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('news.title')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Weather Widget */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Cloud className="h-5 w-5 mr-2" />
                  Bengaluru Weather
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{mockWeather.temperature}°C</div>
                  <div className="text-gray-600">{mockWeather.condition}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Droplets className="h-4 w-4 text-blue-500 mr-2" />
                    <div>
                      <div className="font-medium">{mockWeather.humidity}%</div>
                      <div className="text-gray-600">Humidity</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Wind className="h-4 w-4 text-gray-500 mr-2" />
                    <div>
                      <div className="font-medium">{mockWeather.windSpeed} km/h</div>
                      <div className="text-gray-600">Wind</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">5-Day Forecast</h4>
                  <div className="space-y-2">
                    {mockWeather.forecast.map((day, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="font-medium">{day.day}</span>
                        <div className="flex items-center space-x-2">
                          <span>{day.temp}°C</span>
                          <Droplets className="h-3 w-3 text-blue-500" />
                          <span className="text-blue-600">{day.rainfall}mm</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">News Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Articles</span>
                  <span className="font-semibold">{mockNews.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Urgent Alerts</span>
                  <Badge variant="destructive" className="text-xs">
                    {mockNews.filter(n => n.priority === "urgent").length}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">This Week</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Views</span>
                  <span className="font-semibold">12.3K</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Categories */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search news articles, topics, or locations..."
                  className="pl-10"
                />
              </div>

              <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                  {categories.map((category) => (
                    <TabsTrigger key={category.id} value={category.id} className="text-xs">
                      {category.name}
                      <Badge variant="secondary" className="ml-1 text-xs">
                        {category.count}
                      </Badge>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* News Articles */}
            <div className="space-y-6">
              {filteredNews.map((article, index) => (
                <Card key={article.id} className={cn(
                  "hover:shadow-lg transition-shadow",
                  index === 0 && article.priority === "urgent" && "border-red-200 bg-red-50/30"
                )}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge 
                            variant="outline" 
                            className={cn("text-xs", getPriorityColor(article.priority))}
                          >
                            {article.priority === "urgent" && <AlertTriangle className="h-3 w-3 mr-1" />}
                            {article.category}
                          </Badge>
                          {article.priority === "urgent" && (
                            <Badge variant="destructive" className="text-xs animate-pulse">
                              URGENT
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl mb-2 hover:text-primary cursor-pointer transition-colors">
                          {article.title}
                        </CardTitle>
                        <CardDescription className="text-gray-600 leading-relaxed">
                          {article.summary}
                        </CardDescription>
                      </div>
                      {article.image && (
                        <img 
                          src={article.image} 
                          alt={article.title}
                          className="ml-4 w-32 h-24 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={article.authorAvatar} />
                            <AvatarFallback>{article.author.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{article.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(article.publishedAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{article.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{article.views.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" className="text-gray-600">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {article.comments}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-600">
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-600">
                          <Bookmark className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{article.readTime} min read</span>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Read More
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center py-8">
              <Button variant="outline" size="lg">
                Load More Articles
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
