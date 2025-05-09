
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Search, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

const recentOrders = [
  { 
    id: "#ORD-12345", 
    customer: "Alex Johnson", 
    product: "Apple iPhone 13 Pro", 
    date: "2023-09-28", 
    amount: "$1,099.00", 
    status: "delivered" 
  },
  { 
    id: "#ORD-12346", 
    customer: "Samantha Lee", 
    product: "Samsung Galaxy Watch 4", 
    date: "2023-09-27", 
    amount: "$299.00", 
    status: "processing" 
  },
  { 
    id: "#ORD-12347", 
    customer: "Chris Wong", 
    product: "Sony WH-1000XM4 Headphones", 
    date: "2023-09-26", 
    amount: "$349.00", 
    status: "delivered" 
  },
  { 
    id: "#ORD-12348", 
    customer: "Jamie Garcia", 
    product: "MacBook Air M2", 
    date: "2023-09-25", 
    amount: "$1,199.00", 
    status: "cancelled" 
  },
  { 
    id: "#ORD-12349", 
    customer: "Morgan Swift", 
    product: "iPad Pro 12.9\"", 
    date: "2023-09-25", 
    amount: "$1,099.00", 
    status: "processing" 
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "processing":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "cancelled":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "";
  }
};

export function RecentOrders() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [filteredOrders, setFilteredOrders] = useState(recentOrders);

  // Handle screen size detection
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter orders when search term or status filter changes
  useEffect(() => {
    let results = recentOrders;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(order => 
        order.id.toLowerCase().includes(term) ||
        order.customer.toLowerCase().includes(term) ||
        order.product.toLowerCase().includes(term)
      );
    }
    
    if (statusFilter) {
      results = results.filter(order => order.status === statusFilter);
    }
    
    setFilteredOrders(results);
  }, [searchTerm, statusFilter]);

  // Mobile view for orders
  const renderMobileOrder = (order: typeof recentOrders[0]) => (
    <div key={order.id} className="border rounded-md p-4 mb-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <span className="font-medium">{order.id}</span>
        <Badge 
          variant="outline" 
          className={getStatusColor(order.status)}
        >
          {order.status}
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-1 text-sm mb-2">
        <div>Customer:</div>
        <div className="font-medium">{order.customer}</div>
        
        <div>Product:</div>
        <div className="font-medium">{order.product}</div>
        
        <div>Date:</div>
        <div className="font-medium">{new Date(order.date).toLocaleDateString()}</div>
        
        <div>Amount:</div>
        <div className="font-medium">{order.amount}</div>
      </div>
      <div className="mt-2">
        <Button variant="ghost" size="sm" className="w-full">
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-2 mb-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search orders..."
            className="pl-8 w-full sm:w-[250px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            variant={statusFilter === null ? "secondary" : "outline"} 
            size="sm"
            onClick={() => setStatusFilter(null)}
          >
            All
          </Button>
          <Button 
            variant={statusFilter === "processing" ? "secondary" : "outline"} 
            size="sm"
            onClick={() => setStatusFilter("processing")}
            className="gap-1"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Processing
          </Button>
          <Button 
            variant={statusFilter === "delivered" ? "secondary" : "outline"} 
            size="sm"
            onClick={() => setStatusFilter("delivered")}
            className="gap-1"
          >
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Delivered
          </Button>
          <Button 
            variant={statusFilter === "cancelled" ? "secondary" : "outline"} 
            size="sm"
            onClick={() => setStatusFilter("cancelled")}
            className="gap-1"
          >
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            Cancelled
          </Button>
        </div>
      </div>
      
      {isDesktop ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.product}</TableCell>
                    <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                    <TableCell>{order.amount}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={getStatusColor(order.status)}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                    No orders found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div>
          {filteredOrders.length > 0 ? (
            filteredOrders.map(renderMobileOrder)
          ) : (
            <div className="text-center py-4 text-muted-foreground border rounded-md">
              No orders found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
