
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  companyName: string;
  logo: string;
  appearance: "light" | "dark" | "system";
  language: "english" | "hindi" | "tamil" | "telugu" | "marathi";
};

interface ThemeContextType {
  theme: Theme;
  updateTheme: (newTheme: Partial<Theme>) => void;
  isDarkMode: boolean;
  setAppearance: (mode: "light" | "dark" | "system") => void;
  translations: Record<string, Record<string, string>>;
  t: (key: string) => string;
}

// Updated default theme with Indian color palette
const defaultTheme: Theme = {
  primaryColor: "orange",
  secondaryColor: "emerald",
  accentColor: "violet",
  companyName: "Bharat CRM",
  logo: "",
  appearance: "system",
  language: "english"
};

// Basic translations for demonstration
const translations = {
  english: {
    "settings": "Settings",
    "general": "General",
    "appearance": "Appearance",
    "data": "Data Management",
    "integrations": "Integrations",
    "email": "Email Campaigns",
    "language": "Language",
    "currency": "Currency",
    "notifications": "Notifications",
    "save_changes": "Save Changes",
    "dashboard": "Dashboard",
    "customers": "Customers",
    "orders": "Orders",
    "products": "Products",
    "analytics": "Analytics",
    "settings_updated": "Settings updated",
    "welcome": "Welcome to",
    "login": "Login",
    "register": "Register",
    "email_address": "Email Address",
    "password": "Password",
    "remember_me": "Remember me",
    "forgot_password": "Forgot password?",
    "submit": "Submit",
    "connect": "Connect",
  },
  hindi: {
    "settings": "सेटिंग्स",
    "general": "सामान्य",
    "appearance": "उपस्थिति",
    "data": "डेटा प्रबंधन",
    "integrations": "एकीकरण",
    "email": "ईमेल अभियान",
    "language": "भाषा",
    "currency": "मुद्रा",
    "notifications": "सूचनाएं",
    "save_changes": "परिवर्तनों को सहेजें",
    "dashboard": "डैशबोर्ड",
    "customers": "ग्राहक",
    "orders": "ऑर्डर",
    "products": "उत्पाद",
    "analytics": "विश्लेषण",
    "settings_updated": "सेटिंग्स अपडेट की गईं",
    "welcome": "स्वागत है",
    "login": "लॉगिन",
    "register": "पंजीकरण",
    "email_address": "ईमेल पता",
    "password": "पासवर्ड",
    "remember_me": "मुझे याद रखें",
    "forgot_password": "पासवर्ड भूल गए?",
    "submit": "प्रस्तुत करें",
    "connect": "जुड़ें",
  },
  tamil: {
    "settings": "அமைப்புகள்",
    "general": "பொது",
    "appearance": "தோற்றம்",
    "data": "தரவு மேலாண்மை",
    "integrations": "ஒருங்கிணைப்புகள்",
    "email": "மின்னஞ்சல் பிரச்சாரங்கள்",
    "language": "மொழி",
    "currency": "நாணயம்",
    "notifications": "அறிவிப்புகள்",
    "save_changes": "மாற்றங்களை சேமி",
    "dashboard": "டாஷ்போர்டு",
    "customers": "வாடிக்கையாளர்கள்",
    "orders": "ஆர்டர்கள்",
    "products": "பொருட்கள்",
    "analytics": "பகுப்பாய்வு",
    "settings_updated": "அமைப்புகள் புதுப்பிக்கப்பட்டன",
    "welcome": "வரவேற்கிறோம்",
    "login": "உள்நுழைவு",
    "register": "பதிவு செய்க",
    "email_address": "மின்னஞ்சல் முகவரி",
    "password": "கடவுச்சொல்",
    "remember_me": "என்னை நினைவில் வை",
    "forgot_password": "கடவுச்சொல் மறந்துவிட்டதா?",
    "submit": "சமர்ப்பி",
    "connect": "இணை",
  },
  telugu: {
    "settings": "సెట్టింగులు",
    "general": "సాధారణ",
    "appearance": "రూపం",
    "data": "డేటా నిర్వహణ",
    "integrations": "ఇంటిగ్రేషన్లు",
    "email": "ఇమెయిల్ ప్రచారాలు",
    "language": "భాష",
    "currency": "కరెన్సీ",
    "notifications": "నోటిఫికేషన్లు",
    "save_changes": "మార్పులను సేవ్ చేయండి",
    "dashboard": "డాష్బోర్డ్",
    "customers": "కస్టమర్లు",
    "orders": "ఆర్డర్లు",
    "products": "ఉత్పత్తులు",
    "analytics": "అనలిటిక్స్",
    "settings_updated": "సెట్టింగులు నవీకరించబడ్డాయి",
    "welcome": "స్వాగతం",
    "login": "లాగిన్",
    "register": "రిజిస్టర్",
    "email_address": "ఇమెయిల్ చిరునామా",
    "password": "పాస్వర్డ్",
    "remember_me": "నన్ను గుర్తుంచుకో",
    "forgot_password": "పాస్వర్డ్ మర్చిపోయారా?",
    "submit": "సమర్పించండి",
    "connect": "కనెక్ట్",
  },
  marathi: {
    "settings": "सेटिंग्ज",
    "general": "सामान्य",
    "appearance": "दिसावा",
    "data": "डेटा व्यवस्थापन",
    "integrations": "एकात्मिकरण",
    "email": "ईमेल मोहिमा",
    "language": "भाषा",
    "currency": "चलन",
    "notifications": "सूचना",
    "save_changes": "बदल जतन करा",
    "dashboard": "डॅशबोर्ड",
    "customers": "ग्राहक",
    "orders": "ऑर्डर",
    "products": "उत्पादने",
    "analytics": "विश्लेषण",
    "settings_updated": "सेटिंग्ज अपडेट केल्या",
    "welcome": "स्वागत आहे",
    "login": "लॉगिन",
    "register": "नोंदणी करा",
    "email_address": "ईमेल पत्ता",
    "password": "पासवर्ड",
    "remember_me": "मला लक्षात ठेवा",
    "forgot_password": "पासवर्ड विसरलात?",
    "submit": "सबमिट करा",
    "connect": "कनेक्ट करा",
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("crm-theme");
    return savedTheme ? JSON.parse(savedTheme) : defaultTheme;
  });
  
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem("crm-theme", JSON.stringify(theme));
  }, [theme]);

  // Handle dark mode based on theme.appearance
  useEffect(() => {
    const setAppearanceClass = () => {
      const { appearance } = theme;
      const root = window.document.documentElement;
      
      // Clear existing class
      root.classList.remove("light", "dark");
      
      let isDark = false;
      
      if (appearance === "system") {
        const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches;
        root.classList.add(systemPreference ? "dark" : "light");
        isDark = systemPreference;
      } else {
        root.classList.add(appearance);
        isDark = appearance === "dark";
      }
      
      setIsDarkMode(isDark);
    };
    
    setAppearanceClass();
    
    // Listen for system preference changes if using system setting
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme.appearance === "system") {
        setAppearanceClass();
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme.appearance]);

  const updateTheme = (newTheme: Partial<Theme>) => {
    setTheme((prevTheme) => ({
      ...prevTheme,
      ...newTheme,
    }));
  };
  
  const setAppearance = (mode: "light" | "dark" | "system") => {
    updateTheme({ appearance: mode });
  };

  // Translation helper
  const t = (key: string) => {
    const currentLanguage = theme.language || 'english';
    return translations[currentLanguage][key] || key;
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      updateTheme, 
      isDarkMode, 
      setAppearance, 
      translations,
      t 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
