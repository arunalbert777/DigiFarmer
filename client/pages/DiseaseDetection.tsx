import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "../contexts/LanguageContext";
import {
  Upload,
  Camera,
  Scan,
  CheckCircle,
  AlertTriangle,
  Leaf,
  FileImage,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

const supportedCrops = [
  { name: "Tomato", diseases: 50, icon: "🍅" },
  { name: "Potato", diseases: 45, icon: "🥔" },
  { name: "Cherry", diseases: 35, icon: "🍒" },
  { name: "Pepper", diseases: 40, icon: "🌶️" }
];

export default function DiseaseDetection() {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      handleImageUpload(files[0]);
    }
  }, [handleImageUpload]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setResult({
      disease: "Early Blight",
      confidence: 92,
      severity: "Moderate",
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
    });
    
    setIsAnalyzing(false);
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setResult(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-leaf-50 via-white to-earth-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-primary p-3 rounded-lg">
              <Scan className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            {t('disease.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('disease.subtitle')}
          </p>
        </div>

        {/* Supported Crops */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Supported Crops</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {supportedCrops.map((crop, index) => (
              <Card key={index} className="text-center p-4">
                <div className="text-2xl mb-2">{crop.icon}</div>
                <div className="font-medium text-gray-900">{crop.name}</div>
                <div className="text-sm text-gray-600">{crop.diseases} diseases</div>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Upload Plant Image
              </CardTitle>
              <CardDescription>
                Choose an image file or drag and drop to analyze
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedImage ? (
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                    dragOver
                      ? "border-primary bg-primary/5"
                      : "border-gray-300 hover:border-gray-400"
                  )}
                  onDrop={handleDrop}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                >
                  <FileImage className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">
                    Drag and drop your plant image here, or click to browse
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button asChild>
                      <span>
                        <Camera className="h-4 w-4 mr-2" />
                        Choose Image
                      </span>
                    </Button>
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={selectedImage}
                      alt="Selected plant"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={resetAnalysis}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {!isAnalyzing && !result && (
                    <Button onClick={analyzeImage} className="w-full" size="lg">
                      <Scan className="h-4 w-4 mr-2" />
                      Analyze Image
                    </Button>
                  )}
                  
                  {isAnalyzing && (
                    <div className="text-center space-y-4">
                      <Leaf className="h-8 w-8 mx-auto text-primary animate-pulse" />
                      <div>
                        <p className="font-medium text-gray-900 mb-2">Analyzing image...</p>
                        <Progress value={66} className="w-full" />
                        <p className="text-sm text-gray-600 mt-2">
                          Using advanced CNN to detect diseases
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Analysis Results
              </CardTitle>
              <CardDescription>
                AI-powered disease identification and treatment recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!result ? (
                <div className="text-center py-12 text-gray-500">
                  <Scan className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Upload an image to see analysis results</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Disease Info */}
                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-red-900">{result.disease}</h3>
                      <Badge variant="destructive">{result.confidence}% confidence</Badge>
                    </div>
                    <div className="flex items-center text-sm text-red-700">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {result.severity} severity in {result.crop}
                    </div>
                  </div>

                  {/* Treatment */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Immediate Treatment</h4>
                    <ul className="space-y-2">
                      {result.treatment.map((step: string, index: number) => (
                        <li key={index} className="flex items-start text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Prevention */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Prevention Tips</h4>
                    <ul className="space-y-2">
                      {result.prevention.map((tip: string, index: number) => (
                        <li key={index} className="flex items-start text-sm">
                          <Leaf className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button onClick={resetAnalysis} variant="outline" className="w-full">
                    Analyze Another Image
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
