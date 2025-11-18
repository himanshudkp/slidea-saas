"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { User } from "@/generated/prisma/client";
import { useTheme } from "next-themes";
import React from "react";
import SearchBar from "./search-bar";
import ThemeSwitcher from "./theme-switcher";
import { Upload } from "lucide-react";
import NewProjectButton from "./new-project-button";

type Props = {
  user: User;
};

const UpperInfoBar = ({ user }: Props) => {
  const { theme, setTheme } = useTheme();
  return (
    <header className="sticky top-0 z-10 flex shrink-0 flex-wrap items-center gap-2 border-bg-background p-4 justify-between">
      <SidebarTrigger className="-ml-1" />
      <Separator className="mr-2 h-4" orientation="vertical" />
      <div className="w-full max-w-[95%] flex items-center justify-between flex-wrap">
        <SearchBar />
        <ThemeSwitcher />

        <div className="flex flex-wrap items-center gap-4 justify-end">
          <Button
            size={"lg"}
            className="bg-secondary rounded-lg hover:bg-background-80 text-primary font-semibold"
          >
            <Upload />
            <span>Import</span>
          </Button>
          <NewProjectButton user={user} />
        </div>
      </div>
    </header>
  );
};

export default UpperInfoBar;
