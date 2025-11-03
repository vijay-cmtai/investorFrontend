import React, { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getRoles, updateRole, Role } from "@/redux/features/roles/roleSlice";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const RolesAccessControl = () => {
  const dispatch = useAppDispatch();
  const { roles, permissionsList, isLoading } = useAppSelector(
    (state) => state.roles
  );
  const [editableRoles, setEditableRoles] = useState<Role[]>([]);

  useEffect(() => {
    dispatch(getRoles());
  }, [dispatch]);

  useEffect(() => {
    if (roles.length > 0) {
      setEditableRoles(JSON.parse(JSON.stringify(roles)));
    }
  }, [roles]);

  const handleCheckboxChange = (
    roleName: string,
    permission: string,
    checked: boolean
  ) => {
    setEditableRoles((prevRoles) =>
      prevRoles.map((role) => {
        if (role.name === roleName) {
          const newPermissions = checked
            ? [...role.permissions, permission]
            : role.permissions.filter((p) => p !== permission);
          return { ...role, permissions: newPermissions };
        }
        return role;
      })
    );
  };

  const handleSaveChanges = async () => {
    const updatePromises = editableRoles.map((editableRole) => {
      const originalRole = roles.find((r) => r._id === editableRole._id);

      // --- YAHAN PAR BADLAV KIYA GAYA HAI ---
      // 'sort()' se pehle array ki copy banayein
      const originalPermissions = originalRole
        ? [...originalRole.permissions].sort()
        : [];
      const editablePermissions = [...editableRole.permissions].sort();
      // --- BADLAV KHATAM ---

      if (
        JSON.stringify(originalPermissions) !==
        JSON.stringify(editablePermissions)
      ) {
        return dispatch(
          updateRole({
            id: editableRole._id,
            permissions: editableRole.permissions,
          })
        ).unwrap();
      }
      return Promise.resolve(null);
    });

    try {
      const results = await Promise.all(updatePromises);
      if (results.some((r) => r !== null)) {
        toast.success("Permissions updated successfully!");
      } else {
        toast.info("No changes to save.");
      }
    } catch {
      toast.error("Failed to update some permissions. Please try again.");
    }
  };

  const renderContent = () => {
    if (isLoading && roles.length === 0) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (!isLoading && roles.length === 0) {
      return (
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">No roles found.</p>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px] font-semibold">
              Permission
            </TableHead>
            {editableRoles.map((role) => (
              <TableHead key={role._id} className="text-center font-semibold">
                {role.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {permissionsList.map((permission) => (
            <TableRow key={permission}>
              <TableCell className="font-medium">{permission}</TableCell>
              {editableRoles.map((role) => (
                <TableCell key={role._id} className="text-center">
                  <Checkbox
                    checked={role.permissions.includes(permission)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(role.name, permission, !!checked)
                    }
                    disabled={role.name === "Admin"}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Roles & Access Control</CardTitle>
        <CardDescription>
          Define permissions for each user role on the platform. Admin
          permissions cannot be changed.
        </CardDescription>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
      <CardFooter>
        <Button onClick={handleSaveChanges} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Permissions
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RolesAccessControl;
