import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  AlertTriangle,
  Info,
  Trash2,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

type AlertVariant = "destructive" | "warning" | "info" | "success";

type Props = {
  children: React.ReactNode;
  title?: string;
  description: string;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;

  // Styling
  variant?: AlertVariant;
  actionLabel?: string;
  cancelLabel?: string;
  actionClassName?: string;

  // Icons
  showIcon?: boolean;
  customIcon?: React.ReactNode;
};

const variantConfig = {
  destructive: {
    icon: <Trash2 className="h-5 w-5" />,
    iconBg: "bg-red-100 dark:bg-red-950",
    iconColor: "text-red-600 dark:text-red-400",
    buttonVariant: "destructive" as const,
  },
  warning: {
    icon: <AlertTriangle className="h-5 w-5" />,
    iconBg: "bg-yellow-100 dark:bg-yellow-950",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    buttonVariant: "default" as const,
  },
  info: {
    icon: <Info className="h-5 w-5" />,
    iconBg: "bg-blue-100 dark:bg-blue-950",
    iconColor: "text-blue-600 dark:text-blue-400",
    buttonVariant: "default" as const,
  },
  success: {
    icon: <CheckCircle className="h-5 w-5" />,
    iconBg: "bg-green-100 dark:bg-green-950",
    iconColor: "text-green-600 dark:text-green-400",
    buttonVariant: "default" as const,
  },
};

const AlertDialogBox = ({
  children,
  title = "Are you absolutely sure?",
  description,
  onOpenChange,
  open,
  loading = false,
  disabled = false,
  onClick,
  variant = "destructive",
  actionLabel = "Continue",
  cancelLabel = "Cancel",
  actionClassName,
  showIcon = true,
  customIcon,
}: Props) => {
  const config = variantConfig[variant];
  const isDisabled = loading || disabled;

  const handleAction = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isDisabled && onClick) {
      onClick();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader className="gap-4">
          {/* Icon */}
          {showIcon && (
            <div
              className={cn(
                "mx-auto flex h-12 w-12 items-center justify-center rounded-full",
                config.iconBg
              )}
            >
              <div className={config.iconColor}>
                {customIcon || config.icon}
              </div>
            </div>
          )}

          {/* Title */}
          <AlertDialogTitle className="text-center text-xl">
            {title}
          </AlertDialogTitle>

          {/* Description */}
          <AlertDialogDescription className="text-center text-sm leading-relaxed">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="sm:flex-col-reverse gap-2 sm:gap-2">
          {/* Cancel Button */}
          <AlertDialogCancel
            disabled={loading}
            className="w-full sm:w-full mt-0"
          >
            {cancelLabel}
          </AlertDialogCancel>

          {/* Action Button */}
          <AlertDialogAction
            disabled={isDisabled}
            onClick={handleAction}
            className={cn(
              "w-full sm:w-full",
              variant === "destructive" &&
                "bg-destructive text-destructive-foreground hover:bg-destructive/90",
              actionClassName
            )}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading...</span>
              </span>
            ) : (
              <span>{actionLabel}</span>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDialogBox;

// ==========================================
// Usage Examples
// ==========================================

/*
import { useState } from "react";
import AlertDialogBox from "@/components/ui/alert-dialog-box";
import { Button } from "@/components/ui/button";

function DeleteProjectDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteProject();
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialogBox
      open={open}
      onOpenChange={setOpen}
      variant="destructive"
      title="Delete Project?"
      description="This action cannot be undone. This will permanently delete your project and remove all associated data."
      actionLabel="Delete Project"
      loading={loading}
      onClick={handleDelete}
    >
      <Button variant="destructive">Delete</Button>
    </AlertDialogBox>
  );
}

// Warning variant
<AlertDialogBox
  open={open}
  onOpenChange={setOpen}
  variant="warning"
  title="Unsaved Changes"
  description="You have unsaved changes. Are you sure you want to leave?"
  actionLabel="Leave"
  cancelLabel="Stay"
  onClick={handleLeave}
>
  <Button>Close Editor</Button>
</AlertDialogBox>

// Info variant
<AlertDialogBox
  open={open}
  onOpenChange={setOpen}
  variant="info"
  title="Update Available"
  description="A new version is available. Would you like to update now?"
  actionLabel="Update Now"
  cancelLabel="Later"
  onClick={handleUpdate}
>
  <Button>Check Updates</Button>
</AlertDialogBox>

// Success variant
<AlertDialogBox
  open={open}
  onOpenChange={setOpen}
  variant="success"
  title="Success!"
  description="Your project has been published successfully."
  actionLabel="View Project"
  cancelLabel="Close"
  onClick={handleView}
  showIcon={true}
>
  <Button>Publish</Button>
</AlertDialogBox>

// Custom icon
<AlertDialogBox
  open={open}
  onOpenChange={setOpen}
  variant="destructive"
  customIcon={<Trash className="h-5 w-5" />}
  description="Delete this item?"
  onClick={handleDelete}
>
  <Button>Delete</Button>
</AlertDialogBox>

// No icon
<AlertDialogBox
  open={open}
  onOpenChange={setOpen}
  showIcon={false}
  description="Are you sure?"
  onClick={handleAction}
>
  <Button>Action</Button>
</AlertDialogBox>
*/
