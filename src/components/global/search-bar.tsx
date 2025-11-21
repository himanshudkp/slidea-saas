"use client";
import { Button } from "@/components/ui/button";
import React, {
  useCallback,
  useState,
  useMemo,
  useTransition,
  useEffect,
} from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

type Props = {
  onSearch?: (query: string) => void;
  debounceDelay?: number;
};

const SearchBar = ({ onSearch, debounceDelay = 300 }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const query = searchParams.get("q") || "";
    setSearchQuery(query);
  }, [searchParams]);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        if (query.trim().length < 2) {
          if (query.trim().length > 0) {
            toast.info("Search query must be at least 2 characters");
          }
          return;
        }

        startTransition(() => {
          const params = new URLSearchParams(searchParams);
          params.set("q", query);
          router.push(`?${params.toString()}`);

          if (onSearch) {
            onSearch(query);
          }
        });
      }, debounceDelay);
    },
    [debounceDelay, onSearch, router, searchParams]
  );

  const handleClear = useCallback(() => {
    setSearchQuery("");
    debounceTimerRef.current && clearTimeout(debounceTimerRef.current);

    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.delete("q");
      router.push(params.toString() ? `?${params.toString()}` : "/");

      if (onSearch) {
        onSearch("");
      }
    });
  }, [onSearch, router, searchParams]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (searchQuery.trim().length < 2) {
        toast.info("Search query must be at least 2 characters");
        return;
      }

      startTransition(() => {
        const params = new URLSearchParams(searchParams);
        params.set("q", searchQuery);
        router.push(`?${params.toString()}`);

        if (onSearch) {
          onSearch(searchQuery);
        }
      });
    },
    [searchQuery, onSearch, router, searchParams]
  );

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={cn(
          "relative flex items-center gap-2 px-3 py-2 rounded-full",
          "bg-muted border border-border transition-all duration-200",
          "focus-within:border-primary focus-within:bg-background",
          "hover:border-primary/50",
          isFocused && "border-primary bg-background shadow-sm"
        )}
      >
        <Button
          type="submit"
          className="shrink-0 h-6 w-6 p-0 bg-transparent hover:bg-transparent"
          disabled={isPending}
          aria-label="Search"
          title="Search projects"
        >
          <Search
            className={cn(
              "h-4 w-4 transition-all duration-200",
              isPending ? "animate-spin" : "",
              searchQuery ? "text-primary" : "text-muted-foreground"
            )}
          />
        </Button>

        <Input
          type="text"
          placeholder="Search projects by title..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={isPending}
          className={cn(
            "flex-1 h-6 px-2 py-0 bg-transparent border-none",
            "placeholder:text-muted-foreground",
            "focus-visible:ring-0 focus-visible:ring-offset-0",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "text-sm"
          )}
          aria-label="Search projects"
        />

        {searchQuery && (
          <Button
            type="button"
            onClick={handleClear}
            className="shrink-0 h-6 w-6 p-0 bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground"
            disabled={isPending}
            aria-label="Clear search"
            title="Clear search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        {isPending && (
          <div className="shrink-0 h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        )}
      </div>
    </form>
  );
};

export default SearchBar;
