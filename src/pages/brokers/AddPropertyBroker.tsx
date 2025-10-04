import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropertyForm from "@/components/shared/PropertyForm";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  createProperty,
  reset,
} from "@/redux/features/properties/propertySlice";
import { toast } from "sonner";

const AddPropertyBroker = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isLoading, isError, isSuccess, message } = useAppSelector(
    (state) => state.properties
  );

  useEffect(() => {
    if (isError) {
      toast.error(message as string);
    }
    if (isSuccess) {
      toast.success("Property submitted for approval!");
      navigate("/broker/properties"); // ब्रोकर के प्रॉपर्टीज पेज पर भेजें
    }
    return () => {
      dispatch(reset());
    };
  }, [isError, isSuccess, message, navigate, dispatch]);

  const handleBrokerSubmit = (formData: FormData) => {
    dispatch(createProperty(formData));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PropertyForm
        onSubmit={handleBrokerSubmit}
        isLoading={isLoading}
        title="List a New Property"
        description="Fill in the details of your property. It will be sent for admin approval."
      />
    </div>
  );
};

export default AddPropertyBroker;
