import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNewsController } from "../controllers/useNewsController";
import { useMarketPriceController } from "../controllers/useMarketPriceController";
import {
  Scan,
  Bot,
  Users,
  UserCheck,
  ArrowRight,
  CheckCircle,
  Leaf,
  Camera,
  MessageCircle,
  TrendingUp,
  Shield,
  Globe,
  Newspaper,
  DollarSign,
  Clock,
  MapPin,
  AlertTriangle,
  Calendar,
  ExternalLink,
  RefreshCw
} from "lucide-react";

const features = [
  {
    icon: Scan,
    title: "Disease Detection",
    description: "AI-powered plant disease identification using advanced CNN technology. Upload plant images for instant diagnosis.",
    path: "/disease-detection",
    color: "bg-red-50 text-red-600",
    benefits: ["200+ disease detection", "90%+ accuracy", "Instant results"]
  },
  {
    icon: Bot,
    title: "AI Assistant",
    description: "24/7 intelligent farming assistant for instant answers to agricultural questions and personalized advice.",
    path: "/ai-chat",
    color: "bg-blue-50 text-blue-600",
    benefits: ["Instant responses", "Expert knowledge", "Personalized advice"]
  },
  {
    icon: Users,
    title: "Community",
    description: "Connect with fellow farmers, share experiences, and learn from agricultural experts worldwide.",
    path: "/community",
    color: "bg-purple-50 text-purple-600",
    benefits: ["Global network", "Experience sharing", "Peer support"]
  },
  {
    icon: UserCheck,
    title: "Expert Consultation",
    description: "Book one-on-one consultations with certified agricultural experts for personalized farm management.",
    path: "/experts",
    color: "bg-green-50 text-green-600",
    benefits: ["Certified experts", "Personalized advice", "Flexible scheduling"]
  }
];

const stats = [
  { label: "Farmers Helped", value: "50K+", icon: Users },
  { label: "Diseases Detected", value: "200+", icon: Scan },
  { label: "Success Rate", value: "94%", icon: TrendingUp },
  { label: "Countries", value: "25+", icon: Globe }
];

export default function Index() {
  // Initialize MVC controllers
  const newsController = useNewsController();
  const priceController = useMarketPriceController();

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-leaf-50 via-white to-earth-50">
      {/* Hero Section */}
      <section className="relative px-6 lg:px-8 pb-24 pt-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8">
            <Badge variant="secondary" className="mb-4">
              <Leaf className="h-3 w-3 mr-1" />
              Powered by Advanced AI
            </Badge>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
            Revolutionize Your
            <span className="text-primary block">Agricultural Journey</span>
          </h1>
          
          <p className="text-lg leading-8 text-gray-600 mb-10 max-w-2xl mx-auto">
            Empower your farming with AI-driven disease detection, expert consultation, and a thriving community. 
            Make data-driven decisions to maximize your crop yield and productivity.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
              <Link to="/disease-detection">
                <Camera className="h-4 w-4 mr-2" />
                Start Disease Detection
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/ai-chat">
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat with AI Assistant
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
              Complete Agricultural Solution
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to optimize your farming operations, from disease detection to expert guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-3 rounded-lg ${feature.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <Button variant="ghost" size="sm" asChild className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link to={feature.path}>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                          {benefit}
                        </div>
                      ))}
                    </div>
                    <Button asChild className="w-full mt-6" variant="outline">
                      <Link to={feature.path}>
                        Explore {feature.title}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section className="py-16 px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
              Agricultural Updates
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stay updated with the latest agricultural news and market prices in Bengaluru
            </p>
          </div>

          <Tabs defaultValue="news" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="news" className="flex items-center space-x-2">
                <Newspaper className="h-4 w-4" />
                <span>Latest News</span>
              </TabsTrigger>
              <TabsTrigger value="prices" className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span>Market Prices</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="news" className="space-y-6">
              {newsController.loading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Loading latest news...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {newsController.latestNews.slice(0, 3).map((article) => (
                      <Card key={article.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between mb-2">
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                article.priority === "urgent"
                                  ? "border-red-200 text-red-700 bg-red-50"
                                  : article.priority === "high"
                                  ? "border-orange-200 text-orange-700 bg-orange-50"
                                  : "border-blue-200 text-blue-700 bg-blue-50"
                              }`}
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
                          <CardTitle className="text-lg leading-tight mb-2">
                            {article.title}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {article.summary}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>{formatTimestamp(article.publishedAt)}</span>
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                <span>{article.location}</span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => newsController.incrementViews(article.id)}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Read More
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="text-center mt-8">
                    <Button variant="outline" asChild>
                      <Link to="/news">
                        View All News
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="prices" className="space-y-6">
              {priceController.loading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Loading market prices...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {priceController.marketPrices.slice(0, 6).map((price) => (
                      <Card key={price.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-gray-900 text-lg">{price.commodity}</h3>
                              <p className="text-sm text-gray-600">{price.market}</p>
                            </div>
                            <div className={`flex items-center text-sm font-medium px-2 py-1 rounded-full ${priceController.getPriceChangeColor(price.trend)}`}>
                              {priceController.getPriceChangeIcon(price.trend)}
                              <span className="ml-1">
                                {priceController.formatPriceChange(price.change)}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-baseline space-x-2">
                              <span className="text-2xl font-bold text-gray-900">{priceController.formatPrice(price.currentPrice)}</span>
                              <span className="text-sm text-gray-600">/{price.unit}</span>
                            </div>

                            <div className="flex items-center space-x-2 text-sm">
                              <span className="text-gray-600">Previous:</span>
                              <span className={`font-medium ${
                                price.currentPrice > price.previousPrice
                                  ? "text-red-600"
                                  : price.currentPrice < price.previousPrice
                                  ? "text-green-600"
                                  : "text-gray-600"
                              }`}>
                                {priceController.formatPrice(price.previousPrice)}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="bg-leaf-50 rounded-lg p-6">
                    <div className="text-center">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">Real-time Market Data</h3>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={priceController.refreshPrices}
                          disabled={priceController.loading}
                        >
                          <RefreshCw className={`h-3 w-3 mr-1 ${priceController.loading ? 'animate-spin' : ''}`} />
                          Refresh
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Prices updated every hour from major wholesale markets in Bengaluru
                      </p>
                      <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>
                            Last updated: {priceController.lastUpdated
                              ? formatTimestamp(priceController.lastUpdated)
                              : 'Never'
                            }
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>Data source: APMC Bengaluru</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-8 bg-primary">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of farmers who are already using DigiFarmer to improve their crop yields and make smarter farming decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/disease-detection">
                <Shield className="h-4 w-4 mr-2" />
                Get Started Free
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary" asChild>
              <Link to="/experts">
                <UserCheck className="h-4 w-4 mr-2" />
                Consult Expert
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
