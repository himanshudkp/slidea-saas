"use client";
import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Project } from "@/generated/prisma/client";
import { useSlideStore } from "@/store/use-slide-store";
import { JsonValue } from "@prisma/client/runtime/library";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";
import { toast } from "sonner";

type Props = {
  recentProjects: Project[];
};

const RecentProjects = ({ recentProjects }: Props) => {
  const router = useRouter();
  const { setSlides } = useSlideStore();
  const handleProjectClick = useCallback(
    (projectId: string, slides: JsonValue) => {
      if (!projectId || !slides) {
        toast.info("Projects not found.", {
          description: "Please try again.",
        });
        return;
      }

      setSlides(JSON.parse(JSON.stringify(slides)));
      router.push(`/ppt/${projectId}`);
    },
    []
  );

  return recentProjects.length > 0 ? (
    <SidebarGroup>
      <SidebarGroupLabel>Recently Opened</SidebarGroupLabel>
      <SidebarMenu>
        {recentProjects.map((project) => {
          const { id, title, slides } = project;
          return (
            <SidebarMenuButton
              asChild
              tooltip={title}
              className="hover:bg-primary-80"
              key={id}
            >
              <Button
                variant={"link"}
                onClick={() => handleProjectClick(id, slides)}
                className="text-xs items-center justify-start"
              >
                <span>{title}</span>
              </Button>
            </SidebarMenuButton>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  ) : (
    <></>
  );
};

export default RecentProjects;
