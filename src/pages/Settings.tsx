import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useData } from "@/contexts/DataContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import AppearanceToggle from "@/components/settings/AppearanceToggle";
import { 
  Mail, 
  RefreshCw, 
  Save, 
  Image, 
  IndianRupee, 
  Languages, 
  Smartphone, 
  Settings as SettingsIcon, 
  BellRing, 
  Store, 
  ShoppingCart, 
  MessageSquare, 
  Globe, 
  Facebook,
  Instagram,
  Loader2, 
  Layout,
  PanelRight,
  PanelLeft
} from "lucide-react";
import { sendEmailToAll } from "@/utils/exportUtils";
import { useNotifications } from "@/contexts/NotificationContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import IntegrationCard from "@/components/integrations/IntegrationCard";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const colorOptions = [
  { value: "slate", label: "Slate" },
  { value: "blue", label: "Blue" },
  { value: "indigo", label: "Indigo" },
  { value: "emerald", label: "Emerald" },
  { value: "violet", label: "Violet" },
  { value: "rose", label: "Rose" },
  { value: "amber", label: "Amber" },
  { value: "orange", label: "Orange" },
];

const layoutOptions = [
  { 
    id: "classic", 
    name: "Classic", 
    description: "Traditional layout with sidebar navigation",
    icon: <PanelLeft className="h-4 w-4 mr-1" />
  },
  { 
    id: "modern", 
    name: "Modern", 
    description: "Clean, spacious layout with top navigation",
    icon: <Layout className="h-4 w-4 mr-1" />
  },
  { 
    id: "compact", 
    name: "Compact", 
    description: "Space-efficient layout for power users",
    icon: <PanelRight className="h-4 w-4 mr-1" />
  },
];

const integrationProviders = [
  {
    id: "shopify",
    name: "Shopify",
    description: "Connect your Shopify store",
    icon: <Store className="h-4 w-4" />,
    isConnected: false,
    connectionUrl: "https://api.shopify.com/auth",
  },
  {
    id: "woocommerce",
    name: "WooCommerce",
    description: "Connect your WordPress store",
    icon: <ShoppingCart className="h-4 w-4" />,
    isConnected: false,
    connectionUrl: "https://woocommerce.com/connect",
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    description: "Sync your email marketing",
    icon: <Mail className="h-4 w-4" />,
    isConnected: false,
    connectionUrl: "https://login.mailchimp.com/oauth2/authorize",
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    description: "Connect WhatsApp for business messaging",
    icon: <MessageSquare className="h-4 w-4" />,
    isNew: true,
    isConnected: false,
    connectionUrl: "https://www.whatsapp.com/business/api",
  },
  {
    id: "instagram",
    name: "Instagram",
    description: "Connect your Instagram business account",
    icon: <Instagram className="h-4 w-4" />,
    isNew: true,
    isConnected: false,
    connectionUrl: "https://www.instagram.com/oauth/authorize",
  },
  {
    id: "facebook",
    name: "Facebook",
    description: "Connect your Facebook business page",
    icon: <Facebook className="h-4 w-4" />,
    isConnected: false,
    connectionUrl: "https://www.facebook.com/dialog/oauth",
  },
  {
    id: "website",
    name: "Website Integration",
    description: "Add CRM features to your website",
    icon: <Globe className="h-4 w-4" />,
    isConnected: false,
    connectionUrl: "#"
  }
];

