import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropertyForm from "@/components/shared/PropertyForm";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  createProperty,
  reset,
} from "@/redux/features/properties/propertySlice";
import { toast } from "sonner";

const AddPropertyAdmin = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isLoading, isError, isSuccess, message } = useAppSelector(
    (state) => state.properties
  );

  useEffect(() => {
    if (isError) {
      console.error("Property creation error:", message);
      toast.error(message as string);
    }

    if (isSuccess) {
      toast.success("Property created successfully!");
      navigate("/admin/properties");
    }

    return () => {
      dispatch(reset());
    };
  }, [isError, isSuccess, message, navigate, dispatch]);

  const handleAdminSubmit = (formData: FormData) => {
    console.log("Submitting property from Admin component");

    // Log FormData contents for debugging
    console.log("FormData being submitted:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    dispatch(createProperty(formData));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PropertyForm
        onSubmit={handleAdminSubmit}
        isLoading={isLoading}
        title="Add New Property"
        description="Fill in the details to list a new property on the platform."
      />
    </div>
  );
};

export default AddPropertyAdmin;
