import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Code,
  Github,
  Linkedin,
  Mail,
  Star,
  Coffee,
  Heart,
  Users
} from "lucide-react";

const developers = [
  {
    id: 1,
    name: "Naveen",
    role: "Full Stack Developer",
    avatar: "/api/placeholder/150/150",
    initials: "NV",
    bio: "Passionate full-stack developer specializing in React, Node.js, and agricultural technology solutions.",
    skills: ["React", "TypeScript", "Node.js", "MongoDB", "AI/ML"],
    github: "https://github.com/naveen",
    linkedin: "https://linkedin.com/in/naveen",
    email: "naveen@digifarmer.com",
    contributions: "Frontend Architecture & UI/UX Design"
  },
  {
    id: 2,
    name: "Arun",
    role: "Backend Developer",
    avatar: "/api/placeholder/150/150",
    initials: "AR",
    bio: "Backend specialist focused on scalable APIs, database optimization, and agricultural data processing.",
    skills: ["Python", "Django", "PostgreSQL", "AWS", "Docker"],
    github: "https://github.com/arun",
    linkedin: "https://linkedin.com/in/arun",
    email: "arun@digifarmer.com",
    contributions: "API Development & Database Design"
  },
  {
    id: 3,
    name: "Avinash",
    role: "AI/ML Engineer",
    avatar: "/api/placeholder/150/150",
    initials: "AV",
    bio: "AI/ML engineer dedicated to developing intelligent agricultural solutions and disease detection models.",
    skills: ["Python", "TensorFlow", "Computer Vision", "Data Science", "CNN"],
    github: "https://github.com/avinash",
    linkedin: "https://linkedin.com/in/avinash",
    email: "avinash@digifarmer.com",
    contributions: "AI Models & Disease Detection System"
  }
];

export default function Developers() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-leaf-50 via-white to-earth-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Code className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Meet Our Development Team
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The talented developers behind DigiFarmer - building the future of agricultural technology
          </p>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-2">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">3</h3>
              <p className="text-gray-600">Team Members</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-2">
                <Code className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">10,000+</h3>
              <p className="text-gray-600">Lines of Code</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-2">
                <Coffee className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">500+</h3>
              <p className="text-gray-600">Cups of Coffee</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-2">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">100%</h3>
              <p className="text-gray-600">Built with Love</p>
            </CardContent>
          </Card>
        </div>

        {/* Developer Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {developers.map((dev) => (
            <Card key={dev.id} className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={dev.avatar} alt={dev.name} />
                    <AvatarFallback className="text-lg font-semibold bg-primary text-white">
                      {dev.initials}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-xl text-gray-900">{dev.name}</CardTitle>
                <CardDescription className="text-primary font-medium">
                  {dev.role}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {dev.bio}
                </p>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Key Contributions</h4>
                  <p className="text-sm text-gray-600">{dev.contributions}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Tech Stack</h4>
                  <div className="flex flex-wrap gap-1">
                    {dev.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-center space-x-4 pt-4 border-t">
                  <a
                    href={dev.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                  <a
                    href={dev.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a
                    href={`mailto:${dev.email}`}
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* System Architecture */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">System Architecture</h2>

          {/* Architecture Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Layers className="h-5 w-5 mr-2 text-blue-600" />
                  Frontend Architecture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Framework</span>
                  <Badge variant="outline">React 18.3.1</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Language</span>
                  <Badge variant="outline">TypeScript 5.9</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Build Tool</span>
                  <Badge variant="outline">Vite 7.1.2</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Styling</span>
                  <Badge variant="outline">TailwindCSS 3.4</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">UI Library</span>
                  <Badge variant="outline">Radix UI + shadcn</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2 text-green-600" />
                  Backend Architecture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Runtime</span>
                  <Badge variant="outline">Node.js</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Framework</span>
                  <Badge variant="outline">Express.js 5.1</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API Type</span>
                  <Badge variant="outline">REST API</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Validation</span>
                  <Badge variant="outline">Zod Schemas</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Deployment</span>
                  <Badge variant="outline">Serverless</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Technology Stack Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <Smartphone className="h-8 w-8 mx-auto text-blue-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">PWA Ready</h3>
                <p className="text-sm text-gray-600">Progressive Web App with offline support</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <Brain className="h-8 w-8 mx-auto text-purple-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">AI/ML</h3>
                <p className="text-sm text-gray-600">Advanced disease detection models</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <Cloud className="h-8 w-8 mx-auto text-green-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Cloud Native</h3>
                <p className="text-sm text-gray-600">Netlify hosting with global CDN</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <Shield className="h-8 w-8 mx-auto text-red-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Secure</h3>
                <p className="text-sm text-gray-600">Multiple security layers & validation</p>
              </CardContent>
            </Card>
          </div>

          {/* Architecture Flow */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-yellow-600" />
                Data Flow Architecture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  <div className="text-center">
                    <div className="bg-blue-100 p-3 rounded-lg mb-2 mx-auto w-fit">
                      <Smartphone className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium">User Interface</p>
                    <p className="text-xs text-gray-600">React Components</p>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl text-gray-400">→</div>
                  </div>

                  <div className="text-center">
                    <div className="bg-green-100 p-3 rounded-lg mb-2 mx-auto w-fit">
                      <Layers className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-sm font-medium">Service Layer</p>
                    <p className="text-xs text-gray-600">Business Logic</p>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl text-gray-400">→</div>
                  </div>

                  <div className="text-center">
                    <div className="bg-purple-100 p-3 rounded-lg mb-2 mx-auto w-fit">
                      <Database className="h-6 w-6 text-purple-600" />
                    </div>
                    <p className="text-sm font-medium">API Layer</p>
                    <p className="text-xs text-gray-600">Express.js</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-white p-4 rounded border">
                    <Globe className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">Multi-Language</p>
                    <p className="text-xs text-gray-600">English & Kannada</p>
                  </div>

                  <div className="bg-white p-4 rounded border">
                    <Brain className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">AI Processing</p>
                    <p className="text-xs text-gray-600">Disease Detection</p>
                  </div>

                  <div className="bg-white p-4 rounded border">
                    <Shield className="h-6 w-6 text-red-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">Security</p>
                    <p className="text-xs text-gray-600">Input Validation</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Message */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                We're passionate about leveraging technology to revolutionize agriculture. Our team combines 
                expertise in software development, artificial intelligence, and agricultural science to create 
                solutions that help farmers make data-driven decisions and improve crop yields.
              </p>
              <div className="flex justify-center items-center space-x-2 text-gray-600">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-sm">Built with passion for farmers, by developers who care</span>
                <Star className="h-5 w-5 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
