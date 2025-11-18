import { Button } from "@/components/ui/button";
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
type Props = {};

const SearchBar = (props: Props) => {
  return (
    <div className="min-w-[60%] relative flex items-center border rounded-full bg-primary-90">
      <Button
        className=" absolute left-2 h-full rounded-l-none bg-transparent hover:bg-transparent"
        type="submit"
        size={"sm"}
        variant={"ghost"}
      >
        <Search className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </Button>
      <Input
        type="text"
        placeholder="Search by title"
        className="flex bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 ml-6"
      />
    </div>
  );
};

export default SearchBar;
