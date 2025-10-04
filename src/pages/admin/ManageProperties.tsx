// src/pages/admin/ManageProperties.js

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { MoreHorizontal, Loader2 } from "lucide-react";

// Redux Imports
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  getProperties,
  deleteProperty,
  approveProperty,
  updateProperty,
  Property,
  reset,
} from "@/redux/features/properties/propertySlice";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ====================================================================
// EDIT PROPERTY MODAL COMPONENT (Updated with all fields)
// ====================================================================

const EditPropertyModal = ({
  property,
  isOpen,
  onClose,
  onSave,
  isLoading,
}) => {
  // State to hold all form data, including nested location
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    bedrooms: 0,
    bathrooms: 0,
    square_feet: 0,
    property_type: "",
    transaction_type: "sale",
    location: {
      city: "",
      district: "",
      area: "",
      fullAddress: "",
      pincode: "",
    },
  });

  // Populate form with existing property data when modal opens
  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || "",
        description: property.description || "",
        price: property.price || 0,
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        square_feet: property.square_feet || 0,
        property_type: property.property_type || "",
        transaction_type: property.transaction_type || "sale",
        location: {
          city: property.location?.city || "",
          district: property.location?.district || "",
          area: property.location?.area || "",
          fullAddress: property.location?.fullAddress || "",
          pincode: property.location?.pincode || "",
        },
      });
    }
  }, [property]);

  // Handle changes for standard inputs and textareas
  const handleChange = (e) => {
    const { id, value } = e.target;
    // Special handling for nested location fields
    if (id.includes(".")) {
      const [parentKey, childKey] = id.split(".");
      setFormData((prev) => ({
        ...prev,
        [parentKey]: {
          ...prev[parentKey],
          [childKey]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  // Handle changes for Select components
  const handleSelectChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Prepare and submit form data on save
  const handleSave = () => {
    const data = new FormData();
    // Loop through form data and append to FormData object
    Object.keys(formData).forEach((key) => {
      if (key === "location") {
        // Append nested location keys correctly for backend (e.g., location[city])
        Object.keys(formData.location).forEach((locKey) => {
          data.append(`location[${locKey}]`, formData.location[locKey]);
        });
      } else {
        data.append(key, formData[key]);
      }
    });

    onSave(property._id, data);
  };

  if (!property) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Property - {property.title}</DialogTitle>
          <DialogDescription>
            Make changes to your property here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* Basic Details */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={formData.title} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />
          </div>

          {/* Property & Transaction Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="property_type">Property Type</Label>
              <Input
                id="property_type"
                value={formData.property_type}
                onChange={handleChange}
                placeholder="e.g., Apartment, Villa, Plot"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transaction_type">Transaction Type</Label>
              <Select
                value={formData.transaction_type}
                onValueChange={(value) =>
                  handleSelectChange("transaction_type", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">For Sale</SelectItem>
                  <SelectItem value="rent">For Rent</SelectItem>
                  <SelectItem value="lease">For Lease</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Pricing and Size */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (INR)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="square_feet">Area (Square Feet)</Label>
              <Input
                id="square_feet"
                type="number"
                value={formData.square_feet}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Room Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Location Details Section */}
          <div className="space-y-4 rounded-md border p-4">
            <h4 className="font-semibold">Location Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location.city">City</Label>
                <Input
                  id="location.city"
                  value={formData.location.city}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location.district">District</Label>
                <Input
                  id="location.district"
                  value={formData.location.district}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location.area">Area</Label>
                <Input
                  id="location.area"
                  value={formData.location.area}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location.pincode">Pincode</Label>
                <Input
                  id="location.pincode"
                  value={formData.location.pincode}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location.fullAddress">Full Address</Label>
              <Textarea
                id="location.fullAddress"
                value={formData.location.fullAddress}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ====================================================================
// MAIN MANAGE PROPERTIES COMPONENT
// ====================================================================

const ManageProperties = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { properties, isLoading, isError, message } = useAppSelector(
    (state) => state.properties
  );
  const { user: loggedInUser } = useAppSelector((state) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );

  useEffect(() => {
    if (isError) {
      toast.error(message as string);
    }
    dispatch(getProperties());
    return () => {
      dispatch(reset());
    };
  }, [dispatch, isError, message]);

  const handleOpenEditModal = (property: Property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleUpdate = (id: string, propertyData: FormData) => {
    dispatch(updateProperty({ id, propertyData }))
      .unwrap()
      .then(() => {
        toast.success("Property updated successfully");
        setIsModalOpen(false);
        // Refresh properties list after update
        dispatch(getProperties());
      })
      .catch((error) => toast.error(error));
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      dispatch(deleteProperty(id))
        .unwrap()
        .then(() => toast.success("Property deleted successfully"))
        .catch((error) => toast.error(error));
    }
  };

  const handleApprove = (id: string) => {
    dispatch(approveProperty(id))
      .unwrap()
      .then(() => toast.success("Property approved successfully"))
      .catch((error) => toast.error(error));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "Rejected":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  if (isLoading && properties.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Manage Properties</CardTitle>
            <CardDescription>
              View, approve, and manage all property listings.
            </CardDescription>
          </div>
          <Button onClick={() => navigate("/admin/properties/add")}>
            Add New Property
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">
                  Uploaded By
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Price</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((prop) => (
                <TableRow key={prop._id}>
                  <TableCell className="font-medium">{prop.title}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {prop.user?.name || "N/A"} ({prop.user?.role})
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
                        {loggedInUser?.role === "admin" &&
                          prop.status === "Pending" && (
                            <DropdownMenuItem
                              onSelect={() => handleApprove(prop._id)}
                            >
                              Approve
                            </DropdownMenuItem>
                          )}
                        <DropdownMenuItem
                          onSelect={() => handleOpenEditModal(prop)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-700 focus:bg-red-50"
                          onSelect={() => handleDelete(prop._id)}
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
        </CardContent>
      </Card>

      {selectedProperty && (
        <EditPropertyModal
          property={selectedProperty}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleUpdate}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default ManageProperties;
