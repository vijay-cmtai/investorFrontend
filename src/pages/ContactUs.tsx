import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, Phone, Mail, MapPin, Building2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  submitContactForm,
  reset,
} from "@/redux/features/contact/contactSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(10, "Phone number must be at least 10 digits."),
  inquiryType: z.string({ required_error: "Please select an inquiry type." }),
  city: z.string().min(1, "City is required."),
  budget: z.string({ required_error: "Please select a budget." }),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type FormData = z.infer<typeof formSchema>;

const ContactUs = () => {
  const dispatch = useAppDispatch();
  const { isLoading, isSuccess, isError, message } = useAppSelector(
    (state) => state.contact
  );
  const form = useForm<FormData>({ resolver: zodResolver(formSchema) });

  useEffect(() => {
    if (isSuccess && message) {
      toast.success(message);
      dispatch(reset());
      form.reset({
        name: "",
        email: "",
        phone: "",
        city: "",
        inquiryType: undefined,
        budget: undefined,
        message: "",
      });
    }
    if (isError && message) {
      toast.error(message);
      dispatch(reset());
    }
  }, [isSuccess, isError, message, dispatch, form]);

  const onSubmit = (data: FormData) => {
    dispatch(submitContactForm(data));
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="py-20 text-center bg-gray-50">
        <div className="container mx-auto px-4 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Get In Touch
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have a question or a property in mind? Our expert advisors are ready
            to assist you on your real estate journey.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-4">Contact Information</h2>
              <p className="text-gray-600 mb-8">
                Reach out to us directly through any of the channels below.
                We're here to help you 24/7.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-red-100 p-3 rounded-full">
                    <Phone className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Call Us</h3>
                    <p className="text-gray-600 hover:text-red-600 transition-colors">
                      +91 98765 43210
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-red-100 p-3 rounded-full">
                    <Mail className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Email Us</h3>
                    <p className="text-gray-600 hover:text-red-600 transition-colors">
                      contact@investorsdeaal.com
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-red-100 p-3 rounded-full">
                    <MapPin className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Our Office</h3>
                    <p className="text-gray-600">
                      123 Real Estate Avenue, Noida Sector 63, New Delhi, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <Card className="p-8 shadow-lg border-gray-200">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  Tell Us What You're Looking For
                </h2>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="you@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="+91 99999 99999"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="inquiryType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>I'm looking to...</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Inquiry Type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Buy a Property">
                                  Buy a Property
                                </SelectItem>
                                <SelectItem value="Rent a Property">
                                  Rent a Property
                                </SelectItem>
                                <SelectItem value="Sell a Property">
                                  Sell a Property
                                </SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred City</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Delhi" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>My Budget is...</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Budget Range" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Below ₹50 Lakh">
                                Below ₹50 Lakh
                              </SelectItem>
                              <SelectItem value="₹50 Lakh - ₹1 Cr">
                                ₹50 Lakh - ₹1 Cr
                              </SelectItem>
                              <SelectItem value="₹1 Cr - ₹3 Cr">
                                ₹1 Cr - ₹3 Cr
                              </SelectItem>
                              <SelectItem value="₹3 Cr - ₹5 Cr">
                                ₹3 Cr - ₹5 Cr
                              </SelectItem>
                              <SelectItem value="Above ₹5 Cr">
                                Above ₹5 Cr
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us more about your requirements..."
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-red-600 text-white hover:bg-red-700"
                      disabled={isLoading}
                    >
                      {isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Submit Inquiry
                    </Button>
                  </form>
                </Form>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section>
        <div className="container mx-auto px-4 pb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Find Us on the Map</h2>
            <p className="text-gray-600 mt-2">
              Visit our office for a face-to-face consultation.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden border-2 border-gray-200 shadow-md">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.260846069901!2d77.37326067512275!3d28.62194887567026!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce544da1eb623%3A0x144f1246473a25f!2sSector%2063%2C%20Noida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
