import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  getWishlist,
  toggleWishlist,
} from "@/redux/features/wishlist/wishlistSlice";
import { RootState } from "@/redux/store";
import PropertyCard from "@/components/PropertyCard";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { items, itemIds, isLoading } = useAppSelector(
    (state: RootState) => state.wishlist
  );

  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);

  const handleToggleWishlist = (propertyId: string) => {
    dispatch(toggleWishlist(propertyId)).then(() => {
      dispatch(getWishlist());
    });
  };

  const handlePropertyClick = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        Loading your wishlist...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            My Wishlist
          </h1>
          <p className="text-lg text-muted-foreground">
            Properties you've saved for later.
          </p>
        </div>

        {items && items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(({ property }) => (
              <div
                key={property._id}
                className="cursor-pointer"
                onClick={() => handlePropertyClick(property._id)}
              >
                <PropertyCard
                  property={property}
                  isWishlisted={itemIds.includes(property._id)}
                  onToggleWishlist={handleToggleWishlist}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-muted-foreground">
              Browse properties and click the heart icon to save them here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
