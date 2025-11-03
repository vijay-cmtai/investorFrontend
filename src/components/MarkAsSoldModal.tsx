import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  createSale,
  reset as resetSale,
} from "@/redux/features/sales/saleSlice";
import { useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import type { Property } from "@/redux/features/properties/propertySlice";

const formSchema = z.object({
  buyerName: z.string().min(2, "Buyer name is required."),
  buyerEmail: z.string().email("Invalid email address."),
  salePrice: z.coerce.number().min(1, "Sale price must be a positive number."),
});

interface MarkAsSoldModalProps {
  property: Property;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MarkAsSoldModal: React.FC<MarkAsSoldModalProps> = ({
  property,
  isOpen,
  onOpenChange,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading } = useAppSelector((state) => state.sales);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { buyerName: "", buyerEmail: "", salePrice: property.price },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const saleData = {
      property: property._id,
      buyer: {
        name: values.buyerName,
        email: values.buyerEmail,
      },
      salePrice: values.salePrice,
    };
    dispatch(createSale(saleData))
      .unwrap()
      .then((response) => {
        toast.success(response.message || "Property marked as sold!");
        onOpenChange(false);
        dispatch(resetSale());
        navigate("/admin/dashboard");
      })
      .catch((error) => toast.error(error));
  };

  useEffect(() => {
    if (!isOpen) {
      form.reset({ buyerName: "", buyerEmail: "", salePrice: property.price });
    }
  }, [isOpen, property, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Mark as Sold: {property.title}</DialogTitle>
          <DialogDescription>
            Enter the final buyer and sale details to close this deal.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              name="buyerName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <Label>Buyer's Name</Label>
                  <FormControl>
                    <Input placeholder="Rohan Sharma" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="buyerEmail"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <Label>Buyer's Email</Label>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="buyer@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="salePrice"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <Label>Final Sale Price (INR)</Label>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm Sale & Generate Commission
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
