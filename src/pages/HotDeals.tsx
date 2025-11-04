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
    "https://cdn.vectorstock.com/i/500p/39/24/red-hot-deal-sale-sticker-vector-60313924.jpg";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <section className="relative py-32 md:py-40 overflow-hidden bg-gradient-to-br from-red-600 via-red-700 to-red-800">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src={heroBackgroundImage}
            alt="Exclusive Hot Deals Background"
            className="w-full h-full object-cover mix-blend-overlay"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20"></div>

        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center justify-center gap-3 mb-6 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <Flame className="w-6 h-6 text-orange-400 animate-pulse" />
            <span className="text-white/90 font-medium text-sm tracking-wide uppercase">
              Limited Time Offer
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
            Exclusive Hot Deals
          </h1>

          <p className="text-lg md:text-2xl text-white/90 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
            Limited time offers on our most sought-after properties. Grab them
            before they're gone!
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 px-5 py-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
              <span className="text-white font-semibold text-3xl">
                {filteredProperties.length}
              </span>
              <span className="text-white/80 text-sm">Active Deals</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="lg:hidden mb-4">
                  <Button
                    variant="outline"
                    className="w-full shadow-sm hover:shadow-md transition-shadow"
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
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-1">
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin text-red-600" />
                        Searching for deals...
                      </span>
                    ) : (
                      `${filteredProperties.length} Hot Deal${filteredProperties.length !== 1 ? "s" : ""} Found`
                    )}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Discover exclusive property offers
                  </p>
                </div>
                {Object.keys(filters).length > 0 && (
                  <Button
                    variant="ghost"
                    onClick={handleClearFilters}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
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
                      className="cursor-pointer transform transition-all duration-300 hover:scale-[1.02]"
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
  <Card className="shadow-xl border-gray-200 overflow-hidden">
    <CardHeader className="bg-gradient-to-br from-red-50 to-orange-50 border-b border-red-100">
      <CardTitle className="flex items-center justify-between">
        <span className="text-gray-900 flex items-center gap-2">
          <ListFilter className="w-5 h-5 text-red-600" />
          Filter Deals
        </span>
        <Button
          variant="link"
          size="sm"
          className="p-0 h-auto text-red-600 hover:text-red-700"
          onClick={onClearFilters}
        >
          Clear All
        </Button>
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-5 pt-6">
      <div>
        <Label
          htmlFor="filter-search"
          className="text-gray-700 font-medium mb-2 block"
        >
          Search by Name/City
        </Label>
        <Input
          id="filter-search"
          placeholder="e.g., 'Luxury Villa'"
          value={filters.search || ""}
          onChange={(e) => onFiltersChange({ search: e.target.value })}
          className="border-gray-300 focus:border-red-500 focus:ring-red-500"
        />
      </div>
      <div>
        <Label
          htmlFor="filter-city"
          className="text-gray-700 font-medium mb-2 block"
        >
          City
        </Label>
        <Select
          value={filters.city || ""}
          onValueChange={(value) => onFiltersChange({ city: value })}
        >
          <SelectTrigger
            id="filter-city"
            className="border-gray-300 focus:border-red-500 focus:ring-red-500"
          >
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
        <Label
          htmlFor="filter-proptype"
          className="text-gray-700 font-medium mb-2 block"
        >
          Property Type
        </Label>
        <Select
          value={filters.property_type || ""}
          onValueChange={(value) => onFiltersChange({ property_type: value })}
        >
          <SelectTrigger
            id="filter-proptype"
            className="border-gray-300 focus:border-red-500 focus:ring-red-500"
          >
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
        <Label className="text-gray-700 font-medium mb-2 block">
          Price Range (₹)
        </Label>
        <div className="flex gap-3">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ""}
            onChange={(e) =>
              onFiltersChange({
                minPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="border-gray-300 focus:border-red-500 focus:ring-red-500"
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
            className="border-gray-300 focus:border-red-500 focus:ring-red-500"
          />
        </div>
      </div>
    </CardContent>
  </Card>
);

const SkeletonCard = () => (
  <Card className="animate-pulse overflow-hidden shadow-lg">
    <div className="h-56 bg-gradient-to-br from-gray-200 to-gray-300"></div>
    <CardContent className="p-5 space-y-3">
      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </CardContent>
  </Card>
);

const NoResults = ({ onClearFilters }: { onClearFilters: () => void }) => (
  <div className="text-center py-20 col-span-full animate-fade-in">
    <div className="max-w-md mx-auto">
      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-8 shadow-lg">
        <Flame className="w-16 h-16 text-red-600" />
      </div>
      <h3 className="text-3xl font-bold text-gray-900 mb-4">
        No Deals Match Your Filters
      </h3>
      <p className="text-gray-600 mb-10 text-lg">
        Try adjusting your search criteria to see more exclusive offers.
      </p>
      <Button
        variant="default"
        onClick={onClearFilters}
        size="lg"
        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all"
      >
        Clear All Filters
      </Button>
    </div>
  </div>
);

export default HotDeals;
