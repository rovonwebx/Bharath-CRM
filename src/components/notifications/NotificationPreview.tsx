
import React from "react";
import { Link } from "react-router-dom";
import { X, BellOff, CheckCheck } from "lucide-react";
import { 
  useNotifications, 
  getNotificationIcon, 
  formatNotificationTime 
} from "@/contexts/NotificationContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface NotificationPreviewProps {
  open: boolean;
  onClose: () => void;
}

const NotificationPreview: React.FC<NotificationPreviewProps> = ({ open, onClose }) => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification, 
    clearAllNotifications 
  } = useNotifications();

  // Handle clicking on a notification
  const handleNotificationClick = (id: string) => {
    markAsRead(id);
  };

  if (!open) return null;

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-background rounded-lg shadow-lg border border-border z-50 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-semibold">Notifications</h3>
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2 text-xs" 
              onClick={markAllAsRead}
            >
              <CheckCheck className="h-3.5 w-3.5 mr-1" />
              Mark all as read
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
          <BellOff className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
          <p className="text-muted-foreground">No notifications</p>
          <p className="text-sm text-muted-foreground opacity-70 mt-1">
            You don't have any notifications yet
          </p>
        </div>
      ) : (
        <>
          <ScrollArea className="max-h-80">
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-accent/50 transition-colors ${
                    !notification.read 
                      ? "bg-primary/5" 
                      : ""
                  }`}
                >
                  <div 
                    className="cursor-pointer"
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        {notification.link ? (
                          <Link 
                            to={notification.link} 
                            className="block"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <h4 className="font-medium text-sm truncate">
                              {notification.title}
                            </h4>
                          </Link>
                        ) : (
                          <h4 className="font-medium text-sm truncate">
                            {notification.title}
                          </h4>
                        )}
                        
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center mt-2 justify-between">
                          <span className="text-xs text-muted-foreground">
                            {formatNotificationTime(notification.timestamp)}
                          </span>
                          
                          {!notification.read && (
                            <span className="inline-block w-2 h-2 bg-primary rounded-full"></span>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="p-3 border-t border-border">
            <div className="flex justify-between items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-8"
                onClick={clearAllNotifications}
              >
                Clear all
              </Button>
              
              <Link to="/notifications" className="text-xs text-primary hover:underline" onClick={onClose}>
                View all
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationPreview;
