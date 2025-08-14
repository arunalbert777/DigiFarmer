import { apiService } from './ApiService';
import { DiseaseDetection, ApiResponse } from '../models/types';

export interface DiseaseDetectionRequest {
  farmerId: string;
  cropType?: string;
  location?: string;
  symptoms?: string;
}

export interface DiseaseDetectionResult {
  disease: string;
  confidence: number;
  severity: 'Low' | 'Moderate' | 'High' | 'Critical';
  crop: string;
  treatment: string[];
  prevention: string[];
}

export class DiseaseDetectionService {
  private apiService = apiService;

  async detectDisease(file: File, additionalData?: DiseaseDetectionRequest): Promise<ApiResponse<DiseaseDetection>> {
    return this.apiService.uploadFile<DiseaseDetection>('/disease-detection/analyze', file, additionalData);
  }

  async getDetectionHistory(farmerId: string): Promise<ApiResponse<DiseaseDetection[]>> {
    return this.apiService.get<DiseaseDetection[]>('/disease-detection/history', { farmerId });
  }

  async getDetectionById(id: string): Promise<ApiResponse<DiseaseDetection>> {
    return this.apiService.get<DiseaseDetection>(`/disease-detection/${id}`);
  }

  async getSupportedCrops(): Promise<ApiResponse<string[]>> {
    return this.apiService.get<string[]>('/disease-detection/crops');
  }

  async getDiseaseInfo(diseaseName: string): Promise<ApiResponse<any>> {
    return this.apiService.get<any>(`/disease-detection/diseases/${diseaseName}`);
  }

  async reportFeedback(detectionId: string, feedback: { accurate: boolean; comments?: string }): Promise<ApiResponse<void>> {
    return this.apiService.post<void>(`/disease-detection/${detectionId}/feedback`, feedback);
  }

  // Mock detection logic for development
  async mockDetectDisease(file: File): Promise<DiseaseDetectionResult> {
    // Simulate API processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    const diseases = [
      {
        disease: "Early Blight",
        confidence: 92,
        severity: "Moderate" as const,
        crop: "Tomato",
        treatment: [
          "Remove affected leaves immediately",
          "Apply copper-based fungicide",
          "Improve air circulation",
          "Avoid overhead watering"
        ],
        prevention: [
          "Crop rotation every 2-3 years",
          "Use disease-resistant varieties",
          "Maintain proper plant spacing",
          "Regular inspection of plants"
        ]
      },
      {
        disease: "Powdery Mildew",
        confidence: 88,
        severity: "Low" as const,
        crop: "Cabbage",
        treatment: [
          "Apply neem oil spray",
          "Use baking soda solution",
          "Remove affected leaves",
          "Increase air circulation"
        ],
        prevention: [
          "Avoid overhead watering",
          "Plant in well-draining soil",
          "Provide adequate spacing",
          "Monitor humidity levels"
        ]
      },
      {
        disease: "Late Blight",
        confidence: 95,
        severity: "High" as const,
        crop: "Potato",
        treatment: [
          "Apply fungicide immediately",
          "Remove and destroy infected plants",
          "Improve drainage",
          "Reduce humidity around plants"
        ],
        prevention: [
          "Use certified disease-free seeds",
          "Practice crop rotation",
          "Avoid working in wet conditions",
          "Apply preventive fungicides"
        ]
      }
    ];

    // Return random disease for demo
    return diseases[Math.floor(Math.random() * diseases.length)];
  }

  getSupportedCropsMock(): string[] {
    return [
      "Tomato",
      "Potato", 
      "Cabbage",
      "Carrot",
      "Onion",
      "Green Beans",
      "Pepper",
      "Cherry",
      "Cucumber",
      "Lettuce"
    ];
  }

  validateImageFile(file: File): { valid: boolean; error?: string } {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      return { valid: false, error: 'Please upload a valid image file (JPEG, PNG, or WebP)' };
    }

    if (file.size > maxSize) {
      return { valid: false, error: 'Image file size should be less than 10MB' };
    }

    return { valid: true };
  }

  formatConfidence(confidence: number): string {
    return `${confidence.toFixed(1)}%`;
  }

  getSeverityColor(severity: string): string {
    switch (severity.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'moderate': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  }

  getDiseaseIconByType(disease: string): string {
    const diseaseIcons: Record<string, string> = {
      'early blight': '🍂',
      'late blight': '🦠',
      'powdery mildew': '🤍',
      'bacterial spot': '🔴',
      'mosaic virus': '🟨',
      'rust': '🟤',
      'anthracnose': '⚫',
      'downy mildew': '💧'
    };

    const key = disease.toLowerCase();
    return diseaseIcons[key] || '🌱';
  }
}

export const diseaseDetectionService = new DiseaseDetectionService();
