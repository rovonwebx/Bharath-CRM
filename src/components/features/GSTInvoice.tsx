import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Printer, Share2, Plus, Calculator, FileText, Save, Trash2, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { CheckedState } from "@radix-ui/react-checkbox";

type InvoiceItem = {
  id: number;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  hsnCode: string;
  taxRate: number;
  cgst: number;
  sgst: number;
  igst: number;
}

type InvoiceTemplate = {
  id: string;
  name: string;
  type: string;
  taxType: string;
}

type SavedInvoice = {
  id: string;
  number: string;
  customerName: string;
  date: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid';
}

const GSTInvoice = () => {
  const { toast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);
  
  const [invoiceNumber, setInvoiceNumber] = useState("INV-001");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  });
  
  const [businessName, setBusinessName] = useState("Your Business Name");
  const [businessGstin, setBusinessGstin] = useState("22AAAAA0000A1Z5");
  const [businessAddress, setBusinessAddress] = useState("123 Business Street, City, State - 400001");
  const [customerName, setCustomerName] = useState("Customer Name");
  const [customerGstin, setCustomerGstin] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: 1,
      description: "Product A",
      quantity: 1,
      rate: 1000,
      amount: 1000,
      hsnCode: "9403",
      taxRate: 18,
      cgst: 90,
      sgst: 90,
      igst: 0
    }
  ]);
  const [invoiceType, setInvoiceType] = useState("regular");
  const [isInterstate, setIsInterstate] = useState(false);
  const [placeOfSupply, setPlaceOfSupply] = useState("maharashtra");
  const [notes, setNotes] = useState("Thank you for your business!");
  const [termsAndConditions, setTermsAndConditions] = useState("1. Payment due within 30 days\n2. GST will be charged as applicable\n3. Goods once sold cannot be returned");
  
  const [applyDiscount, setApplyDiscount] = useState(false);
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState(0);
  const [applyShipping, setApplyShipping] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);
  const [reverseCharge, setReverseCharge] = useState(false);
  const [ewaybillNumber, setEwaybillNumber] = useState("");
  
  const [templates, setTemplates] = useState<InvoiceTemplate[]>([
    { id: "template1", name: "Standard GST Invoice", type: "regular", taxType: "cgst-sgst" },
    { id: "template2", name: "E-commerce Invoice", type: "regular", taxType: "igst" },
    { id: "template3", name: "Export Invoice", type: "export", taxType: "igst" }
  ]);
  
  const [savedInvoices, setSavedInvoices] = useState<SavedInvoice[]>([
    { id: "inv1", number: "INV-0022", customerName: "Reliance Industries", date: "2023-05-15", amount: 25000, status: 'paid' },
    { id: "inv2", number: "INV-0023", customerName: "Tata Consultancy", date: "2023-05-20", amount: 18500, status: 'sent' },
    { id: "inv3", number: "INV-0024", customerName: "Infosys Ltd", date: "2023-05-28", amount: 12750, status: 'draft' }
  ]);

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: items.length + 1,
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
      hsnCode: "",
      taxRate: 18,
      cgst: 0,
      sgst: 0,
      igst: 0
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: number, field: keyof InvoiceItem, value: any) => {
    setItems(
      items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          
          if (field === 'quantity' || field === 'rate' || field === 'taxRate') {
            updatedItem.amount = updatedItem.quantity * updatedItem.rate;
            
            if (isInterstate) {
              updatedItem.igst = (updatedItem.amount * updatedItem.taxRate) / 100;
              updatedItem.cgst = 0;
              updatedItem.sgst = 0;
            } else {
              updatedItem.cgst = (updatedItem.amount * updatedItem.taxRate) / 200;
              updatedItem.sgst = (updatedItem.amount * updatedItem.taxRate) / 200;
              updatedItem.igst = 0;
            }
          }
          
          return updatedItem;
        }
        return item;
      })
    );
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleTaxTypeChange = (value: string) => {
    const newIsInterstate = value === "igst";
    setIsInterstate(newIsInterstate);
    
    setItems(
      items.map(item => {
        const totalTaxAmount = (item.amount * item.taxRate) / 100;
        
        if (newIsInterstate) {
          return {
            ...item,
            igst: totalTaxAmount,
            cgst: 0,
            sgst: 0
          };
        } else {
          return {
            ...item,
            igst: 0,
            cgst: totalTaxAmount / 2,
            sgst: totalTaxAmount / 2
          };
        }
      })
    );
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateDiscount = () => {
    if (!applyDiscount) return 0;
    
    const subtotal = calculateSubtotal();
    if (discountType === "percentage") {
      return (subtotal * discountValue) / 100;
    } else {
      return discountValue;
    }
  };

  const calculateTaxableAmount = () => {
    return calculateSubtotal() - calculateDiscount();
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const taxableAmount = subtotal - discount;
    
    const totalCgst = items.reduce((sum, item) => sum + item.cgst, 0);
    const totalSgst = items.reduce((sum, item) => sum + item.sgst, 0);
    const totalIgst = items.reduce((sum, item) => sum + item.igst, 0);
    
    let total = taxableAmount + totalCgst + totalSgst + totalIgst;
    
    if (applyShipping) {
      total += shippingCost;
    }
    
    return {
      subtotal: subtotal.toFixed(2),
      discount: discount.toFixed(2),
      taxableAmount: taxableAmount.toFixed(2),
      cgst: totalCgst.toFixed(2),
      sgst: totalSgst.toFixed(2),
      igst: totalIgst.toFixed(2),
      shipping: applyShipping ? shippingCost.toFixed(2) : "0.00",
      total: total.toFixed(2),
      totalInWords: convertNumberToWords(total)
    };
  };

  const convertNumberToWords = (num: number) => {
    const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    const numStr = num.toFixed(2);
    const [rupees, paise] = numStr.split('.');
    const rupeesNum = parseInt(rupees);
    
    if (rupeesNum === 0) return 'Zero Rupees';
    
    if (rupeesNum < 10) return `${units[rupeesNum]} Rupees`;
    if (rupeesNum < 20) return `${teens[rupeesNum - 10]} Rupees`;
    if (rupeesNum < 100) {
      const ten = Math.floor(rupeesNum / 10);
      const unit = rupeesNum % 10;
      return `${tens[ten]}${unit ? ' ' + units[unit] : ''} Rupees`;
    }
    if (rupeesNum < 1000) {
      const hundred = Math.floor(rupeesNum / 100);
      const remaining = rupeesNum % 100;
      return `${units[hundred]} Hundred${remaining ? ' and ' + convertNumberToWords(remaining).replace(' Rupees', '') : ''} Rupees`;
    }
    
    return `${Math.floor(rupeesNum / 1000)} Thousand${rupeesNum % 1000 ? ' ' + convertNumberToWords(rupeesNum % 1000).replace(' Rupees', '') : ''} Rupees`;
  };

  const handleGenerateInvoice = () => {
    toast({
      title: "Invoice Generated Successfully",
      description: `Invoice #${invoiceNumber} has been created for ${customerName}`,
    });
    
    const newSavedInvoice: SavedInvoice = {
      id: `inv${savedInvoices.length + 1}`,
      number: invoiceNumber,
      customerName: customerName,
      date: invoiceDate,
      amount: parseFloat(calculateTotal().total),
      status: 'draft'
    };
    
    setSavedInvoices([...savedInvoices, newSavedInvoice]);
  };

  const handleSaveTemplate = () => {
    const newTemplate: InvoiceTemplate = {
      id: `template${templates.length + 1}`,
      name: `Template ${templates.length + 1}`,
      type: invoiceType,
      taxType: isInterstate ? "igst" : "cgst-sgst"
    };
    
    setTemplates([...templates, newTemplate]);
    
    toast({
      title: "Template Saved",
      description: `"${newTemplate.name}" has been saved for future use.`,
    });
  };

  const generatePDF = () => {
    if (!printRef.current) return;
    
    toast({
      title: "Generating PDF",
      description: "Please wait while we prepare your invoice...",
    });

    const invoiceContent = document.createElement('div');
    invoiceContent.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #333; margin-bottom: 5px;">TAX INVOICE</h1>
          <p>Invoice #${invoiceNumber}</p>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
          <div>
            <h3 style="color: #444; margin-bottom: 10px;">From:</h3>
            <p style="font-weight: bold;">${businessName}</p>
            <p>GSTIN: ${businessGstin}</p>
            <p>${businessAddress}</p>
          </div>
          <div style="text-align: right;">
            <p><strong>Date:</strong> ${invoiceDate}</p>
            <p><strong>Due Date:</strong> ${dueDate}</p>
          </div>
        </div>
        
        <div style="margin-bottom: 30px;">
          <h3 style="color: #444; margin-bottom: 10px;">Bill To:</h3>
          <p style="font-weight: bold;">${customerName}</p>
          ${customerGstin ? `<p>GSTIN: ${customerGstin}</p>` : ''}
          <p>${customerAddress}</p>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Description</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">HSN/SAC</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Qty</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Rate (₹)</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Amount (₹)</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Tax %</th>
              ${!isInterstate ? `
                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">CGST (₹)</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">SGST (₹)</th>
              ` : `
                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">IGST (₹)</th>
              `}
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.description}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.hsnCode}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.quantity}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.rate.toFixed(2)}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.amount.toFixed(2)}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.taxRate}%</td>
                ${!isInterstate ? `
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.cgst.toFixed(2)}</td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.sgst.toFixed(2)}</td>
                ` : `
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.igst.toFixed(2)}</td>
                `}
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="width: 300px; margin-left: auto;">
          <div style="border: 1px solid #ddd; padding: 15px; background-color: #f9f9f9;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>Subtotal:</span>
              <span>₹ ${totals.subtotal}</span>
            </div>
            
            ${applyDiscount && parseFloat(totals.discount) > 0 ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #e67e22;">
                <span>Discount:</span>
                <span>- ₹ ${totals.discount}</span>
              </div>
            ` : ''}
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-weight: 500;">
              <span>Taxable Amount:</span>
              <span>₹ ${totals.taxableAmount}</span>
            </div>
            
            ${!isInterstate ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>CGST:</span>
                <span>₹ ${totals.cgst}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>SGST:</span>
                <span>₹ ${totals.sgst}</span>
              </div>
            ` : `
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>IGST:</span>
                <span>₹ ${totals.igst}</span>
              </div>
            `}
            
            ${applyShipping && parseFloat(totals.shipping) > 0 ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Shipping:</span>
                <span>₹ ${totals.shipping}</span>
              </div>
            ` : ''}
            
            <div style="display: flex; justify-content: space-between; margin-top: 8px; padding-top: 8px; border-top: 1px solid #ddd; font-weight: bold;">
              <span>Total:</span>
              <span>₹ ${totals.total}</span>
            </div>
            
            <div style="margin-top: 8px; font-size: 12px; font-style: italic;">
              ${totals.totalInWords}
            </div>
          </div>
        </div>
        
        ${notes ? `
          <div style="margin-top: 30px;">
            <h4 style="color: #444; margin-bottom: 5px;">Notes:</h4>
            <p>${notes}</p>
          </div>
        ` : ''}
        
        ${termsAndConditions ? `
          <div style="margin-top: 20px;">
            <h4 style="color: #444; margin-bottom: 5px;">Terms & Conditions:</h4>
            <p style="white-space: pre-line;">${termsAndConditions}</p>
          </div>
        ` : ''}
      </div>
    `;

    const tempContainer = document.createElement('div');
    tempContainer.appendChild(invoiceContent);
    document.body.appendChild(tempContainer);

    html2canvas(tempContainer, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      windowWidth: 1024,
      windowHeight: 1024,
    }).then((canvas) => {
      document.body.removeChild(tempContainer);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      let heightLeft = imgHeight;
      let position = 0;
      
      while (heightLeft > pageHeight) {
        position = heightLeft - pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, -position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`Invoice_${invoiceNumber}.pdf`);
      
      toast({
        title: "PDF Generated Successfully",
        description: `Invoice #${invoiceNumber} has been downloaded.`,
      });
    });
  };

  const handlePrint = () => {
    if (!printRef.current) return;
    
    toast({
      title: "Preparing for Print",
      description: "Getting your invoice ready for printing...",
    });

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Print Failed",
        description: "Unable to open print window. Please check your pop-up settings.",
        variant: "destructive",
      });
      return;
    }

    const invoiceContent = printRef.current.cloneNode(true) as HTMLElement;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .total-section { margin-top: 20px; border: 1px solid #ddd; padding: 10px; }
            @media print {
              .no-print { display: none; }
              body { margin: 0; padding: 15mm; }
            }
            button { padding: 10px 15px; background: #4CAF50; color: white; border: none; cursor: pointer; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="no-print">
            <button onclick="window.print()">Print Invoice</button>
            <button onclick="window.close()">Close</button>
          </div>
          <h1>Tax Invoice #${invoiceNumber}</h1>
          <hr/>
          ${invoiceContent.innerHTML}
          <div class="no-print">
            <button onclick="window.print()">Print Invoice</button>
            <button onclick="window.close()">Close</button>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    printWindow.focus();
  };

  const handleDownload = () => {
    generatePDF();
  };

  const handleShare = () => {
    toast({
      title: "Share Invoice",
      description: "Invoice sharing options opened.",
    });
  };

  const loadTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setInvoiceType(template.type);
      handleTaxTypeChange(template.taxType === "igst" ? "igst" : "cgst-sgst");
      
      toast({
        title: "Template Loaded",
        description: `"${template.name}" has been applied to the current invoice.`,
      });
    }
  };

  const totals = calculateTotal();

  const handleCheckboxChange = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    checked: CheckedState
  ) => {
    setter(checked === true);
  };

  return (
    <Tabs defaultValue="create" className="w-full">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="create">Create Invoice</TabsTrigger>
        <TabsTrigger value="templates">Templates</TabsTrigger>
        <TabsTrigger value="saved">Saved Invoices</TabsTrigger>
      </TabsList>
      
      <TabsContent value="create">
        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700">
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-orange-600" />
              GST Invoice Generator
            </CardTitle>
            <CardDescription>Create professional GST-compliant invoices</CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6" ref={printRef}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2 text-orange-700 dark:text-orange-400">Business Details</h3>
                <div className="space-y-2">
                  <Label htmlFor="business-name">Business Name</Label>
                  <Input 
                    id="business-name" 
                    value={businessName} 
                    onChange={e => setBusinessName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-gstin">GSTIN</Label>
                  <Input 
                    id="business-gstin" 
                    value={businessGstin} 
                    onChange={e => setBusinessGstin(e.target.value)} 
                    placeholder="22AAAAA0000A1Z5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-address">Business Address</Label>
                  <Textarea 
                    id="business-address" 
                    value={businessAddress} 
                    onChange={e => setBusinessAddress(e.target.value)}
                    className="resize-none"
                    rows={2}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2 text-orange-700 dark:text-orange-400">Customer Details</h3>
                <div className="space-y-2">
                  <Label htmlFor="customer-name">Customer Name*</Label>
                  <Input 
                    id="customer-name" 
                    value={customerName} 
                    onChange={e => setCustomerName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-gstin">Customer GSTIN (Optional)</Label>
                  <Input 
                    id="customer-gstin" 
                    value={customerGstin} 
                    onChange={e => setCustomerGstin(e.target.value)}
                    placeholder="Enter customer GSTIN"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-address">Customer Address</Label>
                  <Textarea 
                    id="customer-address" 
                    value={customerAddress} 
                    onChange={e => setCustomerAddress(e.target.value)}
                    className="resize-none"
                    rows={2}
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="invoice-number">Invoice Number*</Label>
                <Input 
                  id="invoice-number" 
                  value={invoiceNumber} 
                  onChange={e => setInvoiceNumber(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoice-date">Invoice Date*</Label>
                <Input 
                  id="invoice-date" 
                  type="date" 
                  value={invoiceDate}
                  onChange={e => setInvoiceDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="due-date">Due Date</Label>
                <Input 
                  id="due-date" 
                  type="date" 
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="invoice-type">Invoice Type</Label>
                <Select value={invoiceType} onValueChange={value => setInvoiceType(value)}>
                  <SelectTrigger id="invoice-type">
                    <SelectValue placeholder="Select invoice type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Regular Invoice</SelectItem>
                    <SelectItem value="bill-of-supply">Bill of Supply</SelectItem>
                    <SelectItem value="export">Export Invoice</SelectItem>
                    <SelectItem value="reverse-charge">Reverse Charge</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tax-type">Tax Type</Label>
                <Select value={isInterstate ? "igst" : "cgst-sgst"} onValueChange={handleTaxTypeChange}>
                  <SelectTrigger id="tax-type">
                    <SelectValue placeholder="Select tax type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cgst-sgst">CGST & SGST (Intra-state)</SelectItem>
                    <SelectItem value="igst">IGST (Inter-state)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="place-of-supply">Place of Supply</Label>
                <Select value={placeOfSupply} onValueChange={setPlaceOfSupply}>
                  <SelectTrigger id="place-of-supply">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="gujarat">Gujarat</SelectItem>
                    <SelectItem value="karnataka">Karnataka</SelectItem>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="punjab">Punjab</SelectItem>
                    <SelectItem value="rajasthan">Rajasthan</SelectItem>
                    <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                    <SelectItem value="telangana">Telangana</SelectItem>
                    <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                    <SelectItem value="west-bengal">West Bengal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="reverse-charge" 
                  checked={reverseCharge} 
                  onCheckedChange={(checked) => handleCheckboxChange(setReverseCharge, checked)}
                />
                <Label htmlFor="reverse-charge" className="cursor-pointer">Reverse Charge Applicable</Label>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="apply-discount" 
                    checked={applyDiscount} 
                    onCheckedChange={(checked) => handleCheckboxChange(setApplyDiscount, checked)}
                  />
                  <Label htmlFor="apply-discount" className="cursor-pointer">Apply Discount</Label>
                </div>
                
                {applyDiscount && (
                  <div className="flex space-x-2 pt-2">
                    <Select value={discountType} onValueChange={(val) => setDiscountType(val as "percentage" | "fixed")}>
                      <SelectTrigger className="w-[110px]">
                        <SelectValue placeholder="Discount type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input 
                      type="number" 
                      min="0" 
                      value={discountValue}
                      onChange={e => setDiscountValue(parseFloat(e.target.value) || 0)}
                      placeholder={discountType === "percentage" ? "%" : "₹"}
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="apply-shipping" 
                    checked={applyShipping} 
                    onCheckedChange={(checked) => handleCheckboxChange(setApplyShipping, checked)}
                  />
                  <Label htmlFor="apply-shipping" className="cursor-pointer">Add Shipping Charges</Label>
                </div>
                
                {applyShipping && (
                  <div className="pt-2">
                    <Input 
                      type="number" 
                      min="0"
                      value={shippingCost}
                      onChange={e => setShippingCost(parseFloat(e.target.value) || 0)}
                      placeholder="Shipping cost"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <div className="space-y-2">
                <Label htmlFor="eway-bill">E-way Bill Number (Optional)</Label>
                <Input 
                  id="eway-bill" 
                  value={ewaybillNumber} 
                  onChange={e => setEwaybillNumber(e.target.value)}
                  placeholder="Enter e-way bill number"
                />
              </div>
            </div>
            
            <h3 className="text-lg font-medium border-b pb-2 mb-4 text-orange-700 dark:text-orange-400">Invoice Items</h3>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead style={{ width: '26%' }}>Description</TableHead>
                    <TableHead>HSN/SAC</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Rate (₹)</TableHead>
                    <TableHead>Amount (₹)</TableHead>
                    <TableHead>Tax %</TableHead>
                    {!isInterstate ? (
                      <>
                        <TableHead>CGST (₹)</TableHead>
                        <TableHead>SGST (₹)</TableHead>
                      </>
                    ) : (
                      <TableHead>IGST (₹)</TableHead>
                    )}
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Input 
                          placeholder="Item description" 
                          value={item.description}
                          onChange={e => updateItem(item.id, 'description', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          placeholder="HSN code" 
                          value={item.hsnCode}
                          onChange={e => updateItem(item.id, 'hsnCode', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          min="1" 
                          value={item.quantity}
                          onChange={e => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          value={item.rate}
                          onChange={e => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                        />
                      </TableCell>
                      <TableCell>{item.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Select 
                          value={item.taxRate.toString()} 
                          onValueChange={value => updateItem(item.id, 'taxRate', parseFloat(value))}
                        >
                          <SelectTrigger className="w-[70px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">0%</SelectItem>
                            <SelectItem value="5">5%</SelectItem>
                            <SelectItem value="12">12%</SelectItem>
                            <SelectItem value="18">18%</SelectItem>
                            <SelectItem value="28">28%</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      {!isInterstate ? (
                        <>
                          <TableCell>{item.cgst.toFixed(2)}</TableCell>
                          <TableCell>{item.sgst.toFixed(2)}</TableCell>
                        </>
                      ) : (
                        <TableCell>{item.igst.toFixed(2)}</TableCell>
                      )}
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700 hover:bg-red-100"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <Button variant="outline" size="sm" className="mt-4" onClick={addItem}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
            
            <div className="mt-6 flex justify-end">
              <div className="w-full md:w-72 space-y-2 border p-4 rounded-lg bg-orange-50/50 dark:bg-gray-800/50">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹ {totals.subtotal}</span>
                </div>
                
                {applyDiscount && parseFloat(totals.discount) > 0 && (
                  <div className="flex justify-between text-orange-600">
                    <span>Discount:</span>
                    <span>- ₹ {totals.discount}</span>
                  </div>
                )}
                
                <div className="flex justify-between font-medium">
                  <span>Taxable Amount:</span>
                  <span>₹ {totals.taxableAmount}</span>
                </div>
                
                {!isInterstate ? (
                  <>
                    <div className="flex justify-between">
                      <span>CGST:</span>
                      <span>₹ {totals.cgst}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SGST:</span>
                      <span>₹ {totals.sgst}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between">
                    <span>IGST:</span>
                    <span>₹ {totals.igst}</span>
                  </div>
                )}
                
                {applyShipping && parseFloat(totals.shipping) > 0 && (
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>₹ {totals.shipping}</span>
                  </div>
                )}
                
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Total:</span>
                  <span>₹ {totals.total}</span>
                </div>
                
                <div className="text-xs italic pt-1">
                  {totals.totalInWords}
                </div>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="text-md font-medium">Notes</h3>
                <Textarea
                  placeholder="Additional notes for the invoice"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                />
                
                <h3 className="text-md font-medium">Terms & Conditions</h3>
                <Textarea
                  placeholder="Terms and conditions"
                  value={termsAndConditions}
                  onChange={e => setTermsAndConditions(e.target.value)}
                  rows={4}
                />
              </div>
              
              <div className="flex flex-col justify-end space-y-4">
                <Button 
                  className="w-full bg-emerald-600 hover:bg-emerald-700" 
                  onClick={handleGenerateInvoice}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Generate Invoice
                </Button>
                
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handleDownload}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handlePrint}
                  >
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleShare}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
                
                <Button
                  variant="outline"
                  className="border-orange-200 text-orange-700 hover:bg-orange-50"
                  onClick={handleSaveTemplate}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save as Template
                </Button>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="border-t pt-6 flex justify-between">
            <Button variant="ghost" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <div className="text-xs text-muted-foreground">
              GST Invoice Generator
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="templates">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Templates</CardTitle>
            <CardDescription>Load or manage your saved invoice templates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {templates.map(template => (
                <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {template.type === "regular" ? "Regular Invoice" : 
                       template.type === "export" ? "Export Invoice" : "Bill of Supply"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm">Tax: {template.taxType === "igst" ? "IGST" : "CGST+SGST"}</p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full"
                      onClick={() => loadTemplate(template.id)}
                    >
                      Load Template
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="saved">
        <Card>
          <CardHeader>
            <CardTitle>Saved Invoices</CardTitle>
            <CardDescription>View and manage your saved invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {savedInvoices.map(invoice => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.number}</TableCell>
                    <TableCell>{invoice.customerName}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>₹ {invoice.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                        invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default GSTInvoice;

