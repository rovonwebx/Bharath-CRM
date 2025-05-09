
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart, Legend } from "recharts";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BarChart3, LineChart } from "lucide-react";

const monthlyData = [
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

// Compare current year with previous year
const comparisonData = monthlyData.map(item => ({
  name: item.name,
  current: item.total,
  previous: item.total * (0.7 + Math.random() * 0.5) // Random previous year data for comparison
}));

export function SalesChart() {
  const [chartType, setChartType] = useState<"area" | "bar">("area");
  const [showComparison, setShowComparison] = useState<boolean>(false);
  
  const data = showComparison ? comparisonData : monthlyData;

  return (
    <div className="w-full">
      <div className="flex justify-end items-center gap-2 mb-4">
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="sm" 
            className={`rounded-r-none ${!showComparison ? 'bg-gray-100' : ''}`}
            onClick={() => setShowComparison(false)}
          >
            Current
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className={`rounded-l-none ${showComparison ? 'bg-gray-100' : ''}`}
            onClick={() => setShowComparison(true)}
          >
            Compare
          </Button>
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => setChartType("area")}
          className={chartType === "area" ? "bg-gray-100" : ""}
        >
          <LineChart className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setChartType("bar")}
          className={chartType === "bar" ? "bg-gray-100" : ""}
        >
          <BarChart3 className="h-4 w-4" />
        </Button>
      </div>
    
      <ResponsiveContainer width="100%" height={350}>
        {chartType === "area" ? (
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0c91e6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#0c91e6" stopOpacity={0} />
              </linearGradient>
              {showComparison && (
                <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              )}
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
            <XAxis 
              dataKey="name" 
              tickLine={false}
              axisLine={false}
              className="text-xs"
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              className="text-xs"
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Month
                          </span>
                          <span className="font-bold text-muted-foreground">
                            {payload[0].payload.name}
                          </span>
                        </div>
                        {showComparison ? (
                          <>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Current
                              </span>
                              <span className="font-bold">
                                ${payload[0].value.toLocaleString()}
                              </span>
                            </div>
                            <div className="col-span-2">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Previous
                              </span>
                              <span className="font-bold ml-2">
                                ${payload[1].value.toLocaleString()}
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Sales
                            </span>
                            <span className="font-bold">
                              ${payload[0].value.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {showComparison ? (
              <>
                <Area
                  type="monotone"
                  dataKey="current"
                  stroke="#0c91e6"
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                  name="Current Year"
                />
                <Area
                  type="monotone"
                  dataKey="previous"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorPrevious)"
                  name="Previous Year"
                />
                <Legend />
              </>
            ) : (
              <Area
                type="monotone"
                dataKey="total"
                stroke="#0c91e6"
                fillOpacity={1}
                fill="url(#colorTotal)"
              />
            )}
          </AreaChart>
        ) : (
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" vertical={false} />
            <XAxis 
              dataKey="name" 
              tickLine={false}
              axisLine={false}
              className="text-xs"
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              className="text-xs"
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Month
                          </span>
                          <span className="font-bold text-muted-foreground">
                            {payload[0].payload.name}
                          </span>
                        </div>
                        {showComparison ? (
                          <>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Current
                              </span>
                              <span className="font-bold">
                                ${payload[0].value.toLocaleString()}
                              </span>
                            </div>
                            <div className="col-span-2">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Previous
                              </span>
                              <span className="font-bold ml-2">
                                ${payload[1].value.toLocaleString()}
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Sales
                            </span>
                            <span className="font-bold">
                              ${payload[0].value.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {showComparison ? (
              <>
                <Bar dataKey="current" fill="#0c91e6" name="Current Year" radius={[4, 4, 0, 0]} />
                <Bar dataKey="previous" fill="#10b981" name="Previous Year" radius={[4, 4, 0, 0]} />
                <Legend />
              </>
            ) : (
              <Bar dataKey="total" fill="#0c91e6" radius={[4, 4, 0, 0]} />
            )}
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
