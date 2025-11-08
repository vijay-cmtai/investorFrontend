import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, Phone, Mail, MapPin, Building2, Send } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  submitContactForm,
  reset,
} from "@/redux/features/contact/contactSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { motion } from "framer-motion";

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

  const bannerImageUrl =
    "https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2070&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-gray-50">
      <section
        className="relative py-32 md:py-40 text-center bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.7), rgba(17, 24, 39, 0.7)), url('${bannerImageUrl}')`,
        }}
      >
        <div className="container mx-auto px-4 text-white">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-extrabold mb-4"
          >
            Get In Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl max-w-3xl mx-auto opacity-90"
          >
            Have a question or a property in mind? Our expert advisors are ready
            to assist you on your real estate journey.
          </motion.p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 bg-gray-900 text-white p-8 rounded-xl shadow-2xl"
            >
              <h2 className="text-3xl font-bold mb-4">Contact Information</h2>
              <p className="text-gray-300 mb-8">
                Reach out to us directly through any of the channels below.
              </p>
              <div className="space-y-6">
                <InfoItem
                  icon={<Phone />}
                  title="Call Us"
                  content="+91 9179140133"
                />
                <InfoItem
                  icon={<Mail />}
                  title="Email Us"
                  content="infoinvestorsdeaal@gmail.com"
                />
                <InfoItem
                  icon={<MapPin />}
                  title="Our Office"
                  content="A-96, Noida Sector 63, New Delhi, India"
                />
              </div>
              <div className="mt-10 pt-6 border-t border-gray-700">
                <h3 className="text-xl font-semibold mb-4">Our Presence</h3>
                <div className="flex flex-wrap gap-3">
                  {["Delhi", "Noida", "Mumbai", "Bangalore", "Pune"].map(
                    (city) => (
                      <div
                        key={city}
                        className="bg-red-600/20 text-red-300 text-sm font-medium px-3 py-1 rounded-full"
                      >
                        {city}
                      </div>
                    )
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-3"
            >
              <Card className="p-8 shadow-xl border-gray-200">
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
                              placeholder="+91 9179140133"
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
                      className="w-full bg-red-600 text-white hover:bg-red-700 text-lg group"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="mr-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                      )}
                      Submit Inquiry
                    </Button>
                  </form>
                </Form>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <section>
        <div className="container mx-auto px-4 pb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Find Us on the Map</h2>
            <p className="text-gray-600 mt-2">
              Visit our office for a face-to-face consultation.
            </p>
          </div>
          <div className="rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
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

// Reusable component for contact info items
const InfoItem = ({
  icon,
  title,
  content,
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
}) => (
  <div className="flex items-start gap-4">
    <div className="bg-red-600/20 p-3 rounded-full">
      {React.cloneElement(icon as React.ReactElement, {
        className: "w-6 h-6 text-red-400",
      })}
    </div>
    <div>
      <h3 className="font-semibold text-lg text-white">{title}</h3>
      <p className="text-gray-300 hover:text-red-400 transition-colors cursor-pointer">
        {content}
      </p>
    </div>
  </div>
);

export default ContactUs;
