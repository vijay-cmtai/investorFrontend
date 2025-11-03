import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  getPropertyReports,
  getLeadPerformanceReport,
  getSalesPerformanceReport,
} from "@/redux/features/reports/reportsSlice";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Loader2 } from "lucide-react";

// Property Report Chart Component
const PropertyReportChart = () => {
  const { propertyReports, isLoading } = useAppSelector(
    (state) => state.reports
  );

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={propertyReports}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={(value) => `₹${value}L`} />
        <Tooltip
          formatter={(value, name) =>
            name === "Avg. Price (in Lakhs)" ? `₹${value} Lakhs` : value
          }
        />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" name="Properties in City" />
        <Bar
          dataKey="averagePrice"
          fill="#82ca9d"
          name="Avg. Price (in Lakhs)"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Lead Performance Chart Component
const LeadPerformanceChart = () => {
  const { leadPerformance, isLoading } = useAppSelector(
    (state) => state.reports
  );
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={leadPerformance}
          dataKey="count"
          nameKey="_id"
          cx="50%"
          cy="50%"
          outerRadius={150}
          fill="#8884d8"
          label
        >
          {leadPerformance.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};
const Reports = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getPropertyReports());
    dispatch(getLeadPerformanceReport());
    dispatch(getSalesPerformanceReport());
  }, [dispatch]);
  return (
    <Tabs defaultValue="properties">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Analytics & Reports
          </h1>
          <p className="text-muted-foreground">
            Detailed insights into your platform's performance.
          </p>
        </div>
        <TabsList>
          <TabsTrigger value="properties">By Location</TabsTrigger>
          <TabsTrigger value="leads">Lead Performance</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="properties">
        <Card>
          <CardHeader>
            <CardTitle>Property Distribution by City</CardTitle>
            <CardDescription>
              Count of properties and their average price in Lakhs across
              different cities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PropertyReportChart />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="leads">
        <Card>
          <CardHeader>
            <CardTitle>Lead Performance</CardTitle>
            <CardDescription>
              A breakdown of all leads by their current status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LeadPerformanceChart />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="sales">
        <Card>
          <CardHeader>
            <CardTitle>Sales Performance</CardTitle>
            <CardDescription>
              Monthly sales revenue and number of deals closed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground py-20">
              Sales Performance chart will be displayed here.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default Reports;
