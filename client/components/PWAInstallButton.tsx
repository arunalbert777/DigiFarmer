import { Button } from "./ui/button";
import { Download, Smartphone } from "lucide-react";
import { usePWA } from "../hooks/usePWA";

export function PWAInstallButton() {
  const { canInstall, installApp, isInstalled } = usePWA();

  if (isInstalled || !canInstall) {
    return null;
  }

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      console.log('App installed successfully');
    }
  };

  return (
    <Button
      onClick={handleInstall}
      variant="outline"
      size="sm"
      className="hidden sm:flex items-center space-x-2 bg-primary/5 hover:bg-primary/10 text-primary border-primary/20"
    >
      <Download className="h-4 w-4" />
      <span>Install App</span>
    </Button>
  );
}

// Mobile version for the navigation menu
export function PWAInstallButtonMobile() {
  const { canInstall, installApp, isInstalled } = usePWA();

  if (isInstalled || !canInstall) {
    return null;
  }

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      console.log('App installed successfully');
    }
  };

  return (
    <button
      onClick={handleInstall}
      className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-primary hover:bg-leaf-50 transition-colors w-full text-left"
    >
      <Smartphone className="h-4 w-4" />
      <span>Install App</span>
    </button>
  );
}
