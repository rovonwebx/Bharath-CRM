
import React, { createContext, useContext, useState } from 'react';
import { toast } from "@/components/ui/use-toast";

// Define a simple user type
type SimpleUser = {
  name: string;
  email: string;
  role: string;
};

// Define simplified context type
type AuthContextType = {
  user: SimpleUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<boolean>;
  resetPassword: (newPassword: string) => Promise<boolean>;
};

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample user data
const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
  },
  {
    name: 'Test User',
    email: 'user@example.com',
    password: 'password123',
    role: 'user',
  }
];

// Create provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SimpleUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Simplified login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const foundUser = sampleUsers.find(
        u => u.email === email && u.password === password
      );
      
      if (foundUser) {
        // Create simplified user object (without password)
        const loggedInUser = {
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role,
        };
        
        setUser(loggedInUser);
        
        toast({ 
          title: "Login successful", 
          description: `Welcome back, ${loggedInUser.name}!` 
        });
        
        return true;
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Simplified logout function
  const logout = () => {
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  // Password reset request function
  const requestPasswordReset = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userExists = sampleUsers.some(user => user.email === email);
      
      if (userExists) {
        toast({
          title: "Password reset requested",
          description: `If an account exists with ${email}, we've sent a reset link.`,
        });
        return true;
      } else {
        // Still show success to prevent email enumeration
        toast({
          title: "Password reset requested",
          description: `If an account exists with ${email}, we've sent a reset link.`,
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Request failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Password reset function
  const resetPassword = async (newPassword: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real application, this would update the user's password in the database
      toast({
        title: "Password reset successful",
        description: "You can now login with your new password",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Reset failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading,
        login, 
        logout,
        requestPasswordReset,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
