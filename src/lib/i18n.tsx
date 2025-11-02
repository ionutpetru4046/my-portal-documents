"use client";

import { createContext, useContext, useCallback, useState } from "react";

// Define the shape of our translations
interface Translations {
  [key: string]: string;
}

// Create the context
interface I18nContextType {
  t: (key: string) => string;
  lang: string;
  setLang: (lang: string) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Create the provider component
export function I18nProvider({
  children,
  translations,
  initialLang = "en",
}: {
  children: React.ReactNode;
  translations: Record<string, Translations>;
  initialLang?: string;
}) {
  const [lang, setLang] = useState(initialLang);

  const t = useCallback(
    (key: string) => {
      // If no translation exists for the current language, fall back to English
      const translation = translations[lang]?.[key] || translations["en"]?.[key];
      return translation || key;
    },
    [lang, translations]
  );

  const value = { t, lang, setLang };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

// Create the hook to use translations
export function useT() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useT must be used within an I18nProvider");
  }
  return context;
}

// Import the translations
export const translations = {
  en: {
    "loginPage.welcome": "Welcome Back",
    "loginPage.subheading": "Sign in to your account",
    "loginPage.email_label": "Email",
    "loginPage.email_placeholder": "you@example.com",
    "loginPage.password_label": "Password",
    "loginPage.sign_in": "Sign in",
    "loginPage.forgot": "Forgot password?",
    "loginPage.or": "or",
    "loginPage.continue_with_google": "Continue with Google",
    "loginPage.redirecting": "Redirecting...",
    "loginPage.no_account": "Don't have an account?",
    "loginPage.create_one": "Create one",
    "loginPage.back_to_home": "Back to home",
  },
  ro: {
    "loginPage.welcome": "Bine ai revenit",
    "loginPage.subheading": "Conectează-te la contul tău",
    "loginPage.email_label": "Email",
    "loginPage.email_placeholder": "tu@exemplu.com",
    "loginPage.password_label": "Parolă",
    "loginPage.sign_in": "Conectare",
    "loginPage.forgot": "Ai uitat parola?",
    "loginPage.or": "sau",
    "loginPage.continue_with_google": "Continuă cu Google",
    "loginPage.redirecting": "Se redirecționează...",
    "loginPage.no_account": "Nu ai cont?",
    "loginPage.create_one": "Creează unul",
    "loginPage.back_to_home": "Înapoi la pagina principală",
  }
};