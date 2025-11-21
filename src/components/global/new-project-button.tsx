"use client";
import { Button } from "@/components/ui/button";
import { User } from "@/generated/prisma/client";
import { Plus, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  user: User;
};

const NewProjectButton = ({ user }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const hasSubscription = user?.subscription;

  const handleCreateNewProject = useCallback(async () => {
    if (isLoading) return;

    if (!hasSubscription) {
      toast.error("Premium required", {
        description: "Upgrade to create new presentations",
        action: {
          label: "Upgrade",
          onClick: () => router.push("/pricing"),
        },
      });
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      router.push("/new-project");
    } catch (error) {
      console.error("Failed to create project:", error);
      toast.error("Failed to create project", {
        description: "Please try again",
      });
      setIsLoading(false);
    }
  }, [hasSubscription, router, isLoading]);

  const buttonContent = (
    <motion.div
      className="flex items-center gap-2"
      animate={{ x: isLoading ? 2 : 0 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      <motion.div
        animate={{ rotate: isLoading ? 360 : 0 }}
        transition={{
          duration: isLoading ? 1 : 0.2,
          repeat: isLoading ? Infinity : 0,
          ease: "linear",
        }}
      >
        <Plus className="h-4 w-4" />
      </motion.div>
      <span className="font-semibold">
        {isLoading ? "Creating..." : "New Project"}
      </span>
    </motion.div>
  );

  if (!hasSubscription) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                size="lg"
                disabled
                variant="outline"
                className={cn(
                  "rounded-lg font-semibold gap-2",
                  "cursor-not-allowed opacity-50",
                  "hover:bg-background"
                )}
                aria-label="Create new project (Premium required)"
                title="Premium required to create projects"
              >
                <Lock className="h-4 w-4" />
                <span>New Project</span>
              </Button>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="flex flex-col gap-2">
            <p className="text-sm font-medium">Premium feature</p>
            <p className="text-xs text-muted-foreground">
              Upgrade your account to create new presentations
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <Button
              size="lg"
              onClick={handleCreateNewProject}
              disabled={isLoading}
              className={cn(
                "rounded-lg font-semibold gap-2",
                "bg-primary hover:bg-primary/90 text-primary-foreground",
                "transition-all duration-200",
                isHovering && "shadow-lg shadow-primary/30",
                isLoading && "opacity-80"
              )}
              aria-label="Create a new presentation"
              title="Create a new presentation"
            >
              {buttonContent}
            </Button>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          Create a new presentation project
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NewProjectButton;
