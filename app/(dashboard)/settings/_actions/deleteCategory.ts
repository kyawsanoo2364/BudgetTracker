"use server";

import prisma from "@/lib/prisma";
import { TransactionType } from "@/lib/types";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const deleteCategory = async ({
  name,
  icon,
  type,
}: {
  name: string;
  icon: string;
  type: TransactionType;
}) => {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  try {
    await prisma.category.delete({
      where: {
        name_icon_userId: {
          name,
          icon,
          userId: user.id,
        },
        type,
      },
    });
  } catch (error) {
    throw new Error(error);
  }
};
