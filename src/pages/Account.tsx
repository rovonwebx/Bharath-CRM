
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "@/components/ui/avatar";
import { 
  User, 
  Mail, 
  Lock, 
  Shield, 
  Bell, 
  CreditCard, 
  LogOut, 
  Camera, 
  PlusCircle,
  Trash,
  Upload,
  X
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";

const Account = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: "",
    company: "",
    role: "Admin",
    phone: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    avatar: "",
    coverImage: ""
  });
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    marketing: false,
    updates: true,
    orderUpdates: true
  });
  
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(40);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showImageActions, setShowImageActions] = useState(false);
  
  // Calculate profile completion percentage
  useEffect(() => {
    let completed = 0;
    const totalFields = 10;
    
    if (profileData.name) completed++;
    if (profileData.email) completed++;
    if (profileData.bio) completed++;
    if (profileData.company) completed++;
    if (profileData.phone) completed++;
    if (profileData.address) completed++;
    if (profileData.city) completed++;
    if (profileData.country) completed++;
    if (profileData.postalCode) completed++;
    if (profileData.avatar || imagePreview) completed++;
    
    setProfileCompletion(Math.floor((completed / totalFields) * 100));
  }, [profileData, imagePreview]);
  
  // Handle profile update
  const handleProfileUpdate = () => {
    setIsLoading(true);
    
    // If there's an image preview, save it to the profile data
    if (imagePreview) {
      setProfileData(prev => ({
        ...prev,
        avatar: imagePreview
      }));
    }
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      });
    }, 1000);
  };
  
  // Handle password update
  const handlePasswordUpdate = () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Your new password and confirmation don't match.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSecurityData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully."
      });
    }, 1000);
  };
  
  // Handle notification settings update
  const handleNotificationsUpdate = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Notification settings updated",
        description: "Your notification preferences have been saved."
      });
    }, 1000);
  };
  
  // Handle profile field changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle security field changes
  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSecurityData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setShowImageActions(false);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  // Remove profile image
  const removeProfileImage = () => {
    setImagePreview(null);
    setProfileData(prev => ({
      ...prev,
      avatar: ""
    }));
    setShowImageActions(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  // Get avatar source
  const getAvatarSrc = () => {
    if (imagePreview) return imagePreview;
    if (profileData.avatar) return profileData.avatar;
    return "https://github.com/shadcn.png";
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        <Button variant="destructive" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile sidebar */}
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <Avatar 
                  className="h-24 w-24 border-4 border-background cursor-pointer transition-all duration-200 group-hover:opacity-80"
                  onMouseEnter={() => setShowImageActions(true)}
                  onMouseLeave={() => setShowImageActions(false)}
                  onClick={triggerFileInput}
                >
                  <AvatarImage src={getAvatarSrc()} />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                    {user?.name?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
                
                {showImageActions && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center space-x-2 bg-black/50 rounded-full h-24 w-24"
                    onMouseEnter={() => setShowImageActions(true)}
                    onMouseLeave={() => setShowImageActions(false)}
                  >
                    <Button 
                      size="icon" 
                      variant="secondary"
                      className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30"
                      onClick={triggerFileInput}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                    {(imagePreview || profileData.avatar) && (
                      <Button 
                        size="icon" 
                        variant="destructive"
                        className="h-8 w-8 rounded-full bg-white/20 hover:bg-red-500/80"
                        onClick={removeProfileImage}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                
                <Button 
                  size="icon" 
                  className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                  onClick={triggerFileInput}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold">{user?.name || "Admin User"}</h3>
                <p className="text-sm text-muted-foreground">{profileData.role}</p>
              </div>
              
              <div className="w-full mt-4">
                <div className="flex justify-between items-center text-sm mb-1">
                  <span>Profile completion</span>
                  <span>{profileCompletion}%</span>
                </div>
                <Progress
                  value={profileCompletion}
                  className="h-2"
                  indicatorClassName={`${
                    profileCompletion < 40 ? "bg-destructive" :
                    profileCompletion < 70 ? "bg-orange-500" :
                    "bg-green-500"
                  }`}
                />
              </div>
              
              <div className="w-full space-y-1 pt-4">
                <p className="text-sm font-medium">Account created on</p>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Main settings tabs */}
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <Tabs defaultValue="profile">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
              </TabsList>
              
              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Basic Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={profileData.name} 
                        onChange={handleProfileChange}
                        placeholder="Your name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={profileData.email} 
                        onChange={handleProfileChange}
                        placeholder="your.email@example.com"
                        disabled
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input 
                        id="company" 
                        name="company" 
                        value={profileData.company} 
                        onChange={handleProfileChange}
                        placeholder="Your company name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <RadioGroup 
                        defaultValue={profileData.role}
                        onValueChange={(value) => 
                          setProfileData(prev => ({ ...prev, role: value }))
                        }
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Admin" id="admin" />
                          <Label htmlFor="admin">Admin</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Manager" id="manager" />
                          <Label htmlFor="manager">Manager</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="User" id="user" />
                          <Label htmlFor="user">User</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio" 
                        name="bio" 
                        value={profileData.bio} 
                        onChange={handleProfileChange}
                        placeholder="Write a short bio about yourself"
                        rows={4}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Contact Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        value={profileData.phone} 
                        onChange={handleProfileChange}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input 
                        id="address" 
                        name="address" 
                        value={profileData.address} 
                        onChange={handleProfileChange}
                        placeholder="123 Street Name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input 
                        id="city" 
                        name="city" 
                        value={profileData.city} 
                        onChange={handleProfileChange}
                        placeholder="City"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input 
                        id="country" 
                        name="country" 
                        value={profileData.country} 
                        onChange={handleProfileChange}
                        placeholder="Country"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input 
                        id="postalCode" 
                        name="postalCode" 
                        value={profileData.postalCode} 
                        onChange={handleProfileChange}
                        placeholder="Postal Code"
                      />
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full sm:w-auto" 
                  onClick={handleProfileUpdate}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Profile"}
                </Button>
              </TabsContent>
              
              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Change Password</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input 
                        id="currentPassword" 
                        name="currentPassword"
                        type="password" 
                        value={securityData.currentPassword}
                        onChange={handleSecurityChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input 
                        id="newPassword" 
                        name="newPassword"
                        type="password" 
                        value={securityData.newPassword}
                        onChange={handleSecurityChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input 
                        id="confirmPassword" 
                        name="confirmPassword"
                        type="password" 
                        value={securityData.confirmPassword}
                        onChange={handleSecurityChange}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handlePasswordUpdate}
                    disabled={isLoading}
                  >
                    {isLoading ? "Updating..." : "Update Password"}
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account by enabling two-factor authentication.
                  </p>
                  <Button variant="outline">
                    <Shield className="mr-2 h-4 w-4" />
                    Enable 2FA
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Sessions</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage your active sessions across devices.
                  </p>
                  <div className="rounded-md border p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Current session</p>
                        <p className="text-sm text-muted-foreground">
                          Last active: {new Date().toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        <span className="text-sm">Active now</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="text-destructive">
                    Sign out of all devices
                  </Button>
                </div>
              </TabsContent>
              
              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Email Notifications</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="emailNotifs">Order notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive emails about your orders
                        </p>
                      </div>
                      <Checkbox 
                        id="emailNotifs"
                        checked={notifications.email}
                        onCheckedChange={(checked) => 
                          setNotifications({...notifications, email: checked as boolean})
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="updateNotifs">Product updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive emails about product updates
                        </p>
                      </div>
                      <Checkbox 
                        id="updateNotifs"
                        checked={notifications.updates}
                        onCheckedChange={(checked) => 
                          setNotifications({...notifications, updates: checked as boolean})
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="marketingNotifs">Marketing emails</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive marketing emails and promotions
                        </p>
                      </div>
                      <Checkbox 
                        id="marketingNotifs"
                        checked={notifications.marketing}
                        onCheckedChange={(checked) => 
                          setNotifications({...notifications, marketing: checked as boolean})
                        }
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Push Notifications</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="pushNotifs">Enable push notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow push notifications on this device
                        </p>
                      </div>
                      <Checkbox 
                        id="pushNotifs"
                        checked={notifications.push}
                        onCheckedChange={(checked) => 
                          setNotifications({...notifications, push: checked as boolean})
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="orderUpdates">Order updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive updates about your orders
                        </p>
                      </div>
                      <Checkbox 
                        id="orderUpdates"
                        checked={notifications.orderUpdates}
                        onCheckedChange={(checked) => 
                          setNotifications({...notifications, orderUpdates: checked as boolean})
                        }
                      />
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleNotificationsUpdate}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Preferences"}
                </Button>
              </TabsContent>
              
              {/* Billing Tab */}
              <TabsContent value="billing" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Payment Methods</h3>
                  
                  <div className="rounded-md border p-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md flex items-center justify-center text-white">
                        <CreditCard className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-medium">Visa ending in 4242</p>
                        <p className="text-sm text-muted-foreground">
                          Expires 10/2025
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Remove</Button>
                  </div>
                  
                  <Button variant="outline">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add payment method
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Billing Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="billingName">Name</Label>
                      <Input 
                        id="billingName" 
                        defaultValue={profileData.name}
                        placeholder="Name on card"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="billingEmail">Email</Label>
                      <Input 
                        id="billingEmail" 
                        defaultValue={profileData.email}
                        placeholder="Billing email address"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="billingAddress">Address</Label>
                      <Input 
                        id="billingAddress" 
                        defaultValue={profileData.address}
                        placeholder="Billing address"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="billingCity">City</Label>
                      <Input 
                        id="billingCity" 
                        defaultValue={profileData.city}
                        placeholder="City"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="billingCountry">Country</Label>
                      <Input 
                        id="billingCountry" 
                        defaultValue={profileData.country}
                        placeholder="Country"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="billingPostal">Postal Code</Label>
                      <Input 
                        id="billingPostal" 
                        defaultValue={profileData.postalCode}
                        placeholder="Postal Code"
                      />
                    </div>
                  </div>
                  
                  <Button>Update Billing Information</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Account;
