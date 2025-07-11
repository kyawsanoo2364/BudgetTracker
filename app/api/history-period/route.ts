import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const monthHistory = await prisma.monthHistory.findMany({
    where: {
      userId: user.id,
    },
    select: {
      year: true,
    },
    distinct: ["year"],
    orderBy: {
      year: "asc",
    },
  });

  return NextResponse.json(monthHistory);
};
