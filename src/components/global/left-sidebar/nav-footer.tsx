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
import React, { useState } from "react";

type Props = {
  dbUser: User;
};

const NavFooter = ({ dbUser }: Props) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  if (!isLoaded || !isSignedIn) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex flex-col gap-y-6 items-start group-data-[collapsible=icon]:hidden">
          {!dbUser?.subscription && (
            <div className="flex flex-col items-start p-3 pb-3 gap-4 bg-background rounded-xl">
              <div className="flex flex-col items-start gap-1">
                <p className="text-base bg-ai-gradient font-bold">
                  Get <span className="text-slidea"> Creative AI</span>
                </p>
                <span className="text-sm">
                  Unlock all the features including AI and more
                </span>
              </div>
              <div className="w-full p-px rounded-full">
                <Button
                  className="w-full text-slidea text-primary rounded-full font-bold"
                  variant={"default"}
                  size={"lg"}
                  //   onClick={handleSubscription}
                >
                  <span className="text-slidea">
                    {isLoading ? "Upgrading..." : "Upgrade"}
                  </span>
                </Button>
              </div>
            </div>
          )}
          <SignedIn>
            <SidebarMenuButton
              size={"lg"}
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserButton />
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold">{user?.fullName}</span>
                <span className="truncate">
                  {user?.emailAddresses[0].emailAddress}
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
