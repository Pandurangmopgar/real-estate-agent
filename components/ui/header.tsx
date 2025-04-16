"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold">Real Estate Assistant</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link 
            href="/chat" 
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Chat Now
          </Link>
        </div>
      </div>
    </header>
  );
}
