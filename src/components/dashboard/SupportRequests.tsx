
import { Card } from "@/components/ui/card";
import { useData } from "@/contexts/DataContext";

export const SupportRequests = () => {
  const { tickets } = useData();

  return (
    <div className="space-y-4">
      {tickets?.slice(0, 5).map((ticket) => (
        <div 
          key={ticket.id}
          className="flex items-center justify-between p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
        >
          <div className="flex flex-col">
            <span className="text-sm font-medium">{ticket.title}</span>
            <span className="text-xs text-muted-foreground">
              {ticket.customer}
            </span>
          </div>
          <span 
            className={`text-xs px-2 py-1 rounded-full ${
              ticket.status === 'high' 
                ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                : ticket.status === 'medium'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                : 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
            }`}
          >
            {ticket.status}
          </span>
        </div>
      ))}
      {(!tickets || tickets.length === 0) && (
        <div className="text-center text-muted-foreground">
          No support tickets
        </div>
      )}
    </div>
  );
};
