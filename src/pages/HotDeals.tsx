import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  getProperties,
  Property,
} from "@/redux/features/properties/propertySlice";
import { toggleWishlist } from "@/redux/features/wishlist/wishlistSlice";
import { RootState } from "@/redux/store";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, Flame, ListFilter, X, Search } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
interface FilterState {
  search?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  property_type?: string;
}
const HotDeals = () => {
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
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    dispatch(getProperties({ isHotDeal: true }));
  }, [dispatch]);

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

  const availableCities = useMemo(() => {
    if (!Array.isArray(properties)) return [];
    const cities = properties
      .map((p: Property) => p.location?.city)
      .filter((city): city is string => !!city);
    return [...new Set(cities)];
  }, [properties]);

  const availablePropTypes = useMemo(() => {
    if (!Array.isArray(properties)) return [];
    const propTypes = properties
      .map((p: Property) => p.property_type)
      .filter((type): type is string => !!type);
    return [...new Set(propTypes)];
  }, [properties]);

  const handleToggleWishlist = (propertyId: string) => {
    if (!user) {
      toast.error("Please log in to save properties.");
      navigate("/auth");
      return;
    }
    dispatch(toggleWishlist(propertyId));
  };

  const handleFiltersChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => setFilters({});

  const heroBackgroundImage =
    "https://images.unsplash.com/photo-1599809275671-558227275237?q=80&w=2070&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-muted/20">
      <section
        className="relative bg-cover bg-center py-24 md:py-32"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${heroBackgroundImage})`,
        }}
      >
        <div className="container mx-auto px-4 text-center animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight flex items-center justify-center gap-3">
            <Flame className="w-10 h-10 text-orange-400" /> Exclusive Hot Deals
          </h1>
          <p className="text-lg md:text-xl text-neutral-200 max-w-3xl mx-auto mb-8">
            Limited time offers on our most sought-after properties. Grab them
            before they're gone!
          </p>
        </div>
      </section>

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
                    ? "Searching for deals..."
                    : `${filteredProperties.length} Hot Deal${filteredProperties.length !== 1 ? "s" : ""} Found`}
                </h2>
                {Object.keys(filters).length > 0 && (
                  <Button variant="ghost" onClick={handleClearFilters}>
                    Clear Filters <X className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
              {isLoading && filteredProperties.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
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
                        isWishlisted={wishlistedIds.includes(property._id)}
                        onToggleWishlist={handleToggleWishlist}
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
        <span>Filter Deals</span>
        <Button
          variant="link"
          size="sm"
          className="p-0 h-auto"
          onClick={onClearFilters}
        >
          Clear
        </Button>
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <Label htmlFor="filter-search">Search by Name/City</Label>
        <Input
          id="filter-search"
          placeholder="e.g., 'Luxury Villa'"
          value={filters.search || ""}
          onChange={(e) => onFiltersChange({ search: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="filter-city">City</Label>
        <Select
          value={filters.city || ""}
          onValueChange={(value) => onFiltersChange({ city: value })}
        >
          <SelectTrigger id="filter-city">
            <SelectValue placeholder="Any City" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city: string) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="filter-proptype">Property Type</Label>
        <Select
          value={filters.property_type || ""}
          onValueChange={(value) => onFiltersChange({ property_type: value })}
        >
          <SelectTrigger id="filter-proptype">
            <SelectValue placeholder="Any Type" />
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
    </CardContent>
  </Card>
);

const NoResults = ({ onClearFilters }: { onClearFilters: () => void }) => (
  <div className="text-center py-16 col-span-full animate-fade-in">
    <div className="max-w-md mx-auto">
      <div className="bg-muted rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
        <Flame className="w-12 h-12 text-muted-foreground" />
      </div>
      <h3 className="text-2xl font-semibold text-foreground mb-3">
        No Deals Match Your Filters
      </h3>
      <p className="text-muted-foreground mb-8">
        Try adjusting your search criteria to see more exclusive offers.
      </p>
      <Button variant="default" onClick={onClearFilters} size="lg">
        Clear All Filters
      </Button>
    </div>
  </div>
);

export default HotDeals;
