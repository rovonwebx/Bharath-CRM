
import React, { useState } from "react";
import { useNotifications, getNotificationIcon, formatNotificationTime } from "@/contexts/NotificationContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { CheckCheck, Trash2, BellOff } from "lucide-react";

const Notifications = () => {
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    removeNotification, 
    clearAllNotifications 
  } = useNotifications();
  const [activeTab, setActiveTab] = useState<string>("all");
  
  // Filter notifications based on the active tab
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.read;
    return true;
  });
  
  // Count of unread notifications
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">
          View and manage your notifications
        </p>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>All Notifications</CardTitle>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={markAllAsRead}
                  className="h-8"
                >
                  <CheckCheck className="mr-2 h-4 w-4" />
                  Mark all as read
                </Button>
              )}
              {notifications.length > 0 && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={clearAllNotifications}
                  className="h-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear all
                </Button>
              )}
            </div>
          </div>
          <CardDescription>
            You have {notifications.length} notifications {unreadCount > 0 && `(${unreadCount} unread)`}
          </CardDescription>
          
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
            className="mt-4"
          >
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">
                Unread 
                {unreadCount > 0 && (
                  <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs">
                    {unreadCount}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent>
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <BellOff className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
              <p className="text-muted-foreground">No notifications found</p>
              <p className="text-sm text-muted-foreground opacity-70 mt-1">
                {activeTab === "all" 
                  ? "You don't have any notifications yet" 
                  : "You don't have any unread notifications"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`py-4 ${!notification.read ? "bg-primary/5" : ""}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      {notification.link ? (
                        <Link 
                          to={notification.link} 
                          className="font-medium hover:underline"
                          onClick={() => markAsRead(notification.id)}
                        >
                          {notification.title}
                        </Link>
                      ) : (
                        <h4 className="font-medium">
                          {notification.title}
                        </h4>
                      )}
                      
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center mt-2 gap-4">
                        <span className="text-xs text-muted-foreground">
                          {formatNotificationTime(notification.timestamp)}
                        </span>
                        
                        {!notification.read ? (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 px-2 text-xs"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Mark as read
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">Read</span>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                          onClick={() => removeNotification(notification.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;
