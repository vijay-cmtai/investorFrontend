import React from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  updateProperty,
  Property,
} from "@/redux/features/properties/propertySlice";
import { toast } from "sonner";
import PropertyForm from "@/components/shared/PropertyForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import * as z from "zod";

interface EditPropertyModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

// Ye formSchema se alag se define karna padega ya import karna padega
const formSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  price: z.coerce.number().min(1),
  // ... baaki ke fields
});

const EditPropertyModal: React.FC<EditPropertyModalProps> = ({
  property,
  isOpen,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.properties);

  const handleUpdate = (values: z.infer<typeof formSchema>) => {
    if (!property) return;

    // Yahan values ko propertyData format mein convert karein agar zaroori ho
    const propertyData = { ...values };

    dispatch(updateProperty({ id: property._id, propertyData }))
      .unwrap()
      .then(() => {
        toast.success("Property updated successfully!");
        onClose();
      })
      .catch((error) =>
        toast.error(error.message || "Failed to update property.")
      );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Property</DialogTitle>
          <DialogDescription>
            Make changes to your property. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <PropertyForm
            onSubmit={handleUpdate}
            isLoading={isLoading}
            initialData={property}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPropertyModal;
