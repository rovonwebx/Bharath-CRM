
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

const AuthGuard = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [checkComplete, setCheckComplete] = useState(false);

  useEffect(() => {
    // Simple check for auth status
    if (!isLoading) {
      setCheckComplete(true);
    }
  }, [isLoading]);

  console.log("AuthGuard: isAuthenticated =", isAuthenticated, "isLoading =", isLoading);

  // Show simple loading state
  if (isLoading && !checkComplete) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <div className="text-primary">Loading...</div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login from", location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render children through the Outlet if authenticated
  return <Outlet />;
};

export default AuthGuard;
