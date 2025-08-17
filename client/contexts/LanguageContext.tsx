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
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Check localStorage for saved language preference
    const saved = localStorage.getItem("preferred-language");
    return (saved as Language) || "en";
  });

  const [translations, setTranslations] = useState<Record<string, any>>({});

  // Load translations when language changes
  useEffect(() => {
    const loadTranslations = async () => {
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
          }
        }
      }
    };

    loadTranslations();
  }, [language]);

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem("preferred-language", language);
  }, [language]);

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split(".");
    let value = translations;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        // Return the key if translation is not found
        return key;
      }
    }

    let result = typeof value === "string" ? value : key;

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
