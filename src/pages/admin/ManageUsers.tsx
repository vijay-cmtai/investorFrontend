import React, { useEffect } from "react";
import { toast } from "sonner";
import { MoreHorizontal, Loader2, PlusCircle, File } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getAllUsers, deleteUser } from "@/redux/features/users/userSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ManageUsers = () => {
  const dispatch = useAppDispatch();
  // Ensure users is always an array, even if it's undefined from the selector initially
  const { users = [], isLoading } = useAppSelector((state) => state.users);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id))
        .unwrap()
        .then(() => toast.success("User deleted successfully."))
        .catch((err) => toast.error(`Failed to delete user: ${err.message}`));
    }
  };

  const getRoleBadge = (role: string) => {
    const roles: { [key: string]: string } = {
      Admin: "border-red-500/50 bg-red-500/10 text-red-700",
      Associate: "border-blue-500/50 bg-blue-500/10 text-blue-700",
      Company: "border-purple-500/50 bg-purple-500/10 text-purple-700",
      Customer: "border-gray-500/50 bg-gray-500/10 text-gray-700",
    };
    return roles[role] || roles.Customer;
  };

  // A single render function for all tabs to avoid code repetition
  const renderUserTable = (userList: typeof users) => {
    if (isLoading && userList.length === 0) {
      return (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (userList.length === 0) {
      return (
        <div className="text-center p-8 text-muted-foreground">
          No users found for this category.
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="hidden md:table-cell">Joined On</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userList.map((user) => (
            <TableRow key={user._id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={`https://avatar.iran.liara.run/public/boy?username=${user.email}`}
                      alt="Avatar"
                    />
                    <AvatarFallback>
                      {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {user.name || "Unnamed User"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {user.email || "No Email"}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getRoleBadge(user.role)}>{user.role}</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>Edit User</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 focus:bg-red-50 focus:text-red-600"
                      onSelect={() => handleDelete(user._id)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="customer">Customers</TabsTrigger>
            <TabsTrigger value="associate">Associates</TabsTrigger>
            <TabsTrigger value="company">Companies</TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <File className="h-3.5 w-3.5" />
              <span>Export</span>
            </Button>
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Add User</span>
            </Button>
          </div>
        </div>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Manage Users</CardTitle>
            <CardDescription>
              View and manage all users on the platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <TabsContent value="all">{renderUserTable(users)}</TabsContent>
            <TabsContent value="customer">
              {renderUserTable(users.filter((u) => u.role === "Customer"))}
            </TabsContent>
            <TabsContent value="associate">
              {renderUserTable(users.filter((u) => u.role === "Associate"))}
            </TabsContent>
            <TabsContent value="company">
              {renderUserTable(users.filter((u) => u.role === "Company"))}
            </TabsContent>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <div className="text-xs text-muted-foreground">
              Showing <strong>{users.length}</strong> of{" "}
              <strong>{users.length}</strong> users.
            </div>
          </CardFooter>
        </Card>
      </Tabs>
    </div>
  );
};

export default ManageUsers;
