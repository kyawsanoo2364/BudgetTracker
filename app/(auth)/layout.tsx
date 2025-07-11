import Logo from "@/components/Logo";
import Image from "next/image";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen gap-y-10 mt-4 mb-4 relative">
      {children}

      <Logo />
    </div>
  );
};

export default layout;
