import React, { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { CSVLink } from "react-csv";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getAllSales, Sale } from "@/redux/features/sales/saleSlice";
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
import { Button } from "@/components/ui/button";
import { MoreHorizontal, File, Loader2, Search, Receipt } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { InvoiceModal } from "@/components/shared/Invoice"; // <-- NAYA IMPORT

const ManageOrders = () => {
  const dispatch = useAppDispatch();
  const { sales, isLoading } = useAppSelector((state) => state.sales);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  useEffect(() => {
    dispatch(getAllSales());
  }, [dispatch]);

  const filteredSales = useMemo(() => {
    if (!searchQuery) return sales;
    const lowercasedQuery = searchQuery.toLowerCase();
    return sales.filter(
      (sale) =>
        sale.buyer?.name?.toLowerCase().includes(lowercasedQuery) ||
        sale.property?.title?.toLowerCase().includes(lowercasedQuery) ||
        sale.sellerAssociate?.name?.toLowerCase().includes(lowercasedQuery)
    );
  }, [sales, searchQuery]);

  const csvData = filteredSales.map((sale) => ({
    saleId: sale._id,
    buyerName: sale.buyer?.name ?? "N/A",
    propertyTitle: sale.property?.title ?? "N/A",
    associateName: sale.sellerAssociate?.name ?? "N/A",
    salePrice: sale.salePrice,
    saleDate: sale.saleDate
      ? format(new Date(sale.saleDate), "yyyy-MM-dd")
      : "N/A",
  }));

  const handleGenerateInvoice = (sale: Sale) => {
    setSelectedSale(sale);
    setIsInvoiceOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div>
              <CardTitle>Manage Orders & Deals</CardTitle>
              <CardDescription>
                Track and manage all property transactions.
              </CardDescription>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search deals..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <CSVLink data={csvData} filename="sales-report.csv">
                <Button size="sm" variant="outline" className="h-9 gap-1">
                  <File className="h-3.5 w-3.5" />
                  <span>Export</span>
                </Button>
              </CSVLink>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Buyer</TableHead>
                <TableHead>Property</TableHead>
                <TableHead className="hidden md:table-cell">
                  Associate
                </TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && sales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                  </TableCell>
                </TableRow>
              ) : filteredSales.length > 0 ? (
                filteredSales.map((sale) => (
                  <TableRow key={sale._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="hidden h-9 w-9 sm:flex">
                          <AvatarImage
                            src={`https://avatar.iran.liara.run/public/boy?username=${sale.buyer?.email}`}
                          />
                          <AvatarFallback>
                            {sale.buyer?.name?.charAt(0) ?? "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid gap-0.5">
                          <div className="font-medium">
                            {sale.buyer?.name ?? "N/A"}
                          </div>
                          <div className="hidden text-sm text-muted-foreground md:inline">
                            {sale.buyer?.email ?? "No Email"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {sale.property?.title ?? "Property Deleted"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {sale.sellerAssociate?.name ?? "Associate Deleted"}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {sale.saleDate
                        ? format(new Date(sale.saleDate), "dd MMM, yyyy")
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                        maximumFractionDigits: 0,
                      }).format(sale.salePrice)}
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
                          <DropdownMenuItem
                            onSelect={() => handleGenerateInvoice(sale)}
                          >
                            <Receipt className="mr-2 h-4 w-4" />
                            <span>Generate Invoice</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No sales found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>{filteredSales.length}</strong> of{" "}
            <strong>{sales.length}</strong> deals
          </div>
        </CardFooter>
      </Card>

      <InvoiceModal
        sale={selectedSale}
        isOpen={isInvoiceOpen}
        onOpenChange={setIsInvoiceOpen}
      />
    </>
  );
};

export default ManageOrders;
