import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  ExternalLink
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

const latestNews = [
  {
    id: "1",
    title: "Karnataka Government Announces ₹500 Crore Package for Bengaluru Farmers",
    summary: "New financial assistance scheme to support sustainable farming practices and crop insurance.",
    category: "Government Policy",
    time: "2 hours ago",
    priority: "high",
    location: "Bengaluru"
  },
  {
    id: "2",
    title: "Weather Alert: Heavy Rains Expected in Bengaluru Rural This Week",
    summary: "Meteorological department issues warning for 3-day heavy rainfall period.",
    category: "Weather Alert",
    time: "5 hours ago",
    priority: "urgent",
    location: "Bengaluru Rural"
  },
  {
    id: "3",
    title: "New Wholesale Market Opens in Electronic City for Vegetable Farmers",
    summary: "Modern facilities with cold storage and direct farmer-to-buyer connections now available.",
    category: "Market News",
    time: "1 day ago",
    priority: "medium",
    location: "Electronic City"
  }
];

const marketPrices = [
  {
    commodity: "Tomato",
    currentPrice: 45,
    previousPrice: 42,
    unit: "kg",
    market: "KR Market",
    trend: "up",
    change: 7.1
  },
  {
    commodity: "Onion",
    currentPrice: 35,
    previousPrice: 38,
    unit: "kg",
    market: "KR Market",
    trend: "down",
    change: -7.9
  },
  {
    commodity: "Potato",
    currentPrice: 28,
    previousPrice: 28,
    unit: "kg",
    market: "KR Market",
    trend: "stable",
    change: 0
  },
  {
    commodity: "Cabbage",
    currentPrice: 18,
    previousPrice: 15,
    unit: "kg",
    market: "Madiwala Market",
    trend: "up",
    change: 20.0
  },
  {
    commodity: "Carrot",
    currentPrice: 32,
    previousPrice: 35,
    unit: "kg",
    market: "Madiwala Market",
    trend: "down",
    change: -8.6
  },
  {
    commodity: "Green Beans",
    currentPrice: 55,
    previousPrice: 52,
    unit: "kg",
    market: "Russell Market",
    trend: "up",
    change: 5.8
  }
];

export default function Index() {
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

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-8 bg-primary">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of farmers who are already using AgroDoc to improve their crop yields and make smarter farming decisions.
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
