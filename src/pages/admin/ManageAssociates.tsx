import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { MoreHorizontal, Loader2 } from "lucide-react";

import { AppDispatch, RootState } from "../../redux/store";
import {
  getAssociates,
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

type Associate = {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
  role: string;
  company?: {
    _id: string;
    name: string;
  };
};

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  isActive: z.string().transform((val) => val === "true"),
});

interface AssociateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  associate: Associate | null;
}

const AssociateFormModal: React.FC<AssociateFormModalProps> = ({
  isOpen,
  onClose,
  associate,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", isActive: true },
  });

  useEffect(() => {
    if (associate) {
      form.reset({
        name: associate.name,
        email: associate.email,
        isActive: associate.isActive,
      });
    }
  }, [associate, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!associate) return;
    try {
      await dispatch(
        updateUser({ id: associate._id, userData: values })
      ).unwrap();
      toast.success("Associate updated successfully!");
      onClose();
    } catch (error: any) {
      toast.error(error.message || "An error occurred.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Associate</DialogTitle>
          <DialogDescription>
            Update the details of the associate.
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
              name="isActive"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
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

const ManageAssociates = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    users: associates,
    isLoading,
    isError,
    message,
  } = useSelector((state: RootState) => state.users);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssociate, setSelectedAssociate] = useState<Associate | null>(
    null
  );

  useEffect(() => {
    dispatch(getAssociates());
  }, [dispatch]);

  const handleOpenModal = (associate: Associate) => {
    setSelectedAssociate(associate);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAssociate(null);
  };

  const handleDeleteAssociate = (id: string) => {
    if (window.confirm("Are you sure you want to delete this associate?")) {
      dispatch(deleteUser(id))
        .unwrap()
        .then(() => toast.success("Associate deleted successfully"))
        .catch((error) =>
          toast.error(error.message || "Failed to delete associate")
        );
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Manage Associates</CardTitle>
          <CardDescription>View, update, or delete associates.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Associate ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
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
              ) : associates.length > 0 ? (
                associates.map((associate) => (
                  <TableRow key={associate._id}>
                    <TableCell className="font-mono text-xs">
                      {associate._id.slice(-6)}
                    </TableCell>
                    <TableCell>{associate.name}</TableCell>
                    <TableCell>{associate.company?.name || "N/A"}</TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${associate.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                      >
                        {associate.isActive ? "Active" : "Inactive"}
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
                            onSelect={() => handleOpenModal(associate)}
                          >
                            Edit Associate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onSelect={() =>
                              handleDeleteAssociate(associate._id)
                            }
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
                    No associates found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AssociateFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        associate={selectedAssociate}
      />
    </>
  );
};

export default ManageAssociates;
