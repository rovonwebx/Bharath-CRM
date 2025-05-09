
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Filter, 
  MoreHorizontal, 
  Search, 
  Eye, 
  Edit, 
  Trash2 
} from "lucide-react";
import { exportOrders } from "@/utils/exportUtils";

// Mock orders data
const orders = [
  { 
    id: "#ORD-12345", 
    customer: "Alex Johnson", 
    date: "2023-09-28", 
    total: "$1,099.00", 
    items: 3,
    payment: "Credit Card",
    status: "delivered" 
  },
  { 
    id: "#ORD-12346", 
    customer: "Samantha Lee", 
    date: "2023-09-27", 
    total: "$299.00", 
    items: 1,
    payment: "PayPal",
    status: "processing" 
  },
  { 
    id: "#ORD-12347", 
    customer: "Chris Wong", 
    date: "2023-09-26", 
    total: "$349.00", 
    items: 1,
    payment: "Credit Card",
    status: "delivered" 
  },
  { 
    id: "#ORD-12348", 
    customer: "Jamie Garcia", 
    date: "2023-09-25", 
    total: "$1,199.00", 
    items: 2,
    payment: "Bank Transfer",
    status: "cancelled" 
  },
  { 
    id: "#ORD-12349", 
    customer: "Morgan Swift", 
    date: "2023-09-25", 
    total: "$1,099.00", 
    items: 4,
    payment: "Credit Card",
    status: "processing" 
  },
  { 
    id: "#ORD-12350", 
    customer: "Taylor Rodriguez", 
    date: "2023-09-24", 
    total: "$89.00", 
    items: 1,
    payment: "PayPal",
    status: "shipped" 
  },
  { 
    id: "#ORD-12351", 
    customer: "Jordan Kim", 
    date: "2023-09-23", 
    total: "$245.00", 
    items: 2,
    payment: "Credit Card",
    status: "delivered" 
  },
];

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Delivered</Badge>;
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Processing</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>;
      case "shipped":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Shipped</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const handleExport = () => {
    exportOrders(filteredOrders);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Order Management</CardTitle>
          <CardDescription>
            Track, process, and manage customer orders.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search orders..."
                className="pl-8 w-full md:w-80"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" className="h-8">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8"
                onClick={handleExport}
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                    <TableCell>{order.items}</TableCell>
                    <TableCell>{order.total}</TableCell>
                    <TableCell>{order.payment}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Update Status
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Cancel Order
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;
