
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme } = useTheme();
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to check if screen is mobile size
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Set initial state
    checkScreenSize();
    
    // Add event listener
    window.addEventListener('resize', checkScreenSize);
    
    // Clean up
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Set dynamic title based on theme
  useEffect(() => {
    document.title = `${theme.companyName} - ${user?.name || 'Admin'}`;
  }, [theme.companyName, user?.name]);

  return (
    <div className="flex h-screen bg-background transition-colors duration-300">
      <Sidebar open={sidebarOpen} />
      
      <div 
        className="flex flex-col flex-1 w-full overflow-hidden transition-all duration-300" 
        style={{ 
          marginLeft: sidebarOpen && !isMobile ? '16rem' : '0',
          width: sidebarOpen && !isMobile ? 'calc(100% - 16rem)' : '100%'
        }}
      >
        <TopBar toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-orange-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
