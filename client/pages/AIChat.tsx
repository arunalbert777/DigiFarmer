import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "../contexts/LanguageContext";
import {
  Bot,
  User,
  Send,
  Mic,
  Paperclip,
  Lightbulb,
  Leaf,
  Droplets,
  Bug,
  Sun,
  Cloud,
  Thermometer,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  type?: "text" | "suggestion";
}

const quickSuggestions = [
  { icon: Leaf, text: "Best crops for Bengaluru climate", category: "Crops" },
  { icon: Droplets, text: "Optimal irrigation schedule", category: "Water" },
  { icon: Bug, text: "Common pest control methods", category: "Pests" },
  { icon: Sun, text: "Seasonal farming calendar", category: "Calendar" },
  { icon: Cloud, text: "Weather impact on crops", category: "Weather" },
  { icon: Thermometer, text: "Soil temperature management", category: "Soil" },
];

const botResponses: { [key: string]: string } = {
  hello:
    "Hello! I'm your AI farming assistant. I'm here to help you with all your agricultural questions. How can I assist you today?",
  crops:
    "For Bengaluru's climate, I recommend crops like tomatoes, beans, carrots, cabbage, and leafy greens. The moderate climate is perfect for year-round cultivation of many vegetables.",
  irrigation:
    "In Bengaluru, drip irrigation works best. Water early morning (6-8 AM) or evening (5-7 PM). For most crops, water every 2-3 days depending on soil moisture and weather.",
  pest: "Common pests in Bengaluru include aphids, whiteflies, and caterpillars. Use neem oil spray, introduce beneficial insects like ladybugs, and practice crop rotation for natural pest control.",
  weather:
    "Bengaluru has a pleasant climate year-round. Monsoon season (June-September) requires good drainage. Winter is ideal for most crops. Summer needs adequate irrigation.",
  soil: "Bengaluru's red soil is generally fertile but may need organic matter. Test pH levels (ideal 6.0-7.0), add compost, and ensure good drainage for optimal crop growth.",
  default:
    "That's a great question! Based on my knowledge of agriculture and Bengaluru's farming conditions, here are some recommendations. For more specific advice, you might want to consult with our agricultural experts.",
};

export default function AIChat() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI farming assistant. I can help you with crop recommendations, pest control, irrigation advice, and farming techniques specific to Bengaluru. What would you like to know?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    if (message.includes("hello") || message.includes("hi")) {
      return botResponses.hello;
    } else if (
      message.includes("crop") ||
      message.includes("plant") ||
      message.includes("grow")
    ) {
      return botResponses.crops;
    } else if (message.includes("water") || message.includes("irrigat")) {
      return botResponses.irrigation;
    } else if (
      message.includes("pest") ||
      message.includes("insect") ||
      message.includes("bug")
    ) {
      return botResponses.pest;
    } else if (
      message.includes("weather") ||
      message.includes("climate") ||
      message.includes("rain")
    ) {
      return botResponses.weather;
    } else if (
      message.includes("soil") ||
      message.includes("fertilizer") ||
      message.includes("compost")
    ) {
      return botResponses.soil;
    } else {
      return botResponses.default;
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateBotResponse(inputMessage),
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-leaf-50 via-white to-earth-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Bot className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            {t("nav.aiAssistant")}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("nav.aiAssistant")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Quick Suggestions Sidebar */}
          <div className="lg:col-span-1">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Lightbulb className="h-5 w-5 mr-2" />
                  {t("common.search")}
                </CardTitle>
                <CardDescription>{t("common.search")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickSuggestions.map((suggestion, index) => {
                  const Icon = suggestion.icon;
                  return (
                    <div key={index}>
                      <button
                        onClick={() => handleSuggestionClick(suggestion.text)}
                        className="w-full text-left p-3 rounded-lg hover:bg-leaf-50 transition-colors group"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="bg-primary/10 p-2 rounded-md group-hover:bg-primary/20 transition-colors">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Badge variant="secondary" className="text-xs mb-1">
                              {suggestion.category}
                            </Badge>
                            <p className="text-sm text-gray-700 font-medium">
                              {suggestion.text}
                            </p>
                          </div>
                        </div>
                      </button>
                      {index < quickSuggestions.length - 1 && (
                        <Separator className="mt-3" />
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary p-2 rounded-lg">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">AgriBot</h3>
                      <p className="text-sm text-gray-600">
                        Online • Expert in Bengaluru farming
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    AI Assistant
                  </Badge>
                </div>
              </CardHeader>

              {/* Messages Area */}
              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex items-start space-x-3",
                          message.sender === "user"
                            ? "flex-row-reverse space-x-reverse"
                            : "",
                        )}
                      >
                        <div
                          className={cn(
                            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                            message.sender === "user"
                              ? "bg-primary text-white"
                              : "bg-blue-100 text-blue-600",
                          )}
                        >
                          {message.sender === "user" ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <Bot className="h-4 w-4" />
                          )}
                        </div>
                        <div
                          className={cn(
                            "flex-1 max-w-xs lg:max-w-md",
                            message.sender === "user" ? "text-right" : "",
                          )}
                        >
                          <div
                            className={cn(
                              "rounded-lg px-4 py-2 text-sm",
                              message.sender === "user"
                                ? "bg-primary text-white"
                                : "bg-gray-100 text-gray-900",
                            )}
                          >
                            {message.content}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                          <Bot className="h-4 w-4" />
                        </div>
                        <div className="bg-gray-100 rounded-lg px-4 py-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div ref={messagesEndRef} />
                </ScrollArea>

                {/* Input Area */}
                <div className="border-t p-4">
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="ghost">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <div className="flex-1 relative">
                      <Input
                        ref={inputRef}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask about crops, pests, irrigation, or any farming question..."
                        className="pr-12"
                      />
                      <Button
                        size="sm"
                        onClick={sendMessage}
                        disabled={!inputMessage.trim() || isTyping}
                        className="absolute right-1 top-1 h-8 w-8 p-0"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Mic className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    AI responses are based on general agricultural knowledge.
                    For specific issues, consult our experts.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
