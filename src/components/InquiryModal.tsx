import React, { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAppSelector, useAppDispatch } from "@/redux/hooks"; // Dispatch import karein
import { createInquiry, reset } from "@/redux/features/inquiries/inquirySlice"; // Thunk import karein
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface InquiryModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: string;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  isOpen,
  onOpenChange,
  propertyId,
}) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const {
    isLoading,
    isSuccess,
    isError,
    message: inquiryMessage,
  } = useAppSelector((state) => state.inquiries);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (isSuccess && isOpen) {
      toast.success("Inquiry sent successfully!");
      onOpenChange(false);
      setMessage("");
      setPhone("");
      dispatch(reset());
    }
    if (isError && isOpen) {
      toast.error(inquiryMessage || "Failed to send inquiry.");
      dispatch(reset());
    }
  }, [isSuccess, isError, inquiryMessage, dispatch, onOpenChange, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !message) {
      toast.error("Please fill all fields.");
      return;
    }
    dispatch(createInquiry({ propertyId, name, email, phone, message }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Inquiry to Owner</DialogTitle>
          <DialogDescription>
            Fill in the details below. The owner will contact you shortly.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="col-span-3"
                placeholder="+91 12345 67890"
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="message" className="text-right">
                Message
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="col-span-3"
                placeholder="I am interested in this property..."
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Sending..." : "Send Inquiry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
