import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, UploadCloud, X, IndianRupee } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";

interface PropertyFormProps {
  onSubmit: (formData: FormData) => void;
  isLoading: boolean;
  title: string;
  description: string;
}

const PropertyForm: React.FC<PropertyFormProps> = ({
  onSubmit,
  isLoading,
  title,
  description,
}) => {
  const { user } = useAppSelector((state) => state.auth);
  const userRole = user?.role;

  const propertyTypes = [
    "Apartment",
    "Villa",
    "Plot",
    "Commercial Space",
    "Office",
    "Farmhouse",
    "Builder Floor",
  ];

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    city: "",
    district: "",
    area: "",
    fullAddress: "",
    pincode: "",
    property_type: "",
    transaction_type: "sale",
    bedrooms: "",
    bathrooms: "",
    square_feet: "",
    yearBuilt: "",
    furnishingStatus: "Unfurnished",
    amenities: [] as string[],
    isFeatured: false,
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (images.length + acceptedFiles.length > 5) {
        toast.error("You can upload a maximum of 5 images.");
        return;
      }
      const newImages = [...images, ...acceptedFiles];
      setImages(newImages);
      const newPreviews = acceptedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    },
    [images]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
  });

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
    URL.revokeObjectURL(imagePreviews[index]);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenityChange = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleCheckboxChange = (
    checked: boolean | "indeterminate",
    name: string
  ) => {
    setFormData((prev) => ({ ...prev, [name]: checked as boolean }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    const location = {
      city: formData.city,
      district: formData.district,
      area: formData.area,
      fullAddress: formData.fullAddress,
      pincode: formData.pincode,
    };
    data.append("location", JSON.stringify(location));

    Object.entries(formData).forEach(([key, value]) => {
      if (
        ![
          "city",
          "district",
          "area",
          "fullAddress",
          "pincode",
          "images",
          "amenities",
        ].includes(key)
      ) {
        data.append(key, String(value));
      }
    });

    formData.amenities.forEach((amenity) => data.append("amenities", amenity));
    images.forEach((file) => data.append("images", file));

    onSubmit(data);
  };

  const amenitiesList = [
    "Swimming Pool",
    "Gym",
    "Security",
    "Parking",
    "Power Backup",
    "Lift",
    "Garden",
    "Clubhouse",
  ];

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-8">
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-foreground border-b pb-2">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Property Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (INR)</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                required
              />
            </div>
          </div>

          <div className="space-y-6 pt-6 border-t">
            <h3 className="text-lg font-medium text-foreground border-b pb-2">
              Location Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="area">Area / Locality</Label>
                <Input
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullAddress">Full Address</Label>
                <Input
                  id="fullAddress"
                  name="fullAddress"
                  value={formData.fullAddress}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-6 border-t">
            <h3 className="text-lg font-medium text-foreground border-b pb-2">
              Property Specifications
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  name="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  name="bathrooms"
                  type="number"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="square_feet">Area (sq. ft.)</Label>
                <Input
                  id="square_feet"
                  name="square_feet"
                  type="number"
                  value={formData.square_feet}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yearBuilt">Year Built</Label>
                <Input
                  id="yearBuilt"
                  name="yearBuilt"
                  type="number"
                  value={formData.yearBuilt}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Property Type</Label>
                <Select
                  value={formData.property_type}
                  onValueChange={(value) =>
                    handleSelectChange("property_type", value)
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Transaction Type</Label>
                <Select
                  value={formData.transaction_type}
                  onValueChange={(value) =>
                    handleSelectChange("transaction_type", value)
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">For Sale</SelectItem>
                    <SelectItem value="rent">For Rent</SelectItem>
                    <SelectItem value="lease">For Lease</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Furnishing Status</Label>
                <Select
                  value={formData.furnishingStatus}
                  onValueChange={(value) =>
                    handleSelectChange("furnishingStatus", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Furnished">Furnished</SelectItem>
                    <SelectItem value="Semi-Furnished">
                      Semi-Furnished
                    </SelectItem>
                    <SelectItem value="Unfurnished">Unfurnished</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-6 border-t">
            <h3 className="text-lg font-medium text-foreground border-b pb-2">
              Features & Images
            </h3>
            <div className="space-y-3">
              <Label>Amenities</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {amenitiesList.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={formData.amenities.includes(amenity)}
                      onCheckedChange={() => handleAmenityChange(amenity)}
                    />
                    <Label htmlFor={amenity} className="font-normal">
                      {amenity}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Label>Property Images (Max 5)</Label>
              <div
                {...getRootProps()}
                className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  isDragActive
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <input {...getInputProps()} />
                <div className="text-center">
                  <UploadCloud className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                  <p className="font-semibold">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, JPEG up to 5 files
                  </p>
                </div>
              </div>
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={preview}
                        alt={`Preview ${index}`}
                        className="w-full h-full object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-md"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {userRole === "admin" && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isFeatured"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(checked, "isFeatured")
                  }
                />
                <Label htmlFor="isFeatured">Mark as Featured Property</Label>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Submitting..." : "Submit Property"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PropertyForm;
