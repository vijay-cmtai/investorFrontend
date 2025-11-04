import React, { useState, useEffect, useMemo } from "react";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Building2, X, ListFilter } from "lucide-react";
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
import { cn } from "@/lib/utils";

interface FilterState {
  search?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  property_type?: string;
}

const Commercial = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Redux store se data le rahe hain, useState ki jagah
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { properties, isLoading } = useAppSelector(
    (state: RootState) => state.properties
  );
  const { itemIds: wishlistedIds } = useAppSelector(
    (state: RootState) => state.wishlist
  );

  const [filters, setFilters] = useState<Partial<FilterState>>({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sirf commercial properties fetch karne ke liye useEffect
  useEffect(() => {
    // Backend se sirf commercial properties fetch kar rahe hain
    dispatch(getProperties({ transaction_type: "commercial" }));

    if (user) {
      dispatch(getWishlist());
    }
  }, [dispatch, user]);

  const handleFiltersChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Client-side filtering (search, price, etc.)
  const filteredProperties = useMemo(() => {
    if (!Array.isArray(properties)) return [];

    let filtered = [...properties];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(searchLower) ||
          p.location?.city?.toLowerCase().includes(searchLower)
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
    if (filters.minPrice) {
      filtered = filtered.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice) {
      filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
    }
    return filtered;
  }, [properties, filters]);

  const handleClearFilters = () => setFilters({});

  const handleToggleWishlist = (propertyId: string) => {
    if (!user) {
      toast.error("Please log in to manage your wishlist.");
      navigate("/auth");
      return;
    }
    dispatch(toggleWishlist(propertyId));
  };

  // Dropdowns ke liye data generate karna
  const availableCities = useMemo(
    () => [...new Set(properties.map((p) => p.location.city))],
    [properties]
  );
  const availablePropTypes = useMemo(
    () => [...new Set(properties.map((p) => p.property_type))],
    [properties]
  );

  const heroBackgroundImage =
    "https://www.resmanagement.in/img/blog/commercial-properties-in-ahemedabad-res-management.webp";

  return (
    <div className="min-h-screen bg-muted/20">
      {/* === HERO SECTION === */}
      <section
        className="relative bg-cover bg-center py-24 md:py-32"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${heroBackgroundImage})`,
        }}
      >
        <div className="container mx-auto px-4 text-center animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
            Prime Commercial Spaces
          </h1>
          <p className="text-lg md:text-xl text-neutral-200 max-w-3xl mx-auto mb-8">
            Find the perfect office, retail, or industrial property for your
            business.
          </p>
          <Card className="max-w-4xl mx-auto bg-background/90 backdrop-blur-sm p-4 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="md:col-span-2">
                <Label
                  htmlFor="hero-search"
                  className="text-left block mb-2 font-semibold"
                >
                  Location or Keyword
                </Label>
                <Input
                  id="hero-search"
                  placeholder="e.g. 'BKC', 'Office Space', 'Warehouse'"
                  value={filters.search || ""}
                  onChange={(e) =>
                    handleFiltersChange({ search: e.target.value })
                  }
                  className="bg-white"
                />
              </div>
              <div>
                <Label
                  htmlFor="hero-city"
                  className="text-left block mb-2 font-semibold"
                >
                  City
                </Label>
                <Select
                  value={filters.city || ""}
                  onValueChange={(value) =>
                    handleFiltersChange({ city: value })
                  }
                >
                  <SelectTrigger id="hero-city" className="bg-white">
                    <SelectValue placeholder="All Cities" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button size="lg" className="w-full">
                <Search className="w-5 h-5 mr-2" /> Search
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* === MAIN CONTENT === */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="lg:hidden mb-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                  >
                    <ListFilter className="w-4 h-4 mr-2" />
                    {showMobileFilters ? "Hide Filters" : "Show Filters"}
                  </Button>
                </div>
                <div
                  className={cn(
                    "space-y-6",
                    showMobileFilters ? "block" : "hidden lg:block"
                  )}
                >
                  <FiltersSidebar
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    onClearFilters={handleClearFilters}
                    cities={availableCities}
                    propertyTypes={availablePropTypes}
                  />
                </div>
              </div>
            </aside>

            <main className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  {isLoading
                    ? "Searching..."
                    : `${filteredProperties.length} Commercial Propert${filteredProperties.length !== 1 ? "ies" : "y"} Found`}
                </h2>
                {Object.keys(filters).length > 0 && (
                  <Button variant="ghost" onClick={handleClearFilters}>
                    Clear All Filters <X className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : filteredProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in-up">
                  {filteredProperties.map((property) => (
                    <div
                      key={property._id}
                      onClick={() => navigate(`/property/${property._id}`)}
                      className="cursor-pointer"
                    >
                      <PropertyCard
                        property={property}
                        onToggleWishlist={handleToggleWishlist}
                        isWishlisted={wishlistedIds.includes(property._id)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <NoResults onClearFilters={handleClearFilters} />
              )}
            </main>
          </div>
        </div>
      </section>
    </div>
  );
};

const FiltersSidebar = ({
  filters,
  onFiltersChange,
  onClearFilters,
  cities,
  propertyTypes,
}: any) => (
  <Card className="shadow-lg">
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <span>Filters</span>
        <Button
          variant="link"
          size="sm"
          className="p-0 h-auto"
          onClick={onClearFilters}
        >
          Clear all
        </Button>
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <Label htmlFor="filter-proptype">Property Type</Label>
        <Select
          value={filters.property_type || ""}
          onValueChange={(value) => onFiltersChange({ property_type: value })}
        >
          <SelectTrigger id="filter-proptype">
            <SelectValue placeholder="Any Commercial Type" />
          </SelectTrigger>
          <SelectContent>
            {propertyTypes.map((type: string) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Price Range (₹)</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ""}
            onChange={(e) =>
              onFiltersChange({
                minPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ""}
            onChange={(e) =>
              onFiltersChange({
                maxPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
        </div>
      </div>
    </CardContent>
  </Card>
);

const SkeletonCard = () => (
  <Card className="animate-pulse overflow-hidden">
    <div className="h-48 bg-muted"></div>
    <CardContent className="p-4 space-y-3">
      <div className="h-4 bg-muted rounded w-3/4"></div>
      <div className="h-4 bg-muted rounded w-1/2"></div>
      <div className="h-4 bg-muted rounded w-2/3"></div>
    </CardContent>
  </Card>
);

const NoResults = ({ onClearFilters }: { onClearFilters: () => void }) => (
  <div className="text-center py-16 col-span-full animate-fade-in">
    <div className="max-w-md mx-auto">
      <div className="bg-muted rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
        <Building2 className="w-12 h-12 text-muted-foreground" />
      </div>
      <h3 className="text-2xl font-semibold text-foreground mb-3">
        No Commercial Properties Match
      </h3>
      <p className="text-muted-foreground mb-8">
        Try adjusting your filters or expanding your search area.
      </p>
      <Button variant="default" onClick={onClearFilters} size="lg">
        Clear All Filters
      </Button>
    </div>
  </div>
);

export default Commercial;
