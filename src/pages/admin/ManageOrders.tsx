import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
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
import { MoreHorizontal, File } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Order = {
  orderId: string;
  propertyTitle: string;
  customerName: string;
  orderDate: string;
  amount: number;
  status: "Pending" | "Completed" | "Cancelled";
};

const ManageOrders = () => {
  const orders: Order[] = [
    {
      orderId: "ORD-001",
      propertyTitle: "Luxury Villa in Mumbai",
      customerName: "Rohan Sharma",
      orderDate: "2024-03-10",
      amount: 50000000,
      status: "Completed",
    },
    {
      orderId: "ORD-002",
      propertyTitle: "2BHK Apartment in Delhi",
      customerName: "Priya Verma",
      orderDate: "2024-03-12",
      amount: 12000000,
      status: "Pending",
    },
    {
      orderId: "ORD-003",
      propertyTitle: "Office Space in Pune",
      customerName: "Amit Singh",
      orderDate: "2024-02-25",
      amount: 80000,
      status: "Cancelled",
    },
    {
      orderId: "ORD-004",
      propertyTitle: "Sea View Apartment",
      customerName: "Sneha Reddy",
      orderDate: "2024-03-15",
      amount: 25000000,
      status: "Pending",
    },
  ];

  const getStatusBadgeClass = (status: Order["status"]) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Manage Orders & Deals</CardTitle>
          <CardDescription>
            Track and manage all property transactions.
          </CardDescription>
        </div>
        <Button size="sm" variant="outline" className="gap-1">
          <File className="h-3.5 w-3.5" />
          <span>Export</span>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.orderId}>
                <TableCell className="font-medium">{order.orderId}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.propertyTitle}</TableCell>
                <TableCell>{order.orderDate}</TableCell>
                <TableCell className="text-right">
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  }).format(order.amount)}
                </TableCell>
                <TableCell className="text-center">
                  <Badge className={getStatusBadgeClass(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Approve Order</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Cancel Order
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-10</strong> of <strong>32</strong> orders
        </div>
      </CardFooter>
    </Card>
  );
};

export default ManageOrders;
