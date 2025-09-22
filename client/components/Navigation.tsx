import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { PWAInstallButton, PWAInstallButtonMobile } from "./PWAInstallButton";
import { LanguageSelector } from "./LanguageSelector";
import { useLanguage } from "../contexts/LanguageContext";
import {
  Leaf,
  Scan,
  Bot,
  Users,
  UserCheck,
  Menu,
  X,
  Newspaper,
  Code,
  ShoppingCart,
  Handshake,
  Building2,
  Volume,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const getNavItems = (t: (key: string) => string) => [
  {
    name: t("nav.home"),
    path: "/",
    icon: Leaf,
  },
  {
    name: t("nav.diseaseDetection"),
    path: "/disease-detection",
    icon: Scan,
  },
  {
    name: t("nav.aiAssistant"),
    path: "/ai-chat",
    icon: Bot,
  },
  {
    name: t("nav.geminiVoice"),
    path: "/gemini-voice",
    icon: Volume,
  },
  {
    name: t("nav.community"),
    path: "/community",
    icon: Users,
  },
  {
    name: t("nav.expertConsultation"),
    path: "/experts",
    icon: UserCheck,
  },
  {
    name: t("nav.news"),
    path: "/news",
    icon: Newspaper,
  },
  {
    name: t("nav.marketplace"),
    path: "/marketplace",
    icon: ShoppingCart,
  },
  {
    name: t("nav.contractFarming"),
    path: "/contract-farming",
    icon: Handshake,
  },
  {
    name: t("nav.verticalFarming"),
    path: "/vertical-farming",
    icon: Building2,
  },
  {
    name: t("nav.developers"),
    path: "/developers",
    icon: Code,
  },
];

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();
  const navItems = getNavItems(t);

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-leaf-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary p-2 rounded-lg">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Agro-Mentor</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "text-primary bg-leaf-50"
                      : "text-gray-600 hover:text-primary hover:bg-leaf-50",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <LanguageSelector />
            <PWAInstallButton />
            {/* Temporary visible install button for testing */}
            <Button
              variant="outline"
              size="sm"
              className="bg-primary/5 hover:bg-primary/10 text-primary border-primary/20"
              onClick={() => {
                if ("serviceWorker" in navigator && "PushManager" in window) {
                  alert("PWA features supported! Install button should work.");
                } else {
                  alert("PWA not supported in this browser");
                }
              }}
            >
              📱 {t("pwa.install")}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "text-primary bg-leaf-50"
                        : "text-gray-600 hover:text-primary hover:bg-leaf-50",
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              <div className="pt-2 border-t border-gray-200 mt-2 space-y-2">
                <LanguageSelector variant="mobile" />
                <PWAInstallButtonMobile />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
