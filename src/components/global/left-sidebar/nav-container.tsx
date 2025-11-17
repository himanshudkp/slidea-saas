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
import React from "react";

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
  return (
    <SidebarGroup className="p-0">
      <SidebarMenu>
        {items.map((item) => {
          const { icon, title, url } = item;
          const Icon = icon;
          return (
            <SidebarMenuItem key={title}>
              <SidebarMenuButton
                asChild
                tooltip={title}
                className={`${pathname.includes(url) && "bg-muted"}`}
              >
                <Link
                  href={url}
                  className={`text-lg ${pathname.includes(url) && "font-bold"}`}
                >
                  <Icon className="text-lg" />
                  <span>{title}</span>
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
