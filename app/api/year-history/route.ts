import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year");
  if (!year) throw new Error("Year is required");
  const date = new Date(parseInt(year), 1);
  const data = await getYearHistory(user.id, date);

  return NextResponse.json(data);
}

export type GetYearHistoryResponseType = Awaited<
  ReturnType<typeof getYearHistory>
>;

async function getYearHistory(userId: string, date: Date) {
  const history = [];
  for (let i = 0; i <= 11; i++) {
    let income = 0;
    let expense = 0;
    let month = new Date(date.getUTCFullYear(), i).toLocaleString("default", {
      month: "long",
    });
    const yearData = await prisma.yearHistory.findUnique({
      where: {
        userId_month_year: {
          userId,
          month: i,
          year: date.getUTCFullYear(),
        },
      },
    });
    if (yearData) {
      income = yearData.income;
      expense = yearData.expense;
    }
    history.push({
      month,
      income,
      expense,
    });
  }

  return history;
}
