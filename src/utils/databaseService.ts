import { supabase } from "@/lib/supabase";
import type { Customer, Product, Order, OrderItem, Ticket } from "@/lib/supabase";

// Customer CRUD operations
export const fetchCustomers = async () => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    throw new Error(`Error fetching customers: ${error.message}`);
  }
  
  return data;
};

export const addCustomer = async (customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('customers')
    .insert([customer])
    .select();
  
  if (error) {
    throw new Error(`Error adding customer: ${error.message}`);
  }
  
  return data[0];
};

export const updateCustomer = async (id: string, updates: Partial<Customer>) => {
  const { data, error } = await supabase
    .from('customers')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) {
    throw new Error(`Error updating customer: ${error.message}`);
  }
  
  return data[0];
};

export const deleteCustomer = async (id: string) => {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id);
  
  if (error) {
    throw new Error(`Error deleting customer: ${error.message}`);
  }
  
  return true;
};

// Product CRUD operations
export const fetchProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    throw new Error(`Error fetching products: ${error.message}`);
  }
  
  return data;
};

export const addProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select();
  
  if (error) {
    throw new Error(`Error adding product: ${error.message}`);
  }
  
  return data[0];
};

export const updateProduct = async (id: string, updates: Partial<Product>) => {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) {
    throw new Error(`Error updating product: ${error.message}`);
  }
  
  return data[0];
};

export const deleteProduct = async (id: string) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  
  if (error) {
    throw new Error(`Error deleting product: ${error.message}`);
  }
  
  return true;
};

// Order CRUD operations
export const fetchOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      customers (name, email),
      order_items (
        *,
        products (name, price)
      )
    `)
    .order('created_at', { ascending: false });
  
  if (error) {
    throw new Error(`Error fetching orders: ${error.message}`);
  }
  
  return data;
};

export const addOrder = async (
  order: Omit<Order, 'id' | 'created_at' | 'updated_at'>, 
  orderItems: Array<Omit<OrderItem, 'id' | 'created_at' | 'updated_at' | 'order_id'>>
) => {
  // Start a transaction
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert([order])
    .select();
  
  if (orderError) {
    throw new Error(`Error creating order: ${orderError.message}`);
  }
  
  const newOrderId = orderData[0].id;
  
  // Add order items with the new order ID
  const items = orderItems.map(item => ({ ...item, order_id: newOrderId }));
  
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(items);
  
  if (itemsError) {
    // If there's an error adding items, we should ideally delete the order
    // to keep the database consistent, but this is simplified for now
    throw new Error(`Error adding order items: ${itemsError.message}`);
  }
  
  // Update customer's orders_count and spent_amount
  const { error: customerError } = await supabase.rpc('update_customer_stats', {
    p_customer_id: order.customer_id,
    p_order_amount: order.total
  });
  
  if (customerError) {
    console.error(`Error updating customer stats: ${customerError.message}`);
  }
  
  return { ...orderData[0], orderItems: items };
};

export const updateOrderStatus = async (id: string, status: Order['status']) => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select();
  
  if (error) {
    throw new Error(`Error updating order status: ${error.message}`);
  }
  
  return data[0];
};

// Ticket CRUD operations
export const fetchTickets = async () => {
  const { data, error } = await supabase
    .from('tickets')
    .select(`
      *,
      customers (name, email)
    `)
    .order('created_at', { ascending: false });
  
  if (error) {
    throw new Error(`Error fetching tickets: ${error.message}`);
  }
  
  return data;
};

export const addTicket = async (ticket: Omit<Ticket, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('tickets')
    .insert([ticket])
    .select();
  
  if (error) {
    throw new Error(`Error adding ticket: ${error.message}`);
  }
  
  return data[0];
};

export const updateTicket = async (id: string, updates: Partial<Ticket>) => {
  const { data, error } = await supabase
    .from('tickets')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) {
    throw new Error(`Error updating ticket: ${error.message}`);
  }
  
  return data[0];
};

export const deleteTicket = async (id: string) => {
  const { error } = await supabase
    .from('tickets')
    .delete()
    .eq('id', id);
  
  if (error) {
    throw new Error(`Error deleting ticket: ${error.message}`);
  }
  
  return true;
};
