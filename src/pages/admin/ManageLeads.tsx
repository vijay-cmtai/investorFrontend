import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  getMyReceivedInquiries,
  updateInquiryStatus,
  deleteInquiry,
} from "@/redux/features/inquiries/inquirySlice";
import { format } from "date-fns";
import { toast } from "sonner";

// UI कंपोनेंट्स
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
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Loader2, Inbox } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// Inquiry का टाइप, ताकि TypeScript में कोई एरर न आए
interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  property?: { title: string };
  createdAt: string;
  status: "Pending" | "Contacted" | "Resolved";
}

const ManageLeads = () => {
  const dispatch = useAppDispatch();
  const { received: leads, isLoading } = useAppSelector(
    (state) => state.inquiries
  );

  // --- Modal के लिए State ---
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Inquiry | null>(null);

  useEffect(() => {
    dispatch(getMyReceivedInquiries());
  }, [dispatch]);

  // --- हैंडलर फंक्शन्स ---
  const handleStatusChange = (id: string, status: string) => {
    dispatch(updateInquiryStatus({ id, status }))
      .unwrap()
      .then(() => toast.success(`Status updated to ${status}`))
      .catch((error) => toast.error(error || "Failed to update status"));
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this inquiry?")) {
      dispatch(deleteInquiry(id))
        .unwrap()
        .then(() => toast.success("Inquiry deleted successfully"))
        .catch((error) => toast.error(error || "Failed to delete inquiry"));
    }
  };

  // संदेश देखने के लिए Modal खोलने का फंक्शन
  const handleViewMessage = (lead: Inquiry) => {
    setSelectedLead(lead);
    setIsMessageDialogOpen(true);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Pending":
        return "border-transparent bg-yellow-500 text-primary-foreground hover:bg-yellow-500/80";
      case "Contacted":
        return "border-transparent bg-blue-500 text-primary-foreground hover:bg-blue-500/80";
      case "Resolved":
        return "border-transparent bg-green-500 text-primary-foreground hover:bg-green-500/80";
      default:
        return "border-transparent bg-gray-500 text-primary-foreground hover:bg-gray-500/80";
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="ml-3 text-muted-foreground">Loading leads...</p>
        </div>
      );
    }

    if (!isLoading && (!leads || leads.length === 0)) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Inbox className="h-16 w-16 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No Inquiries Yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            When you receive new inquiries, they will appear here.
          </p>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Property</TableHead>
            <TableHead className="hidden md:table-cell">Sender</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead className="hidden md:table-cell">Received</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead: Inquiry) => (
            <TableRow key={lead._id}>
              <TableCell className="font-medium">
                {lead.property?.title || "N/A"}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {lead.name}
              </TableCell>
              <TableCell>
                <div>{lead.email}</div>
                <div className="text-sm text-muted-foreground">
                  {lead.phone}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {format(new Date(lead.createdAt), "dd MMM, yyyy")}
              </TableCell>
              <TableCell className="text-center">
                <Badge className={getStatusBadgeClass(lead.status)}>
                  {lead.status}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onSelect={() => handleViewMessage(lead)}>
                      View Message
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        Update Status
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          {["Pending", "Contacted", "Resolved"].map(
                            (status) => (
                              <DropdownMenuItem
                                key={status}
                                disabled={lead.status === status}
                                onSelect={() =>
                                  handleStatusChange(lead._id, status)
                                }
                              >
                                {status}
                              </DropdownMenuItem>
                            )
                          )}
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600 focus:bg-red-50"
                      onSelect={() => handleDelete(lead._id)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Manage Leads / Inquiries</CardTitle>
          <CardDescription>
            View and manage all inquiries for your properties.
          </CardDescription>
        </CardHeader>
        <CardContent>{renderContent()}</CardContent>
        {leads && leads.length > 0 && (
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing <strong>{leads.length}</strong> of{" "}
              <strong>{leads.length}</strong> leads.
            </div>
          </CardFooter>
        )}
      </Card>

      {/* --- Message Viewer Dialog --- */}
      {selectedLead && (
        <Dialog
          open={isMessageDialogOpen}
          onOpenChange={setIsMessageDialogOpen}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                Inquiry for "{selectedLead.property?.title || "N/A"}"
              </DialogTitle>
              <DialogDescription>
                From: <strong>{selectedLead.name}</strong> ({selectedLead.email}{" "}
                | {selectedLead.phone})
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <h4 className="font-semibold mb-2">Message:</h4>
              <p className="text-sm text-muted-foreground bg-slate-100 p-4 rounded-md whitespace-pre-wrap">
                {selectedLead.message}
              </p>
            </div>
            <DialogFooter>
              <Button
                type="button"
                onClick={() => setIsMessageDialogOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ManageLeads;
