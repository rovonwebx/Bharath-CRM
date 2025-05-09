
import SalesOverview from "@/components/dashboard/SalesOverview";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { SupportRequests } from "@/components/dashboard/SupportRequests";
import { RecentCustomers } from "@/components/dashboard/RecentCustomers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/contexts/DataContext";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { generateSalesData } from "@/utils/generateSalesData";
import { BarChart, CreditCard, Package, Users, IndianRupee, TrendingUp, FileText, Calendar, Percent } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FestivalCalendar from "@/components/features/FestivalCalendar";
import GSTInvoice from "@/components/features/GSTInvoice";
import { useNotifications } from "@/contexts/NotificationContext";
import { useTheme } from "@/contexts/ThemeContext";

const Dashboard = () => {
  const { customers, products, orders } = useData();
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotifications();
  const { theme } = useTheme();

  // Calculate key metrics
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const lowStockProducts = products.filter(product => product.status === 'low-stock').length;
  const activeCustomers = customers.filter(customer => customer.status === 'active').length;

  // Calculate growth metrics (simulated data)
  const revenueGrowth = 12.5; // Percentage growth compared to last month
  const customerGrowth = 8.3;  // Percentage growth compared to last month
  const orderGrowth = 5.7;     // Percentage growth compared to last month

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setSalesData(generateSalesData());
      setLoading(false);
      
      // Add notification when dashboard loads
      addNotification({
        title: "Dashboard Updated",
        message: "Latest data has been loaded into the dashboard",
        type: "info",
        read: false,
      });
    }, 1000);
  }, [addNotification]);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight mb-2 md:mb-0">
          Dashboard
        </h2>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{new Date().toLocaleDateString('en-IN', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric',
            weekday: 'long'
          })}</span>
        </div>
      </div>

      {/* Performance Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <IndianRupee className="h-5 w-5 text-blue-600 mr-2" />
                    <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString('en-IN')}</div>
                  </div>
                  <Badge className={cn(
                    revenueGrowth >= 0 
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" 
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                  )}>
                    {revenueGrowth >= 0 ? "+" : ""}{revenueGrowth}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Compared to last month</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Customers</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-green-600 mr-2" />
                    <div className="text-2xl font-bold">{activeCustomers}</div>
                  </div>
                  <Badge className={cn(
                    customerGrowth >= 0 
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" 
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                  )}>
                    {customerGrowth >= 0 ? "+" : ""}{customerGrowth}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Compared to last month</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">New Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Package className="h-5 w-5 text-orange-600 mr-2" />
                    <div className="text-2xl font-bold">{pendingOrders}</div>
                  </div>
                  <Badge className={cn(
                    orderGrowth >= 0 
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" 
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                  )}>
                    {orderGrowth >= 0 ? "+" : ""}{orderGrowth}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Pending fulfillment</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock Products</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Percent className="h-5 w-5 text-red-600 mr-2" />
                    <div className="text-2xl font-bold">{lowStockProducts}</div>
                  </div>
                  <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                    Alert
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Needs reordering</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card className="shadow-md hover:shadow-lg transition-shadow overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-gray-800 dark:to-gray-700">
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 text-orange-600 mr-2" />
              <span>Sales Performance</span>
            </CardTitle>
            <CardDescription>Monthly sales performance analysis</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {loading ? (
              <Skeleton className="h-60" />
            ) : (
              <SalesOverview data={salesData} />
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-gray-800 dark:to-gray-700">
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 text-emerald-600 mr-2" />
              <span>Festival Calendar</span>
            </CardTitle>
            <CardDescription>Upcoming festivals and events</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <FestivalCalendar />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7 mb-8">
        <Card className="shadow-md hover:shadow-lg transition-shadow md:col-span-3">
          <CardHeader className="bg-gradient-to-r from-violet-50 to-violet-100 dark:from-gray-800 dark:to-gray-700">
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 text-violet-600 mr-2" />
              <span>Top Customers</span>
            </CardTitle>
            <CardDescription>Highest spending customers</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {loading ? (
              <Skeleton className="h-60" />
            ) : (
              <RecentCustomers />
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow md:col-span-4">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700">
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 text-blue-600 mr-2" />
              <span>Recent Orders</span>
            </CardTitle>
            <CardDescription>Latest customer orders</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {loading ? (
              <Skeleton className="h-60" />
            ) : (
              <RecentOrders />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700">
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 text-orange-600 mr-2" />
              <span>GST Invoice Generator</span>
            </CardTitle>
            <CardDescription>Create and manage GST compliant invoices</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <GSTInvoice />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 dark:from-gray-800 dark:to-gray-700">
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 text-red-600 mr-2" />
              <span>Support Requests</span>
            </CardTitle>
            <CardDescription>Open support tickets</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {loading ? (
              <Skeleton className="h-40" />
            ) : (
              <SupportRequests />
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow lg:col-span-2">
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-gray-800 dark:to-gray-700">
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 text-yellow-600 mr-2" />
              <span>Low Stock Products</span>
            </CardTitle>
            <CardDescription>Products with low stock levels that need attention</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {loading ? (
              <Skeleton className="h-40" />
            ) : (
              <div className="space-y-3">
                {products
                  .filter((product) => product.status === "low-stock")
                  .map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 rounded-md border border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-900/20"
                    >
                      <div className="flex items-center gap-3">
                        {product.imageUrl && (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">SKU: {product.sku || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                          )}
                        >
                          {product.stock} left
                        </Badge>
                        <Button size="sm" asChild>
                          <Link to={`/products/${product.id}`}>Update</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                {products.filter((product) => product.status === "low-stock")
                  .length === 0 && <div className="text-center py-6 text-muted-foreground">No low stock products</div>}
                <Button asChild variant="outline" className="w-full mt-4">
                  <Link to="/products">Manage All Products</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
