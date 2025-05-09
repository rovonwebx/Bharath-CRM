
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useNotifications } from "@/contexts/NotificationContext";
import { Loader2 } from "lucide-react";

export interface IntegrationProps {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  isNew?: boolean;
  isConnected?: boolean;
  connectionUrl: string;
  onConnect: (id: string) => Promise<boolean>;
  onDisconnect: (id: string) => Promise<boolean>;
}

const IntegrationCard: React.FC<IntegrationProps> = ({
  id,
  name,
  description,
  icon,
  isNew = false,
  isConnected = false,
  connectionUrl,
  onConnect,
  onDisconnect,
}) => {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(isConnected);
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  const handleConnect = async () => {
    try {
      setConnecting(true);

      // Simulate API call to connect to the service
      const success = await onConnect(id);

      if (success) {
        setConnected(true);
        toast({
          title: `${name} Connected`,
          description: `Your ${name} account has been connected successfully.`,
        });

        addNotification({
          title: "Integration Added",
          message: `${name} has been connected to the CRM`,
          type: "success",
          read: false,
        });
      } else {
        toast({
          title: "Connection Failed",
          description: `Failed to connect to ${name}. Please try again.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: `An error occurred while connecting to ${name}.`,
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setConnecting(true);

      // Simulate API call to disconnect from the service
      const success = await onDisconnect(id);

      if (success) {
        setConnected(false);
        toast({
          title: `${name} Disconnected`,
          description: `Your ${name} account has been disconnected.`,
        });

        addNotification({
          title: "Integration Removed",
          message: `${name} has been disconnected from the CRM`,
          type: "info",
          read: false,
        });
      } else {
        toast({
          title: "Disconnection Failed",
          description: `Failed to disconnect from ${name}. Please try again.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Disconnection Error",
        description: `An error occurred while disconnecting from ${name}.`,
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  };

  const getBgClass = () => {
    if (isNew) return "bg-green-50 dark:bg-green-900/20";
    if (connected) return "bg-blue-50 dark:bg-blue-900/20";
    return "";
  };

  return (
    <div className={`rounded-lg border p-4 transition-colors ${getBgClass()}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium flex items-center gap-2">
            {icon}
            {name}
            {isNew && (
              <Badge
                variant="outline"
                className="ml-2 bg-green-100 text-green-800 border-green-300"
              >
                New
              </Badge>
            )}
            {connected && (
              <Badge
                variant="outline"
                className="ml-2 bg-blue-100 text-blue-800 border-blue-300"
              >
                Connected
              </Badge>
            )}
          </h3>
          <p className="text-sm text-gray-500">{description}</p>
          {connected && (
            <p className="text-xs text-muted-foreground mt-1">
              Connected on {new Date().toLocaleDateString()}
            </p>
          )}
        </div>
        <Button
          variant={connected ? "outline" : "default"}
          onClick={connected ? handleDisconnect : handleConnect}
          disabled={connecting}
        >
          {connecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {connected ? "Disconnecting..." : "Connecting..."}
            </>
          ) : (
            <>{connected ? "Disconnect" : "Connect"}</>
          )}
        </Button>
      </div>
    </div>
  );
};

export default IntegrationCard;
