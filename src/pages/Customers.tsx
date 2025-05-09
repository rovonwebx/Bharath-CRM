import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
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
  Plus, 
  Search,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { exportCustomers } from "@/utils/exportUtils";

const Customers = () => {
  const { id } = useParams();
  const { customers, deleteCustomer } = useData();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter customers based on search query
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (customer.location && customer.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDeleteCustomer = (id: string) => {
    deleteCustomer(id);
    toast({
      title: "Customer deleted",
      description: "The customer has been deleted successfully.",
    });
  };
  
  const handleExport = () => {
    exportCustomers(filteredCustomers);
  };

  // Show customer details if ID is provided
  if (id) {
    const customer = customers.find(c => c.id === id);
    
    if (!customer) {
      return <div>Customer not found</div>;
    }
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Customer Details</h2>
          <Button variant="outline" asChild>
            <Link to="/customers">Back to Customers</Link>
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-4">{customer.name}</h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-500">Email:</span> {customer.email}
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Phone:</span> {customer.phone}
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Location:</span> {customer.location}
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Status:</span>{" "}
                    <Badge className={customer.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {customer.status}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-4">Order History</h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-500">Total Orders:</span> {customer.orders}
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Total Spent:</span> {customer.spent}
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Last Order:</span> {customer.lastOrder && new Date(customer.lastOrder).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button asChild>
                <Link to={`/customers/edit/${customer.id}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Customer
                </Link>
              </Button>
              <Button 
                variant="destructive"
                onClick={() => {
                  handleDeleteCustomer(customer.id);
                  // Navigate back to customers list after deletion
                  window.location.href = "/customers";
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Customer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
        <Button asChild>
          <Link to="/customers/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Customer Management</CardTitle>
          <CardDescription>
            View and manage your customer database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search customers..."
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
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Spent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.location}</TableCell>
                    <TableCell>{customer.orders}</TableCell>
                    <TableCell>{customer.spent}</TableCell>
                    <TableCell>
                      <Badge className={customer.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/customers/view/${customer.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/customers/edit/${customer.id}`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteCustomer(customer.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
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

export default Customers;
