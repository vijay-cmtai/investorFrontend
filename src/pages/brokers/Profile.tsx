import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updateUser } from "@/redux/features/users/userSlice";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const BrokerProfile = () => {
  const dispatch = useAppDispatch();

  // 1. authSlice से लॉग-इन यूजर की जानकारी लें
  const { user } = useAppSelector((state) => state.auth);

  // 2. userSlice से लोडिंग स्टेट लें (क्योंकि updateUser एक्शन यहीं से है)
  const { isLoading } = useAppSelector((state) => state.users);

  // 3. फॉर्म के लिए लोकल स्टेट बनाएं
  const [formData, setFormData] = useState({
    name: "",
    agency: "",
    phone: "",
  });

  // 4. जब Redux से user ऑब्जेक्ट मिले, तो फॉर्म की स्टेट को सेट करें
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        agency: user.agency || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  // 5. इनपुट फील्ड्स में बदलाव को हैंडल करें
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // 6. फॉर्म सबमिट होने पर प्रोफाइल अपडेट करें
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    dispatch(updateUser({ id: user._id, userData: formData }))
      .unwrap()
      .then(() => {
        toast.success("Profile updated successfully!");
      })
      .catch((error) => {
        toast.error(error || "Failed to update profile.");
      });
  };

  // 7. अगर यूजर की जानकारी अभी लोड नहीं हुई है, तो लोडर दिखाएं
  if (!user) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleProfileUpdate}>
      <Card>
        <CardHeader>
          <CardTitle>My Broker Profile</CardTitle>
          <CardDescription>
            Update your public information and contact details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="agency">Agency Name</Label>
            <Input
              id="agency"
              value={formData.agency}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" value={user.email} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Profile
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default BrokerProfile;
