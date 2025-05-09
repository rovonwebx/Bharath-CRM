
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNotifications } from "./NotificationContext";

// Define Customer type
export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  location?: string;
  status?: 'active' | 'inactive';
  avatar?: string;
  orders?: number;
  spent?: string;
  lastOrder?: string;
  company?: string;
  notes?: string;
  lastUpdated?: Date;
};

// Define Product type
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  category: string;
  sku?: string;
  costPrice?: number;
  comparePrice?: number;
  barcode?: string;
  dimensions?: {
    length?: string;
    width?: string;
    height?: string;
    weight?: string;
  };
  lastUpdated?: Date;
  imageUrl?: string;
};

// Define Order type
export type Order = {
  id: string;
  customerId: string;
  orderDate: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: { productId: string; quantity: number; price: number }[];
  lastUpdated?: Date;
  paymentMethod?: 'credit-card' | 'upi' | 'netbanking' | 'cash-on-delivery' | 'wallet';
  deliveryAddress?: string;
  trackingNumber?: string;
};

// Define Ticket type
export type Ticket = {
  id: string;
  title: string;
  customer: string;
  status: 'high' | 'medium' | 'low';
  date: string;
  description?: string;
  lastUpdated?: Date;
  assignedTo?: string;
  category?: 'technical' | 'billing' | 'general' | 'feature-request';
};

