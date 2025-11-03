import React, { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { CSVLink } from "react-csv";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  getMyReceivedInquiries,
  updateInquiryStatus,
  addNoteToInquiry,
  Inquiry,
} from "@/redux/features/inquiries/inquirySlice";

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
  MessageSquare,
  Phone,
  Mail,
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
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

const CompanyLeads = () => {
  const dispatch = useAppDispatch();
  const { received: allReceivedLeads, isLoading } = useAppSelector(
    (state) => state.inquiries
  );
  const { user } = useAppSelector((state) => state.auth);

  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Inquiry | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    dispatch(getMyReceivedInquiries());
  }, [dispatch]);

  const myLeads = useMemo(() => {
    if (!user) return [];
    return allReceivedLeads.filter((lead) => lead.assignedTo?._id === user.id);
  }, [allReceivedLeads, user]);

  const filteredLeads = useMemo(() => {
    let leads = [...myLeads];

    if (activeTab !== "all") {
      leads = leads.filter(
        (lead) => lead.status.toLowerCase() === activeTab.toLowerCase()
      );
    }

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      leads = leads.filter(
        (lead) =>
          lead.name.toLowerCase().includes(lowercasedQuery) ||
          lead.email.toLowerCase().includes(lowercasedQuery) ||
          lead.property?.title?.toLowerCase().includes(lowercasedQuery)
      );
    }

    return leads;
  }, [myLeads, activeTab, searchQuery]);

  const statusCounts = useMemo(() => {
    return {
      all: myLeads.length,
      assigned: myLeads.filter((l) => l.status === "Assigned").length,
      "in progress": myLeads.filter((l) => l.status === "In Progress").length,
      contacted: myLeads.filter((l) => l.status === "Contacted").length,
      resolved: myLeads.filter((l) => l.status === "Resolved").length,
    };
  }, [myLeads]);

  const csvHeaders = [
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phone" },
    { label: "Property", key: "property" },
    { label: "Status", key: "status" },
    { label: "Priority", key: "priority" },
    { label: "Assigned Date", key: "assignedDate" },
  ];

  const csvData = filteredLeads.map((lead) => ({
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    property: lead.property?.title || "N/A",
    status: lead.status,
    priority: lead.priority,
    assignedDate: lead.assignedAt
      ? format(new Date(lead.assignedAt), "yyyy-MM-dd")
      : "N/A",
  }));

  const handleStatusChange = (id: string, status: Inquiry["status"]) => {
    dispatch(updateInquiryStatus({ id, status }))
      .unwrap()
      .then(() => toast.success(`Status updated to ${status}`))
      .catch((error) => toast.error(error || "Failed to update status"));
  };

  const handleViewDetails = (lead: Inquiry) => {
    setSelectedLead(lead);
    setIsDetailsDialogOpen(true);
  };

  const handleOpenNotesDialog = (lead: Inquiry) => {
    setSelectedLead(lead);
    setNoteText("");
    setIsNotesDialogOpen(true);
  };

  const handleAddNote = () => {
    if (!selectedLead || !noteText.trim()) {
      toast.error("Please enter a note");
      return;
    }

    dispatch(addNoteToInquiry({ id: selectedLead._id, note: noteText }))
      .unwrap()
      .then(() => {
        toast.success("Note added successfully");
        setNoteText("");
      })
      .catch((error) => toast.error(error || "Failed to add note"));
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Assigned":
        return "bg-purple-100 text-purple-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Contacted":
        return "bg-cyan-100 text-cyan-800";
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
        return "bg-red-100 text-red-800";
      case "High":
        return "bg-orange-100 text-orange-800";
      case "Medium":
        return "bg-blue-100 text-blue-800";
      case "Low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center mb-6 gap-4">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full sm:w-auto"
        >
          <TabsList>
            <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
            <TabsTrigger value="assigned">
              Assigned ({statusCounts.assigned})
            </TabsTrigger>
            <TabsTrigger value="in progress">
              In Progress ({statusCounts["in progress"]})
            </TabsTrigger>
            <TabsTrigger value="contacted">
              Contacted ({statusCounts.contacted})
            </TabsTrigger>
            <TabsTrigger value="resolved">
              Resolved ({statusCounts.resolved})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="ml-auto flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search leads..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <CSVLink
            data={csvData}
            headers={csvHeaders}
            filename={`my_leads_${activeTab}_${new Date().toISOString().slice(0, 10)}.csv`}
          >
            <Button size="sm" variant="outline" className="h-9 gap-1">
              <File className="h-3.5 w-3.5" />
              <span>Export</span>
            </Button>
          </CSVLink>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Assigned Leads</CardTitle>
          <CardDescription>
            Manage and track leads assigned to you by the admin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && myLeads.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Inbox className="h-16 w-16 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No Leads Found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search query."
                  : "No leads have been assigned to you yet."}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Priority
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Assigned Date
                  </TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={`https://avatar.iran.liara.run/public/boy?username=${lead.email}`}
                          />
                          <AvatarFallback>{lead.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{lead.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Mail className="h-3 w-3" />
                            {lead.email}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Phone className="h-3 w-3" />
                            {lead.phone}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {lead.property?.title || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge
                        variant="outline"
                        className={getPriorityBadgeClass(lead.priority)}
                      >
                        {lead.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {lead.assignedAt
                        ? format(new Date(lead.assignedAt), "dd MMM, yyyy")
                        : "N/A"}
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
                          <DropdownMenuItem
                            onSelect={() => handleViewDetails(lead)}
                          >
                            View Full Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => handleOpenNotesDialog(lead)}
                          >
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Activity & Notes ({lead.notes?.length || 0})
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              Update Status
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                {(
                                  [
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
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        {filteredLeads.length > 0 && (
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing <strong>{filteredLeads.length}</strong> assigned leads.
            </div>
          </CardFooter>
        )}
      </Card>
      {selectedLead && (
        <Dialog
          open={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
        >
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedLead.name}'s Details</DialogTitle>
              <DialogDescription>
                Complete information about this lead
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Phone</Label>
                  <p className="font-medium">{selectedLead.phone}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{selectedLead.email}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">
                    Interested Property
                  </Label>
                  <p className="font-medium">
                    {selectedLead.property?.title || "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <p>
                    <Badge
                      variant="outline"
                      className={getStatusBadgeClass(selectedLead.status)}
                    >
                      {selectedLead.status}
                    </Badge>
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Priority</Label>
                  <p>
                    <Badge
                      variant="outline"
                      className={getPriorityBadgeClass(selectedLead.priority)}
                    >
                      {selectedLead.priority}
                    </Badge>
                  </p>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">
                    Assigned By (Admin)
                  </Label>
                  <p className="font-medium">
                    {selectedLead.assignedBy?.name || "N/A"}
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">
                  Customer Message
                </Label>
                <p className="text-sm bg-slate-100 p-3 rounded-md mt-2 whitespace-pre-wrap">
                  {selectedLead.message}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsDetailsDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {selectedLead && (
        <Dialog open={isNotesDialogOpen} onOpenChange={setIsNotesDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Activity & Notes</DialogTitle>
              <DialogDescription>
                Lead: {selectedLead.name} | Property:{" "}
                {selectedLead.property?.title}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Add New Note / Update</Label>
                <div className="mt-2">
                  <Textarea
                    placeholder="E.g., 'Called customer at 2 PM, scheduled site visit for tomorrow'"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    rows={3}
                  />
                </div>
                <Button
                  onClick={handleAddNote}
                  size="sm"
                  className="mt-2"
                  disabled={!noteText.trim()}
                >
                  Add Note
                </Button>
              </div>
              <div>
                <Label>Activity History</Label>
                <ScrollArea className="h-[350px] mt-2 rounded-md border p-4">
                  {selectedLead.notes && selectedLead.notes.length > 0 ? (
                    <div className="space-y-4">
                      {selectedLead.notes.map((note) => (
                        <div
                          key={note._id}
                          className="bg-slate-50 p-4 rounded-md border"
                        >
                          <div className="flex items-start gap-3 mb-2">
                            <Avatar className="h-8 w-8">
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
                      No activity yet. Add your first update above.
                    </p>
                  )}
                </ScrollArea>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsNotesDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default CompanyLeads;
