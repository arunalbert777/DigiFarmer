import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  UserCheck, 
  Star, 
  MapPin, 
  Clock, 
  Video, 
  Phone, 
  MessageSquare,
  Award,
  BookOpen,
  Calendar as CalendarIcon,
  DollarSign,
  Search,
  Filter,
  Users,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Leaf
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Expert {
  id: string;
  name: string;
  avatar: string;
  specialization: string[];
  experience: number;
  rating: number;
  reviews: number;
  location: string;
  languages: string[];
  hourlyRate: number;
  responseTime: string;
  availability: string;
  consultations: number;
  description: string;
  achievements: string[];
  verified: boolean;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

const mockExperts: Expert[] = [
  {
    id: "1",
    name: "Dr. Priya Krishnan",
    avatar: "/api/placeholder/100/100",
    specialization: ["Plant Pathology", "Disease Management", "Integrated Pest Management"],
    experience: 15,
    rating: 4.9,
    reviews: 124,
    location: "University of Agricultural Sciences, Bengaluru",
    languages: ["English", "Kannada", "Hindi"],
    hourlyRate: 800,
    responseTime: "< 2 hours",
    availability: "Mon-Fri: 9 AM - 6 PM",
    consultations: 1200,
    description: "Specializing in plant diseases affecting crops in Karnataka. Expert in organic and sustainable farming practices with 15+ years of research experience.",
    achievements: ["PhD in Plant Pathology", "Published 50+ research papers", "Agricultural Innovation Award 2023"],
    verified: true
  },
  {
    id: "2",
    name: "Rajesh Kumar Reddy",
    avatar: "/api/placeholder/100/100",
    specialization: ["Organic Farming", "Soil Health", "Crop Rotation"],
    experience: 12,
    rating: 4.8,
    reviews: 98,
    location: "Bengaluru Rural District",
    languages: ["Kannada", "English", "Telugu"],
    hourlyRate: 600,
    responseTime: "< 4 hours",
    availability: "Daily: 7 AM - 7 PM",
    consultations: 850,
    description: "Successful organic farmer with 300+ acres under organic cultivation. Helps farmers transition to sustainable farming practices.",
    achievements: ["Certified Organic Consultant", "Karnataka Farmer Award 2022", "Trained 1000+ farmers"],
    verified: true
  },
  {
    id: "3",
    name: "Dr. Suresh Gowda",
    avatar: "/api/placeholder/100/100",
    specialization: ["Irrigation Management", "Water Conservation", "Precision Agriculture"],
    experience: 18,
    rating: 4.9,
    reviews: 156,
    location: "Indian Institute of Science, Bengaluru",
    languages: ["English", "Kannada"],
    hourlyRate: 1200,
    responseTime: "< 1 hour",
    availability: "Mon-Sat: 10 AM - 5 PM",
    consultations: 2100,
    description: "Leading expert in agricultural water management and precision farming technologies. Specialist in drip irrigation systems.",
    achievements: ["Professor Emeritus", "Water Management Excellence Award", "300+ Published Papers"],
    verified: true
  },
  {
    id: "4",
    name: "Meena Sharma",
    avatar: "/api/placeholder/100/100",
    specialization: ["Vegetable Cultivation", "Greenhouse Farming", "Market Analysis"],
    experience: 10,
    rating: 4.7,
    reviews: 76,
    location: "Kolar District, Karnataka",
    languages: ["Hindi", "Kannada", "English"],
    hourlyRate: 500,
    responseTime: "< 6 hours",
    availability: "Tue-Sun: 8 AM - 8 PM",
    consultations: 650,
    description: "Commercial vegetable farmer and consultant. Expert in greenhouse cultivation and helping farmers access better markets.",
    achievements: ["Successful Vegetable Farmer", "Market Linkage Specialist", "Women Farmer Leader"],
    verified: false
  }
];

const timeSlots: TimeSlot[] = [
  { time: "9:00 AM", available: true },
  { time: "10:00 AM", available: false },
  { time: "11:00 AM", available: true },
  { time: "2:00 PM", available: true },
  { time: "3:00 PM", available: true },
  { time: "4:00 PM", available: false },
  { time: "5:00 PM", available: true },
];

export default function ExpertConsultation() {
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [consultationType, setConsultationType] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    farmSize: "",
    cropType: "",
    problem: "",
    urgency: "",
    contactMethod: ""
  });

  const filteredExperts = mockExperts.filter(expert => {
    const matchesSearch = expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expert.specialization.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSpecialization = selectedSpecialization === "all" || 
                                 expert.specialization.some(spec => spec.toLowerCase().includes(selectedSpecialization.toLowerCase()));
    return matchesSearch && matchesSpecialization;
  });

  const handleBookConsultation = () => {
    if (selectedExpert && selectedDate && selectedTime && consultationType) {
      // In a real app, this would make an API call
      console.log("Booking consultation:", {
        expert: selectedExpert.name,
        date: selectedDate,
        time: selectedTime,
        type: consultationType,
        details: bookingForm
      });
      setIsBookingOpen(false);
      alert("Consultation booked successfully! You will receive a confirmation email shortly.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-leaf-50 via-white to-earth-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Expert Consultation
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get personalized advice from certified agricultural experts in Bengaluru. Book one-on-one consultations for your specific farming challenges.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-2">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">25+</h3>
              <p className="text-gray-600">Certified Experts</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">5,000+</h3>
              <p className="text-gray-600">Successful Consultations</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-2">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">95%</h3>
              <p className="text-gray-600">Problem Resolution</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-2">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">< 4hrs</h3>
              <p className="text-gray-600">Avg Response Time</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search experts by name or specialization..."
                className="pl-10"
              />
            </div>
            <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
              <SelectTrigger className="w-full lg:w-64">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by specialization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specializations</SelectItem>
                <SelectItem value="plant pathology">Plant Pathology</SelectItem>
                <SelectItem value="organic farming">Organic Farming</SelectItem>
                <SelectItem value="irrigation">Irrigation Management</SelectItem>
                <SelectItem value="soil">Soil Health</SelectItem>
                <SelectItem value="vegetable">Vegetable Cultivation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Experts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredExperts.map((expert) => (
            <Card key={expert.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={expert.avatar} />
                      <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {expert.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{expert.name}</h3>
                    <div className="flex items-center mt-1">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{expert.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500 ml-2">({expert.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center mt-1 text-sm text-gray-600">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="truncate">{expert.location}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Specializations</h4>
                  <div className="flex flex-wrap gap-1">
                    {expert.specialization.slice(0, 2).map((spec, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                    {expert.specialization.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{expert.specialization.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience:</span>
                    <span className="font-medium">{expert.experience} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rate:</span>
                    <span className="font-medium">₹{expert.hourlyRate}/hour</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Response:</span>
                    <span className="font-medium">{expert.responseTime}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2">{expert.description}</p>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">{expert.consultations} consultations</span>
                  </div>
                  <Dialog open={isBookingOpen && selectedExpert?.id === expert.id} onOpenChange={setIsBookingOpen}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        onClick={() => setSelectedExpert(expert)}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Book Now
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={expert.avatar} />
                            <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <span>Book Consultation with {expert.name}</span>
                            <p className="text-sm text-gray-600 font-normal">₹{expert.hourlyRate}/hour</p>
                          </div>
                        </DialogTitle>
                        <DialogDescription>
                          Fill in the details below to book your consultation session.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-6 py-4">
                        {/* Consultation Type */}
                        <div>
                          <Label className="text-base font-medium">Consultation Method</Label>
                          <div className="grid grid-cols-3 gap-3 mt-2">
                            <Button
                              variant={consultationType === "video" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setConsultationType("video")}
                              className="flex items-center justify-center"
                            >
                              <Video className="h-4 w-4 mr-2" />
                              Video Call
                            </Button>
                            <Button
                              variant={consultationType === "phone" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setConsultationType("phone")}
                              className="flex items-center justify-center"
                            >
                              <Phone className="h-4 w-4 mr-2" />
                              Phone Call
                            </Button>
                            <Button
                              variant={consultationType === "chat" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setConsultationType("chat")}
                              className="flex items-center justify-center"
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Chat
                            </Button>
                          </div>
                        </div>

                        {/* Date Selection */}
                        <div>
                          <Label className="text-base font-medium">Select Date</Label>
                          <div className="mt-2">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={setSelectedDate}
                              disabled={(date) => date < new Date() || date.getDay() === 0}
                              className="rounded-md border"
                            />
                          </div>
                        </div>

                        {/* Time Slots */}
                        <div>
                          <Label className="text-base font-medium">Available Time Slots</Label>
                          <div className="grid grid-cols-3 gap-2 mt-2">
                            {timeSlots.map((slot) => (
                              <Button
                                key={slot.time}
                                variant={selectedTime === slot.time ? "default" : "outline"}
                                size="sm"
                                disabled={!slot.available}
                                onClick={() => setSelectedTime(slot.time)}
                                className={cn(
                                  "w-full",
                                  !slot.available && "opacity-50 cursor-not-allowed"
                                )}
                              >
                                {slot.time}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Additional Details */}
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="farmSize">Farm Size (acres)</Label>
                              <Input
                                id="farmSize"
                                value={bookingForm.farmSize}
                                onChange={(e) => setBookingForm({...bookingForm, farmSize: e.target.value})}
                                placeholder="e.g., 2.5"
                              />
                            </div>
                            <div>
                              <Label htmlFor="cropType">Primary Crops</Label>
                              <Input
                                id="cropType"
                                value={bookingForm.cropType}
                                onChange={(e) => setBookingForm({...bookingForm, cropType: e.target.value})}
                                placeholder="e.g., Tomatoes, Beans"
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="problem">Describe Your Problem/Question</Label>
                            <Textarea
                              id="problem"
                              value={bookingForm.problem}
                              onChange={(e) => setBookingForm({...bookingForm, problem: e.target.value})}
                              placeholder="Please describe the specific issue you're facing or what you'd like to discuss..."
                              className="min-h-[100px]"
                            />
                          </div>

                          <div>
                            <Label htmlFor="urgency">Urgency Level</Label>
                            <Select value={bookingForm.urgency} onValueChange={(value) => setBookingForm({...bookingForm, urgency: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select urgency level" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low - General advice</SelectItem>
                                <SelectItem value="medium">Medium - Need solution soon</SelectItem>
                                <SelectItem value="high">High - Urgent crop issue</SelectItem>
                                <SelectItem value="critical">Critical - Emergency</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Summary */}
                        {consultationType && selectedDate && selectedTime && (
                          <div className="bg-leaf-50 p-4 rounded-lg">
                            <h4 className="font-medium mb-2">Consultation Summary</h4>
                            <div className="text-sm space-y-1">
                              <p><strong>Expert:</strong> {expert.name}</p>
                              <p><strong>Date:</strong> {selectedDate.toLocaleDateString()}</p>
                              <p><strong>Time:</strong> {selectedTime}</p>
                              <p><strong>Method:</strong> {consultationType}</p>
                              <p><strong>Duration:</strong> 1 hour</p>
                              <p><strong>Cost:</strong> ₹{expert.hourlyRate}</p>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end space-x-3 pt-4">
                          <Button variant="outline" onClick={() => setIsBookingOpen(false)}>
                            Cancel
                          </Button>
                          <Button
                            onClick={handleBookConsultation}
                            disabled={!consultationType || !selectedDate || !selectedTime || !bookingForm.problem}
                            className="bg-primary hover:bg-primary/90"
                          >
                            Confirm Booking
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How It Works */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">How Expert Consultation Works</CardTitle>
            <CardDescription className="text-center">
              Simple steps to get expert agricultural advice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">1. Choose Expert</h3>
                <p className="text-sm text-gray-600">Browse and select from our certified agricultural experts</p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">2. Book Session</h3>
                <p className="text-sm text-gray-600">Schedule your consultation at a convenient time</p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">3. Get Advice</h3>
                <p className="text-sm text-gray-600">Discuss your farming challenges with the expert</p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">4. Implement</h3>
                <p className="text-sm text-gray-600">Apply the recommendations to improve your farm</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}