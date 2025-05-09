
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Plus, 
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Users,
  Calendar
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

// Mock email campaign data
const campaigns = [
  {
    id: 1,
    name: "Summer Sale Announcement",
    subject: "Don't Miss Our Summer Sale - Up to 50% Off!",
    audience: "All Customers",
    recipients: 3245,
    openRate: "32%",
    clickRate: "12%",
    sentDate: "2023-06-15",
    status: "sent"
  },
  {
    id: 2,
    name: "New Product Launch",
    subject: "Introducing Our Latest Products - Check Them Out!",
    audience: "Previous Customers",
    recipients: 2189,
    openRate: "41%",
    clickRate: "18%",
    sentDate: "2023-07-22",
    status: "sent"
  },
  {
    id: 3,
    name: "Customer Feedback Request",
    subject: "We Value Your Opinion - Take Our 2-Minute Survey",
    audience: "Recent Customers",
    recipients: 1567,
    openRate: "28%",
    clickRate: "9%",
    sentDate: "2023-08-10",
    status: "sent"
  },
  {
    id: 4,
    name: "Holiday Season Preview",
    subject: "Get Ready for the Holidays with These Special Offers",
    audience: "All Customers",
    recipients: 3245,
    openRate: "-",
    clickRate: "-",
    sentDate: "-",
    status: "draft"
  },
  {
    id: 5,
    name: "Abandoned Cart Recovery",
    subject: "Don't Forget Your Items - Complete Your Purchase Today",
    audience: "Cart Abandoners",
    recipients: 873,
    openRate: "45%",
    clickRate: "22%",
    sentDate: "2023-09-05",
    status: "sent"
  },
  {
    id: 6,
    name: "Black Friday Preview",
    subject: "Early Access to Black Friday Deals",
    audience: "VIP Customers",
    recipients: 520,
    openRate: "-",
    clickRate: "-",
    sentDate: "2023-11-20",
    status: "scheduled"
  }
];

const EmailCampaigns = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Sent</Badge>;
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Draft</Badge>;
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Scheduled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Email Campaigns</h2>
        <Button className="h-9">
          <Plus className="mr-2 h-4 w-4" />
          Create Campaign
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              <Mail className="h-4 w-4 text-muted-foreground inline mr-2" />
              Total Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground mt-1">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              <Users className="h-4 w-4 text-muted-foreground inline mr-2" />
              Total Recipients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">11,639</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all campaigns
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              <Calendar className="h-4 w-4 text-muted-foreground inline mr-2" />
              Scheduled Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground mt-1">
              For the upcoming month
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Campaign Management</CardTitle>
          <CardDescription>
            Create, send, and track email campaigns to engage with your customers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Audience</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Open Rate</TableHead>
                  <TableHead>Click Rate</TableHead>
                  <TableHead>Sent Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>{campaign.subject}</TableCell>
                    <TableCell>{campaign.audience}</TableCell>
                    <TableCell>{campaign.recipients}</TableCell>
                    <TableCell>{campaign.openRate}</TableCell>
                    <TableCell>{campaign.clickRate}</TableCell>
                    <TableCell>{campaign.sentDate}</TableCell>
                    <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Campaign
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Campaign
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Test Email
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Campaign
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailCampaigns;
