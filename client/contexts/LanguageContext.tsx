import { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "kn";

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Avoid throwing in environments where provider isn't mounted (e.g., preview renderers).
    // Return a safe fallback implementation so components can render without crashing.
    return {
      language: "en" as Language,
      setLanguage: () => {},
      t: (key: string) => key.split(".").pop() || key,
    };
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Check localStorage for saved language preference (guarded for SSR/preview)
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const saved = localStorage.getItem("preferred-language");
        return (saved as Language) || "en";
      }
    } catch (e) {
      // ignore and fall back to English
    }
    return "en";
  });

  // Initialize with basic fallback translations to prevent undefined context
  const [translations, setTranslations] = useState<Record<string, any>>(() => ({
    nav: {
      home: "Home",
      diseaseDetection: "Disease Detection",
      aiAssistant: "AI Assistant",
      community: "Community",
      expertConsultation: "Expert Consultation",
      news: "News",
      marketplace: "Marketplace",
      contractFarming: "Contract Farming",
      verticalFarming: "Vertical Farming",
      developers: "Developers",
    },
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
    },
    home: {
      title: "Agro-Mentor",
      subtitle: "Empowering farmers with modern agricultural technology",
    },
    disease: {
      title: "AI Disease Detection",
      subtitle: "Upload crop images for instant disease identification",
      uploadImage: "Upload Crop Image",
      analyzing: "Analyzing image...",
      results: "Detection Results",
      treatment: "Treatment Recommendations",
      prevention: "Prevention Tips",
    },
  }));
  const [isLoading, setIsLoading] = useState(true);

  // Load translations when language changes
  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true);
      try {
        const translationModule = await import(
          `../translations/${language}.ts`
        );
        setTranslations(translationModule.default);
      } catch (error) {
        console.error(`Failed to load translations for ${language}:`, error);
        // Fallback to English translations
        if (language !== "en") {
          try {
            const fallbackModule = await import("../translations/en.ts");
            setTranslations(fallbackModule.default);
          } catch (fallbackError) {
            console.error(
              "Failed to load fallback translations:",
              fallbackError,
            );
            // Keep existing fallback translations - don't reset them
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [language]);

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem("preferred-language", language);
  }, [language]);

  const t = (key: string, params?: Record<string, string | number>): string => {
    // If translations are still loading, return the key or a loading placeholder
    if (isLoading || !translations || Object.keys(translations).length === 0) {
      return key.split(".").pop() || key; // Return the last part of the key as fallback
    }

    const keys = key.split(".");
    let value = translations;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        // Return a user-friendly fallback if translation is not found
        return key.split(".").pop() || key;
      }
    }

    let result =
      typeof value === "string" ? value : key.split(".").pop() || key;

    // Replace parameters in the translation
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        result = result.replace(`{{${paramKey}}}`, String(paramValue));
      });
    }

    return result;
  };

  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};
