import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDropzone } from "react-dropzone";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getAssociates } from "@/redux/features/users/userSlice";
import { toast } from "sonner";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, UploadCloud, X, IndianRupee } from "lucide-react";
import { Property } from "@/redux/features/properties/propertySlice"; // Property type import karein

const formSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters."),
  price: z.coerce.number().min(1, "Price must be a positive number."),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters."),
  city: z.string().min(1, "City is required."),
  district: z.string().min(1, "District is required."),
  area: z.string().min(1, "Area is required."),
  fullAddress: z.string().min(1, "Full address is required."),
  pincode: z.string().length(6, "Pincode must be 6 digits."),
  property_type: z.string({ required_error: "Property type is required." }),
  transaction_type: z.string({
    required_error: "Transaction type is required.",
  }),
  bedrooms: z.coerce.number().min(0),
  bathrooms: z.coerce.number().min(0),
  square_feet: z.coerce.number().min(1, "Area is required."),
  furnishingStatus: z.string({
    required_error: "Furnishing status is required.",
  }),
  amenities: z.array(z.string()).optional(),
  isFeatured: z.boolean().default(false),
  commissionPercentage: z.coerce.number().optional(),
  assignedAssociate: z.string().optional(),
  images: z.any().optional(), // Make images optional for updates
  yearBuilt: z.coerce.number().optional(),
  floor: z.coerce.number().optional(),
  totalFloors: z.coerce.number().optional(),
  parkingSpaces: z.coerce.number().optional(),
});

type PropertyFormData = z.infer<typeof formSchema>;

interface PropertyFormProps {
  onSubmit: (formData: FormData) => void;
  isLoading: boolean;
  initialData?: Property | null; // <-- YEH NAYA PROP HAI
}

