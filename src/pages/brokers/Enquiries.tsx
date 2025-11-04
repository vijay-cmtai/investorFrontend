import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  getMyReceivedInquiries,
  updateInquiryStatus,
  reset,
} from "@/redux/features/inquiries/inquirySlice";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Loader2, Mail } from "lucide-react";

const Enquiries = () => {
  const dispatch = useAppDispatch();

  // === YAHAN PAR BADLAV KIYA GAYA HAI ===
  // state.inquiry se state.inquiries kar diya gaya hai
  const { received: inquiries, isLoading } = useAppSelector(
    (state) => state.inquiries
  );

  useEffect(() => {
    dispatch(getMyReceivedInquiries());
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  const handleStatusUpdate = (id: string, status: string) => {
    dispatch(updateInquiryStatus({ id, status }))
      .unwrap()
      .then(() => toast.success(`Inquiry status updated to "${status}".`))
      .catch((err) => toast.error(err.message || "Failed to update status."));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return "border-yellow-500/50 bg-yellow-500/10 text-yellow-700";
      case "Contacted":
        return "border-blue-500/50 bg-blue-500/10 text-blue-700";
      case "In Progress":
        return "border-purple-500/50 bg-purple-500/10 text-purple-700";
      case "Resolved":
        return "border-green-500/50 bg-green-500/10 text-green-700";
      case "Closed":
        return "border-gray-500/50 bg-gray-500/10 text-gray-700";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const statusOptions = [
    "Pending",
    "Contacted",
    "In Progress",
    "Resolved",
    "Closed",
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Enquiries</CardTitle>
        <CardDescription>
          Here are the inquiries received for your properties. Respond to leads
          to close deals.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && inquiries.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : inquiries.length === 0 ? (
          <div className="text-center py-16">
            <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No Enquiries Yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              When customers inquire about your properties, they will appear
              here.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden sm:table-cell">Property</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.map((inquiry) => (
                <TableRow key={inquiry._id}>
                  <TableCell>
                    <div className="font-medium">{inquiry.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {inquiry.email}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {inquiry.property?.title || "N/A"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(inquiry.status)}>
                      {inquiry.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {statusOptions.map((status) => (
                          <DropdownMenuItem
                            key={status}
                            disabled={inquiry.status === status}
                            onSelect={() =>
                              handleStatusUpdate(inquiry._id, status)
                            }
                          >
                            Mark as {status}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default Enquiries;
