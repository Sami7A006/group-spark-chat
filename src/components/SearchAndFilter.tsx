
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useData } from "../contexts/DataContext";
import { Search } from "lucide-react";

export const SearchAndFilter: React.FC = () => {
  const { setFilterQuery } = useData();
  const [query, setQuery] = useState("");
  
  useEffect(() => {
    const debounce = setTimeout(() => {
      setFilterQuery(query);
    }, 300);
    
    return () => clearTimeout(debounce);
  }, [query, setFilterQuery]);
  
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search by name, description, or tags..."
        className="pl-9"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
};
