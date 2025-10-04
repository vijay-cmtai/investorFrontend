import React from "react";
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
import { Badge } from "@/components/ui/badge";

const Enquiries = () => {
  const enquiries = [
    {
      id: "ENQ01",
      property: "Luxury Villa in Mumbai",
      name: "Aarav Patel",
      date: "2024-03-15",
      status: "New",
    },
    {
      id: "ENQ02",
      property: "Office Space in Pune",
      name: "Sneha Reddy",
      date: "2024-03-14",
      status: "Contacted",
    },
    {
      id: "ENQ03",
      property: "Luxury Villa in Mumbai",
      name: "Rohan Mehra",
      date: "2024-03-12",
      status: "Closed",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Enquiries</CardTitle>
        <CardDescription>
          Respond to leads from interested customers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Enquiry ID</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enquiries.map((enquiry) => (
              <TableRow key={enquiry.id}>
                <TableCell>{enquiry.id}</TableCell>
                <TableCell>{enquiry.property}</TableCell>
                <TableCell>{enquiry.name}</TableCell>
                <TableCell>{enquiry.date}</TableCell>
                <TableCell>
                  <Badge
                    variant={enquiry.status === "New" ? "default" : "secondary"}
                  >
                    {enquiry.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Enquiries;
