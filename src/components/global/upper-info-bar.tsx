"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { User } from "@/generated/prisma/client";
import { useTheme } from "next-themes";
import React, { useCallback, useState } from "react";
import SearchBar from "./search-bar";
import ThemeSwitcher from "./theme-switcher";
import { Upload } from "lucide-react";
import NewProjectButton from "./new-project-button";
import { cn } from "@/lib/utils";
import { showError, showSuccess } from "@/lib/toast";

type Props = {
  user: User;
};

const UpperInfoBar = ({ user }: Props) => {
  const { theme, setTheme } = useTheme();
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = useCallback(async () => {
    setIsImporting(true);
    try {
      // TODO: Implement file import logic
      // Example: Open file picker, validate, and import
      console.log("Opening import dialog...");
      showSuccess(
        "Import feature coming soon",
        "You'll be able to import presentations from your device"
      );
    } catch (error) {
      console.error("Import failed:", error);
      showError("Import failed", "Please try again");
    } finally {
      setIsImporting(false);
    }
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex shrink-0 flex-wrap items-center gap-2",
        "border-b border-border bg-background/95 backdrop-blur-sm p-4",
        "justify-between transition-all duration-200"
      )}
    >
      <div className="flex items-center gap-2">
        <SidebarTrigger
          className="transition-colors duration-200 hover:bg-muted"
          title="Toggle sidebar"
        />
        <Separator className="h-6" orientation="vertical" />
      </div>

      <div className="flex-1 max-w-xl mx-4">
        <SearchBar />
      </div>

      <div className="flex items-center gap-3 ml-auto flex-wrap justify-end">
        <ThemeSwitcher />

        <Button
          size="lg"
          variant="outline"
          onClick={handleImport}
          disabled={isImporting}
          className={cn(
            "gap-2 font-medium transition-all duration-200",
            "hover:bg-primary/10 hover:border-primary/50"
          )}
          aria-label="Import presentation"
          title="Import a presentation from your device"
        >
          <Upload className="h-4 w-4" />
          <span className="hidden sm:inline">Import</span>
          {isImporting && (
            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
          )}
        </Button>

        <NewProjectButton user={user} />
      </div>
    </header>
  );
};

export default UpperInfoBar;
