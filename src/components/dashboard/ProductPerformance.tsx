
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "recharts";

// Ensure proper type handling for product metrics
interface ProductPerformanceProps {
  data: {
    name: string;
    sales: number;
    growth: number;
  }[];
}

export const ProductPerformance = ({ data }: ProductPerformanceProps) => {
  // Format number to have commas for thousands and fix 'replace' issue
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  if (!data || data.length === 0) {
    return <div>No product performance data available</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((product, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>{product.name}</div>
              <div className="font-semibold">₹{formatNumber(product.sales)}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
