import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  getWishlist,
  toggleWishlist,
} from "@/redux/features/wishlist/wishlistSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import PropertyCard from "@/components/PropertyCard";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Loader2, HeartCrack } from "lucide-react"; 

const SavedProperties = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { items, isLoading, isError, message } = useAppSelector(
    (state) => state.wishlist
  );
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(getWishlist());
    }
    if (isError) {
      toast.error(message);
    }
  }, [dispatch, user, isError, message]);

  const handleToggleWishlist = (propertyId: string) => {
    if (!user) {
      toast.error("Please log in first.");
      navigate("/login");
      return;
    }
    dispatch(toggleWishlist(propertyId))
      .unwrap()
      .then(() => {
        toast.success("Property removed from wishlist.");
      })
      .catch((error) => {
        toast.error(error || "Failed to update wishlist.");
      });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saved Properties</CardTitle>
          <CardDescription>Loading your saved properties...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-20">
          <Loader2 className="h-10 w-10 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saved Properties</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-20">
          <HeartCrack className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">
            Please log in to view your saved properties.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saved Properties</CardTitle>
          <CardDescription>
            You haven't saved any properties yet.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-20">
          <HeartCrack className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">
            Your wishlist is empty. Start exploring to find properties you love!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Properties</CardTitle>
        <CardDescription>
          Here are the properties you have saved for later.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <PropertyCard
            key={item._id}
            property={item.property} 
            isWishlisted={true}
            onToggleWishlist={handleToggleWishlist}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default SavedProperties;
