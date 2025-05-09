
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";

// Sample sales data
const salesData = [
  { name: "Jan", total: 1800 },
  { name: "Feb", total: 2800 },
  { name: "Mar", total: 2200 },
  { name: "Apr", total: 3800 },
  { name: "May", total: 4300 },
  { name: "Jun", total: 5200 },
  { name: "Jul", total: 4800 },
  { name: "Aug", total: 5800 },
  { name: "Sep", total: 6800 },
  { name: "Oct", total: 7800 },
  { name: "Nov", total: 8300 },
  { name: "Dec", total: 9800 },
];

// Sample category sales data
const categorySales = [
  { name: "Electronics", value: 45 },
  { name: "Furniture", value: 20 },
  { name: "Kitchen", value: 15 },
  { name: "Home Goods", value: 10 },
  { name: "Wearables", value: 10 },
];

// Sample products data
const topProducts = [
  { name: "Bluetooth Headphones", sales: 1200 },
  { name: "Office Chair", sales: 980 },
  { name: "Water Bottle", sales: 850 },
  { name: "Security Camera", sales: 730 },
  { name: "Throw Blanket", sales: 650 },
];

// Sample customer acquisition data
const customerAcquisition = [
  { name: "Direct", value: 30 },
  { name: "Social Media", value: 25 },
  { name: "Search", value: 20 },
  { name: "Email", value: 15 },
  { name: "Referral", value: 10 },
];

const COLORS = ["#0c91e6", "#36acf7", "#7bc7fc", "#bae0fd", "#e0effe"];

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <Tabs defaultValue="30days" className="space-y-4">
          <TabsList>
            <TabsTrigger value="7days">7 days</TabsTrigger>
            <TabsTrigger value="30days">30 days</TabsTrigger>
            <TabsTrigger value="90days">90 days</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$52,300.25</div>
            <p className="text-xs text-muted-foreground mt-1">
              +18% from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,345</div>
            <p className="text-xs text-muted-foreground mt-1">
              +12% from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <p className="text-xs text-muted-foreground mt-1">
              +0.5% from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Order Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$89.45</div>
            <p className="text-xs text-muted-foreground mt-1">
              +5% from previous period
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Sales Over Time</CardTitle>
            <CardDescription>
              Monthly sales performance for the current year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={salesData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#0c91e6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>
              Revenue distribution across product categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categorySales}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categorySales.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>
              Best selling products by unit sales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topProducts}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#0c91e6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Customer Acquisition</CardTitle>
            <CardDescription>
              How customers find your store
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={customerAcquisition}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {customerAcquisition.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
