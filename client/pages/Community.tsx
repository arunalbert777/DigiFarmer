import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ArrowRight } from "lucide-react";

export default function Community() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-leaf-50 via-white to-earth-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="text-center p-12">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-purple-100 p-4 rounded-lg">
                <Users className="h-12 w-12 text-purple-600" />
              </div>
            </div>
            <CardTitle className="text-2xl mb-4">Community Platform Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Connect with fellow farmers worldwide, share experiences, and learn from agricultural experts. 
              Build a network that grows together.
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
