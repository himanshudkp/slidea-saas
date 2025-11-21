"use client";

import type { JsonValue } from "@prisma/client/runtime/library";
import React, { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { itemVariants, THEMES } from "@/lib/constants";
import { useSlideStore } from "@/store/use-slide-store";
import { cn, timeAgo } from "@/lib/utils";
import { useRouter } from "next/navigation";
import ThumbnailPreview from "./thumbnail-preview";
import AlertDialogBox from "./alert-dialog-box";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { deleteProject, recoverProject } from "@/actions/project";
import { RotateCcw } from "lucide-react";

type Props = {
  projectId: string;
  title: string;
  createdAt: string;
  isDeleted?: boolean;
  slidesData: JsonValue;
  themeName: string;
};

const ProjectCard = ({
  createdAt,
  isDeleted,
  projectId,
  slidesData,
  title,
  themeName,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setSlides } = useSlideStore();
  const router = useRouter();

  const theme = useMemo(() => {
    return THEMES.find((theme) => theme.name === themeName) || THEMES[0];
  }, [themeName]);

  const parsedSlides = useMemo(() => {
    return JSON.parse(JSON.stringify(slidesData));
  }, [slidesData]);

  const handleNavigation = useCallback(() => {
    setSlides(parsedSlides);
    router.push(`ppt/${projectId}`);
  }, [parsedSlides, projectId, setSlides, router]);

  const handleRecoverProject = useCallback(async () => {
    setLoading(true);
    if (!projectId) {
      setLoading(false);
      toast.error("Error: Project not found.");
      return;
    }

    try {
      const response = await recoverProject(projectId);
      if (response.status !== 200) {
        console.error(response.error || "Something went wrong");
        toast.error(response.error || "Failed to recover project.");
        return;
      }
      setOpen(false);
      router.refresh();
      toast.success("Project recovered successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [projectId, router]);

  const handleDeleteProject = useCallback(async () => {
    setLoading(true);
    if (!projectId) {
      setLoading(false);
      toast.error("Error: Project not found.");
      return;
    }

    try {
      const response = await deleteProject(projectId);
      if (response.status !== 200) {
        console.error(response.error || "Something went wrong");
        toast.error(response.error || "Failed to delete project.");
        return;
      }

      setOpen(false);
      router.refresh();
      toast.success("Project deleted successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [projectId, router]);

  return (
    <motion.div
      variants={itemVariants}
      className={cn(
        "group relative w-full flex flex-col gap-y-3 rounded-xl p-3 transition-all duration-200",
        "border border-border hover:border-primary hover:shadow-md",
        isDeleted && "opacity-75 hover:opacity-100"
      )}
    >
      <div
        className="relative aspect-video overflow-hidden rounded-lg cursor-pointer group/thumbnail transition-transform duration-200 hover:scale-105"
        onClick={handleNavigation}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleNavigation();
          }
        }}
        aria-label={`Open project: ${title}`}
      >
        <ThumbnailPreview slides={parsedSlides} theme={theme} />

        <div className="absolute inset-0 bg-black/0 group-hover/thumbnail:bg-black/20 transition-colors duration-200 flex items-center justify-center">
          <span className="text-white opacity-0 group-hover/thumbnail:opacity-100 transition-opacity text-sm font-medium">
            Open Project
          </span>
        </div>

        {isDeleted && (
          <div className="absolute top-2 right-2 bg-red-500/90 text-white text-xs font-semibold px-2 py-1 rounded">
            Deleted
          </div>
        )}
      </div>

      <div className="w-full flex flex-col gap-2">
        <div className="space-y-1">
          <h3 className="font-semibold text-base text-primary line-clamp-2 leading-tight">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground" suppressHydrationWarning>
            {timeAgo(createdAt)}
          </p>
        </div>

        <div className="flex w-full justify-between items-center gap-2">
          <div className="flex-1" />

          {isDeleted ? (
            <AlertDialogBox
              variant="success"
              title="Recover Project?"
              description="This will recover your project and restore all your data."
              open={open}
              onOpenChange={setOpen}
              loading={loading}
              onClick={handleRecoverProject}
              actionLabel="Recover Project"
              cancelLabel="Cancel"
              customIcon={<RotateCcw className="h-5 w-5" />}
            >
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                disabled={loading}
                title="Recover this project"
              >
                <RotateCcw className="w-4 h-4" />
                Recover
              </Button>
            </AlertDialogBox>
          ) : (
            <AlertDialogBox
              open={open}
              onOpenChange={setOpen}
              variant="destructive"
              title="Delete Project?"
              description="This will delete your project and send it to trash. You can recover it later."
              actionLabel="Delete Project"
              loading={loading}
              onClick={handleDeleteProject}
            >
              <Button variant="destructive">Delete</Button>
            </AlertDialogBox>
          )}
        </div>
      </div>
      {loading && (
        <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </motion.div>
  );
};

export default ProjectCard;
