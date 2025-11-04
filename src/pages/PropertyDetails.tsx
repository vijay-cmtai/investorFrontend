import React, { useEffect, useState, FC } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  getPropertyById,
  reset,
  Property,
  createReview,
  Review,
} from "@/redux/features/properties/propertySlice";
import { toggleWishlist } from "@/redux/features/wishlist/wishlistSlice";
import { RootState } from "@/redux/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Heart,
  Share2,
  Bed,
  Bath,
  Square,
  MapPin,
  Building,
  Phone,
  Mail,
  MessageCircle,
  Armchair,
  Wind,
  Dumbbell,
  ParkingSquare,
  Loader2,
  CheckCircle,
  Star,
} from "lucide-react";
import { InquiryModal } from "@/components/InquiryModal";
import { MarkAsSoldModal } from "@/components/MarkAsSoldModal";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

const PropertyDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [isSoldModalOpen, setIsSoldModalOpen] = useState(false);
  const [mainImage, setMainImage] = useState<string>("");

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

  useEffect(() => {
    if (property?.images && property.images.length > 0) {
      setMainImage(property.images[0]);
    }
  }, [property]);

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
    const ownerPhone = property?.user?.phone || "911234567890";
    const message = `Hello, I'm interested in your property "${property?.title}".`;
    const whatsappUrl = `https://wa.me/${ownerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleShare = async () => {
    const shareData = {
      title: property?.title,
      text: `Check out this amazing property: ${property?.title}`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Property shared successfully!");
      } catch (error) {
        toast.error("Could not share property.");
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Property link copied to clipboard!");
      } catch (error) {
        toast.error("Could not copy link.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
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

  const formatPrice = (price: number, type: string) => {
    const priceStr = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
    return type === "rent" || type === "lease" ? `${priceStr}/month` : priceStr;
  };

  const canMarkAsSold =
    user && (user.role === "Admin" || user.id === property.user?._id);

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 animate-fade-in pl-0"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to listings
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="overflow-hidden animate-scale-in">
              <CardContent className="p-4">
                <div className="aspect-video w-full overflow-hidden rounded-lg mb-4">
                  <img
                    src={
                      mainImage ||
                      "https://via.placeholder.com/800x500?text=No+Image"
                    }
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {property.images.map((image, index) => (
                    <div
                      key={index}
                      className={cn(
                        "aspect-square rounded-md overflow-hidden cursor-pointer border-2",
                        mainImage === image
                          ? "border-primary"
                          : "border-transparent"
                      )}
                      onClick={() => setMainImage(image)}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card
              className="animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-3xl font-bold">
                      {property.title}
                    </CardTitle>
                    <div className="mt-2 flex items-center text-muted-foreground">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span>
                        {property.location?.fullAddress ||
                          "Address not available"}
                      </span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-md">
                    {property.property_type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
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
                    label="Status"
                    value={property.furnishingStatus || "Unfurnished"}
                  />
                </div>
              </CardContent>
            </Card>

            <Card
              className="animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <CardHeader>
                <CardTitle>About this property</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {property.description}
                </p>
              </CardContent>
            </Card>

            <Card
              className="animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <AmenityItem icon={<Armchair />} label="Furnished" />
                <AmenityItem icon={<Wind />} label="Air Conditioning" />
                <AmenityItem icon={<ParkingSquare />} label="Car Parking" />
                <AmenityItem icon={<Dumbbell />} label="Gym" />
              </CardContent>
            </Card>

            <Card
              className="animate-fade-in"
              style={{ animationDelay: "0.5s" }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Customer Reviews ({property.numReviews})
                  <div className="flex items-center ml-2 bg-muted px-2 py-1 rounded-md">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-1" />
                    <span className="font-bold">
                      {property.averageRating?.toFixed(1) || "0.0"}
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AddReviewForm
                  propertyId={property._id}
                  reviews={property.reviews || []}
                />
                <div className="mt-8 space-y-6">
                  {property.reviews && property.reviews.length > 0 ? (
                    property.reviews.map((review) => (
                      <ReviewItem key={review._id} review={review} />
                    ))
                  ) : (
                    <p className="py-8 text-center text-muted-foreground">
                      No reviews yet. Be the first to write one!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card
              className="sticky top-24 animate-fade-in"
              style={{ animationDelay: "0.5s" }}
            >
              <CardHeader className="text-center">
                <p className="text-3xl font-bold text-primary">
                  {formatPrice(property.price, property.transaction_type)}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleToggleFavorite}
                  >
                    <Heart
                      className={cn(
                        "w-5 h-5",
                        isWishlisted
                          ? "text-red-500 fill-red-500"
                          : "text-muted-foreground"
                      )}
                    />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleShare}>
                    <Share2 className="w-5 h-5 text-muted-foreground" />
                  </Button>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-4 text-center">
                    Contact Owner
                  </h3>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={`https://avatar.iran.liara.run/public/boy?username=${property.user?.email}`}
                      />
                      <AvatarFallback>
                        {property.user?.name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">
                        {property.user?.name || "Owner"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {property.user?.role}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Button
                      className="w-full bg-green-500 text-white hover:bg-green-600"
                      onClick={handleStartChat}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" /> Chat on
                      WhatsApp
                    </Button>
                    <Button
                      variant="default"
                      className="w-full"
                      onClick={() =>
                        toast.info(`Calling ${property.user?.name}...`)
                      }
                    >
                      <Phone className="w-4 h-4 mr-2" /> Call Now
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsEnquiryModalOpen(true)}
                    >
                      <Mail className="w-4 h-4 mr-2" /> Send Inquiry
                    </Button>
                    {canMarkAsSold && (
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => setIsSoldModalOpen(true)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" /> Mark as Sold
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {id && (
        <InquiryModal
          isOpen={isEnquiryModalOpen}
          onOpenChange={setIsEnquiryModalOpen}
          propertyId={id}
        />
      )}
      {id && (
        <MarkAsSoldModal
          property={property}
          isOpen={isSoldModalOpen}
          onOpenChange={setIsSoldModalOpen}
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
  <div className="flex flex-col items-center text-center p-3 rounded-lg bg-muted/40">
    <div className="text-primary mb-2">{icon}</div>
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="font-semibold">{value}</p>
  </div>
);
const AmenityItem = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <div className="flex items-center gap-3">
    <div className="text-primary">{icon}</div>
    <span>{label}</span>
  </div>
);

const ReviewItem = ({ review }: { review: Review }) => (
  <div className="flex gap-4 border-t pt-6 first:border-t-0 first:pt-0">
    <Avatar>
      <AvatarImage
        src={`https://avatar.iran.liara.run/public/boy?username=${review.user.name}`}
      />
      <AvatarFallback>{review.user.name?.charAt(0) || "U"}</AvatarFallback>
    </Avatar>
    <div>
      <div className="flex items-center gap-2">
        <p className="font-semibold">{review.user.name}</p>
        <span className="text-xs text-muted-foreground">
          {new Date(review.createdAt).toLocaleDateString()}
        </span>
      </div>
      <div className="flex items-center my-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
      <p className="text-muted-foreground">{review.comment}</p>
    </div>
  </div>
);

const AddReviewForm = ({
  propertyId,
  reviews,
}: {
  propertyId: string;
  reviews: Review[];
}) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  if (!user)
    return (
      <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
        Please log in to write a review.
      </p>
    );

  const hasReviewed = reviews.some((review) => review.user._id === user.id);
  if (hasReviewed)
    return (
      <p className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
        You have already reviewed this property.
      </p>
    );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !comment.trim()) {
      return toast.error("Please provide a rating and a comment.");
    }
    dispatch(createReview({ propertyId, rating, comment }))
      .unwrap()
      .then(() => {
        toast.success("Review submitted! It will be updated shortly.");
        setRating(0);
        setComment("");
        dispatch(getPropertyById(propertyId));
      })
      .catch((err) => toast.error(err));
  };

  return (
    <form onSubmit={handleSubmit} className="border-t pt-6 mt-6">
      <h4 className="font-semibold mb-3">Write Your Review</h4>
      <div className="mb-4">
        <div className="flex items-center">
          {[...Array(5)].map((_, index) => {
            const starValue = index + 1;
            return (
              <Star
                key={starValue}
                className={`w-7 h-7 cursor-pointer transition-colors ${starValue <= (hoverRating || rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHoverRating(starValue)}
                onMouseLeave={() => setHoverRating(0)}
              />
            );
          })}
        </div>
      </div>
      <div className="mb-4">
        <Textarea
          placeholder="Share your thoughts about the property, location, and your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
        />
      </div>
      <Button type="submit">Submit Review</Button>
    </form>
  );
};

export default PropertyDetails;
