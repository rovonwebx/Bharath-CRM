
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { Product } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addProduct, updateProduct } = useData();
  
  // Define proper types for form data
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    description: '',
    price: '0',
    costPrice: '0',
    comparePrice: '0',
    stock: 0,
    status: 'in-stock' as 'in-stock' | 'low-stock' | 'out-of-stock', // Fix type definition
    barcode: '',
    image: '',
    dimensions: {
      length: '',
      width: '',
      height: '',
      weight: '',
    },
  });

  useEffect(() => {
    if (id) {
      const productToEdit = products.find(product => product.id === id);
      
      if (productToEdit) {
        setFormData({
          name: productToEdit.name,
          sku: productToEdit.sku || '',
          category: productToEdit.category,
          description: productToEdit.description,
          price: productToEdit.price.toString(),
          costPrice: productToEdit.costPrice?.toString() || '0',
          comparePrice: productToEdit.comparePrice?.toString() || '0',
          stock: productToEdit.stock,
          status: productToEdit.status,
          barcode: productToEdit.barcode || '',
          image: '', // Assuming image is not stored in the product object
          dimensions: {
            length: productToEdit.dimensions?.length || '',
            width: productToEdit.dimensions?.width || '',
            height: productToEdit.dimensions?.height || '',
            weight: productToEdit.dimensions?.weight || '',
          },
        });
      }
    }
  }, [id, products]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...(formData[parent as keyof typeof formData] as Record<string, unknown>),
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert string values to numbers where needed
    const productData: Omit<Product, 'id'> = {
      name: formData.name,
      sku: formData.sku,
      category: formData.category,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      costPrice: parseFloat(formData.costPrice) || 0,
      comparePrice: parseFloat(formData.comparePrice) || 0,
      stock: formData.stock,
      status: formData.status,
      barcode: formData.barcode,
      dimensions: formData.dimensions,
    };
    
    if (id) {
      updateProduct(id, productData);
    } else {
      addProduct(productData);
    }
    
    navigate('/products');
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{id ? 'Edit Product' : 'Add Product'}</h2>
        <Button variant="outline" onClick={() => navigate('/products')}>
          Cancel
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{id ? 'Edit Product Details' : 'Add New Product'}</CardTitle>
          <CardDescription>
            {id ? 'Modify product information here' : 'Enter product details to add a new product'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input
                type="text"
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="costPrice">Cost Price</Label>
              <Input
                type="number"
                id="costPrice"
                name="costPrice"
                value={formData.costPrice}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="comparePrice">Compare Price</Label>
              <Input
                type="number"
                id="comparePrice"
                name="comparePrice"
                value={formData.comparePrice}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={(value) => handleSelectChange(value, 'status')}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" defaultValue={formData.status} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="low-stock">Low Stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="barcode">Barcode</Label>
              <Input
                type="text"
                id="barcode"
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Dimensions</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="length">Length</Label>
                  <Input
                    type="text"
                    id="length"
                    name="dimensions.length"
                    value={formData.dimensions.length}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="width">Width</Label>
                  <Input
                    type="text"
                    id="width"
                    name="dimensions.width"
                    value={formData.dimensions.width}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height</Label>
                  <Input
                    type="text"
                    id="height"
                    name="dimensions.height"
                    value={formData.dimensions.height}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight</Label>
                  <Input
                    type="text"
                    id="weight"
                    name="dimensions.weight"
                    value={formData.dimensions.weight}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <Button type="submit">{id ? 'Update Product' : 'Add Product'}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductForm;
