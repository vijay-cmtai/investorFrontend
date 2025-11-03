import React, { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { CSVLink } from "react-csv";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  getCommissions,
  updateCommissionStatus,
} from "@/redux/features/commissions/commissionSlice";
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
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Loader2, File, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CommissionManagement = () => {
  const dispatch = useAppDispatch();
  const { commissions, isLoading } = useAppSelector(
    (state) => state.commissions
  );

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(getCommissions());
  }, [dispatch]);

  const filteredCommissions = useMemo(() => {
    let items = commissions;
    if (activeTab !== "all") {
      items = items.filter((c) => c.status.toLowerCase() === activeTab);
    }
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      items = items.filter(
        (c) =>
          c.user?.name.toLowerCase().includes(lowercasedQuery) ||
          c.sale?.property?.title.toLowerCase().includes(lowercasedQuery)
      );
    }
    return items;
  }, [commissions, activeTab, searchQuery]);

  const handleStatusUpdate = (
    id: string,
    status: "Paid" | "Pending" | "Cancelled"
  ) => {
    dispatch(updateCommissionStatus({ id, status }))
      .unwrap()
      .then(() => toast.success(`Commission marked as ${status}.`))
      .catch((error) => toast.error(error));
  };

  const getStatusBadge = (status: string) => {
    const statuses: { [key: string]: string } = {
      Paid: "bg-green-100 text-green-800",
      Pending: "bg-yellow-100 text-yellow-800",
      Cancelled: "bg-red-100 text-red-800",
    };
    return statuses[status] || "bg-gray-100 text-gray-800";
  };

  const csvData = filteredCommissions.map((c) => ({
    associateName: c.user?.name,
    propertyTitle: c.sale?.property?.title,
    amount: c.amount,
    status: c.status,
    date: format(new Date(c.createdAt), "yyyy-MM-dd"),
  }));
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div>
            <CardTitle>Commission Management</CardTitle>
            <CardDescription>
              Track, manage, and process all associate commissions.
            </CardDescription>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by associate or property..."
                className="pl-8 sm:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <CSVLink data={csvData} filename="commissions.csv">
              <Button size="sm" variant="outline" className="h-9 gap-1">
                <File className="h-3.5 w-3.5" />
                <span>Export</span>
              </Button>
            </CSVLink>
          </div>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Associate</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && commissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                </TableCell>
              </TableRow>
            ) : filteredCommissions.length > 0 ? (
              filteredCommissions.map((c) => (
                <TableRow key={c._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={`https://avatar.iran.liara.run/public/boy?username=${c.user?.email}`}
                        />
                        <AvatarFallback>
                          {c.user?.name?.charAt(0) || "A"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{c.user?.name || "N/A"}</div>
                    </div>
                  </TableCell>
                  <TableCell>{c.sale?.property?.title || "N/A"}</TableCell>
                  <TableCell>₹{c.amount.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getStatusBadge(c.status)}
                    >
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          disabled={c.status === "Paid"}
                          onSelect={() => handleStatusUpdate(c._id, "Paid")}
                        >
                          Mark as Paid
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={c.status === "Cancelled"}
                          onSelect={() =>
                            handleStatusUpdate(c._id, "Cancelled")
                          }
                        >
                          Mark as Cancelled
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No commissions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>{filteredCommissions.length}</strong> commissions
        </div>
      </CardFooter>
    </Card>
  );
};
export default CommissionManagement;
