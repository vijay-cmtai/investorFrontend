import React, { useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { getProperties } from "@/redux/features/properties/propertySlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";

const PropertySearch = () => {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [transactionType, setTransactionType] = useState("sale");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(getProperties({ city: searchTerm }));
  };

  return (
    <Card className="p-4 md:p-6 shadow-2xl bg-background/90 backdrop-blur-sm">
      <form
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row items-center gap-4"
      >
        <div className="w-full flex items-center bg-background rounded-md border">
          <MapPin className="h-5 w-5 text-muted-foreground ml-3" />
          <Input
            type="text"
            placeholder="Search by city or locality..."
            className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={transactionType} onValueChange={setTransactionType}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sale">For Sale</SelectItem>
            <SelectItem value="rent">For Rent</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" className="w-full md:w-auto">
          <Search className="h-4 w-4 mr-2" /> Search
        </Button>
      </form>
    </Card>
  );
};

export default PropertySearch;
