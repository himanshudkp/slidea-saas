"use client";
import { Project, User } from "@/generated/prisma/client";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NavigationContainer from "./nav-container";
import { DATA } from "@/lib/constants";
import RecentProjects from "./recent-projects";
import NavFooter from "./nav-footer";

type AppSidebarProps = {
  recentProjects: Project[];
  user: User;
} & React.ComponentProps<typeof Sidebar>;

const AppSidebar = ({ recentProjects, user, ...props }: AppSidebarProps) => {
  return (
    <Sidebar
      collapsible="icon"
      className="max-w-[250px] bg-background-90"
      {...props}
    >
      <SidebarHeader className="pt-6 px-2 pb-0">
        <SidebarMenuButton
          size={"lg"}
          className="data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center  justify-center rounded-lg text-sidebar-primary-foreground ">
            <Avatar className="h-10 w-10 rounded-full">
              <AvatarImage src={"/twitter-logo.png"} alt="logo image" />
              <AvatarFallback className="rounded-lg" />
            </Avatar>
          </div>
          <span className="truncate text-primary text-3xl font-semibold">
            Slidea
          </span>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent className="px-2 mt-10 gap-y-6">
        <NavigationContainer items={DATA.navigation} />
        <RecentProjects recentProjects={recentProjects} />
      </SidebarContent>
      <SidebarFooter>
        <NavFooter dbUser={user} />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
