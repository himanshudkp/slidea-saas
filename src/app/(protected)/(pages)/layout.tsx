import { getRecentProjects } from "@/actions/project";
import { authenticateUser } from "@/actions/user";
import AppSidebar from "@/components/global/left-sidebar";
import UpperInfoBar from "@/components/global/upper-info-bar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import React from "react";

interface Props {
  children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
  const auth = await authenticateUser();
  const recentProjects = await getRecentProjects();
  if (!auth.user) return redirect("/sign-in");
  return (
    <SidebarProvider>
      <AppSidebar recentProjects={recentProjects.data || []} user={auth.user} />
      <SidebarInset>
        <UpperInfoBar user={auth.user} />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
