import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSettings) {
    const us = await prisma.userSettings.create({
      data: {
        userId: user.id,
        currency: "USD",
      },
    });

    return NextResponse.json(us);
  }
  return NextResponse.json(userSettings);
}
