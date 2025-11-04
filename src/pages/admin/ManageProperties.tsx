import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  MoreHorizontal,
  Loader2,
  PlusCircle,
  File,
  Search,
  Flame,
  Star,
  CheckCircle,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  getProperties,
  deleteProperty,
  approveProperty,
  reset,
  Property,
  toggleHotDeal,
  toggleFeatured,
  toggleVerified,
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
import EditPropertyModal from "@/components/admin/EditPropertyModal";

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
      props = props.filter((p) =>
        p.title.toLowerCase().includes(lowercasedQuery)
      );
    }
    return props;
  }, [properties, activeTab, searchQuery]);

  const handleOpenEditModal = (property: Property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      dispatch(deleteProperty(id))
        .unwrap()
        .then(() => toast.success("Property deleted."))
        .catch((error) =>
          toast.error(error.message || "Failed to delete property.")
        );
    }
  };

  const handleApprove = (id: string) => {
    dispatch(approveProperty(id))
      .unwrap()
      .then(() => toast.success("Property approved."))
      .catch((error) =>
        toast.error(error.message || "Failed to approve property.")
      );
  };

  const handleToggleHotDeal = (id: string) => {
    dispatch(toggleHotDeal(id))
      .unwrap()
      .then((p) =>
        toast.success(
          `Property marked as ${p.isHotDeal ? "Hot Deal" : "Normal"}.`
        )
      )
      .catch((e) => toast.error(e.message));
  };

  const handleToggleFeatured = (id: string) => {
    dispatch(toggleFeatured(id))
      .unwrap()
      .then((p) =>
        toast.success(
          `Property marked as ${p.isFeatured ? "Featured" : "Not Featured"}.`
        )
      )
      .catch((e) => toast.error(e.message));
  };

  const handleToggleVerified = (id: string) => {
    dispatch(toggleVerified(id))
      .unwrap()
      .then((p) =>
        toast.success(
          `Property marked as ${p.isVerified ? "Verified" : "Not Verified"}.`
        )
      )
      .catch((e) => toast.error(e.message));
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
                placeholder="Search by title..."
                className="pl-8 sm:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
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
              Manage your properties and their status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Deal</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
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
                      <TableCell>
                        {prop.isHotDeal ? (
                          <Badge className="border-orange-500/50 bg-orange-500/10 text-orange-700">
                            <Flame className="w-3 h-3 mr-1" />
                            Hot
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {prop.isFeatured ? (
                          <Badge className="border-blue-500/50 bg-blue-500/10 text-blue-700">
                            <Star className="w-3 h-3 mr-1" />
                            Yes
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">No</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {prop.isVerified ? (
                          <Badge className="border-indigo-500/50 bg-indigo-500/10 text-indigo-700">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Yes
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">No</span>
                        )}
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
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onSelect={() => handleToggleHotDeal(prop._id)}
                            >
                              {prop.isHotDeal
                                ? "Remove Hot Deal"
                                : "Mark as Hot Deal"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() => handleToggleFeatured(prop._id)}
                            >
                              {prop.isFeatured
                                ? "Remove Featured"
                                : "Mark as Featured"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() => handleToggleVerified(prop._id)}
                            >
                              {prop.isVerified
                                ? "Un-verify"
                                : "Mark as Verified"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleOpenEditModal(prop)}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600 focus:bg-red-50"
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
