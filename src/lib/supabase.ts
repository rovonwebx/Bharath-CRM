import { createClient } from '@supabase/supabase-js';

// Your Supabase URL and anon key
const supabaseUrl = 'https://iyadzirmukonckhoksbg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5YWR6aXJtdWtvbmNraG9rc2JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2MDY5OTIsImV4cCI6MjA1OTE4Mjk5Mn0.S_kpdF63S8mYHHFz7n_aCA_I_dhnJlr1PCd1ZmnZS8I';

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define types for our database
export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: 'admin';
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  company?: string;
  notes?: string;
  last_order_date?: string;
  spent_amount?: number;
  orders_count?: number;
  avatar_url?: string;
}

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  created_at: string;
  updated_at: string;
  sku?: string;
  cost_price?: number;
  compare_price?: number;
  barcode?: string;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    weight: number;
    unit: string;
  };
  image_url?: string;
}

export type Order = {
  id: string;
  customer_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  created_at: string;
  updated_at: string;
  payment_method?: 'credit-card' | 'upi' | 'netbanking' | 'cash-on-delivery' | 'wallet';
  delivery_address?: string;
  tracking_number?: string;
}

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
}

export type Ticket = {
  id: string;
  title: string;
  customer_id: string;
  status: 'high' | 'medium' | 'low';
  created_at: string;
  updated_at: string;
  description?: string;
  assigned_to?: string;
  category?: 'technical' | 'billing' | 'general' | 'feature-request';
}

// Create a type for the Database object that includes all our tables
export type Database = {
  public: {
    Tables: {
      users: {
        Row: AdminUser;
        Insert: Omit<AdminUser, 'id'> & { id?: string };
        Update: Partial<AdminUser>;
      };
      customers: {
        Row: Customer;
        Insert: Omit<Customer, 'id' | 'created_at' | 'updated_at'> & { id?: string, created_at?: string, updated_at?: string };
        Update: Partial<Customer>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'> & { id?: string, created_at?: string, updated_at?: string };
        Update: Partial<Product>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, 'id' | 'created_at' | 'updated_at'> & { id?: string, created_at?: string, updated_at?: string };
        Update: Partial<Order>;
      };
      order_items: {
        Row: OrderItem;
        Insert: Omit<OrderItem, 'id' | 'created_at' | 'updated_at'> & { id?: string, created_at?: string, updated_at?: string };
        Update: Partial<OrderItem>;
      };
      tickets: {
        Row: Ticket;
        Insert: Omit<Ticket, 'id' | 'created_at' | 'updated_at'> & { id?: string, created_at?: string, updated_at?: string };
        Update: Partial<Ticket>;
      };
    };
  };
};
