import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="w-full min-h-screen flex flex-col bg-linear-to-br from-background via-background to-background/80">
      <div className="flex-1 flex justify-center items-center px-4 py-2">
        <div className="w-full max-w-md">{children}</div>
      </div>
      <footer className="py-3 px-4 border-t border-border/40 backdrop-blur-sm">
        <div className="max-w-md mx-auto flex flex-col items-center justify-center gap-2 text-center">
          <p className="text-xs text-muted-foreground font-semibold">
            © 2025 PresentPerfect. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
