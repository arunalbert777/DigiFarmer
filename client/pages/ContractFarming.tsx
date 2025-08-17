import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Handshake, 
  Building2, 
  Leaf, 
  Calendar, 
  MapPin, 
  Users, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Shield,
  Truck,
  GraduationCap,
  Sprout,
  FileText,
  Phone,
  Mail,
  Star,
  ArrowRight
} from 'lucide-react';

interface ContractOpportunity {
  id: string;
  company: string;
  logo: string;
  crops: string[];
  contractType: 'seasonal' | 'annual' | 'multiYear';
  minArea: string;
  duration: string;
  guaranteedPrice: string;
  location: string;
  benefits: string[];
  requirements: string[];
  status: 'open' | 'closing-soon' | 'closed';
  applications: number;
  rating: number;
}

export function ContractFarming() {
  const { t } = useLanguage();
  const [selectedTab, setSelectedTab] = useState('opportunities');

  const contractOpportunities: ContractOpportunity[] = [
    {
      id: '1',
      company: 'IFFCO Kisan',
      logo: '/api/placeholder/60/60',
      crops: ['Tomato', 'Onion', 'Potato', 'Cabbage'],
      contractType: 'seasonal',
      minArea: '2 acres',
      duration: '4-6 months',
      guaranteedPrice: '₹15-25/kg',
      location: 'Bengaluru Rural, Chikkaballapur',
      benefits: ['Quality seeds provided', 'Technical support', 'Fertilizer subsidy', 'Guaranteed buyback'],
      requirements: ['2+ acres farmland', 'Drip irrigation', 'GAP certification'],
      status: 'open',
      applications: 156,
      rating: 4.5
    },
    {
      id: '2',
      company: 'Reliance Fresh',
      logo: '/api/placeholder/60/60',
      crops: ['Lettuce', 'Spinach', 'Herbs', 'Cherry Tomato'],
      contractType: 'annual',
      minArea: '1 acre',
      duration: '12 months',
      guaranteedPrice: '₹30-50/kg',
      location: 'Devanahalli, Hoskote',
      benefits: ['Premium pricing', 'Cold storage access', 'Transportation', 'Packaging support'],
      requirements: ['Greenhouse facility', 'Organic certification', 'Quality standards'],
      status: 'open',
      applications: 89,
      rating: 4.3
    },
    {
      id: '3',
      company: 'BigBasket Farm',
      logo: '/api/placeholder/60/60',
      crops: ['Organic Vegetables', 'Exotic Fruits', 'Microgreens'],
      contractType: 'multiYear',
      minArea: '0.5 acres',
      duration: '2-3 years',
      guaranteedPrice: '₹40-80/kg',
      location: 'Whitefield, Electronic City',
      benefits: ['Organic premium', 'E-commerce reach', 'Brand partnership', 'Training programs'],
      requirements: ['Organic certification', 'Consistent supply', 'Quality assurance'],
      status: 'closing-soon',
      applications: 234,
      rating: 4.7
    },
    {
      id: '4',
      company: 'Heritage Foods',
      logo: '/api/placeholder/60/60',
      crops: ['Fodder Crops', 'Millets', 'Pulses', 'Oilseeds'],
      contractType: 'annual',
      minArea: '3 acres',
      duration: '12 months',
      guaranteedPrice: '₹25-35/kg',
      location: 'Tumkur, Kolar',
      benefits: ['Equipment leasing', 'Buyback guarantee', 'Processing facility access', 'Insurance coverage'],
      requirements: ['3+ acres farmland', 'Soil testing', 'Water availability'],
      status: 'open',
      applications: 67,
      rating: 4.2
    }
  ];

  const localSupport = [
    {
      icon: Sprout,
      title: 'Quality Input Supply',
      description: 'Certified seeds, fertilizers, and pesticides at subsidized rates',
      color: 'text-green-600'
    },
    {
      icon: GraduationCap,
      title: 'Technical Training',
      description: 'Regular workshops on modern farming techniques and best practices',
      color: 'text-blue-600'
    },
    {
      icon: Shield,
      title: 'Risk Protection',
      description: 'Weather insurance and crop failure protection coverage',
      color: 'text-purple-600'
    },
    {
      icon: Truck,
      title: 'Logistics Support',
      description: 'Transportation, storage, and supply chain management',
      color: 'text-orange-600'
    },
    {
      icon: TrendingUp,
      title: 'Guaranteed Markets',
      description: 'Pre-agreed pricing and assured purchase of quality produce',
      color: 'text-red-600'
    },
    {
      icon: Users,
      title: 'Community Network',
      description: 'Connect with fellow contract farmers and share experiences',
      color: 'text-indigo-600'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closing-soon': return 'bg-orange-100 text-orange-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getContractTypeLabel = (type: string) => {
    switch (type) {
      case 'seasonal': return t('contractFarming.contractTypes.seasonal');
      case 'annual': return t('contractFarming.contractTypes.annual');
      case 'multiYear': return t('contractFarming.contractTypes.multiYear');
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-leaf-50 via-white to-earth-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-primary p-3 rounded-lg">
              <Handshake className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('contractFarming.title')}
          </h1>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            {t('contractFarming.subtitle')}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <Building2 className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">15+</div>
            <div className="text-sm text-gray-600">Partner Companies</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <Leaf className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">50+</div>
            <div className="text-sm text-gray-600">Crop Varieties</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">2,500+</div>
            <div className="text-sm text-gray-600">Active Farmers</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">85%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="opportunities" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>{t('contractFarming.contracts')}</span>
            </TabsTrigger>
            <TabsTrigger value="companies" className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span>{t('contractFarming.companies.title')}</span>
            </TabsTrigger>
            <TabsTrigger value="support" className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>{t('contractFarming.support.title')}</span>
            </TabsTrigger>
          </TabsList>

          {/* Contract Opportunities */}
          <TabsContent value="opportunities" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {contractOpportunities.map((contract) => (
                <Card key={contract.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={contract.logo} />
                          <AvatarFallback>
                            {contract.company.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{contract.company}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getStatusColor(contract.status)}>
                              {contract.status === 'open' ? 'Open' : 
                               contract.status === 'closing-soon' ? 'Closing Soon' : 'Closed'}
                            </Badge>
                            <div className="flex items-center text-sm text-gray-600">
                              <Star className="h-3 w-3 text-yellow-500 mr-1" />
                              {contract.rating}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Crops:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {contract.crops.map((crop, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {crop}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Type:</span>
                        <p className="text-gray-600">{getContractTypeLabel(contract.contractType)}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Min Area:</span>
                        <p className="text-gray-600">{contract.minArea}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Duration:</span>
                        <p className="text-gray-600">{contract.duration}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Price:</span>
                        <p className="font-semibold text-primary">{contract.guaranteedPrice}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Location:</span>
                        <p className="text-gray-600">{contract.location}</p>
                      </div>
                    </div>

                    <div>
                      <span className="font-medium text-gray-700">Benefits:</span>
                      <ul className="mt-1 space-y-1">
                        {contract.benefits.slice(0, 3).map((benefit, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="h-3 w-3 text-green-600 mr-2" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-gray-600">
                        <Users className="h-4 w-4 inline mr-1" />
                        {contract.applications} applications
                      </div>
                      <Button className="flex items-center space-x-2">
                        <span>{t('contractFarming.apply')}</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Companies */}
          <TabsContent value="companies" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('contractFarming.companies.title')}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {t('contractFarming.companies.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(t('contractFarming.localCompanies') || {}).map(([key, company]: [string, any]) => (
                <Card key={key} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="/api/placeholder/60/60" />
                        <AvatarFallback>
                          {(company?.name || key || 'Company').split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{company?.name || key || 'Company'}</CardTitle>
                        <CardDescription className="text-sm">{company?.description || ''}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">Preferred Crops:</span>
                      <p className="text-gray-600">{company?.crops || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Area Requirement:</span>
                      <p className="text-gray-600">{company?.minArea || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Support Provided:</span>
                      <p className="text-gray-600">{company?.support || 'N/A'}</p>
                    </div>
                    
                    <div className="flex space-x-2 pt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Phone className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                      <Button size="sm" className="flex-1">
                        <FileText className="h-4 w-4 mr-2" />
                        {t('contractFarming.viewDetails')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Support Services */}
          <TabsContent value="support" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('contractFarming.support.title')}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Comprehensive support services provided to contract farmers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {localSupport.map((service, index) => {
                const Icon = service.icon;
                return (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 mb-4`}>
                        <Icon className={`h-6 w-6 ${service.color}`} />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{service.title}</h3>
                      <p className="text-sm text-gray-600">{service.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-primary/5 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Start Contract Farming?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of farmers in Bengaluru who have improved their income and reduced risks through contract farming partnerships.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <FileText className="h-4 w-4 mr-2" />
              Browse All Contracts
            </Button>
            <Button size="lg" variant="outline">
              <Phone className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
