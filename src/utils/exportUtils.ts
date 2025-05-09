
import { Customer, Product } from "@/contexts/DataContext";
import { toast } from "@/components/ui/use-toast";

// Mock function to generate a PDF string
const generatePdfContent = (data: any[], title: string): string => {
  let content = `${title}\n\n`;
  
  if (data.length === 0) {
    return content + "No data available";
  }
  
  // Get all keys from the first object to use as headers
  const headers = Object.keys(data[0]);
  
  // Add headers to content
  content += headers.join(",") + "\n";
  
  // Add rows to content
  data.forEach(item => {
    const row = headers.map(header => {
      const value = item[header];
      // Handle nested objects
      if (typeof value === 'object' && value !== null) {
        return JSON.stringify(value).replace(/,/g, ';');
      }
      // Convert value to string and escape commas
      return String(value || '').replace(/,/g, ';');
    });
    content += row.join(",") + "\n";
  });
  
  return content;
};

// Function to download text as a file
const downloadTextAsFile = (text: string, filename: string) => {
  const blob = new Blob([text], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Export customers to PDF
export const exportCustomers = (customers: Customer[]) => {
  try {
    const simplifiedCustomers = customers.map(c => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      location: c.location || `${c.city}, ${c.country}`,
      orders: c.orders || 0,
      spent: c.spent || "₹0",
      status: c.status || "inactive"
    }));
    
    const content = generatePdfContent(simplifiedCustomers, "Customer Report");
    downloadTextAsFile(content, "customers_export.csv");
    
    toast({
      title: "Export Successful",
      description: "Customers data has been exported"
    });
  } catch (error) {
    console.error("Failed to export customers:", error);
    toast({
      title: "Export Failed",
      description: "There was an error exporting customers data",
      variant: "destructive"
    });
  }
};

// Export products to PDF
export const exportProducts = (products: Product[]) => {
  try {
    const simplifiedProducts = products.map(p => ({
      id: p.id,
      name: p.name,
      sku: p.sku || "",
      category: p.category,
      price: p.price,
      stock: p.stock,
      status: p.status
    }));
    
    const content = generatePdfContent(simplifiedProducts, "Product Report");
    downloadTextAsFile(content, "products_export.csv");
    
    toast({
      title: "Export Successful",
      description: "Products data has been exported"
    });
  } catch (error) {
    console.error("Failed to export products:", error);
    toast({
      title: "Export Failed",
      description: "There was an error exporting products data",
      variant: "destructive"
    });
  }
};

// Export orders to PDF
export const exportOrders = (orders: any[]) => {
  try {
    const content = generatePdfContent(orders, "Orders Report");
    downloadTextAsFile(content, "orders_export.csv");
    
    toast({
      title: "Export Successful",
      description: "Orders data has been exported"
    });
  } catch (error) {
    console.error("Failed to export orders:", error);
    toast({
      title: "Export Failed",
      description: "There was an error exporting orders data",
      variant: "destructive"
    });
  }
};

// Send email to all customers
export const sendEmailToAll = (customers: Customer[]) => {
  const emails = customers.map(c => c.email).join(', ');
  
  // In a real application, this would send the email via an API
  console.log("Sending email to:", emails);
  
  // For demo purposes, we'll just show a toast
  toast({
    title: "Emails Sent",
    description: `Email campaign initiated to ${customers.length} recipients`
  });
  
  return true;
};
