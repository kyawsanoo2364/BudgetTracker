import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DateRangeSchema } from "../overview-transactions/route";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const queryParams = DateRangeSchema.safeParse({ from, to });
  if (!queryParams.success) {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }
  const data = await getTransactionsData(
    user.id,
    queryParams.data.from,
    queryParams.data.to,
  );

  return NextResponse.json(data);
};

export type GetTransactionsDataResponseType = Awaited<
  ReturnType<typeof getTransactionsData>
>;

async function getTransactionsData(userId: string, from: Date, to: Date) {
  return await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: new Date(from),
        lte: new Date(to),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
