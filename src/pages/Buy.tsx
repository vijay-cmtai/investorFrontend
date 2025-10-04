import React, { useState, useEffect, useMemo } from "react";
import PropertyCard from "@/components/PropertyCard";
import PropertyFilters from "@/components/PropertyFilters";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  getProperties,
  Property,
} from "@/redux/features/properties/propertySlice";
import {
  getWishlist,
  toggleWishlist,
} from "@/redux/features/wishlist/wishlistSlice";
import { RootState } from "@/redux/store";
import { toast } from "sonner";

interface FilterState {
  search?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: string;
  property_type?: string;
}

const Buy = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user } = useAppSelector((state: RootState) => state.auth);
  const { properties, isLoading } = useAppSelector(
    (state: RootState) => state.properties
  );
  const { itemIds: wishlistedIds } = useAppSelector(
    (state: RootState) => state.wishlist
  );

  const [filters, setFilters] = useState<Partial<FilterState>>({});

  useEffect(() => {
    const queryFilters: Partial<FilterState> & { transaction_type: string } = {
      transaction_type: "sale",
    };
    dispatch(getProperties(queryFilters));

    if (user) {
      dispatch(getWishlist());
    }
  }, [dispatch, user]);

  const filteredProperties = useMemo(() => {
    if (!Array.isArray(properties)) return [];

    let filtered = properties.filter((p) => p.transaction_type === "sale");

    // Apply local filters for instant filtering
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower) ||
          p.location?.city?.toLowerCase().includes(searchLower) ||
          p.location?.area?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.city) {
      filtered = filtered.filter((p) => p.location?.city === filters.city);
    }

    if (filters.property_type) {
      filtered = filtered.filter(
        (p) => p.property_type === filters.property_type
      );
    }

    if (filters.bedrooms) {
      const bedroomCount = parseInt(filters.bedrooms);
      filtered = filtered.filter((p) => p.bedrooms === bedroomCount);
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
    }

    return filtered;
  }, [properties, filters]);

  const availableCities = useMemo(() => {
    if (!Array.isArray(properties)) return [];
    const cities = properties
      .map((p: Property) => p.location?.city)
      .filter((city): city is string => Boolean(city));
    return [...new Set(cities)];
  }, [properties]);

  const availablePropTypes = useMemo(() => {
    if (!Array.isArray(properties)) return [];
    const propTypes = properties
      .map((p: Property) => p.property_type)
      .filter((type): type is string => Boolean(type));
    return [...new Set(propTypes)];
  }, [properties]);

  const handleToggleWishlist = (propertyId: string) => {
    if (!user) {
      toast.error("Please log in to save properties to your wishlist.");
      navigate("/auth");
      return;
    }
    dispatch(toggleWishlist(propertyId));
  };

  const handleFiltersChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handlePropertyClick = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
  };

  const heroBackgroundImage =
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2146&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-background">
      <section
        className="relative bg-cover bg-center py-20 text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${heroBackgroundImage})`,
        }}
      >
        <div className="container mx-auto px-4 text-center animate-fade-in">
          <div className="flex justify-center mb-4">
            <Home className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Properties for Sale
          </h1>
          <p className="text-xl text-neutral-200 max-w-2xl mx-auto">
            Find and buy your dream home from our curated listings
          </p>
        </div>
      </section>

      <section className="py-8 border-b sticky top-16 bg-background z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <PropertyFilters
            onFiltersChange={handleFiltersChange}
            cities={availableCities}
            propertyTypes={availablePropTypes}
          />
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold text-foreground">
                {isLoading && filteredProperties.length === 0
                  ? "Searching..."
                  : `${filteredProperties.length} ${filteredProperties.length === 1 ? "Property" : "Properties"} Found`}
              </h2>
              <p className="text-muted-foreground mt-2">
                Explore homes for sale that fit your needs
              </p>
            </div>
            {Object.keys(filters).length > 0 && (
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="hover:bg-destructive hover:text-destructive-foreground transition-colors"
              >
                Clear Filters
              </Button>
            )}
          </div>

          {isLoading && filteredProperties.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse overflow-hidden">
                  <div className="h-48 bg-muted"></div>
                  <CardContent className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {filteredProperties.map((property) => (
                <div
                  key={property._id}
                  className="cursor-pointer transform transition-transform hover:scale-105"
                  onClick={() => handlePropertyClick(property._id)}
                >
                  <PropertyCard
                    property={property}
                    isWishlisted={wishlistedIds.includes(property._id)}
                    onToggleWishlist={handleToggleWishlist}
                  />
                </div>
              ))}
            </div>
          )}
          {!isLoading && filteredProperties.length === 0 && (
            <div className="text-center py-16 animate-fade-in">
              <div className="max-w-md mx-auto">
                <div className="bg-muted/30 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-3">
                  No Properties Found
                </h3>
                <p className="text-muted-foreground mb-8 text-lg">
                  Try adjusting your filters to see more results
                </p>
                <Button
                  variant="default"
                  onClick={handleClearFilters}
                  size="lg"
                  className="min-w-[200px]"
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Buy;
