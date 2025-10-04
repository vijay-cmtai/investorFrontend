import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { MoreHorizontal, Loader2 } from "lucide-react";

import { AppDispatch, RootState } from "../../redux/store";
import {
  getBrokers,
  updateUser,
  deleteUser,
} from "@/redux/features/users/userSlice";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type User = {
  _id: string;
  name: string;
  email: string;
  agency: string;
  status: "Active" | "Inactive";
  role: string;
};

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  agency: z.string().optional(),
  status: z.enum(["Active", "Inactive"]),
});

interface BrokerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  broker: User | null;
}

const BrokerFormModal: React.FC<BrokerFormModalProps> = ({
  isOpen,
  onClose,
  broker,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", agency: "", status: "Active" },
  });

  useEffect(() => {
    if (broker) {
      form.reset({
        name: broker.name,
        email: broker.email,
        agency: broker.agency || "",
        status: broker.status,
      });
    }
  }, [broker, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!broker) return;
    try {
      await dispatch(updateUser({ id: broker._id, userData: values })).unwrap();
      toast.success("Broker updated successfully!");
      onClose();
    } catch (error: any) {
      toast.error(error || "An error occurred.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Broker</DialogTitle>
          <DialogDescription>
            Update the details of the broker.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="agency"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agency (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="status"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const ManageBrokers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    users: brokers,
    isLoading,
    isError,
    message,
  } = useSelector((state: RootState) => state.users);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState<User | null>(null);

  useEffect(() => {
    dispatch(getBrokers());
  }, [dispatch]);

  const handleOpenModal = (broker: User) => {
    setSelectedBroker(broker);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBroker(null);
  };

  const handleDeleteBroker = (id: string) => {
    if (window.confirm("Are you sure you want to delete this broker?")) {
      dispatch(deleteUser(id))
        .unwrap()
        .then(() => toast.success("Broker deleted successfully"))
        .catch((error) => toast.error(error || "Failed to delete broker"));
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Manage Brokers</CardTitle>
          <CardDescription>View, update, or delete brokers.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Broker ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Agency</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-red-600 py-10"
                  >
                    {message}
                  </TableCell>
                </TableRow>
              ) : brokers.length > 0 ? (
                brokers.map((broker) => (
                  <TableRow key={broker._id}>
                    <TableCell className="font-mono text-xs">
                      {broker._id.slice(-6)}
                    </TableCell>
                    <TableCell>{broker.name}</TableCell>
                    <TableCell>{broker.agency || "N/A"}</TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${broker.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                      >
                        {broker.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onSelect={() => handleOpenModal(broker)}
                          >
                            Edit Broker
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onSelect={() => handleDeleteBroker(broker._id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    No brokers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <BrokerFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        broker={selectedBroker}
      />
    </>
  );
};

export default ManageBrokers;