// Add tickets to the context type
export type DataContextType = {
  customers: Customer[];
  products: Product[];
  orders: Order[];
  tickets: Ticket[];
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (id: string, data: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addOrder: (order: Omit<Order, 'id'>) => void;
  updateOrder: (id: string, data: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  addTicket: (ticket: Omit<Ticket, 'id'>) => void;
  updateTicket: (id: string, data: Partial<Ticket>) => void;
  deleteTicket: (id: string) => void;
  refreshAllData: () => void;
  lastDataRefresh: Date;
};

// Create Data Context
const DataContext = createContext<DataContextType | undefined>(undefined);

// Custom hook to use Data Context
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

// Function to generate unique ID (replacing uuid dependency)
const generateId = (prefix: string) => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

// Sample product images
const productImages = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
  "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f",
  "https://images.unsplash.com/photo-1572635196237-14b3f281503f",
  "https://images.unsplash.com/photo-1517242027094-631f8c218a0f"
];

// Data Provider Component
export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const { addNotification } = useNotifications();
  const [lastDataRefresh, setLastDataRefresh] = useState<Date>(new Date());
  
  // State for customers
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "customer-1",
      name: "Raj Patel",
      email: "raj.patel@example.com",
      phone: "123-456-7890",
      address: "123 Main St",
      city: "Mumbai",
      country: "India",
      location: "Mumbai, India",
      status: "active",
      orders: 15,
      spent: "₹12,500",
      lastOrder: "2023-09-15",
      lastUpdated: new Date(Date.now() - 5 * 86400000),
    },
    {
      id: "customer-2",
      name: "Priya Sharma",
      email: "priya.sharma@example.com",
      phone: "987-654-3210",
      address: "456 Elm St",
      city: "Delhi",
      country: "India",
      location: "Delhi, India",
      status: "active",
      orders: 8,
      spent: "₹8,200",
      lastOrder: "2023-09-18",
      lastUpdated: new Date(Date.now() - 3 * 86400000),
    },
    {
      id: "customer-3",
      name: "Vikram Singh",
      email: "vikram.singh@example.com",
      phone: "555-123-4567",
      address: "789 Oak St",
      city: "Bangalore",
      country: "India",
      location: "Bangalore, India",
      status: "inactive",
      orders: 3,
      spent: "₹5,750",
      lastOrder: "2023-08-22",
      lastUpdated: new Date(Date.now() - 15 * 86400000),
    },
    {
      id: "customer-4",
      name: "Ananya Gupta",
      email: "ananya.gupta@example.com",
      phone: "222-333-4444",
      address: "101 Pine St",
      city: "Chennai",
      country: "India",
      location: "Chennai, India",
      status: "active",
      orders: 22,
      spent: "₹18,900",
      lastOrder: "2023-09-20",
      lastUpdated: new Date(Date.now() - 1 * 86400000),
    },
  ]);

  // State for products with images
  const [products, setProducts] = useState<Product[]>([
    {
      id: "product-1",
      name: "Laptop",
      description: "High-performance laptop",
      price: 45000,
      stock: 50,
      status: "in-stock",
      category: "Electronics",
      sku: "LAP-001",
      imageUrl: productImages[0],
      lastUpdated: new Date(Date.now() - 7 * 86400000),
    },
    {
      id: "product-2",
      name: "Office Chair",
      description: "Ergonomic office chair",
      price: 7500,
      stock: 10,
      status: "low-stock",
      category: "Furniture",
      sku: "CHR-001",
      imageUrl: productImages[1],
      lastUpdated: new Date(Date.now() - 10 * 86400000),
    },
    {
      id: "product-3",
      name: "Wireless Mouse",
      description: "Comfortable wireless mouse",
      price: 1200,
      stock: 0,
      status: "out-of-stock",
      category: "Electronics",
      sku: "MOU-001",
      imageUrl: productImages[2],
      lastUpdated: new Date(Date.now() - 14 * 86400000),
    },
    {
      id: "product-4",
      name: "Desk Lamp",
      description: "LED desk lamp with adjustable brightness",
      price: 950,
      stock: 35,
      status: "in-stock",
      category: "Home",
      sku: "LAMP-001",
      imageUrl: productImages[3],
      lastUpdated: new Date(Date.now() - 3 * 86400000),
    },
    {
      id: "product-5",
      name: "External SSD",
      description: "500GB External SSD drive",
      price: 4500,
      stock: 8,
      status: "low-stock",
      category: "Electronics",
      sku: "SSD-001",
      imageUrl: productImages[4],
      lastUpdated: new Date(Date.now() - 5 * 86400000),
    },
  ]);

  // State for orders
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "order-1",
      customerId: "customer-1",
      orderDate: "2023-09-20",
      totalAmount: 55000,
      status: "processing",
      items: [
        { productId: "product-1", quantity: 1, price: 45000 },
        { productId: "product-3", quantity: 2, price: 1200 },
      ],
      paymentMethod: "upi",
      lastUpdated: new Date(Date.now() - 2 * 86400000),
    },
    {
      id: "order-2",
      customerId: "customer-2",
      orderDate: "2023-09-22",
      totalAmount: 7500,
      status: "pending",
      items: [{ productId: "product-2", quantity: 1, price: 7500 }],
      paymentMethod: "netbanking",
      lastUpdated: new Date(Date.now() - 1 * 86400000),
    },
    {
      id: "order-3",
      customerId: "customer-4",
      orderDate: "2023-09-19",
      totalAmount: 12450,
      status: "delivered",
      items: [
        { productId: "product-4", quantity: 3, price: 950 },
        { productId: "product-5", quantity: 2, price: 4500 },
      ],
      paymentMethod: "credit-card",
      lastUpdated: new Date(Date.now() - 4 * 86400000),
    },
    {
      id: "order-4",
      customerId: "customer-3",
      orderDate: "2023-09-15",
      totalAmount: 3600,
      status: "shipped",
      items: [{ productId: "product-3", quantity: 3, price: 1200 }],
      paymentMethod: "cash-on-delivery",
      lastUpdated: new Date(Date.now() - 6 * 86400000),
    },
  ]);
  
  // Add tickets state
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: "ticket-1",
      title: "Cannot access inventory module",
      customer: "Raj Enterprises",
      status: "high",
      date: "2023-06-15",
      category: "technical",
      lastUpdated: new Date(Date.now() - 3 * 86400000),
    },
    {
      id: "ticket-2",
      title: "Need help with GST report",
      customer: "Sharma Trading Co.",
      status: "medium", 
      date: "2023-06-14",
      category: "general",
      lastUpdated: new Date(Date.now() - 4 * 86400000),
    },
    {
      id: "ticket-3",
      title: "Invoice printing issue",
      customer: "Patel Distributors",
      status: "medium",
      date: "2023-06-13",
      category: "technical",
      lastUpdated: new Date(Date.now() - 5 * 86400000),
    },
    {
      id: "ticket-4",
      title: "Dashboard not loading",
      customer: "Singh Exports",
      status: "low",
      date: "2023-06-12",
      category: "technical",
      lastUpdated: new Date(Date.now() - 7 * 86400000),
    },
    {
      id: "ticket-5",
      title: "Feature request: multiple currencies",
      customer: "Global India Traders",
      status: "low",
      date: "2023-06-11",
      category: "feature-request",
      lastUpdated: new Date(Date.now() - 8 * 86400000),
    }
  ]);

  // Simulate real-time data updates (for demo purposes)
  useEffect(() => {
    const updateInterval = setInterval(() => {
      // Randomly update product stock levels occasionally
      if (Math.random() > 0.7) { // 30% chance
        const randomProductIndex = Math.floor(Math.random() * products.length);
        const randomProduct = products[randomProductIndex];
        
        const stockChange = Math.floor(Math.random() * 5) + 1;
        const stockOperation = Math.random() > 0.5 ? 'increase' : 'decrease';
        const newStock = stockOperation === 'increase' 
          ? randomProduct.stock + stockChange
          : Math.max(0, randomProduct.stock - stockChange);
        
        // Update product stock
        updateProduct(randomProduct.id, { 
          stock: newStock,
          status: newStock === 0 ? 'out-of-stock' : newStock < 15 ? 'low-stock' : 'in-stock'
        });
        
        // Add notification about the stock change
        addNotification({
          title: stockOperation === 'increase' ? "Stock Increased" : "Stock Decreased",
          message: `${randomProduct.name} stock ${stockOperation === 'increase' ? 'increased' : 'decreased'} by ${stockChange} units.`,
          type: "info",
          read: false,
        });
      }
      
      // Randomly update order status occasionally
      if (Math.random() > 0.8) { // 20% chance
        const randomOrderIndex = Math.floor(Math.random() * orders.length);
        const randomOrder = orders[randomOrderIndex];
        
        if (randomOrder.status !== 'delivered' && randomOrder.status !== 'cancelled') {
          let newStatus: Order['status'] = randomOrder.status;
          
          // Progress the order status
          if (randomOrder.status === 'pending') newStatus = 'processing';
          else if (randomOrder.status === 'processing') newStatus = 'shipped';
          else if (randomOrder.status === 'shipped') newStatus = 'delivered';
          
          // Update order status
          updateOrder(randomOrder.id, { status: newStatus });
          
          // Find customer name
          const customer = customers.find(c => c.id === randomOrder.customerId);
          
          // Add notification about the order status change
          addNotification({
            title: "Order Status Updated",
            message: `Order #${randomOrder.id.split('-')[1]} for ${customer?.name || 'a customer'} is now ${newStatus}.`,
            type: "order",
            read: false,
          });
        }
      }
    }, 60000); // Every minute

    return () => clearInterval(updateInterval);
  }, [products, orders, customers, addNotification]);

  // Customer management functions
  const addCustomer = (customer: Omit<Customer, 'id'>) => {
    const newCustomer = { 
      ...customer, 
      id: generateId('customer'),
      lastUpdated: new Date() 
    };
    setCustomers([...customers, newCustomer]);
    
    addNotification({
      title: "New Customer Added",
      message: `${customer.name} has been added to your customer database.`,
      type: "success",
      read: false,
    });
  };

  const updateCustomer = (id: string, data: Partial<Customer>) => {
    const updatedCustomers = customers.map((customer) => 
      customer.id === id ? { 
        ...customer, 
        ...data, 
        lastUpdated: new Date() 
      } : customer
    );
    setCustomers(updatedCustomers);
    
    const customer = customers.find(c => c.id === id);
    if (customer) {
      addNotification({
        title: "Customer Updated",
        message: `${customer.name}'s information has been updated.`,
        type: "info",
        read: false,
      });
    }
  };

  const deleteCustomer = (id: string) => {
    const customer = customers.find(c => c.id === id);
    setCustomers(customers.filter((customer) => customer.id !== id));
    
    if (customer) {
      addNotification({
        title: "Customer Deleted",
        message: `${customer.name} has been removed from your customer database.`,
        type: "info",
        read: false,
      });
    }
  };

  // Product management functions
  const addProduct = (product: Omit<Product, 'id'>) => {
    const randomImageIndex = Math.floor(Math.random() * productImages.length);
    const newProduct = { 
      ...product, 
      id: generateId('product'),
      imageUrl: product.imageUrl || productImages[randomImageIndex],
      lastUpdated: new Date() 
    };
    setProducts([...products, newProduct]);
    
    addNotification({
      title: "New Product Added",
      message: `${product.name} has been added to your product catalog.`,
      type: "success",
      read: false,
    });
  };

  const updateProduct = (id: string, data: Partial<Product>) => {
    const updatedProducts = products.map((product) => 
      product.id === id ? { 
        ...product, 
        ...data, 
        lastUpdated: new Date() 
      } : product
    );
    setProducts(updatedProducts);
    
    const product = products.find(p => p.id === id);
    if (product) {
      addNotification({
        title: "Product Updated",
        message: `${product.name} has been updated in your product catalog.`,
        type: "info",
        read: false,
      });
    }
  };

  const deleteProduct = (id: string) => {
    const product = products.find(p => p.id === id);
    setProducts(products.filter((product) => product.id !== id));
    
    if (product) {
      addNotification({
        title: "Product Deleted",
        message: `${product.name} has been removed from your product catalog.`,
        type: "info",
        read: false,
      });
    }
  };
  
  // Order management functions
  const addOrder = (order: Omit<Order, 'id'>) => {
    const newOrder = { 
      ...order, 
      id: generateId('order'),
      lastUpdated: new Date() 
    };
    setOrders([...orders, newOrder]);
    
    const customer = customers.find(c => c.id === order.customerId);
    addNotification({
      title: "New Order Received",
      message: `A new order worth ₹${order.totalAmount.toLocaleString()} has been placed${customer ? ' by ' + customer.name : ''}.`,
      type: "order",
      read: false,
    });
  };

  const updateOrder = (id: string, data: Partial<Order>) => {
    const updatedOrders = orders.map((order) => 
      order.id === id ? { 
        ...order, 
        ...data, 
        lastUpdated: new Date() 
      } : order
    );
    setOrders(updatedOrders);
    
    if (data.status && ['delivered', 'shipped', 'cancelled'].includes(data.status)) {
      const order = orders.find(o => o.id === id);
      const customer = order ? customers.find(c => c.id === order.customerId) : null;
      
      addNotification({
        title: `Order ${data.status.charAt(0).toUpperCase() + data.status.slice(1)}`,
        message: `Order #${id.split('-')[1]}${customer ? ' for ' + customer.name : ''} has been ${data.status}.`,
        type: data.status === 'cancelled' ? "warning" : "success",
        read: false,
      });
    }
  };

  const deleteOrder = (id: string) => {
    setOrders(orders.filter((order) => order.id !== id));
    
    addNotification({
      title: "Order Deleted",
      message: `Order #${id.split('-')[1]} has been deleted from the system.`,
      type: "warning",
      read: false,
    });
  };
  
  // Ticket management functions
  const addTicket = (ticket: Omit<Ticket, 'id'>) => {
    const newTicket = { 
      ...ticket, 
      id: generateId('ticket'),
      lastUpdated: new Date() 
    };
    setTickets([...tickets, newTicket]);
    
    addNotification({
      title: "New Support Ticket",
      message: `A new support ticket has been created by ${ticket.customer}.`,
      type: ticket.status === 'high' ? "error" : ticket.status === 'medium' ? "warning" : "info",
      read: false,
    });
  };

  const updateTicket = (id: string, data: Partial<Ticket>) => {
    const updatedTickets = tickets.map((ticket) => 
      ticket.id === id ? { 
        ...ticket, 
        ...data, 
        lastUpdated: new Date() 
      } : ticket
    );
    setTickets(updatedTickets);
    
    const ticket = tickets.find(t => t.id === id);
    if (ticket && data.status) {
      addNotification({
        title: "Ticket Status Updated",
        message: `The priority of "${ticket.title}" has been updated to ${data.status}.`,
        type: data.status === 'high' ? "error" : data.status === 'medium' ? "warning" : "info",
        read: false,
      });
    }
  };

  const deleteTicket = (id: string) => {
    const ticket = tickets.find(t => t.id === id);
    setTickets(tickets.filter((ticket) => ticket.id !== id));
    
    if (ticket) {
      addNotification({
        title: "Support Ticket Closed",
        message: `The ticket "${ticket.title}" from ${ticket.customer} has been closed.`,
        type: "success",
        read: false,
      });
    }
  };
  
  // Refresh all data function
  const refreshAllData = () => {
    setLastDataRefresh(new Date());
    
    addNotification({
      title: "Data Refreshed",
      message: "All data has been refreshed with the latest information.",
      type: "info",
      read: false,
    });
  };

  const value = {
    customers,
    products,
    orders,
    tickets,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addProduct,
    updateProduct,
    deleteProduct,
    addOrder,
    updateOrder,
    deleteOrder,
    addTicket,
    updateTicket,
    deleteTicket,
    refreshAllData,
    lastDataRefresh,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
