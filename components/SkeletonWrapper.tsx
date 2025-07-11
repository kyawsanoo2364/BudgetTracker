"use client";

import React from "react";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

const SkeletonWrapper = ({
  children,
  isLoading,
  fullWidth = true,
  className,
}: {
  isLoading: boolean;
  children: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}) => {
  if (!isLoading) return children;

  return (
    <Skeleton className={cn(fullWidth && "w-full", className)}>
      <div className="opacity-0">{children}</div>
    </Skeleton>
  );
};

export default SkeletonWrapper;
