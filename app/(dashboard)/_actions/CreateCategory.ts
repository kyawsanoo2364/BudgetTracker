"use server";

import prisma from "@/lib/prisma";
import { TransactionType } from "@/lib/types";
import { CreateCategorySchema } from "@/schema/CreateCategorySchema";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const CreateCategory = async ({
  name,
  icon,
  type,
}: {
  name: string;
  icon: string;
  type: TransactionType;
}) => {
  try {
    const user = await currentUser();
    if (!user) {
      redirect("/sign-in");
    }
    const queryParams = CreateCategorySchema.safeParse({ name, icon, type });
    if (!queryParams.success) {
      throw new Error("Bad Request!");
    }
    return await prisma.category.create({
      data: {
        userId: user.id,
        name: queryParams.data.name,
        icon: queryParams.data.icon,
        type: queryParams.data.type,
      },
    });
  } catch (error) {
    throw error;
  }
};
