import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  getCompanyDashboardStats,
  // getRecentProperties aur getRecentLeads ko yahan se hata diya gaya hai
} from "@/redux/features/dashboard/dashboardSlice";
import {
  Building2,
  Users,
  TrendingUp,
  FileText,
  Loader2,
  MoreHorizontal,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) => (
  <Card className="hover:border-primary transition-colors">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="text-muted-foreground">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">Updated in real-time</p>
    </CardContent>
  </Card>
);

const CompanyDashboard = () => {
  const dispatch = useAppDispatch();

  // recentProperties aur recentLeads abhi bhi state se aayenge, lekin woh hamesha empty rahenge
  const {
    companyStats: stats,
    recentProperties,
    recentLeads,
    isLoading,
  } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(getCompanyDashboardStats());
    // getRecentProperties() aur getRecentLeads() ke dispatch calls hata diye gaye hain
  }, [dispatch]);

  const formatCurrency = (value: number | undefined) => {
    if (typeof value !== "number") return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Sold":
        return "border-red-500/50 bg-red-500/10 text-red-700";
      case "Approved":
        return "border-green-500/50 bg-green-500/10 text-green-700";
      case "Pending":
        return "border-yellow-500/50 bg-yellow-500/10 text-yellow-700";
      default:
        return "border-gray-500/50 bg-gray-500/10 text-gray-700";
    }
  };

  if (isLoading && !stats) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome back 👋</h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your properties and leads today.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="My Properties"
          value={(stats?.totalProperties ?? 0).toString()}
          icon={<Building2 className="h-4 w-4" />}
        />
        <StatCard
          title="My Sales (This Month)"
          value={formatCurrency(stats?.totalSalesMonth)}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard
          title="New Leads (This Month)"
          value={(stats?.newLeadsMonth ?? 0).toString()}
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          title="Reports Generated"
          value={(stats?.reportsGenerated ?? 0).toString()}
          icon={<FileText className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>My Recent Properties</CardTitle>
            <CardDescription>
              The last 5 properties you've listed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Location
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Price</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentProperties && recentProperties.length > 0 ? (
                  recentProperties.map((prop) => (
                    <TableRow key={prop._id}>
                      <TableCell>
                        <div className="font-medium">{prop.title}</div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {prop.location.city}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatCurrency(prop.price)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className={getStatusBadge(prop.status)}>
                          {prop.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      Data not available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Recent Leads</CardTitle>
            <CardDescription>Your 5 most recent leads.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {recentLeads && recentLeads.length > 0 ? (
              recentLeads.map((lead) => (
                <div
                  key={lead._id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={`https://avatar.iran.liara.run/public/boy?username=${lead.customerName}`}
                      />
                      <AvatarFallback>
                        {lead.customerName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">
                        {lead.customerName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Interested in: {lead.property?.title ?? "N/A"}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Mark as Contacted</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-48">
                <p className="text-sm text-muted-foreground">
                  Data not available.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompanyDashboard;
