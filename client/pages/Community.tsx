import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Share2, 
  Plus,
  Search,
  TrendingUp,
  Award,
  MapPin,
  Clock,
  Image as ImageIcon,
  ThumbsUp,
  BookOpen,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    location: string;
    expertise: string;
    verified: boolean;
  };
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  category: string;
  tags: string[];
}

interface Expert {
  id: string;
  name: string;
  avatar: string;
  expertise: string;
  location: string;
  rating: number;
  posts: number;
  followers: number;
}

const mockPosts: Post[] = [
  {
    id: "1",
    author: {
      name: "Rajesh Kumar",
      avatar: "/api/placeholder/40/40",
      location: "Bengaluru Rural",
      expertise: "Organic Farming",
      verified: true
    },
    content: "Just harvested my first batch of organic tomatoes using the techniques discussed here! The yield increased by 30% compared to last season. Special thanks to @MeenaAgri for the pest control advice. Here's what worked for me in Bengaluru's climate...",
    image: "/api/placeholder/400/300",
    timestamp: "2 hours ago",
    likes: 24,
    comments: 8,
    shares: 3,
    category: "Success Story",
    tags: ["organic", "tomatoes", "bengaluru"]
  },
  {
    id: "2",
    author: {
      name: "Dr. Meena Krishnan",
      avatar: "/api/placeholder/40/40",
      location: "Agricultural University",
      expertise: "Plant Pathology",
      verified: true
    },
    content: "Weather alert for Bengaluru farmers: Heavy rains expected next week. Recommendations for protecting your crops: 1) Ensure proper drainage 2) Cover sensitive plants 3) Avoid fertilizing during heavy rains. Stay safe and protect your harvest!",
    timestamp: "5 hours ago",
    likes: 56,
    comments: 15,
    shares: 12,
    category: "Weather Alert",
    tags: ["weather", "protection", "bengaluru"]
  },
  {
    id: "3",
    author: {
      name: "Priya Sharma",
      avatar: "/api/placeholder/40/40",
      location: "Kolar District",
      expertise: "Sustainable Agriculture",
      verified: false
    },
    content: "Looking for advice on setting up drip irrigation for my 2-acre vegetable farm near Bengaluru. Budget is around ₹1.5 lakhs. Any recommendations for reliable suppliers and installation? Also, what's the maintenance like?",
    timestamp: "1 day ago",
    likes: 18,
    comments: 22,
    shares: 5,
    category: "Question",
    tags: ["irrigation", "vegetables", "advice"]
  },
  {
    id: "4",
    author: {
      name: "Farmers Collective Bengaluru",
      avatar: "/api/placeholder/40/40",
      location: "Bengaluru",
      expertise: "Community Group",
      verified: true
    },
    content: "🌾 Monthly Farmers Meet - This Saturday, 10 AM at Agricultural College. Topics: Soil health testing, Government schemes update, Organic certification process. Free soil testing for first 50 farmers! Register in comments.",
    timestamp: "2 days ago",
    likes: 89,
    comments: 34,
    shares: 28,
    category: "Event",
    tags: ["event", "community", "soilhealth"]
  }
];

const topExperts: Expert[] = [
  {
    id: "1",
    name: "Dr. Meena Krishnan",
    avatar: "/api/placeholder/60/60",
    expertise: "Plant Pathology",
    location: "Bengaluru",
    rating: 4.9,
    posts: 156,
    followers: 2340
  },
  {
    id: "2",
    name: "Rajesh Kumar",
    avatar: "/api/placeholder/60/60",
    expertise: "Organic Farming",
    location: "Bengaluru Rural",
    rating: 4.8,
    posts: 89,
    followers: 1520
  },
  {
    id: "3",
    name: "Prof. Suresh Reddy",
    avatar: "/api/placeholder/60/60",
    expertise: "Soil Science",
    location: "UAS Bengaluru",
    rating: 4.9,
    posts: 203,
    followers: 3200
  }
];

