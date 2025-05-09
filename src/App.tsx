
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { DataProvider } from '@/contexts/DataContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthGuard from '@/components/auth/AuthGuard';
import Login from '@/pages/Login';
import ForgotPassword from '@/pages/ForgotPassword';
import Dashboard from '@/pages/Dashboard';
import Customers from '@/pages/Customers';
import CustomerForm from '@/pages/CustomerForm';
import Products from '@/pages/Products';
import ProductForm from '@/pages/ProductForm';
import Orders from '@/pages/Orders';
import Analytics from '@/pages/Analytics';
import EmailCampaigns from '@/pages/EmailCampaigns';
import Settings from '@/pages/Settings';
import Account from '@/pages/Account';
import NotFound from '@/pages/NotFound';
import MainLayout from '@/components/layout/MainLayout';
import { NotificationProvider } from './contexts/NotificationContext';
import Notifications from './pages/Notifications';

import './App.css';

// Create query client with performance-optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
    },
  },
});

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <DataProvider>
            <AuthProvider>
              <NotificationProvider>
                <div className="app">
                  <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/forgot-password/reset" element={<ForgotPassword />} />
                    
                    {/* Protected routes */}
                    <Route element={<AuthGuard />}>
                      <Route element={<MainLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/products/new" element={<ProductForm />} />
                        <Route path="/products/:id" element={<ProductForm />} />
                        <Route path="/customers" element={<Customers />} />
                        <Route path="/customers/new" element={<CustomerForm />} />
                        <Route path="/customers/:id" element={<CustomerForm />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/email-campaigns" element={<EmailCampaigns />} />
                        <Route path="/account" element={<Account />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/notifications" element={<Notifications />} />
                        
                        {/* Index route redirects to dashboard */}
                        <Route index element={<Dashboard />} />
                      </Route>
                    </Route>
                    
                    {/* Redirect root to dashboard */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    
                    {/* Catch all route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <Toaster />
                </div>
              </NotificationProvider>
            </AuthProvider>
          </DataProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
