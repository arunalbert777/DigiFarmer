import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Building2, 
  Leaf, 
  Lightbulb, 
  Droplets, 
  Zap, 
  Shield,
  TrendingUp,
  Users,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Star,
  Clock,
  DollarSign,
  Sprout,
  Settings,
  Monitor,
  Smartphone,
  Recycle,
  Target,
  Award,
  BookOpen,
  Play
} from 'lucide-react';

interface VerticalFarmProvider {
  id: string;
  name: string;
  description: string;
  specialization: string;
  location: string;
  experience: string;
  products: string;
  support: string;
  rating: number;
  projects: number;
  logo: string;
}

export function VerticalFarming() {
  const { t } = useLanguage();
  const [selectedTab, setSelectedTab] = useState('overview');

  const providers: VerticalFarmProvider[] = [
    {
      id: '1',
      name: 'Future Farms India',
      description: 'Complete hydroponic and aeroponic solutions for urban farming',
      specialization: 'NFT systems, LED grow lights, automation',
      location: 'Electronic City, Bengaluru',
      experience: '8+ years',
      products: 'Hydroponic towers, grow tents, nutrient solutions',
      support: 'Installation, training, maintenance',
      rating: 4.8,
      projects: 500,
      logo: '/api/placeholder/60/60'
    },
    {
      id: '2',
      name: 'Urban Kissan',
      description: 'Vertical farming technology and consultancy services',
      specialization: 'Stackable systems, IoT monitoring',
      location: 'Koramangala, Bengaluru',
      experience: '5+ years',
      products: 'Vertical towers, smart controllers, sensors',
      support: 'Design consultation, technical support',
      rating: 4.6,
      projects: 300,
      logo: '/api/placeholder/60/60'
    },
    {
      id: '3',
      name: 'GreenPod Labs',
      description: 'Automated vertical farming solutions for homes and businesses',
      specialization: 'AI-powered systems, mobile apps',
      location: 'Whitefield, Bengaluru',
      experience: '6+ years',
      products: 'Smart pods, mobile app control, auto-dosing',
      support: 'App support, remote monitoring',
      rating: 4.7,
      projects: 250,
      logo: '/api/placeholder/60/60'
    },
    {
      id: '4',
      name: 'Simply Green',
      description: 'Affordable hydroponic kits and vertical farming solutions',
      specialization: 'DIY kits, educational programs',
      location: 'Indiranagar, Bengaluru',
      experience: '4+ years',
      products: 'Starter kits, grow towers, organic nutrients',
      support: 'Workshops, online tutorials',
      rating: 4.4,
      projects: 150,
      logo: '/api/placeholder/60/60'
    }
  ];

  const benefits = [
    {
      icon: Building2,
      title: t('verticalFarming.benefits.spaceEfficient'),
      description: t('verticalFarming.benefits.spaceDesc'),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Recycle,
      title: t('verticalFarming.benefits.yearRound'),
      description: t('verticalFarming.benefits.yearDesc'),
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Droplets,
      title: t('verticalFarming.benefits.waterSaving'),
      description: t('verticalFarming.benefits.waterDesc'),
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50'
    },
    {
      icon: Shield,
      title: t('verticalFarming.benefits.pesticideFree'),
      description: t('verticalFarming.benefits.pesticideDesc'),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: TrendingUp,
      title: t('verticalFarming.benefits.higherYield'),
      description: t('verticalFarming.benefits.yieldDesc'),
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      icon: Target,
      title: t('verticalFarming.benefits.qualityControl'),
      description: t('verticalFarming.benefits.qualityDesc'),
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  const systems = [
    {
      icon: Droplets,
      name: t('verticalFarming.systems.hydroponic'),
      description: 'Nutrient-rich water solutions for root systems',
      suitableFor: 'Leafy greens, herbs, tomatoes',
      difficulty: 'Beginner',
      cost: '₹15,000 - ₹50,000'
    },
    {
      icon: Zap,
      name: t('verticalFarming.systems.aeroponic'),
      description: 'Mist-based nutrient delivery system',
      suitableFor: 'Herbs, strawberries, peppers',
      difficulty: 'Advanced',
      cost: '₹30,000 - ₹80,000'
    },
    {
      icon: Lightbulb,
      name: t('verticalFarming.systems.nft'),
      description: 'Continuous nutrient film flow system',
      suitableFor: 'Lettuce, basil, cilantro',
      difficulty: 'Intermediate',
      cost: '₹20,000 - ₹60,000'
    },
    {
      icon: Settings,
      name: t('verticalFarming.systems.stackable'),
      description: 'Modular tower systems for maximum space efficiency',
      suitableFor: 'Microgreens, small herbs',
      difficulty: 'Beginner',
      cost: '₹10,000 - ₹40,000'
    }
  ];

  const setupSteps = [
    {
      title: t('verticalFarming.setupGuide.step1.title'),
      description: t('verticalFarming.setupGuide.step1.description'),
      details: t('verticalFarming.setupGuide.step1.details')
    },
    {
      title: t('verticalFarming.setupGuide.step2.title'),
      description: t('verticalFarming.setupGuide.step2.description'),
      details: t('verticalFarming.setupGuide.step2.details')
    },
    {
      title: t('verticalFarming.setupGuide.step3.title'),
      description: t('verticalFarming.setupGuide.step3.description'),
      details: t('verticalFarming.setupGuide.step3.details')
    },
    {
      title: t('verticalFarming.setupGuide.step4.title'),
      description: t('verticalFarming.setupGuide.step4.description'),
      details: t('verticalFarming.setupGuide.step4.details')
    },
    {
      title: t('verticalFarming.setupGuide.step5.title'),
      description: t('verticalFarming.setupGuide.step5.description'),
      details: t('verticalFarming.setupGuide.step5.details')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-leaf-50 via-white to-earth-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-green-600 p-3 rounded-lg">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('verticalFarming.title')}
          </h1>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            {t('verticalFarming.subtitle')}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">365x</div>
            <div className="text-sm text-gray-600">More Productive</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <Droplets className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">95%</div>
            <div className="text-sm text-gray-600">Water Saved</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <Building2 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">90%</div>
            <div className="text-sm text-gray-600">Less Space</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <Shield className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">0%</div>
            <div className="text-sm text-gray-600">Pesticides</div>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Leaf className="h-4 w-4" />
              <span className="hidden sm:inline">{t('verticalFarming.benefits')}</span>
            </TabsTrigger>
            <TabsTrigger value="systems" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">{t('verticalFarming.technologies')}</span>
            </TabsTrigger>
            <TabsTrigger value="setup" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">{t('verticalFarming.setup')}</span>
            </TabsTrigger>
            <TabsTrigger value="providers" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">{t('verticalFarming.providers')}</span>
            </TabsTrigger>
            <TabsTrigger value="costs" className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Costs</span>
            </TabsTrigger>
          </TabsList>

          {/* Benefits Overview */}
          <TabsContent value="overview" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('verticalFarming.benefits.title')}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover the advantages of vertical farming technology for modern agriculture
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${benefit.bgColor} mb-4`}>
                        <Icon className={`h-6 w-6 ${benefit.color}`} />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                      <p className="text-sm text-gray-600">{benefit.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* ROI Section */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {t('verticalFarming.roi.title')}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="font-semibold text-gray-900">{t('verticalFarming.roi.timeframe')}</div>
                  </div>
                  <div className="text-center">
                    <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="font-semibold text-gray-900">{t('verticalFarming.roi.savings')}</div>
                  </div>
                  <div className="text-center">
                    <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="font-semibold text-gray-900">{t('verticalFarming.roi.income')}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Farming Systems */}
          <TabsContent value="systems" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('verticalFarming.technologies')}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Choose the right vertical farming system for your needs and space
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {systems.map((system, index) => {
                const Icon = system.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <Icon className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{system.name}</CardTitle>
                          <CardDescription>{system.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Suitable for:</span>
                          <p className="text-gray-600">{system.suitableFor}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Difficulty:</span>
                          <Badge variant={system.difficulty === 'Beginner' ? 'default' : 
                                        system.difficulty === 'Intermediate' ? 'secondary' : 'destructive'}>
                            {system.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Investment:</span>
                        <p className="font-semibold text-primary">{system.cost}</p>
                      </div>
                      
                      <Button className="w-full mt-4">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        {t('verticalFarming.learnMore')}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Setup Guide */}
          <TabsContent value="setup" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('verticalFarming.setupGuide.title')}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Follow our step-by-step guide to set up your vertical farming system
              </p>
            </div>

            <div className="space-y-6">
              {setupSteps.map((step, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                        <p className="text-gray-600 mb-3">{step.description}</p>
                        <p className="text-sm text-gray-500">{step.details}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Video Tutorial CTA */}
            <Card className="bg-gradient-to-r from-primary/5 to-green-50">
              <CardContent className="p-8 text-center">
                <Play className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Watch Setup Tutorial
                </h3>
                <p className="text-gray-600 mb-4">
                  Learn from experts with our comprehensive video guide
                </p>
                <Button size="lg">
                  <Play className="h-4 w-4 mr-2" />
                  Watch Now
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Equipment Providers */}
          <TabsContent value="providers" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('verticalFarming.companies.title')}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {t('verticalFarming.companies.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {providers.map((provider) => (
                <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={provider.logo} />
                          <AvatarFallback>
                            {provider.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{provider.name}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex items-center text-sm text-gray-600">
                              <Star className="h-3 w-3 text-yellow-500 mr-1" />
                              {provider.rating}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {provider.projects} projects
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="mt-2">
                      {provider.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Specialization:</span>
                        <p className="text-gray-600">{provider.specialization}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Location:</span>
                        <p className="text-gray-600">{provider.location}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Experience:</span>
                        <p className="text-gray-600">{provider.experience}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Products:</span>
                        <p className="text-gray-600">{provider.products}</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 pt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                      <Button size="sm" className="flex-1">
                        <Mail className="h-4 w-4 mr-2" />
                        {t('verticalFarming.contactProvider')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Investment & Costs */}
          <TabsContent value="costs" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('verticalFarming.costs.title')}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Choose the right investment level for your vertical farming goals
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: t('verticalFarming.costs.starter.title'),
                  price: t('verticalFarming.costs.starter.price'),
                  description: t('verticalFarming.costs.starter.description'),
                  includes: t('verticalFarming.costs.starter.includes')
                },
                {
                  title: t('verticalFarming.costs.intermediate.title'),
                  price: t('verticalFarming.costs.intermediate.price'),
                  description: t('verticalFarming.costs.intermediate.description'),
                  includes: t('verticalFarming.costs.intermediate.includes')
                },
                {
                  title: t('verticalFarming.costs.commercial.title'),
                  price: t('verticalFarming.costs.commercial.price'),
                  description: t('verticalFarming.costs.commercial.description'),
                  includes: t('verticalFarming.costs.commercial.includes')
                }
              ].map((cost, index) => (
                <Card key={index} className={`text-center hover:shadow-lg transition-shadow ${index === 1 ? 'ring-2 ring-primary' : ''}`}>
                  <CardHeader>
                    {index === 1 && (
                      <Badge className="w-fit mx-auto mb-2">Most Popular</Badge>
                    )}
                    <CardTitle className="text-xl">{cost.title}</CardTitle>
                    <div className="text-2xl font-bold text-primary">{cost.price}</div>
                    <CardDescription>{cost.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{cost.includes}</p>

                    <Button className="w-full" variant={index === 1 ? 'default' : 'outline'}>
                      {t('verticalFarming.getStarted')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">
            Ready to Start Your Vertical Farm?
          </h2>
          <p className="mb-6 max-w-2xl mx-auto opacity-90">
            Join the future of agriculture with space-efficient, sustainable vertical farming technology. 
            Get expert guidance and support from local Bengaluru providers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              <Phone className="h-4 w-4 mr-2" />
              Contact Experts
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-green-600">
              <BookOpen className="h-4 w-4 mr-2" />
              Download Guide
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
