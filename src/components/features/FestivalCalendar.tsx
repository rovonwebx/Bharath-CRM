
import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";

type Festival = {
  name: string;
  date: string;
  description: string;
  type: "national" | "regional" | "religious" | "corporate";
};

const currentYear = new Date().getFullYear();

// Sample Indian festivals data (would be dynamic in production)
const festivals: Festival[] = [
  {
    name: "Diwali",
    date: `${currentYear}-11-12`,
    description: "Festival of lights celebrating the victory of light over darkness",
    type: "national"
  },
  {
    name: "Holi",
    date: `${currentYear}-03-25`,
    description: "Festival of colors celebrating the arrival of spring",
    type: "national"
  },
  {
    name: "Republic Day",
    date: `${currentYear}-01-26`,
    description: "National holiday celebrating the adoption of the Constitution",
    type: "national"
  },
  {
    name: "Independence Day",
    date: `${currentYear}-08-15`,
    description: "National holiday celebrating India's independence",
    type: "national"
  },
  {
    name: "Navratri",
    date: `${currentYear}-10-03`,
    description: "Nine nights dedicated to Goddess Durga",
    type: "religious"
  },
  {
    name: "Ganesh Chaturthi",
    date: `${currentYear}-09-07`,
    description: "Festival honoring Lord Ganesha",
    type: "religious"
  },
  {
    name: "Onam",
    date: `${currentYear}-09-10`,
    description: "Harvest festival celebrated in Kerala",
    type: "regional"
  },
  {
    name: "Pongal",
    date: `${currentYear}-01-15`,
    description: "Harvest festival celebrated in Tamil Nadu",
    type: "regional"
  },
  {
    name: "Fiscal Year End",
    date: `${currentYear}-03-31`,
    description: "End of financial year in India",
    type: "corporate"
  },
  {
    name: "GST Filing Deadline",
    date: `${currentYear}-07-20`,
    description: "Last date for quarterly GST returns",
    type: "corporate"
  }
];

const FestivalCalendar = () => {
  const { toast } = useToast();
  const [upcomingFestivals, setUpcomingFestivals] = useState<Festival[]>([]);
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    const today = new Date();
    const nextThreeMonths = new Date(today);
    nextThreeMonths.setMonth(today.getMonth() + 3);
    
    const upcoming = festivals.filter(festival => {
      const festivalDate = new Date(festival.date);
      return festivalDate >= today && festivalDate <= nextThreeMonths;
    });
    
    upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setUpcomingFestivals(upcoming);
  }, []);

  const getTypeColor = (type: string) => {
    switch(type) {
      case "national": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100";
      case "religious": return "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-100";
      case "regional": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100";
      case "corporate": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100";
    }
  };

  const createCampaign = (festival: Festival) => {
    toast({
      title: "Campaign Created",
      description: `${festival.name} campaign has been set up`,
    });
  };

  const filteredFestivals = filterType === "all" 
    ? upcomingFestivals 
    : upcomingFestivals.filter(festival => festival.type === filterType);

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="bg-gradient-to-r from-orange-100 to-emerald-100 dark:from-orange-900/20 dark:to-emerald-900/20">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <span>Festival Calendar</span>
            </CardTitle>
            <CardDescription>Upcoming festivals and important dates</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setFilterType("all")}
              className={filterType === "all" ? "bg-orange-100 dark:bg-orange-900/40" : ""}
            >
              All
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setFilterType("corporate")}
              className={filterType === "corporate" ? "bg-orange-100 dark:bg-orange-900/40" : ""}
            >
              Business
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {filteredFestivals.length > 0 ? (
          <div className="space-y-4">
            {filteredFestivals.map((festival, index) => (
              <div key={index} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{festival.name}</span>
                    <Badge className={getTypeColor(festival.type)}>
                      {festival.type}
                    </Badge>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-64">{festival.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(festival.date).toLocaleDateString("en-IN", { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-xs"
                  onClick={() => createCampaign(festival)}
                >
                  Create Campaign
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            No upcoming festivals in the selected category
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FestivalCalendar;
