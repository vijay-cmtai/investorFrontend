import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, Camera } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updateProfile, reset } from "@/redux/features/users/userSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ProfileFormData = {
  name: string;
  email: string;
  phone?: string;
};

const UserProfile = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { isSuccess, isError, message, isLoading } = useAppSelector(
    (state) => state.users
  );
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset: resetForm,
  } = useForm<ProfileFormData>();

  useEffect(() => {
    if (user) {
      resetForm({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
      });
      setPreviewImage(user.profileImage || null);
    }
  }, [user, resetForm]);

  useEffect(() => {
    if (isSuccess && message) {
      toast.success(message);
      dispatch(reset());
    }
    if (isError && message) {
      toast.error(message);
      dispatch(reset());
    }
  }, [isSuccess, isError, message, dispatch]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const onProfileSubmit = (data: ProfileFormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.phone) {
      formData.append("phone", data.phone);
    }
    if (profileImageFile) {
      formData.append("profileImage", profileImageFile);
    }
    dispatch(updateProfile(formData));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">My Profile</h3>
        <p className="text-sm text-muted-foreground">
          View and manage your personal information.
        </p>
      </div>
      <Separator />
      <form onSubmit={handleSubmit(onProfileSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage
                    src={
                      previewImage ||
                      `https://avatar.iran.liara.run/public/boy?username=${user?.name}`
                    }
                  />
                  <AvatarFallback className="text-4xl">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    document.getElementById("profileImageInput")?.click()
                  }
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Change Picture
                </Button>
                <Input
                  id="profileImageInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Keep your details up to date.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" {...register("name")} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 12345 67890"
                    {...register("phone")}
                  />
                </div>
              </CardContent>
              <div className="p-6 pt-0 flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Update Profile
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
