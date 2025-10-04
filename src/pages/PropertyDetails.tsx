import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  getPropertyById,
  reset,
} from "@/redux/features/properties/propertySlice";
import { toggleWishlist } from "@/redux/features/wishlist/wishlistSlice";
import { RootState } from "@/redux/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import {
  ArrowLeft,
  Heart,
  Share2,
  Bed,
  Bath,
  Square,
  MapPin,
  Calendar,
  Building,
  Phone,
  Mail,
  MessageCircle, // WhatsApp के लिए भी यही आइकॉन ठीक है
} from "lucide-react";
import { InquiryModal } from "@/components/InquiryModal";
import { toast } from "sonner";

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  const { property, isLoading, isError } = useAppSelector(
    (state: RootState) => state.properties
  );
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { itemIds: wishlistedIds } = useAppSelector(
    (state: RootState) => state.wishlist
  );

  const isWishlisted = property ? wishlistedIds.includes(property._id) : false;

  useEffect(() => {
    if (id) {
      dispatch(getPropertyById(id));
    }
    return () => {
      dispatch(reset());
    };
  }, [dispatch, id]);

  const handleToggleFavorite = () => {
    if (!user) {
      toast.error("Please log in to add properties to your wishlist.");
      navigate("/auth");
      return;
    }
    if (id) {
      dispatch(toggleWishlist(id));
    }
  };

  const handleStartChat = () => {
    const ownerPhone = property?.user?.phone;
    if (!ownerPhone) {
      toast.error("Owner's phone number is not available for chat.");
      return;
    }

    // फ़ोन नंबर से special characters (+, -, space) हटा दें
    const cleanedPhone = ownerPhone.replace(/\D/g, "");

    // एक प्री-फिल्ड मैसेज बनाएं
    const message = `Hello, I'm interested in your property "${property.title}". Can you provide more details?`;
    const encodedMessage = encodeURIComponent(message);

    // WhatsApp URL बनाएं
    const whatsappUrl = `https://wa.me/${cleanedPhone}?text=${encodedMessage}`;

    // नई टैब में URL खोलें
    window.open(whatsappUrl, "_blank");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading property details...
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
          <p className="text-muted-foreground mb-4">
            Could not load details for this property.
          </p>
          <Button onClick={() => navigate("/")}>Go Back Home</Button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number, status: string) => {
    const priceStr = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
    return status === "rent" || status === "lease"
      ? `${priceStr}/month`
      : priceStr;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-6 animate-fade-in"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden animate-scale-in">
              <Carousel plugins={[plugin.current]} className="w-full">
                <CarouselContent>
                  {property.images && property.images.length > 0 ? (
                    property.images.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="aspect-video">
                          <img
                            src={image}
                            alt={`${property.title} - Image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </CarouselItem>
                    ))
                  ) : (
                    <CarouselItem>
                      <div className="aspect-video bg-muted">
                        <img
                          src="https://via.placeholder.com/800x500?text=No+Image"
                          alt="Placeholder"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  )}
                </CarouselContent>
                <CarouselPrevious className="absolute left-4" />
                <CarouselNext className="absolute right-4" />
              </Carousel>
            </Card>

            <Card
              className="animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      {property.title}
                    </h1>
                    <p className="text-3xl font-bold text-primary">
                      {formatPrice(property.price, property.transaction_type)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleToggleFavorite}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          isWishlisted
                            ? "text-red-500 fill-red-500"
                            : "text-muted-foreground"
                        }`}
                      />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="w-5 h-5 text-muted-foreground" />
                    </Button>
                  </div>
                </div>

                <div className="mt-4 flex items-center text-muted-foreground">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>
                    {property.location?.fullAddress || "Address not available"}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 mt-6 border-t">
                  <InfoBox
                    icon={<Bed />}
                    label="Bedrooms"
                    value={property.bedrooms}
                  />
                  <InfoBox
                    icon={<Bath />}
                    label="Bathrooms"
                    value={property.bathrooms}
                  />
                  <InfoBox
                    icon={<Square />}
                    label="Area"
                    value={`${property.square_feet.toLocaleString()} sqft`}
                  />
                  <InfoBox
                    icon={<Building />}
                    label="Type"
                    value={property.property_type}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {property.user && (
              <Card
                className="sticky top-24 animate-fade-in"
                style={{ animationDelay: "0.3s" }}
              >
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Contact Owner</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">
                        {property.user?.name || "Owner Name"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Property Owner
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Button className="w-full">
                        <Phone className="w-4 h-4 mr-2" /> Call Now
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleStartChat}
                        disabled={!property.user?.phone}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" /> Start Chat
                      </Button>
                      <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() => setIsModalOpen(true)}
                      >
                        <Mail className="w-4 h-4 mr-2" /> Send Inquiry
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {id && (
        <InquiryModal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          propertyId={id}
        />
      )}
    </div>
  );
};

const InfoBox = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) => (
  <div className="flex items-center p-3 bg-muted/30 rounded-lg">
    <div className="mr-3 text-primary">{icon}</div>
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
);

export default PropertyDetails;
