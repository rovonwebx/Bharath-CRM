
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  BarChart, 
  Settings,
  Mail,
  MessageSquare,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface SidebarProps {
  open: boolean;
}

const Sidebar = ({ open }: SidebarProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Users, label: "Customers", path: "/customers" },
    { icon: Package, label: "Products", path: "/products" },
    { icon: ShoppingCart, label: "Orders", path: "/orders" },
    { icon: BarChart, label: "Analytics", path: "/analytics" },
    { icon: Mail, label: "Email Campaigns", path: "/email-campaigns" },
    { icon: MessageSquare, label: "Support", path: "/support" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-sidebar dark:bg-sidebar border-r border-sidebar-border/30 backdrop-blur-sm",
        open ? "w-64" : "w-0 md:w-20"
      )}
      style={{ width: open ? '16rem' : '0', minWidth: open ? '16rem' : '0' }}
    >
      <div className={cn("h-full px-4 py-6 overflow-y-auto flex flex-col", !open && "md:items-center")}>
        <div className={cn(
          "flex items-center mb-8", 
          open ? "justify-start pl-2" : "justify-center",
          !open && "md:block hidden"
        )}>
          {open ? (
            <h1 className="text-xl font-bold text-white">
              <span className="gradient-text">EcomCRM</span>
            </h1>
          ) : (
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center glow-effect">
              <span className="text-white font-bold text-lg">E</span>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index} className={cn(!open && "md:flex md:justify-center")}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center p-3 text-sidebar-foreground rounded-xl hover:bg-sidebar-accent transition-all duration-200 group",
                    isActive(item.path) && "bg-sidebar-accent text-sidebar-primary",
                    !open && "md:justify-center"
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5 transition duration-200", 
                    isActive(item.path) ? "text-sidebar-primary" : "text-sidebar-foreground/70 group-hover:text-sidebar-foreground"
                  )} />
                  {open && (
                    <span className="ms-3 font-medium">{item.label}</span>
                  )}
                  {isActive(item.path) && (
                    <div className="absolute inset-y-0 left-0 w-1 bg-sidebar-primary rounded-r-full" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
