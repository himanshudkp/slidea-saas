"use client";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

type NavItemChild = {
  title: string;
  url: string;
};

type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: NavItemChild[];
};

const NavigationContainer = ({ items }: { items: NavItem[] }) => {
  const pathname = usePathname();

  const activeItem = useMemo(() => {
    return items.find((item) => pathname.startsWith(item.url));
  }, [pathname, items]);

  return (
    <SidebarGroup className="p-0">
      <SidebarMenu className="gap-1">
        {items.map((item) => {
          const { icon: Icon, title, url } = item;
          const isActive = pathname.startsWith(url);

          return (
            <SidebarMenuItem key={title}>
              <SidebarMenuButton
                asChild
                tooltip={title}
                isActive={isActive}
                className={cn(
                  "transition-all duration-200 relative",
                  isActive && "bg-primary/10 text-primary font-semibold"
                )}
              >
                <Link
                  href={url}
                  className="flex items-center gap-2 no-underline"
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="truncate text-sm font-medium leading-tight">
                    {title}
                  </span>

                  {isActive && (
                    <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default NavigationContainer;
