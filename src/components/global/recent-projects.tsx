"use client";
import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Project } from "@/generated/prisma/client";
import { useSlideStore } from "@/store/use-slide-store";
import { JsonValue } from "@prisma/client/runtime/library";
import { useRouter } from "next/navigation";
import React, { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { Clock, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  recentProjects: Project[];
};

const RecentProjects = ({ recentProjects }: Props) => {
  const router = useRouter();
  const { setSlides } = useSlideStore();

  const parsedProjectsMap = useMemo(() => {
    return new Map(
      recentProjects.map((project) => [
        project.id,
        JSON.parse(JSON.stringify(project.slides)),
      ])
    );
  }, [recentProjects]);

  const handleProjectClick = useCallback(
    (projectId: string, slides: JsonValue) => {
      if (!projectId || !slides) {
        toast.error("Project not found", {
          description: "Please try again.",
        });
        return;
      }

      try {
        setSlides(JSON.parse(JSON.stringify(slides)));
        router.push(`/ppt/${projectId}`);
      } catch (error) {
        console.error("Failed to open project:", error);
        toast.error("Failed to open project", {
          description: "Please try again.",
        });
      }
    },
    [setSlides, router]
  );

  if (recentProjects.length === 0) {
    return null;
  }

  return (
    <SidebarGroup className="gap-2">
      <SidebarGroupLabel className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
        <Clock className="h-4 w-4" />
        Recently Opened
      </SidebarGroupLabel>

      <SidebarMenu className="gap-1">
        {recentProjects.slice(0, 5).map((project) => {
          const { id, title, slides } = project;

          return (
            <SidebarMenuItem key={id}>
              <SidebarMenuButton
                asChild
                tooltip={title}
                className={cn(
                  "transition-all duration-200 group",
                  "hover:bg-primary/10 data-[active=true]:bg-primary/10"
                )}
              >
                <Button
                  variant="ghost"
                  onClick={() => handleProjectClick(id, slides)}
                  className="w-full justify-start gap-2 px-2 py-1.5 h-auto text-xs font-normal"
                  title={title}
                  aria-label={`Open project: ${title}`}
                >
                  <FileText className="h-4 w-4 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                  <span className="truncate group-hover:font-medium transition-all">
                    {title}
                  </span>
                </Button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default RecentProjects;
