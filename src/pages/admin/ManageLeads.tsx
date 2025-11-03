import React, { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { CSVLink } from "react-csv";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import {
  getMyReceivedInquiries,
  getMySentInquiries,
  updateInquiryStatus,
  deleteInquiry,
  assignInquiry,
  getEmployeesForAssignment,
  Inquiry,
} from "@/redux/features/inquiries/inquirySlice";

// UI Components
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
import {
  MoreHorizontal,
  Loader2,
  Inbox,
  Search,
  File,
  UserPlus,
  MessageSquare,
} from "lucide-react";
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

const ManageLeads = () => {
  const dispatch = useAppDispatch();
  const {
    received: receivedLeads,
    sent: sentLeads,
    employees,
    isLoading,
  } = useAppSelector((state) => state.inquiries);

  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Inquiry | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("received");

  useEffect(() => {
    if (activeTab === "received") {
      dispatch(getMyReceivedInquiries());
      dispatch(getEmployeesForAssignment());
    } else {
      dispatch(getMySentInquiries());
    }
  }, [dispatch, activeTab]);

  const leadsToDisplay = useMemo(() => {
    const leads = activeTab === "received" ? receivedLeads : sentLeads;
    if (!searchQuery) return leads;
    const lowercasedQuery = searchQuery.toLowerCase();
    return leads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(lowercasedQuery) ||
        lead.email.toLowerCase().includes(lowercasedQuery) ||
        lead.property?.title?.toLowerCase().includes(lowercasedQuery)
    );
  }, [receivedLeads, sentLeads, activeTab, searchQuery]);

  const csvHeaders = [
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phone" },
    { label: "Property", key: "property" },
    { label: "Status", key: "status" },
    { label: "Priority", key: "priority" },
    { label: "Assigned To", key: "assignedTo" },
    { label: "Date", key: "date" },
  ];

  const csvData = leadsToDisplay.map((lead) => ({
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    property: lead.property?.title || "N/A",
    status: lead.status,
    priority: lead.priority,
    assignedTo: lead.assignedTo?.name || "Unassigned",
    date: format(new Date(lead.createdAt), "yyyy-MM-dd"),
  }));

  const handleStatusChange = (id: string, status: Inquiry["status"]) => {
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

  const handleViewDetails = (lead: Inquiry) => {
    setSelectedLead(lead);
    setIsDetailsDialogOpen(true);
  };

  const handleAssignClick = (lead: Inquiry) => {
    setSelectedLead(lead);
    setIsAssignDialogOpen(true);
  };

  const handleAssignSubmit = () => {
    if (!selectedLead || !selectedEmployeeId) {
      toast.error("Please select an employee to assign.");
      return;
    }
    dispatch(
      assignInquiry({ id: selectedLead._id, employeeId: selectedEmployeeId })
    )
      .unwrap()
      .then((updatedInquiry) => {
        toast.success(`Inquiry assigned to ${updatedInquiry.assignedTo?.name}`);
        setIsAssignDialogOpen(false);
        setSelectedEmployeeId("");
      })
      .catch((error) => toast.error(error || "Failed to assign inquiry"));
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Assigned":
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Contacted":
        return "bg-purple-100 text-purple-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      case "Closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-200 text-red-800 border-red-300";
      case "High":
        return "bg-orange-200 text-orange-800 border-orange-300";
      case "Medium":
        return "bg-yellow-200 text-yellow-800 border-yellow-300";
      case "Low":
        return "bg-blue-200 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderContent = (leads: Inquiry[]) => {
    if (isLoading && leads.length === 0) {
      return (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      );
    }
    if (!isLoading && leads.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Inbox className="h-16 w-16 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No Inquiries Found</h3>
        </div>
      );
    }
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{activeTab === "received" ? "From" : "To"}</TableHead>
            <TableHead>Property</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead className="text-center">Priority</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead._id}>
              <TableCell>
                <div className="font-medium">{lead.name}</div>
                <div className="text-sm text-muted-foreground">
                  {lead.email}
                </div>
              </TableCell>
              <TableCell>{lead.property?.title || "N/A"}</TableCell>
              <TableCell>
                {lead.assignedTo ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={`https://avatar.iran.liara.run/public/boy?username=${lead.assignedTo.email}`}
                      />
                      <AvatarFallback>
                        {lead.assignedTo.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{lead.assignedTo.name}</span>
                  </div>
                ) : (
                  <Badge variant="outline">Unassigned</Badge>
                )}
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant="outline"
                  className={getPriorityBadgeClass(lead.priority)}
                >
                  {lead.priority}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant="outline"
                  className={getStatusBadgeClass(lead.status)}
                >
                  {lead.status}
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
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onSelect={() => handleViewDetails(lead)}>
                      <MessageSquare className="mr-2 h-4 w-4" /> View Details &
                      Notes ({lead.notes?.length || 0})
                    </DropdownMenuItem>
                    {activeTab === "received" && (
                      <DropdownMenuItem
                        onSelect={() => handleAssignClick(lead)}
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Assign Inquiry
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        Update Status
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          {(
                            [
                              "Pending",
                              "Assigned",
                              "In Progress",
                              "Contacted",
                              "Resolved",
                              "Closed",
                            ] as const
                          ).map((status) => (
                            <DropdownMenuItem
                              key={status}
                              disabled={lead.status === status}
                              onSelect={() =>
                                handleStatusChange(lead._id, status)
                              }
                            >
                              Set as {status}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
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
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="received">Received</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search inquiries..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <CSVLink
              data={csvData}
              headers={csvHeaders}
              filename={`inquiries_${activeTab}_${new Date().toISOString().slice(0, 10)}.csv`}
            >
              <Button size="sm" variant="outline" className="h-9 gap-1">
                <File className="h-3.5 w-3.5" />
                <span>Export</span>
              </Button>
            </CSVLink>
          </div>
        </div>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Manage Leads / Inquiries</CardTitle>
            <CardDescription>
              View, manage, and assign all inquiries for your properties.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TabsContent value="received">
              {renderContent(leadsToDisplay)}
            </TabsContent>
            <TabsContent value="sent">
              {renderContent(leadsToDisplay)}
            </TabsContent>
          </CardContent>
          {leadsToDisplay && leadsToDisplay.length > 0 && (
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>{leadsToDisplay.length}</strong>{" "}
                {activeTab === "received" ? "received" : "sent"} inquiries.
              </div>
            </CardFooter>
          )}
        </Card>
      </Tabs>

      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          {selectedLead && (
            <>
              <DialogHeader>
                <DialogTitle>Inquiry Details & Activity</DialogTitle>
                <DialogDescription>
                  From: <strong>{selectedLead.name}</strong> for property "
                  {selectedLead.property?.title || "N/A"}"
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label>Original Customer Message</Label>
                  <p className="text-sm bg-slate-100 p-3 rounded-md mt-1 whitespace-pre-wrap">
                    {selectedLead.message}
                  </p>
                </div>
                <div>
                  <Label>Activity History & Notes</Label>
                  <ScrollArea className="h-[300px] mt-1 rounded-md border p-4">
                    {selectedLead.notes && selectedLead.notes.length > 0 ? (
                      <div className="space-y-4">
                        {selectedLead.notes.map((note) => (
                          <div
                            key={note._id}
                            className="bg-slate-50 p-4 rounded-md border"
                          >
                            <div className="flex items-start gap-3 mb-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={`https://avatar.iran.liara.run/public/boy?username=${note.addedBy.email}`}
                                />
                                <AvatarFallback className="text-xs">
                                  {note.addedBy.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">
                                    {note.addedBy.name}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {format(
                                      new Date(note.addedAt),
                                      "dd MMM, yyyy HH:mm"
                                    )}
                                  </span>
                                </div>
                                {note.addedBy.role && (
                                  <span className="text-xs text-muted-foreground">
                                    {note.addedBy.role}
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-gray-700 ml-11">
                              {note.note}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No activity or notes have been added yet.
                      </p>
                    )}
                  </ScrollArea>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  onClick={() => setIsDetailsDialogOpen(false)}
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          {selectedLead && (
            <>
              <DialogHeader>
                <DialogTitle>Assign Inquiry: {selectedLead.name}</DialogTitle>
                <DialogDescription>
                  Select an employee to assign this inquiry to.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Select
                  value={selectedEmployeeId}
                  onValueChange={setSelectedEmployeeId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp._id} value={emp._id}>
                        {emp.name} ({emp.email})
                      </SelectItem>
                    ))}
                    {employees.length === 0 && (
                      <p className="p-4 text-sm text-muted-foreground">
                        No employees found.
                      </p>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAssignDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAssignSubmit}
                  disabled={!selectedEmployeeId}
                >
                  Assign
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ManageLeads;
