import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Download, Smartphone } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallButton() {
  const { t } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsInstalled(true);
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      console.log("Install prompt available");
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      console.log("App installed");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // Fallback for browsers that don't support the install prompt
      alert(
        'To install Agro-Mentor:\n\n• Chrome: Click the install icon in the address bar\n• Mobile: Use "Add to Home Screen" from browser menu\n• Edge: Look for the app available notification',
      );
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log("Install result:", outcome);
      setDeferredPrompt(null);
    } catch (error) {
      console.error("Installation failed:", error);
    }
  };

  // Always show the button unless app is already installed
  if (isInstalled) {
    return null;
  }

  return (
    <Button
      onClick={handleInstall}
      variant="outline"
      size="sm"
      className="hidden sm:flex items-center space-x-2 bg-primary/5 hover:bg-primary/10 text-primary border-primary/20"
    >
      <Download className="h-4 w-4" />
      <span>{t("pwa.install")}</span>
    </Button>
  );
}

// Mobile version for the navigation menu
export function PWAInstallButtonMobile() {
  const { t } = useLanguage();
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsInstalled(true);
    }
  }, []);

  const handleInstall = () => {
    // For mobile, show instructions since the install prompt might not be available
    if (
      navigator.userAgent.includes("iPhone") ||
      navigator.userAgent.includes("iPad")
    ) {
      alert(
        'To install Agro-Mentor on iOS:\n\n1. Tap the Share button at the bottom\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" to confirm',
      );
    } else {
      alert(
        'To install DigiFarmer:\n\n• Use "Add to Home Screen" from your browser menu\n• Or look for the install icon in your browser',
      );
    }
  };

  if (isInstalled) {
    return null;
  }

  return (
    <button
      onClick={handleInstall}
      className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-primary hover:bg-leaf-50 transition-colors w-full text-left"
    >
      <Smartphone className="h-4 w-4" />
      <span>{t("pwa.install")}</span>
    </button>
  );
}