const PropertyForm: React.FC<PropertyFormProps> = ({
  onSubmit,
  isLoading,
  initialData,
}) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { users: associates } = useAppSelector((state) => state.users);

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const mode = initialData ? "edit" : "add";

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
      bedrooms: initialData?.bedrooms || 0,
      bathrooms: initialData?.bathrooms || 0,
      square_feet: initialData?.square_feet || 0,
      property_type: initialData?.property_type || "",
      transaction_type: initialData?.transaction_type || "sale",
      furnishingStatus: initialData?.furnishingStatus || "Unfurnished",
      city: initialData?.location?.city || "",
      district: initialData?.location?.district || "",
      area: initialData?.location?.area || "",
      fullAddress: initialData?.location?.fullAddress || "",
      pincode: initialData?.location?.pincode || "",
      amenities: initialData?.amenities || [],
      isFeatured: initialData?.isFeatured || false,
      commissionPercentage: initialData?.commission?.percentage || 2,
      assignedAssociate: initialData?.commission?.assignedAssociate || "",
      yearBuilt: initialData?.yearBuilt || undefined,
      floor: initialData?.floor || undefined,
      totalFloors: initialData?.totalFloors || undefined,
      parkingSpaces: initialData?.parkingSpaces || 0,
    },
  });

  useEffect(() => {
    if (user?.role === "Admin" || user?.role === "Company") {
      dispatch(getAssociates());
    }
    // Edit mode mein existing images ka preview set karein
    if (mode === "edit" && initialData?.images) {
      setImagePreviews(initialData.images);
    }
  }, [dispatch, user, mode, initialData]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const currentFiles = form.getValues("images") || [];
      const totalImages =
        (mode === "edit"
          ? imagePreviews.length - (initialData?.images?.length || 0)
          : 0) +
        currentFiles.length +
        acceptedFiles.length;
      if (totalImages > 5) {
        toast.error("You can upload a maximum of 5 images.");
        return;
      }
      const newFiles = [...currentFiles, ...acceptedFiles];
      form.setValue("images", newFiles);
      const newPreviews = acceptedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    },
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
  });

  const handleRemoveImage = (index: number, previewUrl: string) => {
    // Implement logic to handle removing existing vs new images if needed
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
    // You might need more complex logic to track which old images to delete
  };

  const onFormSubmit = (values: PropertyFormData) => {
    const data = new FormData();
    const location = {
      city: values.city,
      district: values.district,
      area: values.area,
      fullAddress: values.fullAddress,
      pincode: values.pincode,
    };
    data.append("location", JSON.stringify(location));

    // Sabhi fields ko append karein
    Object.entries(values).forEach(([key, value]) => {
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
        if (value !== undefined && value !== null) {
          data.append(key, String(value));
        }
      }
    });

    values.amenities?.forEach((amenity) => data.append("amenities", amenity));
    if (values.images) {
      for (let i = 0; i < values.images.length; i++) {
        data.append("images", values.images[i]);
      }
    }
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
        <CardTitle className="text-2xl">
          {mode === "edit" ? "Edit Property" : "Add New Property"}
        </CardTitle>
        <CardDescription>
          {mode === "edit"
            ? "Update the details for this property."
            : "Fill in the details to list a new property."}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onFormSubmit)}>
          <CardContent className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-lg font-medium border-b pb-2">
                Basic Information
              </h3>
              <FormField
                name="title"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Label>Property Title</Label>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="price"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Label>Price (INR)</Label>
                    <FormControl>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="number" className="pl-9" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Label>Description</Label>
                    <FormControl>
                      <Textarea rows={5} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-6 pt-6 border-t">
              <h3 className="text-lg font-medium border-b pb-2">
                Location Details
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <FormField
                  name="city"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <Label>City</Label>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="district"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <Label>District</Label>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="pincode"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <Label>Pincode</Label>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  name="area"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <Label>Area / Locality</Label>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="fullAddress"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <Label>Full Address</Label>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="space-y-6 pt-6 border-t">
              <h3 className="text-lg font-medium border-b pb-2">
                Property Specifications
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <FormField
                  name="bedrooms"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <Label>Bedrooms</Label>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="bathrooms"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <Label>Bathrooms</Label>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="square_feet"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <Label>Area (sq. ft.)</Label>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="parkingSpaces"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <Label>Parking</Label>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  name="yearBuilt"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <Label>Year Built</Label>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="floor"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <Label>Floor</Label>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="totalFloors"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <Label>Total Floors</Label>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  name="property_type"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <Label>Property Type</Label>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Apartment">Apartment</SelectItem>
                          <SelectItem value="Villa">Villa</SelectItem>
                          <SelectItem value="Plot">Plot</SelectItem>
                          <SelectItem value="Commercial Space">
                            Commercial Space
                          </SelectItem>
                          <SelectItem value="Office">Office</SelectItem>
                          <SelectItem value="Farmhouse">Farmhouse</SelectItem>
                          <SelectItem value="Builder Floor">
                            Builder Floor
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="transaction_type"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <Label>Transaction Type</Label>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sale">For Sale</SelectItem>
                          <SelectItem value="rent">For Rent</SelectItem>
                          <SelectItem value="lease">For Lease</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="furnishingStatus"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <Label>Furnishing</Label>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Furnished">Furnished</SelectItem>
                          <SelectItem value="Semi-Furnished">
                            Semi-Furnished
                          </SelectItem>
                          <SelectItem value="Unfurnished">
                            Unfurnished
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {(user?.role === "Admin" || user?.role === "Company") && (
              <div className="space-y-6 pt-6 border-t">
                <h3 className="text-lg font-medium border-b pb-2">
                  Commission Details
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    name="commissionPercentage"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <Label>Commission (%)</Label>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="assignedAssociate"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <Label>Assign to Associate</Label>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an Associate" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="NONE">None</SelectItem>
                            {associates
                              .filter((a) => a.role === "Associate")
                              .map((a) => (
                                <SelectItem key={a._id} value={a._id}>
                                  {a.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}
            <div className="space-y-6 pt-6 border-t">
              <h3 className="text-lg font-medium border-b pb-2">
                Features & Images
              </h3>
              <FormField
                name="amenities"
                control={form.control}
                render={() => (
                  <FormItem>
                    <Label>Amenities</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                      {amenitiesList.map((amenity) => (
                        <FormField
                          key={amenity}
                          control={form.control}
                          name="amenities"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(amenity)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...(field.value || []),
                                          amenity,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (v) => v !== amenity
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <Label className="font-normal">{amenity}</Label>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-4">
                <Label>Property Images (Max 5)</Label>
                <div
                  {...getRootProps()}
                  className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}
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
                          onClick={() => handleRemoveImage(index, preview)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {user?.role === "Admin" && (
                <FormField
                  name="isFeatured"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <Label>Mark as Featured Property</Label>
                    </FormItem>
                  )}
                />
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
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{" "}
              {isLoading
                ? "Submitting..."
                : mode === "edit"
                  ? "Save Changes"
                  : "Submit Property"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default PropertyForm;
