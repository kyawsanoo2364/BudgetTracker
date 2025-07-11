"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const deleteTransaction = async ({ id }: { id: string }) => {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  const transaction = await prisma.transaction.findUnique({
    where: {
      id,
    },
  });
  if (!transaction) {
    throw new Error("Transaction not found!");
  }

  const day = new Date(transaction.date).getDate();
  const month = new Date(transaction.date).getUTCMonth();
  const year = new Date(transaction.date).getUTCFullYear();
  try {
    await prisma.$transaction([
      prisma.monthHistory.update({
        where: {
          userId_day_month_year: {
            userId: user.id,
            day,
            month,
            year,
          },
        },
        data: {
          income: {
            decrement: transaction.type === "income" ? transaction.amount : 0,
          },
          expense: {
            decrement: transaction.type === "expense" ? transaction.amount : 0,
          },
        },
      }),
      prisma.yearHistory.update({
        where: {
          userId_month_year: {
            userId: user.id,

            month,
            year,
          },
        },
        data: {
          income: {
            decrement: transaction.type === "income" ? transaction.amount : 0,
          },
          expense: {
            decrement: transaction.type === "expense" ? transaction.amount : 0,
          },
        },
      }),
      prisma.transaction.delete({
        where: {
          id,
        },
      }),
    ]);
  } catch (error) {
    throw new Error(error);
  }
};
