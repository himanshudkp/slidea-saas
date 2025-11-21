import { getRecentProjects } from "@/actions/project";
import { authenticateUser } from "@/actions/user";
import AppSidebar from "@/components/global/left-sidebar";
import UpperInfoBar from "@/components/global/upper-info-bar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
  const auth = await authenticateUser();

  if (!auth.user) {
    redirect("/sign-in");
  }

  return (
    <SidebarProvider>
      <Suspense fallback={<SidebarSkeleton />}>
        <SidebarLoader user={auth.user} />
      </Suspense>

      <SidebarInset>
        <UpperInfoBar user={auth.user} />
        <div className="p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;

async function SidebarLoader({ user }: { user: any }) {
  try {
    const recentProjects = await getRecentProjects();
    return (
      <AppSidebar recentProjects={recentProjects.data || []} user={user} />
    );
  } catch (error) {
    console.error("Failed to load recent projects:", error);
    return <AppSidebar recentProjects={[]} user={user} />;
  }
}

const SidebarSkeleton = () => {
  return (
    <div className="flex h-screen w-64 flex-col border-r bg-background">
      <div className="flex h-14 items-center gap-3 border-b px-4">
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-32" />
      </div>

      <div className="p-4 mt-5 space-y-5 flex-1 overflow-y-auto">
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-6 w-5 rounded" />
              <Skeleton className="h-6 w-32" />
            </div>
          ))}
        </div>

        <div className="pt-4">
          <Skeleton className="h-4 w-32 mb-3" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 pl-1">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>
        </div>
        <div className="pt-6">
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
      </div>
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
      </div>
    </div>
  );
};
