
-- Function to update customer stats when a new order is added
CREATE OR REPLACE FUNCTION update_customer_stats(p_customer_id UUID, p_order_amount NUMERIC)
RETURNS VOID AS $$
BEGIN
  UPDATE customers
  SET 
    orders_count = COALESCE(orders_count, 0) + 1,
    spent_amount = COALESCE(spent_amount, 0) + p_order_amount,
    last_order_date = NOW(),
    updated_at = NOW()
  WHERE id = p_customer_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update product stock when an order is placed
CREATE OR REPLACE FUNCTION update_product_stock_on_order()
RETURNS TRIGGER AS $$
DECLARE
  product_rec RECORD;
  new_stock INTEGER;
BEGIN
  SELECT * INTO product_rec FROM products WHERE id = NEW.product_id;
  new_stock := product_rec.stock - NEW.quantity;
  
  UPDATE products 
  SET 
    stock = new_stock,
    status = CASE 
              WHEN new_stock <= 0 THEN 'out-of-stock'
              WHEN new_stock < 10 THEN 'low-stock'
              ELSE 'in-stock'
            END,
    updated_at = NOW()
  WHERE id = NEW.product_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update product stock when an order item is created
CREATE TRIGGER update_product_stock
  AFTER INSERT ON order_items
  FOR EACH ROW
  EXECUTE PROCEDURE update_product_stock_on_order();
