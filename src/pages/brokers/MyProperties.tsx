import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { MoreHorizontal, Loader2, PlusCircle, Search } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  getProperties,
  deleteProperty,
  updateProperty,
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
import { Input } from "@/components/ui/input";
import EditPropertyModal from "@/components/admin/EditPropertyModal"; // Assuming this is a shared component now

const MyProperties = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { properties, isLoading } = useAppSelector((state) => state.properties);
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
    if (!searchQuery) return properties;
    const lowercasedQuery = searchQuery.toLowerCase();
    return properties.filter((p) =>
      p.title.toLowerCase().includes(lowercasedQuery)
    );
  }, [properties, searchQuery]);

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Sold":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Property Listings</h1>
            <p className="text-muted-foreground">
              Manage your properties available for sale or rent.
            </p>
          </div>
          <Button onClick={() => navigate("/broker/add-property")}>
            <PlusCircle className="w-4 h-4 mr-2" /> Add New Property
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your Properties</CardTitle>
                <CardDescription>
                  All properties listed under your account.
                </CardDescription>
              </div>
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by title..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading && properties.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground">
                  You have not added any properties yet.
                </p>
                <Button
                  onClick={() => navigate("/broker/add-property")}
                  className="mt-4"
                >
                  Add Your First Property
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.map((prop) => (
                    <TableRow key={prop._id}>
                      <TableCell className="font-medium">
                        {prop.title}
                      </TableCell>
                      <TableCell>{prop.property_type}</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                          maximumFractionDigits: 0,
                        }).format(prop.price)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusBadge(prop.status)}
                        >
                          {prop.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onSelect={() => navigate(`/property/${prop._id}`)}
                            >
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() => handleOpenEditModal(prop)}
                            >
                              Edit Property
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onSelect={() => handleDelete(prop._id)}
                            >
                              Delete Property
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing <strong>{filteredProperties.length}</strong> of{" "}
              <strong>{properties.length}</strong> properties.
            </div>
          </CardFooter>
        </Card>
      </div>

      {selectedProperty && (
        <EditPropertyModal
          property={selectedProperty}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};
export default MyProperties;
