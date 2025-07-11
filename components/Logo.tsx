"use client";

import { cn } from "@/lib/utils";
import { HandCoins, PiggyBankIcon } from "lucide-react";
import React, { HTMLAttributes } from "react";

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex flex-row gap-2 items-center", className)}>
      <HandCoins className="size-8 md:size-12 text-red-500" />
      <h1 className="md:text-4xl text-2xl bg-gradient-to-r from-red-500 via-pink-700 to-yellow-500 bg-clip-text text-transparent font-bold">
        BudgetTracker
      </h1>
    </div>
  );
};

export default Logo;
