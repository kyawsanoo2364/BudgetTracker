import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import z from "zod";

export const DateRangeSchema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date(),
});

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const dateRangeParams = DateRangeSchema.safeParse({ from, to });
  if (!dateRangeParams.success) {
    throw new Error("Bad request");
  }
  const res = await getTransactions(
    user.id,
    dateRangeParams.data.from,
    dateRangeParams.data.to,
  );

  return NextResponse.json(res);
}

export type GetTransactionsResponseType = Awaited<
  ReturnType<typeof getTransactions>
>;

const getTransactions = async (userId: string, from: Date, to: Date) => {
  const data = await prisma.transaction.groupBy({
    by: ["category", "type", "categoryIcon"],

    where: {
      userId: userId,
      date: {
        gte: from,
        lte: to,
      },
    },
    _sum: {
      amount: true,
    },
    orderBy: {
      category: "asc",
    },
  });

  return data;
};
