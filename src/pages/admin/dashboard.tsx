
import React, { useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Users, Building, DollarSign, Activity, Loader2 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getAdminDashboardStats } from "@/redux/features/dashboard/dashboardSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";

const AdminDashboard = () => {
  const dispatch = useAppDispatch();
  const { adminStats: stats, isLoading } = useAppSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    dispatch(getAdminDashboardStats());
  }, [dispatch]);

  const formatChartData = (data: any[] = []) => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const sortedData = [...data].sort((a, b) => a._id.localeCompare(b._id));
    return sortedData.map((item) => {
      const monthIndex = parseInt(item._id.split("-")[1], 10) - 1;
      return { name: monthNames[monthIndex], total: item.total };
    });
  };

  if (isLoading || !stats) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const chartData = formatChartData(stats.monthlyRevenue || []);

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{(stats.totalSalesValue || 0).toLocaleString("en-IN")}
            </div>
            <p className="text-xs text-muted-foreground">
              Total revenue generated
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats.totalUsers || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Across all roles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Listed Properties
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats.totalProperties || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Live on the platform
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats.activeLeads || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently being tracked
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${Number(value) / 100000}L`}
                />
                <Tooltip
                  formatter={(value: number) =>
                    `₹${value.toLocaleString("en-IN")}`
                  }
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Sales Revenue"
                  stroke="hsl(var(--primary))"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>
              Last {(stats.recentSales || []).length} transactions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(stats.recentSales || []).map((sale) => (
                  <TableRow key={sale._id}>
                    <TableCell>
                      <div className="font-medium">{sale.buyer.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {sale.buyer.email}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{(sale.salePrice || 0).toLocaleString("en-IN")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default AdminDashboard;
