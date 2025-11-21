"use client";

import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

type DashboardHeaderProps = {
  projectCount: number;
  hasProjects: boolean;
};

const DashboardHeader = ({
  projectCount,
  hasProjects,
}: DashboardHeaderProps) => {
  return (
    <motion.div
      className="flex flex-col-reverse gap-4 sm:flex-row sm:items-end sm:justify-between"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
        </div>
        <p
          className={cn(
            "text-sm font-medium transition-colors duration-200",
            hasProjects ? "text-muted-foreground" : "text-muted-foreground/60"
          )}
        >
          {hasProjects
            ? `${projectCount} presentation${
                projectCount !== 1 ? "s" : ""
              } • All your work in one place`
            : "Start creating your first presentation"}
        </p>
      </div>

      {hasProjects && (
        <motion.div
          className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 flex items-center gap-2 w-fit"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-semibold text-primary">
            {projectCount} Active
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DashboardHeader;
