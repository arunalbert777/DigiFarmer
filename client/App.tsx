import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import Index from "./pages/Index";
import DiseaseDetection from "./pages/DiseaseDetection";
import AIChat from "./pages/AIChat";
import Community from "./pages/Community";
import ExpertConsultation from "./pages/ExpertConsultation";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/disease-detection" element={<DiseaseDetection />} />
            <Route path="/ai-chat" element={<AIChat />} />
            <Route path="/community" element={<Community />} />
            <Route path="/experts" element={<ExpertConsultation />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
