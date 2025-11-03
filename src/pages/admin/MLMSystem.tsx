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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp } from "lucide-react";

const MLMSystem = () => {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>MLM & Referral Network</CardTitle>
          <CardDescription>
            Visualize your multi-level marketing structure and track
            performance.
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Associates</CardDescription>
            <CardTitle className="text-4xl">1,257</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              +25% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Commissions Paid</CardDescription>
            <CardTitle className="text-4xl">₹8,42,500</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              +18% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Top Earner</CardDescription>
            <CardTitle className="text-4xl">Ravi Kumar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              ₹98,000 this month
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Network Hierarchy</CardTitle>
          <CardDescription>
            Example view of an associate's downline.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Simplified Tree View */}
          <div className="pl-4 border-l-2">
            <div className="font-semibold">You (Admin)</div>
            <div className="pl-6 pt-2 border-l-2 ml-2">
              <div className="font-medium">Sunita Sharma (Level 1)</div>
              <div className="pl-6 pt-2 border-l-2 ml-2">
                <div>Vikram Singh (Level 2)</div>
                <div>Priya Desai (Level 2)</div>
              </div>
            </div>
            <div className="pl-6 pt-2 border-l-2 ml-2">
              <div className="font-medium">Amit Patel (Level 1)</div>
              <div className="pl-6 pt-2 border-l-2 ml-2">
                <div>Neha Gupta (Level 2)</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default MLMSystem;
