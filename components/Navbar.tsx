"use client";

import React, { useState } from "react";
import Logo from "./Logo";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ToggleThemeMode } from "./ToggleThemeMode";
import { UserButton } from "@clerk/nextjs";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

const navItems = [
  {
    label: "Dashboard",
    href: "/",
  },
  {
    label: "Transactions",
    href: "/transactions",
  },
  {
    label: "My Settings",
    href: "/settings",
  },
];

const Navbar = () => {
  return (
    <>
      <DesktopNavbar />
      <MobileNavbar />
    </>
  );
};

export default Navbar;

function DesktopNavbar() {
  const pathName = usePathname();
  return (
    <nav className=" py-5 border-b border-b-muted hidden lg:block">
      <div className="flex flex-row items-center justify-between gap-4 container mx-auto">
        <div className="flex flex-row items-center gap-4">
          <Link href={"/"}>
            <Logo />
          </Link>
          {navItems.map((item, index) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "text-xl font-semibold hover:bg-card p-2 rounded-md text-muted-foreground",
                pathName === item.href && "dark:text-white text-black",
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center flex-row gap-4">
          <ToggleThemeMode />
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <Link href={"/sign-in"}>
              <Button variant={"outline"}>Sign In</Button>
            </Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}

function MobileNavbar() {
  const [sheetOpen, setSheetOpen] = useState(false);
  return (
    <nav className=" w-full items-center border-b border-b-muted lg:hidden block py-2">
      <div className="flex items-center justify-between gap-4 px-4">
        <Link href={"/"}>
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
          <ToggleThemeMode />
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant={"outline"}>
                <MenuIcon className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full" side="left">
              <SheetHeader>
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2">
                <div className="flex flex-row items-center justify-center">
                  <UserButton />
                </div>
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "p-4 text-lg font-medium hover:bg-muted border-b border-b-muted",
                    )}
                    onClick={() => setSheetOpen((prev) => !prev)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