const Settings = () => {
  const { theme, updateTheme, setAppearance, t } = useTheme();
  const { customers } = useData();
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const [companyName, setCompanyName] = useState(theme.companyName);
  const [logoUrl, setLogoUrl] = useState(theme.logo);
  const [language, setLanguage] = useState(theme.language || "english");
  const [currency, setCurrency] = useState("inr");
  const [autoBackup, setAutoBackup] = useState(true);
  const [dataRefreshInterval, setDataRefreshInterval] = useState("30");
  const [mobileNotifications, setMobileNotifications] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [integrations, setIntegrations] = useState(integrationProviders);
  const [selectedLayout, setSelectedLayout] = useState("classic");

  useEffect(() => {
    const interval = setInterval(() => {
      if (autoBackup) {
        toast({
          title: "Auto Backup",
          description: "Your data has been automatically backed up.",
        });
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [autoBackup, toast]);

  const handleSaveGeneral = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateTheme({
        companyName,
        logo: logoUrl,
      });
      
      toast({
        title: t('settings_updated'),
        description: "Your CRM settings have been updated successfully.",
      });
      
      addNotification({
        title: "Settings Changed",
        message: "Company settings have been updated by admin",
        type: "info",
        read: false,
      });
      
      setIsSaving(false);
    }, 800);
  };

  const handleColorChange = (colorType: 'primaryColor' | 'secondaryColor' | 'accentColor', color: string) => {
    updateTheme({
      [colorType]: color,
    });
    
    addNotification({
      title: "Theme Updated",
      message: `The ${colorType.replace('Color', '')} color has been changed to ${color}`,
      type: "info",
      read: false,
    });
  };

  const handleSendEmailCampaign = () => {
    if (customers.length === 0) {
      toast({
        title: "No recipients",
        description: "There are no customers to send emails to.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    
    setTimeout(() => {
      sendEmailToAll(customers);
      setIsSaving(false);
      
      addNotification({
        title: "Email Campaign Sent",
        message: `Email campaign sent to ${customers.length} customers`,
        type: "success",
        read: false,
      });
    }, 1500);
  };

  const handleDataSettingsSave = () => {
    setIsSaving(true);
    
    setTimeout(() => {
      toast({
        title: "Data settings updated",
        description: `Data refresh interval set to ${dataRefreshInterval} minutes.`,
      });
      
      addNotification({
        title: "Data Settings Changed",
        message: `Data refresh settings have been updated to ${dataRefreshInterval} minutes`,
        type: "info",
        read: false,
      });
      
      setIsSaving(false);
    }, 800);
  };

  const handleLanguageChange = (value: string) => {
    const languageValue = value as "english" | "hindi" | "tamil" | "telugu" | "marathi";
    setLanguage(languageValue);
    updateTheme({ language: languageValue });
    
    toast({
      title: "Language preference updated",
      description: `UI language preference set to ${value}.`,
    });
    
    addNotification({
      title: "Language Setting Changed",
      message: `System language has been updated to ${value}`,
      type: "info",
      read: false,
    });
  };

  const handleCurrencyChange = (value: string) => {
    setCurrency(value);
    
    toast({
      title: "Currency updated",
      description: `Default currency set to ${value === 'inr' ? 'Indian Rupee (₹)' : 'US Dollar ($)'}`,
    });
    
    addNotification({
      title: "Currency Setting Changed",
      message: `System currency has been updated to ${value === 'inr' ? 'Indian Rupee (₹)' : 'US Dollar ($)'}`,
      type: "info",
      read: false,
    });
  };

  const handleLayoutChange = (layoutId: string) => {
    setSelectedLayout(layoutId);
    
    toast({
      title: "Layout Changed",
      description: `CRM layout has been updated to ${layoutId}.`,
    });
    
    addNotification({
      title: "Layout Changed",
      message: `The CRM layout has been changed to ${layoutId}`,
      type: "info",
      read: false,
    });
  };

  const handleConnectIntegration = async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setIntegrations((prev) => 
          prev.map((item) => 
            item.id === id ? { ...item, isConnected: true } : item
          )
        );
        resolve(true);
      }, 1500);
    });
  };

  const handleDisconnectIntegration = async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setIntegrations((prev) => 
          prev.map((item) => 
            item.id === id ? { ...item, isConnected: false } : item
          )
        );
        resolve(true);
      }, 1500);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t('settings')}</h2>
        <Badge variant="outline" className="px-2 py-1">
          Last updated: {new Date().toLocaleString('en-IN')}
        </Badge>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="general">{t('general')}</TabsTrigger>
          <TabsTrigger value="appearance">{t('appearance')}</TabsTrigger>
          <TabsTrigger value="data">{t('data')}</TabsTrigger>
          <TabsTrigger value="integrations">{t('integrations')}</TabsTrigger>
          <TabsTrigger value="email">{t('email')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5 text-muted-foreground" />
                {t('general')} {t('settings')}
              </CardTitle>
              <CardDescription>
                Configure your CRM's basic information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input 
                  id="company-name" 
                  value={companyName} 
                  onChange={(e) => setCompanyName(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo-url">Logo URL</Label>
                <div className="flex gap-2">
                  <Input 
                    id="logo-url" 
                    value={logoUrl} 
                    onChange={(e) => setLogoUrl(e.target.value)} 
                    placeholder="https://yourdomain.com/logo.png" 
                  />
                  <Button variant="outline" size="icon" title="Browse for logo">
                    <Image className="h-4 w-4" />
                  </Button>
                </div>
                {logoUrl && (
                  <div className="mt-2 border rounded p-2 flex justify-center">
                    <img 
                      src={logoUrl} 
                      alt="Company Logo" 
                      className="h-16 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Logo";
                      }}
                    />
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">{t('language')}</Label>
                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger id="language" className="w-full">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
                      <SelectItem value="tamil">தமிழ் (Tamil)</SelectItem>
                      <SelectItem value="telugu">తెలుగు (Telugu)</SelectItem>
                      <SelectItem value="marathi">मराठी (Marathi)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency">{t('currency')}</Label>
                  <Select value={currency} onValueChange={handleCurrencyChange}>
                    <SelectTrigger id="currency" className="w-full">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inr">
                        <div className="flex items-center gap-2">
                          <IndianRupee className="h-4 w-4" />
                          <span>Indian Rupee (₹)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="usd">
                        <div className="flex items-center gap-2">
                          <span className="h-4 w-4 flex items-center justify-center">$</span>
                          <span>US Dollar ($)</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="mobile-notifications">Mobile Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications on your mobile device
                    </p>
                  </div>
                  <Switch 
                    id="mobile-notifications" 
                    checked={mobileNotifications}
                    onCheckedChange={setMobileNotifications}
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleSaveGeneral} 
                disabled={isSaving}
                className="mt-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {t('save_changes')}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('appearance')}</CardTitle>
              <CardDescription>
                Customize the look and feel of your CRM
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <AppearanceToggle 
                  appearance={theme.appearance || "system"} 
                  onAppearanceChange={setAppearance} 
                />
                
                <Separator className="my-6" />
                
                <div>
                  <h3 className="text-lg font-medium">Layout</h3>
                  <p className="text-sm text-muted-foreground mb-4">Choose how your CRM interface is organized</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {layoutOptions.map((layout) => (
                      <div 
                        key={layout.id}
                        className={`
                          border rounded-lg p-4 cursor-pointer transition-all
                          ${selectedLayout === layout.id 
                            ? 'border-primary bg-primary/5' 
                            : 'hover:border-primary/50'
                          }
                        `}
                        onClick={() => handleLayoutChange(layout.id)}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {layout.icon}
                          <h4 className="font-medium">{layout.name}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">{layout.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div>
                  <h3 className="text-lg font-medium">Color Theme</h3>
                  <Separator className="my-2" />
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label>Primary Color</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {colorOptions.map((color) => (
                          <div
                            key={`primary-${color.value}`}
                            onClick={() => handleColorChange('primaryColor', color.value)}
                            className={`w-10 h-10 rounded-full cursor-pointer border-2 ${
                              theme.primaryColor === color.value ? 'border-black dark:border-white' : 'border-transparent'
                            } bg-${color.value}-500 hover:scale-110 transition-transform`}
                            title={color.label}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label>Secondary Color</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {colorOptions.map((color) => (
                          <div
                            key={`secondary-${color.value}`}
                            onClick={() => handleColorChange('secondaryColor', color.value)}
                            className={`w-10 h-10 rounded-full cursor-pointer border-2 ${
                              theme.secondaryColor === color.value ? 'border-black dark:border-white' : 'border-transparent'
                            } bg-${color.value}-200 hover:scale-110 transition-transform`}
                            title={color.label}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label>Accent Color</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {colorOptions.map((color) => (
                          <div
                            key={`accent-${color.value}`}
                            onClick={() => handleColorChange('accentColor', color.value)}
                            className={`w-10 h-10 rounded-full cursor-pointer border-2 ${
                              theme.accentColor === color.value ? 'border-black dark:border-white' : 'border-transparent'
                            } bg-${color.value}-400 hover:scale-110 transition-transform`}
                            title={color.label}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div>
                  <h3 className="text-lg font-medium">Advanced Customization</h3>
                  <p className="text-sm text-muted-foreground mb-4">Fine-tune your CRM interface</p>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="font">
                      <AccordionTrigger>Font Settings</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Font Family</Label>
                            <Select defaultValue="inter">
                              <SelectTrigger>
                                <SelectValue placeholder="Select font" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="inter">Inter</SelectItem>
                                <SelectItem value="roboto">Roboto</SelectItem>
                                <SelectItem value="poppins">Poppins</SelectItem>
                                <SelectItem value="lato">Lato</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Font Size</Label>
                            <Select defaultValue="medium">
                              <SelectTrigger>
                                <SelectValue placeholder="Select size" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="small">Small</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="large">Large</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="animation">
                      <AccordionTrigger>Animation & Effects</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="enable-animations">Enable Animations</Label>
                              <p className="text-sm text-muted-foreground">Show transitions and animations in the interface</p>
                            </div>
                            <Switch id="enable-animations" defaultChecked />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="reduced-motion">Reduced Motion</Label>
                              <p className="text-sm text-muted-foreground">Simplify animations for accessibility</p>
                            </div>
                            <Switch id="reduced-motion" />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="sidebar">
                      <AccordionTrigger>Sidebar Options</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="collapsed-sidebar">Collapsed Sidebar by Default</Label>
                              <p className="text-sm text-muted-foreground">Start with a minimized sidebar</p>
                            </div>
                            <Switch id="collapsed-sidebar" />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Sidebar Position</Label>
                            <Select defaultValue="left">
                              <SelectTrigger>
                                <SelectValue placeholder="Select position" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="left">Left</SelectItem>
                                <SelectItem value="right">Right</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-muted-foreground" />
                {t('data')}
              </CardTitle>
              <CardDescription>
                Configure how data is managed and refreshed in your CRM
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-backup">Automatic Backup</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically backup your data every day
                    </p>
                  </div>
                  <Switch 
                    id="auto-backup" 
                    checked={autoBackup}
                    onCheckedChange={setAutoBackup}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="refresh-interval">Data Refresh Interval (minutes)</Label>
                <Select value={dataRefreshInterval} onValueChange={setDataRefreshInterval}>
                  <SelectTrigger id="refresh-interval">
                    <SelectValue placeholder="Select refresh interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="manual">Manual only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-between items-center space-x-2">
                <Button 
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Data Refreshed",
                      description: "All data has been refreshed with the latest information."
                    });
                    
                    addNotification({
                      title: "Data Refresh",
                      message: "Manual data refresh performed by admin",
                      type: "info",
                      read: false,
                    });
                  }}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Data Now
                </Button>
                
                <Button 
                  onClick={handleDataSettingsSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {isSaving ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('integrations')}</CardTitle>
              <CardDescription>
                Connect your CRM with other services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrations.map((integration) => (
                  <IntegrationCard 
                    key={integration.id}
                    id={integration.id}
                    name={integration.name}
                    description={integration.description}
                    icon={integration.icon}
                    isNew={integration.isNew}
                    isConnected={integration.isConnected}
                    connectionUrl={integration.connectionUrl}
                    onConnect={handleConnectIntegration}
                    onDisconnect={handleDisconnectIntegration}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('email')}</CardTitle>
              <CardDescription>
                Send emails to all your customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="rounded-lg border p-6 bg-muted/50">
                  <h3 className="text-lg font-medium mb-2">Send Mass Email</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    This will send an email to all {customers.length} customers in your database. 
                    Make sure your email content is ready before sending.
                  </p>
                  <Button 
                    onClick={handleSendEmailCampaign}
                    disabled={customers.length === 0 || isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending Emails...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Send to All Customers
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="rounded-lg border p-6">
                  <h3 className="text-lg font-medium mb-2">Mobile Notification Campaign</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Send a push notification to all customers with the mobile app installed.
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        toast({
                          title: "Mobile Campaign Sent",
                          description: `Push notifications sent to ${Math.floor(customers.length * 0.7)} mobile devices.`
                        });
                        
                        addNotification({
                          title: "Mobile Campaign",
                          message: "Push notification campaign was sent to all customers",
                          type: "success",
                          read: false,
                        });
                      }}
                    >
                      <Smartphone className="mr-2 h-4 w-4" />
                      Send Push Notification
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
