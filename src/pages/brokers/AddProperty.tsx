import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropertyForm from "@/components/shared/PropertyForm"; // PropertyForm ka sahi path dein
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  createProperty,
  reset,
} from "@/redux/features/properties/propertySlice";
import { toast } from "sonner";

const AddPropertyPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isLoading, isError, isSuccess, message } = useAppSelector(
    (state) => state.properties
  );
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      toast.error(message as string);
    }
    if (isSuccess) {
      toast.success("Property added successfully!");
      // Role ke hisaab se alag-alag page par redirect karein
      if (user?.role === "Admin") {
        navigate("/admin/properties");
      } else if (user?.role === "Company") {
        navigate("/company/properties");
      } else {
        navigate("/broker/properties");
      }
    }
    // Cleanup function
    return () => {
      dispatch(reset());
    };
  }, [isError, isSuccess, message, navigate, dispatch, user]);

  const handleSubmit = (formData: FormData) => {
    dispatch(createProperty(formData));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PropertyForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        title="Add a New Property"
        description="Fill out the details of the property you want to list."
      />
    </div>
  );
};

export default AddPropertyPage;
