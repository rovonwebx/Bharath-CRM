
import React, { createContext, useContext, useState, useEffect } from "react";
import { Bell, Mail, ShoppingBag, AlertCircle, Check, Smartphone, Settings, User, IndianRupee } from "lucide-react";

// Define notification types
export type NotificationType = "info" | "success" | "warning" | "error" | "message" | "order" | "payment" | "user" | "setting";

// Define the notification interface
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  timestamp: Date;
  link?: string;
}

// Define the context interface
interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (notification: Omit<Notification, "id" | "timestamp">) => void;
}

// Create the context with default values
const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  markAsRead: () => {},
  markAllAsRead: () => {},
  removeNotification: () => {},
  clearAllNotifications: () => {},
  addNotification: () => {},
});

// Sample notifications data for demonstration
const sampleNotifications: Notification[] = [
  {
    id: "1",
    title: "New Message",
    message: "You have received a new message from John Doe",
    type: "message",
    read: false,
    timestamp: new Date(Date.now() - 10 * 60000), // 10 minutes ago
    link: "/messages",
  },
  {
    id: "2",
    title: "Order Completed",
    message: "Order #12345 has been successfully processed",
    type: "success",
    read: false,
    timestamp: new Date(Date.now() - 30 * 60000), // 30 minutes ago
    link: "/orders/12345",
  },
  {
    id: "3",
    title: "Payment Failed",
    message: "Your payment for order #67890 could not be processed",
    type: "error",
    read: true,
    timestamp: new Date(Date.now() - 2 * 3600000), // 2 hours ago
    link: "/payments",
  },
  {
    id: "4",
    title: "New Order",
    message: "You have received a new order #54321",
    type: "order",
    read: true,
    timestamp: new Date(Date.now() - 1 * 86400000), // 1 day ago
    link: "/orders/54321",
  },
  {
    id: "5",
    title: "System Update",
    message: "System will undergo maintenance tonight at 2 AM",
    type: "info",
    read: false,
    timestamp: new Date(Date.now() - 3 * 86400000), // 3 days ago
  },
  {
    id: "6",
    title: "Currency Updated",
    message: "All prices now display in Indian Rupees (₹)",
    type: "setting",
    read: false,
    timestamp: new Date(Date.now() - 5 * 60000), // 5 minutes ago
    link: "/settings",
  },
  {
    id: "7",
    title: "New Customer Registered",
    message: "Raj Patel has registered as a new customer",
    type: "user",
    read: false,
    timestamp: new Date(Date.now() - 15 * 60000), // 15 minutes ago
    link: "/customers",
  },
  {
    id: "8",
    title: "Payment Received",
    message: "₹15,000 payment received from Sharma Enterprises",
    type: "payment",
    read: false,
    timestamp: new Date(Date.now() - 45 * 60000), // 45 minutes ago
    link: "/orders",
  },
];

// Icon mapping for notification types
export const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "message":
      return <Mail className="h-4 w-4 text-blue-500" />;
    case "success":
      return <Check className="h-4 w-4 text-green-500" />;
    case "warning":
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    case "error":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case "order":
      return <ShoppingBag className="h-4 w-4 text-purple-500" />;
    case "payment":
      return <IndianRupee className="h-4 w-4 text-emerald-500" />;
    case "user":
      return <User className="h-4 w-4 text-amber-500" />;
    case "setting":
      return <Settings className="h-4 w-4 text-slate-500" />;
    case "info":
    default:
      return <Bell className="h-4 w-4 text-blue-400" />;
  }
};

// Helper function to format the timestamp
export const formatNotificationTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return "Just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return days === 1 ? "Yesterday" : `${days} days ago`;
  }
};

// Provider component
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  
  // Calculate unread count whenever notifications change
  useEffect(() => {
    setUnreadCount(notifications.filter(notification => !notification.read).length);
  }, [notifications]);

  // Simulated real-time notifications (for demo)
  useEffect(() => {
    const simulateRealTimeNotifications = () => {
      const types: NotificationType[] = ["info", "success", "order", "payment"];
      const type = types[Math.floor(Math.random() * types.length)];
      
      const titles = {
        info: "System Update",
        success: "Process Completed",
        order: "New Order Placed",
        payment: "Payment Received",
      };
      
      const messages = {
        info: [
          "Database backup completed successfully",
          "System health check passed all tests",
          "New feature available: Advanced reporting",
        ],
        success: [
          "Invoice #12389 has been generated",
          "Customer data successfully imported",
          "Product inventory updated successfully",
        ],
        order: [
          "New order #67234 from Patel Electronics",
          "Order #98127 has been shipped",
          "Order #45231 requires approval",
        ],
        payment: [
          "₹12,500 received from Mehta Traders",
          "₹8,750 payment verified from Singh Exports",
          "₹32,000 payment processed for Kumar Enterprises",
        ],
      };
      
      const randomMessage = messages[type][Math.floor(Math.random() * messages[type].length)];
      
      addNotification({
        title: titles[type],
        message: randomMessage,
        type,
        read: false,
      });
    };
    
    // Simulate real-time notifications randomly between 30-60 seconds
    const interval = setInterval(() => {
      if (Math.random() > 0.5) { // 50% chance to trigger a notification
        simulateRealTimeNotifications();
      }
    }, 30000 + Math.random() * 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };
  
  // Remove a notification
  const removeNotification = (id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.filter(notification => notification.id !== id)
    );
  };
  
  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };
  
  // Add a new notification
  const addNotification = (notification: Omit<Notification, "id" | "timestamp">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    
    setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
  };
  
  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    addNotification,
  };
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  
  return context;
};
