import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { MoreHorizontal, Loader2, PlusCircle, File } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  getAllUsers,
  deleteUser,
  updateUser,
} from "@/redux/features/users/userSlice";
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
  const { users, isLoading } = useAppSelector((state) => state.users);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteUser(id))
        .unwrap()
        .then(() => toast.success("User deleted."));
    }
  };

  const getRoleBadge = (role) => {
    const roles = {
      Admin: "bg-red-100 text-red-800",
      Associate: "bg-blue-100 text-blue-800",
      Company: "bg-purple-100 text-purple-800",
      Customer: "bg-gray-100 text-gray-800",
    };
    return roles[role] || roles.Customer;
  };

  const renderTable = (filteredUsers) => (
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
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={4} className="h-24 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin" />
            </TableCell>
          </TableRow>
        ) : (
          filteredUsers.map((user) => (
            <TableRow key={user._id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={`https://avatar.iran.liara.run/public/boy?username=${user.email}`}
                      alt="Avatar"
                    />
                    <AvatarFallback>
                      {/* --- FIX #1: Check if user.name exists before using charAt --- */}
                      {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    {/* --- FIX #2: Provide a fallback for the name --- */}
                    <div className="font-medium">
                      {user.name || "Unnamed User"}
                    </div>
                    {/* --- FIX #3: Provide a fallback for the email --- */}
                    <div className="text-sm text-muted-foreground">
                      {user.email || "No Email"}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getRoleBadge(user.role)}>
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {/* --- FIX #4: Provide a fallback for the date --- */}
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
                      className="text-red-500"
                      onSelect={() => handleDelete(user._id)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="customer">Customers</TabsTrigger>
          <TabsTrigger value="associate">Associates</TabsTrigger>
          <TabsTrigger value="company">Companies</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-7 gap-1">
            <File className="h-3.5 w-3.5" />
            <span>Export</span>
          </Button>
          <Button size="sm" className="h-7 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Add User</span>
          </Button>
        </div>
      </div>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Manage all users of your platform, including customers, associates,
            and companies.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TabsContent value="all">{renderTable(users)}</TabsContent>
          <TabsContent value="customer">
            {renderTable(users.filter((u) => u.role === "Customer"))}
          </TabsContent>
          <TabsContent value="associate">
            {renderTable(users.filter((u) => u.role === "Associate"))}
          </TabsContent>
          <TabsContent value="company">
            {renderTable(users.filter((u) => u.role === "Company"))}
          </TabsContent>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-{users.length}</strong> of{" "}
            <strong>{users.length}</strong> users
          </div>
        </CardFooter>
      </Card>
    </Tabs>
  );
};

export default ManageUsers;
