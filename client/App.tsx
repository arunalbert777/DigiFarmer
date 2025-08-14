import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import { Navigation } from "./components/Navigation";
import { InstallPrompt } from "./components/InstallPrompt";
import Index from "./pages/Index";
import DiseaseDetection from "./pages/DiseaseDetection";
import AIChat from "./pages/AIChat";
import Community from "./pages/Community";
import ExpertConsultation from "./pages/ExpertConsultation";
import News from "./pages/News";
import Developers from "./pages/Developers";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <AppProvider>
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
              <Route path="/news" element={<News />} />
              <Route path="/developers" element={<Developers />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <InstallPrompt />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
