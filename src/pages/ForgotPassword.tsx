
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MailIcon, KeyIcon, ArrowLeftIcon, AlertCircleIcon } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { useNavigate, useLocation } from 'react-router-dom';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const { requestPasswordReset, resetPassword } = useAuth();

  // Check if we're on the reset page (after clicking email link)
  useState(() => {
    if (location.pathname === '/forgot-password/reset') {
      setStep('reset');
    }
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      return 'Email is required';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = (password: string, confirmPassword: string) => {
    if (!password.trim()) {
      return 'New password is required';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    return '';
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    const emailError = validateEmail(email);
    if (emailError) {
      setErrors({ email: emailError });
      toast({
        title: "Validation Error",
        description: emailError,
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});
    
    const success = await requestPasswordReset(email);
    
    if (success) {
      // In a real app, we would wait for the user to click the link in their email
      // For demo purposes, we'll just move to the reset step
      setTimeout(() => {
        setStep('reset');
        setIsSubmitting(false);
      }, 1500);
    } else {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password
    const passwordError = validatePassword(newPassword, confirmPassword);
    if (passwordError) {
      setErrors({ password: passwordError });
      toast({
        title: "Validation Error",
        description: passwordError,
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      const success = await resetPassword(newPassword);
      
      if (success) {
        toast({
          title: "Password reset successful",
          description: "You can now login with your new password",
        });
        
        // Redirect to login
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (error: any) {
      toast({
        title: "Password reset failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary to-primary/80 p-4">
      <Card className="w-full max-w-md overflow-hidden rounded-lg shadow-xl p-8">
        <div className="mb-6 flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/login')} 
            className="mr-2"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-medium text-foreground">
            {step === 'email' && 'Forgot Password'}
            {step === 'reset' && 'Reset Password'}
          </h2>
        </div>
        
        <div className="space-y-6">
          {step === 'email' ? (
            <form onSubmit={handleRequestReset} className="space-y-6">
              <div className="space-y-2">
                <div className="relative">
                  <MailIcon className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <Input
                    type="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({...errors, email: ''});
                    }}
                    required
                    className={`pl-10 bg-secondary border-secondary ${errors.email ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.email && (
                  <div className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircleIcon className="h-4 w-4" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <KeyIcon className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <Input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (errors.password) setErrors({...errors, password: ''});
                    }}
                    required
                    className={`pl-10 bg-secondary border-secondary ${errors.password ? 'border-destructive' : ''}`}
                  />
                </div>
                
                <div className="relative">
                  <KeyIcon className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.password) setErrors({...errors, password: ''});
                    }}
                    required
                    className={`pl-10 bg-secondary border-secondary ${errors.password ? 'border-destructive' : ''}`}
                  />
                </div>
                
                {errors.password && (
                  <div className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircleIcon className="h-4 w-4" />
                    <span>{errors.password}</span>
                  </div>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          )}
        </div>
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Remember your password? <a href="/login" className="text-primary hover:underline">Back to login</a></p>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPassword;
