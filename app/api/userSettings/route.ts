import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

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

    return Response.json(us);
  }
  return Response.json(userSettings);
}
