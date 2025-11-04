import React, { useEffect } from "react"; // <-- YEH LINE THEEK KAR DI GAYI HAI
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, Phone, Mail, MapPin } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  submitContactForm,
  reset,
} from "@/redux/features/contact/contactSlice";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card"; // Card import kar liya
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type FormData = {
  name: string;
  email: string;
  message: string;
};

const ContactUs = () => {
  const dispatch = useAppDispatch();
  const { isLoading, isSuccess, isError, message } = useAppSelector(
    (state) => state.contact
  );

  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    if (isSuccess && message) {
      toast.success(message);
      dispatch(reset());
      resetForm();
    }
    if (isError && message) {
      toast.error(message);
      dispatch(reset());
    }
  }, [isSuccess, isError, message, dispatch, resetForm]);

  const onSubmit = (data: FormData) => {
    dispatch(submitContactForm(data));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-primary/10 to-accent/10 py-20 text-center">
        <div className="container mx-auto px-4 animate-fade-in">
          <Mail className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We'd love to hear from you. Whether you have a question, feedback,
            or need assistance, we're here to help.
          </p>
        </div>
      </section>

      {/* Contact Form and Info Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden shadow-lg">
            <div className="grid md:grid-cols-2">
              {/* Contact Info */}
              <div className="p-8 bg-muted/30">
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <p className="text-muted-foreground mb-8">
                  Fill up the form and our team will get back to you within 24
                  hours.
                </p>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Phone className="w-6 h-6 text-primary" />
                    <span className="text-lg">+91 98765 43210</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Mail className="w-6 h-6 text-primary" />
                    <span className="text-lg">contact@investorsdeaal.com</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <MapPin className="w-6 h-6 text-primary" />
                    <span className="text-lg">
                      123 Real Estate Avenue, New Delhi, India
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      {...register("name", { required: "Name is required" })}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email address",
                        },
                      })}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Your message here..."
                      rows={5}
                      {...register("message", {
                        required: "Message is required",
                      })}
                    />
                    {errors.message && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.message.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
