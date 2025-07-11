"use client";

import React, { useEffect, useState } from "react";
import CurrencyCard from "./_components/CurrencyCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { Card, CardContent } from "@/components/ui/card";

const page = () => {
  return (
    <div className="flex items-center flex-col justify-center w-full min-h-screen">
      <Card className="w-full max-w-lg ">
        <CardContent className="flex flex-col items-center justify-center">
          <Logo className="my-5" />
          <CurrencyCard />
          <Button className="max-w-lg w-full mt-5" asChild>
            <Link href={"/"} className="w-full">
              Take me to my dashboard
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
