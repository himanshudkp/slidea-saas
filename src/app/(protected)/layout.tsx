export const dynamic = "force-dynamic";
import { authenticateUser } from "@/actions/user";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const Layout = async ({ children }: Props) => {
  const auth = await authenticateUser();
  if (!auth.user) return redirect("/sign-in");
  return <div className="w-full min-h-screen">{children}</div>;
};

export default Layout;
