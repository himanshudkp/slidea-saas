"use client";
import { Button } from "@/components/ui/button";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { User } from "@/generated/prisma/client";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useCallback, useMemo, useState } from "react";
import { Sparkles, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  dbUser: User;
  userInitials?: string;
};

const NavFooter = ({ dbUser, userInitials }: Props) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const userEmail = useMemo(() => {
    return user?.emailAddresses?.[0]?.emailAddress || "";
  }, [user?.emailAddresses]);

  const handleSubscription = useCallback(async () => {
    setIsLoading(true);
    try {
      // TODO: Implement subscription logic
      // Example: router.push("/pricing");
      console.log("Redirecting to subscription...");
      // router.push("/pricing");
    } catch (error) {
      console.error("Failed to upgrade subscription:", error);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  if (!isLoaded || !isSignedIn) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex flex-col gap-4 items-start group-data-[collapsible=icon]:hidden">
          {dbUser?.subscription && (
            <div
              className={cn(
                "w-full flex flex-col gap-3 p-4 rounded-lg",
                "`bg-linear-to-br from-primary/10 to-primary/5",
                "border border-primary/20 hover:border-primary/40 transition-colors duration-200"
              )}
            >
              <div className="flex items-start gap-2">
                <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1 flex-1">
                  <p className="text-sm font-semibold text-primary">
                    Unlock Creative AI
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Get access to AI-powered features and more
                  </p>
                </div>
              </div>

              <Button
                onClick={handleSubscription}
                disabled={isLoading}
                className={cn(
                  "w-full font-semibold transition-all duration-200",
                  "bg-primary hover:bg-primary/90 text-primary-foreground"
                )}
                size="sm"
                aria-label="Upgrade to premium"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Upgrading...
                  </>
                ) : (
                  <>
                    Upgrade
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          )}

          <SignedIn>
            <SidebarMenuButton
              size="lg"
              className={cn(
                "w-full transition-all duration-200",
                "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
                "hover:bg-background-80"
              )}
              tooltip={`${user?.fullName} • ${userEmail}`}
            >
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9",
                  },
                }}
              />
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden min-w-0">
                <span className="truncate font-semibold text-primary">
                  {user?.fullName || "User"}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {userEmail}
                </span>
              </div>
            </SidebarMenuButton>
          </SignedIn>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default NavFooter;
