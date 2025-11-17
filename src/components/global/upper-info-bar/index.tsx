"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { User } from "@/generated/prisma/client";
import { useTheme } from "next-themes";
import React from "react";

type Props = {
  user: User;
  children: React.ReactNode;
};

const UpperInfoBar = ({ user, children }: Props) => {
  const { theme, setTheme } = useTheme();
  return (
    <header className="sticky top-0 z-10 flex shrink-0 flex-wrap items-center gap-2 border-bg-background p-4 justify-between">
      <SidebarTrigger className="-ml-1" />
      <Separator className="mr-2 h-4" orientation="vertical" />
      <div>
        <Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {" "}
          Set
        </Button>
      </div>
    </header>
  );
};

export default UpperInfoBar;
