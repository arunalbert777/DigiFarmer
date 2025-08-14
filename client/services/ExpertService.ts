import { apiService } from './ApiService';
import { Expert, ExpertFilter, ConsultationBooking, PaginatedResponse, ApiResponse } from '../models/types';

export class ExpertService {
  private apiService = apiService;

  async getExperts(filter?: ExpertFilter, page?: number, limit?: number): Promise<ApiResponse<PaginatedResponse<Expert>>> {
    return this.apiService.getPaginated<Expert>('/experts', page, limit, filter);
  }

  async getExpertById(id: string): Promise<ApiResponse<Expert>> {
    return this.apiService.get<Expert>(`/experts/${id}`);
  }

  async getTopExperts(limit: number = 5): Promise<ApiResponse<Expert[]>> {
    return this.apiService.get<Expert[]>('/experts/top', { limit });
  }

  async searchExperts(query: string, limit?: number): Promise<ApiResponse<Expert[]>> {
    return this.apiService.get<Expert[]>('/experts/search', { q: query, limit });
  }

  async getExpertsBySpecialization(specialization: string): Promise<ApiResponse<Expert[]>> {
    return this.apiService.get<Expert[]>(`/experts/specialization/${specialization}`);
  }

  async getAvailableTimeSlots(expertId: string, date: string): Promise<ApiResponse<string[]>> {
    return this.apiService.get<string[]>(`/experts/${expertId}/availability`, { date });
  }

  async bookConsultation(booking: Partial<ConsultationBooking>): Promise<ApiResponse<ConsultationBooking>> {
    return this.apiService.post<ConsultationBooking>('/consultations', booking);
  }

  async getConsultations(farmerId: string): Promise<ApiResponse<ConsultationBooking[]>> {
    return this.apiService.get<ConsultationBooking[]>('/consultations', { farmerId });
  }

  async cancelConsultation(bookingId: string): Promise<ApiResponse<void>> {
    return this.apiService.delete<void>(`/consultations/${bookingId}`);
  }

  async rateExpert(expertId: string, rating: number, review?: string): Promise<ApiResponse<void>> {
    return this.apiService.post<void>(`/experts/${expertId}/rating`, { rating, review });
  }

  // Mock data fallback for development
  getExpertsMock(): Expert[] {
    const now = new Date();
    return [
      {
        id: "1",
        name: "Dr. Priya Krishnan",
        email: "priya.krishnan@example.com",
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
        verified: true,
        avatar: "/api/placeholder/100/100",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "2",
        name: "Rajesh Kumar Reddy",
        email: "rajesh.reddy@example.com",
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
        verified: true,
        avatar: "/api/placeholder/100/100",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "3",
        name: "Dr. Suresh Gowda",
        email: "suresh.gowda@example.com",
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
        verified: true,
        avatar: "/api/placeholder/100/100",
        createdAt: now,
        updatedAt: now,
      }
    ];
  }

  getAvailableTimeSlotsMock(): string[] {
    return [
      "9:00 AM",
      "11:00 AM", 
      "2:00 PM",
      "3:00 PM",
      "5:00 PM"
    ];
  }

  calculateConsultationCost(hourlyRate: number, duration: number): number {
    return (hourlyRate * duration) / 60; // duration in minutes
  }

  formatExpertRating(rating: number): string {
    return `${rating.toFixed(1)} ⭐`;
  }

  formatExpertExperience(years: number): string {
    return `${years} year${years !== 1 ? 's' : ''} experience`;
  }
}

export const expertService = new ExpertService();
