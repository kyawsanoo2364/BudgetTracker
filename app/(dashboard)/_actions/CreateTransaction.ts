"use server";

import prisma from "@/lib/prisma";
import { TransactionType } from "@/lib/types";

import { CreateTransactionSchema } from "@/schema/CreateTransactionSchema";
import { currentUser } from "@clerk/nextjs/server";
import { getDay } from "date-fns";
import { redirect } from "next/navigation";

export const CreateTransaction = async ({
  amount,
  description,
  category,
  categoryIcon,
  date,
  type,
}: {
  amount: number;
  description: string;
  category: string;
  categoryIcon: string;
  date: Date;
  type: TransactionType;
}) => {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  const queryParams = CreateTransactionSchema.safeParse({
    amount,
    description,
    type,
    category,
    categoryIcon,
    date,
  });

  if (!queryParams.success) {
    throw new Error("Bad Request!");
  }

  const _amount = Number(queryParams.data.amount);
  const day = getDay(queryParams.data.date);

  await prisma.$transaction([
    prisma.transaction.create({
      data: {
        category: queryParams.data.category,
        categoryIcon: queryParams.data.categoryIcon,
        description: queryParams.data.description || "",
        amount: _amount,
        type: queryParams.data.type,
        date: queryParams.data.date,
        userId: user.id,
      },
    }),

    prisma.monthHistory.upsert({
      where: {
        userId_day_month_year: {
          userId: user.id,
          day: queryParams.data.date.getDate(),
          month: queryParams.data.date.getUTCMonth(),
          year: queryParams.data.date.getUTCFullYear(),
        },
      },
      update: {
        income: {
          increment: type === "income" ? _amount : 0,
        },
        expense: type === "expense" ? _amount : 0,
      },
      create: {
        userId: user.id,
        day: queryParams.data.date.getDate(),
        month: queryParams.data.date.getUTCMonth(),
        year: queryParams.data.date.getUTCFullYear(),
        income: type === "income" ? _amount : 0,
        expense: type === "expense" ? _amount : 0,
      },
    }),

    prisma.yearHistory.upsert({
      where: {
        userId_month_year: {
          userId: user.id,

          month: queryParams.data.date.getUTCMonth(),
          year: queryParams.data.date.getUTCFullYear(),
        },
      },
      update: {
        income: {
          increment: type === "income" ? _amount : 0,
        },
        expense: {
          increment: type === "expense" ? _amount : 0,
        },
      },
      create: {
        userId: user.id,

        month: queryParams.data.date.getUTCMonth(),
        year: queryParams.data.date.getUTCFullYear(),
        income: type === "income" ? _amount : 0,
        expense: type === "expense" ? _amount : 0,
      },
    }),
  ]);
};
