import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { getDaysInMonth, getMonth } from "date-fns";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");
  const year = searchParams.get("year");
  const date = new Date(`${month} 01,${year}`);

  const monthHistory = await getMonthHistory(user.id, date);

  return NextResponse.json(monthHistory);
}

export type GetMonthHistoryResponseType = Awaited<
  ReturnType<typeof getMonthHistory>
>;

async function getMonthHistory(userId: string, date: Date) {
  const daysOfMonth = getDaysInMonth(date);
  const history = [];

  for (let i = 1; i <= daysOfMonth; i++) {
    let income = 0;
    let expense = 0;

    const data = await prisma.monthHistory.findUnique({
      where: {
        userId_day_month_year: {
          userId,
          day: i,
          month: date.getMonth(),
          year: date.getUTCFullYear(),
        },
      },
    });
    if (data) {
      income = data.income || 0;
      expense = data.expense || 0;
    }
    history.push({
      day: i,
      income,
      expense,
    });
  }

  return history;
}
