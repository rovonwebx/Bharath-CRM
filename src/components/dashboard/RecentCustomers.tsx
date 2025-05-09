
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/contexts/DataContext";

export function RecentCustomers() {
  const { customers } = useData();
  
  // Get the top 5 customers by amount spent
  const topCustomers = [...customers]
    .sort((a, b) => {
      const aSpent = parseFloat(a.spent.replace(/[^0-9.-]+/g, ""));
      const bSpent = parseFloat(b.spent.replace(/[^0-9.-]+/g, ""));
      return bSpent - aSpent;
    })
    .slice(0, 5);

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }

  return (
    <div className="space-y-4">
      {topCustomers.map((customer) => (
        <div key={customer.id} className="flex items-center justify-between flex-wrap gap-2 group p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={customer.avatar} />
              <AvatarFallback className="bg-brand-100 text-brand-700">
                {getInitials(customer.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">{customer.name}</p>
              <p className="text-sm text-gray-500 mt-1">{customer.email}</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <p className="text-sm font-medium">{customer.spent}</p>
            <Badge 
              variant={customer.status === "active" ? "default" : "outline"}
              className={
                customer.status === "active" 
                  ? "bg-green-100 text-green-800 hover:bg-green-100 mt-1" 
                  : "text-gray-500 mt-1"
              }
            >
              {customer.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
