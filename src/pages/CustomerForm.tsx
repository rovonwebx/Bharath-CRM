
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useData, Customer } from "@/contexts/DataContext";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNotifications } from "@/contexts/NotificationContext";
import { Loader2 } from "lucide-react";

// Create a schema for form validation
const customerFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  status: z.enum(["active", "inactive"]),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string(),
  notes: z.string().optional()
});

type CustomerFormData = z.infer<typeof customerFormSchema>;

const CustomerForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const { toast } = useToast();
  const { customers, addCustomer, updateCustomer } = useData();
  const { addNotification } = useNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with react-hook-form
  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      status: 'active',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'us',
      notes: ''
    }
  });

  // If editing, load customer data
  useEffect(() => {
    if (isEditing && id) {
      const customerToEdit = customers.find(c => c.id === id);
      if (customerToEdit) {
        const nameParts = customerToEdit.name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        form.reset({
          firstName,
          lastName,
          email: customerToEdit.email || '',
          phone: customerToEdit.phone || '',
          company: customerToEdit.company || '',
          status: customerToEdit.status || 'active',
          street: customerToEdit.address || '',
          city: customerToEdit.city || '',
          state: '',
          postalCode: '',
          country: customerToEdit.country || 'us',
          notes: customerToEdit.notes || ''
        });
      } else {
        // Customer not found, redirect to customers list
        navigate('/customers');
        toast({
          title: "Customer not found",
          description: "The customer you're trying to edit does not exist.",
          variant: "destructive"
        });
      }
    }
  }, [isEditing, id, customers, navigate, toast, form]);

  const onSubmit = (data: CustomerFormData) => {
    setIsSubmitting(true);
    
    // Prepare the customer data from form values
    const customerData = {
      name: `${data.firstName} ${data.lastName}`.trim(),
      email: data.email,
      phone: data.phone || '',
      company: data.company || undefined,
      status: data.status as 'active' | 'inactive',
      location: `${data.city}${data.city && data.state ? ', ' : ''}${data.state}`,
      address: data.street || '',
      city: data.city || '',
      country: data.country,
      avatar: '',
      notes: data.notes || undefined
    };

    setTimeout(() => {
      try {
        if (isEditing && id) {
          updateCustomer(id, customerData);
          
          // Add notification for update
          addNotification({
            title: "Customer Updated",
            message: `${customerData.name}'s information has been updated successfully.`,
            type: "success",
            read: false,
          });
          
          toast({
            title: "Customer Updated",
            description: "The customer has been successfully updated.",
          });
        } else {
          addCustomer(customerData);
          
          // Add notification for new customer
          addNotification({
            title: "New Customer Added",
            message: `${customerData.name} has been added to your customer database.`,
            type: "success",
            read: false,
          });
          
          toast({
            title: "Customer Added",
            description: "The customer has been successfully added.",
          });
        }
        setIsSubmitting(false);
        navigate("/customers");
      } catch (error) {
        console.error("Error saving customer:", error);
        setIsSubmitting(false);
        toast({
          title: "Error",
          description: "There was a problem saving the customer information.",
          variant: "destructive"
        });
      }
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          {isEditing ? "Edit Customer" : "Add New Customer"}
        </h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
                <CardDescription>
                  Enter the basic information about the customer.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input type="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Address Information</CardTitle>
                <CardDescription>
                  Enter the address details for the customer.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State / Province</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="in">India</SelectItem>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="ca">Canada</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                            <SelectItem value="au">Australia</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any additional notes about the customer"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/customers")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Adding..."}
                </>
              ) : (
                isEditing ? "Update Customer" : "Add Customer"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CustomerForm;
