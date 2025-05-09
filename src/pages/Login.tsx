
import { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { UserIcon, LockIcon, AlertCircleIcon, AlertTriangleIcon, InfoIcon } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

const Login = () => {
  // Simplified form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, t } = useTheme();
  
  // Get redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  // Effect to navigate to dashboard when authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      console.log("User is authenticated, navigating to", from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, from]);

  // Simplified login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (!password.trim()) {
      setError('Password is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await login(email, password);
      
      if (!success) {
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      setIsSubmitting(false);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Sample user credentials notification
  useEffect(() => {
    toast({
      title: "Demo Credentials",
      description: "Email: admin@example.com, Password: password123",
    });
  }, []);

  // If already authenticated, redirect to dashboard
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/90 to-primary/70 p-4">
      <div className="w-full max-w-md">
        {/* Warning Message Alert */}
        <Alert variant="destructive" className="mb-6 border-2 border-red-500 animate-fade-in">
          <AlertTriangleIcon className="h-5 w-5" />
          <AlertTitle className="font-bold">Database System Unavailable</AlertTitle>
          <AlertDescription>
            Excuse us, our database system is currently unavailable. Please use the sample credentials provided below to log in until we resolve the issue.
          </AlertDescription>
        </Alert>
        
        <Card className="w-full overflow-hidden rounded-lg shadow-xl backdrop-blur-sm bg-card/95 hover:shadow-2xl transition-all duration-300">
          <div className="p-6 text-center border-b border-border relative">
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-primary text-white p-4 rounded-full shadow-lg">
              <UserIcon className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold pt-8">{t('login')}</h2>
            <p className="text-muted-foreground mt-2">Access your dashboard</p>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md flex items-center gap-2 animate-pulse">
                  <AlertCircleIcon className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}
              
              <div className="space-y-3">
                <div className="relative">
                  <UserIcon className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <Input
                    type="email"
                    placeholder={t('email_address')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 border-2 focus:border-primary transition-colors"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="relative">
                  <LockIcon className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <Input
                    type="password"
                    placeholder={t('password')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12 border-2 focus:border-primary transition-colors"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe}
                    onCheckedChange={(checked) => {
                      if (typeof checked === 'boolean') {
                        setRememberMe(checked);
                      }
                    }}
                  />
                  <label htmlFor="remember" className="text-sm text-muted-foreground">{t('remember_me')}</label>
                </div>
                
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  {t('forgot_password')}
                </Link>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-medium transition-transform hover:scale-105"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : t('login')}
              </Button>
            </form>
            
            {/* Sample credentials box with info icon */}
            <div className="mt-6 p-5 bg-primary/5 border border-primary/20 rounded-md shadow-sm animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <InfoIcon className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Sample Login Credentials</h3>
              </div>
              <div className="text-sm space-y-1 text-left">
                <p><span className="font-medium">Email:</span> admin@example.com</p>
                <p><span className="font-medium">Password:</span> password123</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
