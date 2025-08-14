import { z } from 'zod';

// Base model interface
export interface BaseModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// User/Farmer model
export const FarmerSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  location: z.string(),
  farmSize: z.number().positive().optional(),
  crops: z.array(z.string()).optional(),
  verified: z.boolean().default(false),
  avatar: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Farmer = z.infer<typeof FarmerSchema>;

// Expert model
export const ExpertSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  email: z.string().email(),
  specialization: z.array(z.string()),
  experience: z.number().min(0),
  rating: z.number().min(0).max(5),
  reviews: z.number().min(0),
  location: z.string(),
  languages: z.array(z.string()),
  hourlyRate: z.number().positive(),
  responseTime: z.string(),
  availability: z.string(),
  consultations: z.number().min(0),
  description: z.string(),
  achievements: z.array(z.string()),
  verified: z.boolean(),
  avatar: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Expert = z.infer<typeof ExpertSchema>;

// News Article model
export const NewsArticleSchema = z.object({
  id: z.string(),
  title: z.string().min(5),
  summary: z.string(),
  content: z.string(),
  category: z.enum(['Government Policy', 'Weather Alert', 'Market News', 'Technology', 'Education', 'Success Story', 'Event']),
  author: z.string(),
  authorAvatar: z.string().optional(),
  publishedAt: z.date(),
  readTime: z.number().positive(),
  views: z.number().min(0),
  comments: z.number().min(0),
  image: z.string().optional(),
  tags: z.array(z.string()),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  location: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type NewsArticle = z.infer<typeof NewsArticleSchema>;

// Market Price model
export const MarketPriceSchema = z.object({
  id: z.string(),
  commodity: z.string(),
  currentPrice: z.number().positive(),
  previousPrice: z.number().positive(),
  unit: z.string(),
  market: z.string(),
  trend: z.enum(['up', 'down', 'stable']),
  change: z.number(),
  date: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type MarketPrice = z.infer<typeof MarketPriceSchema>;

// Disease Detection model
export const DiseaseDetectionSchema = z.object({
  id: z.string(),
  farmerId: z.string(),
  imagePath: z.string(),
  disease: z.string(),
  confidence: z.number().min(0).max(100),
  severity: z.enum(['Low', 'Moderate', 'High', 'Critical']),
  crop: z.string(),
  treatment: z.array(z.string()),
  prevention: z.array(z.string()),
  detectionDate: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type DiseaseDetection = z.infer<typeof DiseaseDetectionSchema>;

// Community Post model
export const CommunityPostSchema = z.object({
  id: z.string(),
  authorId: z.string(),
  content: z.string().min(1),
  image: z.string().optional(),
  likes: z.number().min(0),
  comments: z.number().min(0),
  shares: z.number().min(0),
  category: z.enum(['Question', 'Success Story', 'Weather Alert', 'Event', 'Discussion']),
  tags: z.array(z.string()),
  location: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CommunityPost = z.infer<typeof CommunityPostSchema>;

// Consultation Booking model
export const ConsultationBookingSchema = z.object({
  id: z.string(),
  farmerId: z.string(),
  expertId: z.string(),
  date: z.date(),
  time: z.string(),
  duration: z.number().positive(),
  type: z.enum(['video', 'phone', 'chat']),
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']),
  farmSize: z.string().optional(),
  cropType: z.string().optional(),
  problem: z.string(),
  urgency: z.enum(['low', 'medium', 'high', 'critical']),
  cost: z.number().positive(),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ConsultationBooking = z.infer<typeof ConsultationBookingSchema>;

// Chat Message model
export const ChatMessageSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  content: z.string(),
  sender: z.enum(['user', 'bot']),
  timestamp: z.date(),
  type: z.enum(['text', 'suggestion', 'image']).default('text'),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;

// API Response wrappers
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Filter and search types
export interface NewsFilter {
  category?: string;
  priority?: string;
  location?: string;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

export interface ExpertFilter {
  specialization?: string;
  minRating?: number;
  maxRate?: number;
  location?: string;
  availability?: string;
  search?: string;
}

export interface MarketPriceFilter {
  commodity?: string;
  market?: string;
  dateFrom?: Date;
  dateTo?: Date;
}
