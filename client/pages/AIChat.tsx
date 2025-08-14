import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, ArrowRight } from "lucide-react";

export default function AIChat() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-leaf-50 via-white to-earth-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="text-center p-12">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-4 rounded-lg">
                <Bot className="h-12 w-12 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl mb-4">AI Assistant Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Our intelligent farming assistant will provide 24/7 support for all your agricultural questions. 
              Get personalized advice and instant answers.
            </p>
            <Button asChild>
              <a href="#" onClick={(e) => { e.preventDefault(); alert("Feature coming soon! Continue prompting to build this page."); }}>
                <ArrowRight className="h-4 w-4 mr-2" />
                Continue to build this feature
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