const trendingTopics = [
  { name: "Organic Farming", posts: 45, trend: "+12%" },
  { name: "Drip Irrigation", posts: 32, trend: "+8%" },
  { name: "Pest Control", posts: 28, trend: "+15%" },
  { name: "Soil Health", posts: 24, trend: "+5%" },
  { name: "Weather Updates", posts: 19, trend: "+3%" }
];

export default function Community() {
  const [newPost, setNewPost] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handlePostSubmit = () => {
    if (newPost.trim()) {
      // In a real app, this would save to backend
      console.log("New post:", newPost);
      setNewPost("");
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return timestamp;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-leaf-50 via-white to-earth-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Farmer Community
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with fellow farmers in Bengaluru, share experiences, and learn from agricultural experts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Community Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Farmers</span>
                  <span className="font-semibold">2,345</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Posts Today</span>
                  <span className="font-semibold">28</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Expert Answers</span>
                  <span className="font-semibold">156</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Bengaluru Focus</span>
                  <Badge variant="secondary">Local</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {trendingTopics.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{topic.name}</p>
                      <p className="text-xs text-gray-600">{topic.posts} posts</p>
                    </div>
                    <Badge variant="secondary" className="text-green-600 bg-green-50">
                      {topic.trend}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Top Experts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Award className="h-5 w-5 mr-2" />
                  Top Experts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {topExperts.map((expert, index) => (
                  <div key={expert.id} className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={expert.avatar} />
                        <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {index === 0 && (
                        <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full w-4 h-4 flex items-center justify-center">
                          <span className="text-xs">👑</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{expert.name}</p>
                      <p className="text-xs text-gray-600">{expert.expertise}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-yellow-600">★ {expert.rating}</span>
                        <span className="text-xs text-gray-500">{expert.followers} followers</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Create Post */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  Share with Community
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share your farming experience, ask questions, or help fellow farmers..."
                  className="min-h-[100px]"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Photo
                    </Button>
                    <Button size="sm" variant="outline">
                      <MapPin className="h-4 w-4 mr-2" />
                      Location
                    </Button>
                  </div>
                  <Button onClick={handlePostSubmit} disabled={!newPost.trim()}>
                    Share Post
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search posts, farmers, topics..."
                  className="pl-10"
                />
              </div>
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="questions">Questions</TabsTrigger>
                  <TabsTrigger value="success">Success</TabsTrigger>
                  <TabsTrigger value="alerts">Alerts</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Posts Feed */}
            <div className="space-y-6">
              {mockPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                            {post.author.verified && (
                              <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-600">
                                ✓ Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>{post.author.expertise}</span>
                            <span>•</span>
                            <span className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {post.author.location}
                            </span>
                            <span>•</span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatTimestamp(post.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-xs",
                            post.category === "Success Story" && "border-green-200 text-green-700 bg-green-50",
                            post.category === "Weather Alert" && "border-orange-200 text-orange-700 bg-orange-50",
                            post.category === "Question" && "border-blue-200 text-blue-700 bg-blue-50",
                            post.category === "Event" && "border-purple-200 text-purple-700 bg-purple-50"
                          )}
                        >
                          {post.category === "Weather Alert" && <AlertCircle className="h-3 w-3 mr-1" />}
                          {post.category === "Question" && <MessageCircle className="h-3 w-3 mr-1" />}
                          {post.category === "Event" && <BookOpen className="h-3 w-3 mr-1" />}
                          {post.category}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>
                    
                    {post.image && (
                      <div className="mb-4">
                        <img 
                          src={post.image} 
                          alt="Post content" 
                          className="w-full h-64 object-cover rounded-lg"
                        />
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    <Separator className="mb-4" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-red-600">
                          <Heart className="h-4 w-4 mr-1" />
                          {post.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {post.comments}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-green-600">
                          <Share2 className="h-4 w-4 mr-1" />
                          {post.shares}
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm" className="text-gray-600">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Helpful
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center py-8">
              <Button variant="outline" size="lg">
                Load More Posts
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
