import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: AuthLayoutProps) {
  return (
    <div className="w-full flex justify-center items-center min-h-screen">
      {children}
    </div>
  );
}
