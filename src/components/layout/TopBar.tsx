
import { useState } from "react";
import { Bell, Search, User, Menu, LogOut, Settings } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import NotificationPreview from "@/components/notifications/NotificationPreview";
import { useNotifications } from "@/contexts/NotificationContext";

interface TopBarProps {
  toggleSidebar: () => void;
}

const TopBar = ({ toggleSidebar }: TopBarProps) => {
  const { isDarkMode } = useTheme();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [notificationOpen, setNotificationOpen] = useState(false);
  
  const toggleNotifications = () => {
    setNotificationOpen(!notificationOpen);
  };

  const closeNotifications = () => {
    setNotificationOpen(false);
  };
  
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between p-4 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="text-primary hover:bg-primary/10"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="relative w-full max-w-md lg:max-w-lg">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search anything..."
            className="pl-10 bg-secondary/50 backdrop-blur-sm border-secondary font-medium focus:border-primary"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-primary hover:bg-primary/10"
            onClick={toggleNotifications}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 h-5 w-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-medium ring-2 ring-background">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>
          
          {notificationOpen && (
            <NotificationPreview open={notificationOpen} onClose={closeNotifications} />
          )}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-primary/10">
              <Avatar className="h-9 w-9 border border-primary/10">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-medium">
                  {user?.name?.charAt(0) || 'A'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 glass-card">
            <div className="flex items-center justify-start gap-3 p-3">
              <Avatar className="h-9 w-9 border border-primary/10">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-medium">
                  {user?.name?.charAt(0) || 'A'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">{user?.name || 'Admin User'}</p>
                <p className="text-sm text-muted-foreground">{user?.email || 'admin@example.com'}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer hover:bg-primary/10" asChild>
              <Link to="/account" className="flex w-full">
                <User className="mr-2 h-4 w-4" />
                <span>My Account</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-primary/10" asChild>
              <Link to="/settings" className="flex w-full">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="cursor-pointer hover:bg-primary/10">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopBar;
