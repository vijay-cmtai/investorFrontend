import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CSVLink } from "react-csv";
import {
  MoreHorizontal,
  Loader2,
  PlusCircle,
  File,
  Search,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  getProperties,
  deleteProperty,
  approveProperty,
  reset,
  Property,
} from "@/redux/features/properties/propertySlice";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EditPropertyModal from "@/components/admin/EditPropertyModal"; // Naya modal import karein

const ManageProperties = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { properties, isLoading } = useAppSelector((state) => state.properties);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );

  useEffect(() => {
    dispatch(getProperties());
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  const filteredProperties = useMemo(() => {
    let props = properties;
    if (activeTab !== "all") {
      props = props.filter((p) => p.status.toLowerCase() === activeTab);
    }
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      props = props.filter(
        (p) =>
          p.title.toLowerCase().includes(lowercasedQuery) ||
          p.user?.name?.toLowerCase().includes(lowercasedQuery)
      );
    }
    return props;
  }, [properties, activeTab, searchQuery]);

  const csvData = filteredProperties.map((prop) => ({
    _id: prop._id,
    title: prop.title,
    price: prop.price,
    status: prop.status,
    uploadedBy: prop.user?.name || "N/A",
    city: prop.location?.city || "N/A",
  }));

  const handleOpenEditModal = (property: Property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteProperty(id))
        .unwrap()
        .then(() => toast.success("Property deleted."))
        .catch((error) => toast.error(error || "Failed to delete property."));
    }
  };

  const handleApprove = (id: string) => {
    dispatch(approveProperty(id))
      .unwrap()
      .then(() => toast.success("Property approved."))
      .catch((error) => toast.error(error || "Failed to approve property."));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search properties..."
                className="pl-8 sm:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <CSVLink data={csvData} filename={`properties_${activeTab}.csv`}>
              <Button size="sm" variant="outline" className="h-9 gap-1">
                <File className="h-3.5 w-3.5" />
                <span>Export</span>
              </Button>
            </CSVLink>
            <Button
              size="sm"
              className="h-9 gap-1"
              onClick={() => navigate("/admin/properties/add")}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Add Property</span>
            </Button>
          </div>
        </div>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Properties</CardTitle>
            <CardDescription>
              Manage your properties and view their sales performance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[80px] sm:table-cell">
                    <span className="sr-only">Image</span>
                  </TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Price</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Uploaded By
                  </TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && properties.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                    </TableCell>
                  </TableRow>
                ) : filteredProperties.length > 0 ? (
                  filteredProperties.map((prop) => (
                    <TableRow key={prop._id}>
                      <TableCell className="hidden sm:table-cell">
                        <img
                          alt="Property"
                          className="aspect-square rounded-md object-cover"
                          height="64"
                          src={prop.images?.[0] || "/placeholder.svg"}
                          width="64"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {prop.title}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusBadge(prop.status)}
                        >
                          {prop.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                          maximumFractionDigits: 0,
                        }).format(prop.price)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={`https://avatar.iran.liara.run/public/boy?username=${prop.user?.email}`}
                            />
                            <AvatarFallback>
                              {prop.user?.name?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <span>{prop.user?.name || "N/A"}</span>
                        </div>
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
                            {prop.status === "Pending" && (
                              <DropdownMenuItem
                                onSelect={() => handleApprove(prop._id)}
                              >
                                Approve
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleOpenEditModal(prop)}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-500"
                              onSelect={() => handleDelete(prop._id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No properties found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing <strong>{filteredProperties.length}</strong> properties
            </div>
          </CardFooter>
        </Card>
      </Tabs>
      <EditPropertyModal
        property={selectedProperty}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default ManageProperties;
