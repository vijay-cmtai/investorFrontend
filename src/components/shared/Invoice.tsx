import React, { FC } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Sale } from "@/redux/features/sales/saleSlice";
import { format } from "date-fns";

interface InvoiceProps {
  sale: Sale | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const InvoiceModal: FC<InvoiceProps> = ({
  sale,
  isOpen,
  onOpenChange,
}) => {
  if (!sale) return null;

  const generateAndDownloadPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Investorsdeaal", 20, 30);
    doc.text("123 Real Estate Ave, New Delhi", 20, 35);

    doc.text(`Invoice #: SALE-${sale._id.slice(-6)}`, 190, 30, {
      align: "right",
    });
    doc.text(
      `Date: ${format(new Date(sale.saleDate), "dd MMM, yyyy")}`,
      190,
      35,
      { align: "right" }
    );

    // Bill To
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Bill To:", 20, 50);
    doc.setFont("helvetica", "normal");
    doc.text(sale.buyer.name, 20, 56);
    doc.text(sale.buyer.email, 20, 61);

    // Table
    autoTable(doc, {
      startY: 75,
      head: [["Description", "Associate", "Price"]],
      body: [
        [
          `Sale of Property: ${sale.property.title}`,
          sale.sellerAssociate.name,
          `₹${sale.salePrice.toLocaleString("en-IN")}`,
        ],
      ],
      theme: "striped",
      headStyles: { fillColor: [34, 34, 34] },
    });

    // Total
    const finalY = (doc as any).lastAutoTable.finalY;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Total Amount:", 140, finalY + 15);
    doc.text(`₹${sale.salePrice.toLocaleString("en-IN")}`, 190, finalY + 15, {
      align: "right",
    });

    // Footer
    doc.setFontSize(10);
    doc.text(
      "Thank you for your business!",
      105,
      doc.internal.pageSize.height - 20,
      { align: "center" }
    );

    doc.save(`Invoice-SALE-${sale._id.slice(-6)}.pdf`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Invoice Preview</DialogTitle>
          <DialogDescription>
            Review the invoice details before downloading.
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 border rounded-md my-4 bg-white text-black">
          {/* Simple Preview */}
          <h2 className="text-2xl font-bold mb-4">INVOICE</h2>
          <div className="flex justify-between mb-4">
            <div>
              <strong>Bill To:</strong> {sale.buyer.name}
            </div>
            <div>
              <strong>Date:</strong>{" "}
              {format(new Date(sale.saleDate), "dd MMM, yyyy")}
            </div>
          </div>
          <p className="mb-2">
            <strong>Property:</strong> {sale.property.title}
          </p>
          <p className="text-xl font-bold text-right mt-4">
            Total: ₹{sale.salePrice.toLocaleString("en-IN")}
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={generateAndDownloadPDF}>Download PDF</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
